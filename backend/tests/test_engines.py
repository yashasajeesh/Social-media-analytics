import pandas as pd
from app.ai_engines.sentiment_engine import process_sentiment_trends
from app.ai_engines.trend_engine import process_trending_topics
from app.ai_engines.demographic_engine import process_demographic_insights
from app.ai_engines.network_engine import build_network_graph

def test_sentiment_engine_logic():
    sample_df = pd.DataFrame([{
        "timestamp": "2026-01-01 10:00:00",
        "sentiment_score": 0.8,
        "toxicity_score": 0.0,
        "likes_count": 15,
        "post_id": 1,
        "emotion_type": "Joy",
        "sentiment_label": "Positive"
    }])
    
    result = process_sentiment_trends(sample_df)
    assert len(result["timeline"]) == 1
    assert result["sentiment_breakdown"]["Positive"] == 1
    assert result["overall_score"] == 0.8

def test_trend_engine_logic():
    sample_df = pd.DataFrame([{
        "hashtags": "AI, Tech, Python",
        "topic_category": "Technology"
    }])
    
    result = process_trending_topics(sample_df)
    assert "AI" in result["trending_hashtags"]
    assert result["top_categories"]["Technology"] == 1

def test_demographic_engine_logic():
    sample_df = pd.DataFrame([{
        "location": "Tokyo, Japan",
        "language": "ja",
        "platform": "Twitter",
        "engagement_rate": 0.12
    }])

    result = process_demographic_insights(sample_df)
    assert "geographic_distribution" in result
    assert "Tokyo, Japan" in result["geographic_distribution"]
    assert "Japanese" in result["language_distribution"]

def test_network_engine_logic():
    sample_df = pd.DataFrame([{
        "user_id": "creator_01",
        "mentions": "@brand_ceo, @influencer",
        "likes_count": 100,
        "impressions": 5000,
        "user_engagement_growth": 0.25,
        "platform": "Twitter"
    }])

    result = build_network_graph(sample_df)
    assert "graph_stats" in result
    assert "top_kols" in result
    assert len(result["top_kols"]) >= 1
    assert result["top_kols"][0]["user_id"] == "creator_01"
