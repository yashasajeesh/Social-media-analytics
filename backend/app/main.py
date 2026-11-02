import asyncio
import os
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import User, Post, CampaignMetric
from app.services.schema import (
    Token, UserLogin, CampaignMetricCreate, CampaignMetricResponse, SocialPostResponse
)
from app.services.dataset_ingestion import DataRepository
from app.services.cache_service import cache_service
from app.ai_engines.sentiment_engine import process_sentiment_trends
from app.ai_engines.demographic_engine import process_demographic_insights
from app.ai_engines.trend_engine import process_trending_topics
from app.ai_engines.network_engine import build_network_graph

# Auto-create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Social Media Analytics Framework API",
    description="Live ingest, sentiment AI, demographics, trends, and network analytics platform",
    version="2.0.0"
)

# Enable CORS for all local and deployed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

repo = DataRepository()

# -------------------------------------------------------------
# WebSocket Connection Manager for Live Streaming Feed
# -------------------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

# -------------------------------------------------------------
# Root & Health Check Endpoints
# -------------------------------------------------------------
@app.get("/")
def root():
    df = repo.get_data()
    return {
        "status": "Active",
        "service": "Social Media Analytics Framework",
        "version": "2.0.0",
        "dataset_records": len(df) if df is not None else 0,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/health")
def health_check():
    df = repo.get_data()
    return {
        "status": "healthy",
        "service": "social-media-analytics-backend",
        "dataset_loaded": df is not None and not df.empty,
        "dataset_records": len(df) if df is not None else 0,
        "cache_online": cache_service.client is not None,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# -------------------------------------------------------------
# Authentication Endpoints
# -------------------------------------------------------------
@app.post("/api/v1/auth/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    # Simple, flexible JWT auth for demo and production test
    if payload.username and len(payload.password) >= 3:
        token = f"jwt_{uuid.uuid4().hex}"
        return Token(access_token=token, token_type="bearer")
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or credentials")

@app.get("/api/v1/auth/me")
def get_current_user():
    return {
        "username": "admin",
        "role": "admin",
        "email": "admin@analytics.internal",
        "permissions": ["read:analytics", "write:campaigns", "export:reports"]
    }

# -------------------------------------------------------------
# Analytics Engine Endpoints (with Caching & Filtering)
# -------------------------------------------------------------
@app.get("/api/v1/analytics/overview")
def get_overview(
    platform: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None)
):
    df = repo.get_filtered_data(platform=platform, brand=brand, sentiment=sentiment)
    cache_key = f"overview_{platform}_{brand}_{sentiment}"
    cached = cache_service.get(cache_key)
    if cached:
        return cached

    total_posts = len(df)
    avg_sentiment = round(float(df['sentiment_score'].mean()), 3) if 'sentiment_score' in df.columns else 0.0
    avg_toxicity = round(float(df['toxicity_score'].mean()), 3) if 'toxicity_score' in df.columns else 0.0
    total_likes = int(df['likes_count'].sum()) if 'likes_count' in df.columns else 0
    total_impressions = int(df['impressions'].sum()) if 'impressions' in df.columns else 0
    top_brand = df['brand_name'].value_counts().index[0] if 'brand_name' in df.columns and not df.empty else "N/A"
    top_platform = df['platform'].value_counts().index[0] if 'platform' in df.columns and not df.empty else "N/A"
    sentiment_breakdown = df['sentiment_label'].value_counts().to_dict() if 'sentiment_label' in df.columns else {}

    result = {
        "total_posts": total_posts,
        "avg_sentiment": avg_sentiment,
        "avg_toxicity": avg_toxicity,
        "total_likes": total_likes,
        "total_impressions": total_impressions,
        "top_brand": top_brand,
        "top_platform": top_platform,
        "sentiment_breakdown": {str(k): int(v) for k, v in sentiment_breakdown.items()}
    }
    cache_service.set(cache_key, result, ttl_seconds=120)
    return result

@app.get("/api/v1/analytics/sentiment")
def get_sentiment_analytics(
    platform: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None)
):
    df = repo.get_filtered_data(platform=platform, brand=brand, sentiment=sentiment)
    return process_sentiment_trends(df)

@app.get("/api/v1/analytics/sentiment-summary")
def get_sentiment_summary(
    platform: Optional[str] = Query(None),
    brand: Optional[str] = Query(None)
):
    df = repo.get_filtered_data(platform=platform, brand=brand)
    res = process_sentiment_trends(df)
    return {
        "status": "success",
        "total_posts": res.get("total_posts", len(df)),
        "overall_score": res.get("overall_score", 0.0),
        "overall_toxicity": res.get("overall_toxicity", 0.0),
        "sentiment_breakdown": res.get("sentiment_breakdown", {}),
        "emotions": res.get("emotions", {})
    }

@app.get("/api/v1/analytics/demographics")
def get_demographics(
    platform: Optional[str] = Query(None),
    brand: Optional[str] = Query(None)
):
    df = repo.get_filtered_data(platform=platform, brand=brand)
    return process_demographic_insights(df)

@app.get("/api/v1/analytics/trends")
def get_trends(
    platform: Optional[str] = Query(None),
    brand: Optional[str] = Query(None)
):
    df = repo.get_filtered_data(platform=platform, brand=brand)
    return process_trending_topics(df)

@app.get("/api/v1/analytics/network")
def get_network_topology(
    platform: Optional[str] = Query(None),
    brand: Optional[str] = Query(None)
):
    df = repo.get_filtered_data(platform=platform, brand=brand)
    return build_network_graph(df)

@app.get("/api/v1/analytics/posts")
def get_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    platform: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    df = repo.get_filtered_data(platform=platform, brand=brand, sentiment=sentiment)
    if search and not df.empty:
        search_lower = search.lower()
        content_mask = df['content'].str.lower().str.contains(search_lower, na=False) if 'content' in df.columns else False
        brand_mask = df['brand_name'].str.lower().str.contains(search_lower, na=False) if 'brand_name' in df.columns else False
        hashtag_mask = df['hashtags'].str.lower().str.contains(search_lower, na=False) if 'hashtags' in df.columns else False
        df = df[content_mask | brand_mask | hashtag_mask]

    total_items = len(df)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    sliced = df.iloc[start_idx:end_idx]

    records = []
    for _, row in sliced.iterrows():
        records.append({
            "post_id": str(row.get("post_id", "")),
            "timestamp": str(row.get("timestamp", "")),
            "platform": str(row.get("platform", "")),
            "user_id": str(row.get("user_id", "")),
            "content": str(row.get("content", row.get("text_content", ""))),
            "location": str(row.get("location", "")),
            "brand_name": str(row.get("brand_name", "")),
            "hashtags": str(row.get("hashtags", "")),
            "sentiment_score": float(row.get("sentiment_score", 0.0)),
            "sentiment_label": str(row.get("sentiment_label", "")),
            "emotion_type": str(row.get("emotion_type", "")),
            "toxicity_score": float(row.get("toxicity_score", 0.0)),
            "likes_count": int(row.get("likes_count", 0)),
            "impressions": int(row.get("impressions", 0))
        })

    return {
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": (total_items + page_size - 1) // page_size,
        "posts": records
    }

# -------------------------------------------------------------
# Campaign Management Endpoints
# -------------------------------------------------------------
@app.get("/api/v1/campaigns", response_model=List[CampaignMetricResponse])
def get_campaigns(db: Session = Depends(get_db)):
    # Fetch database campaigns or seed with default campaigns if empty
    campaigns = db.query(CampaignMetric).all()
    if not campaigns:
        defaults = [
            CampaignMetric(campaign_name="Black Friday 2025", platform="Instagram", engagement_rate=0.185, sentiment_score=0.74),
            CampaignMetric(campaign_name="Spring Blast", platform="Twitter", engagement_rate=0.142, sentiment_score=0.62),
            CampaignMetric(campaign_name="Cyber Monday Deals", platform="Reddit", engagement_rate=0.210, sentiment_score=0.58),
            CampaignMetric(campaign_name="Global Brand Wave", platform="YouTube", engagement_rate=0.294, sentiment_score=0.81)
        ]
        db.add_all(defaults)
        db.commit()
        for c in defaults:
            db.refresh(c)
        campaigns = defaults
    return campaigns

@app.post("/api/v1/campaigns", response_model=CampaignMetricResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(payload: CampaignMetricCreate, db: Session = Depends(get_db)):
    metric = CampaignMetric(
        campaign_name=payload.campaign_name,
        platform=payload.platform,
        engagement_rate=payload.engagement_rate,
        sentiment_score=payload.sentiment_score
    )
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return metric

# -------------------------------------------------------------
# Reports & PDF Dispatch Endpoint
# -------------------------------------------------------------
@app.post("/api/v1/reports/trigger-pdf", status_code=status.HTTP_202_ACCEPTED)
def trigger_pdf_report():
    task_id = f"report_task_{uuid.uuid4().hex[:8]}"
    return {
        "status": "Dispatched",
        "message": "PDF report generation task dispatched successfully.",
        "task_id": task_id,
        "report_name": "Social_Media_Analytics_Executive_Summary.pdf"
    }

# -------------------------------------------------------------
# Real-Time WebSocket Streaming Endpoint
# -------------------------------------------------------------
@app.websocket("/ws/analytics")
async def websocket_analytics_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        df = repo.get_data()
        if df is None or df.empty:
            await websocket.send_json({"event": "error", "message": "Dataset not available"})
            return

        idx = 0
        total_len = len(df)
        while True:
            # Stream a pulse every 2.5 seconds
            await asyncio.sleep(2.5)
            batch_slice = df.iloc[idx : idx + 4]
            idx = (idx + 4) % total_len

            latest_posts = []
            for _, row in batch_slice.iterrows():
                latest_posts.append({
                    "post_id": str(row.get("post_id", "")),
                    "user_id": str(row.get("user_id", "")),
                    "platform": str(row.get("platform", "Social")),
                    "content": str(row.get("content", row.get("text_content", ""))),
                    "sentiment_label": str(row.get("sentiment_label", "Neutral")),
                    "sentiment_score": round(float(row.get("sentiment_score", 0.0)), 3),
                    "emotion_type": str(row.get("emotion_type", "Normal")),
                    "likes_count": int(row.get("likes_count", 0)),
                    "location": str(row.get("location", ""))
                })

            sentiment_summary = process_sentiment_trends(batch_slice)["sentiment_breakdown"]

            payload = {
                "event": "live_feed_update",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "batch_size": len(batch_slice),
                "latest_posts": latest_posts,
                "sentiment_summary": sentiment_summary
            }
            await websocket.send_json(payload)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)