# ⚡ PulseAI: Social Media Analytics Framework

A modern, full-stack, enterprise-grade Social Media Analytics & Intelligence platform built with **FastAPI**, **Pandas**, and **React (Vite)**. Designed for multi-channel data ingestion, sentiment & emotion AI classification, demographic mapping, trend detection, influencer (KOL) network topologies, and real-time streaming pulses.

---

## 🚀 Key Features

- **📊 Executive Overview Dashboard**: High-level KPI indicators (Total Ingested Records, Average Sentiment, Key Opinion Leaders, Graph Connections) with dynamic Recharts line, bar, donut, and area visualizations.
- **🧠 Sentiment & Emotion AI Studio**: Deep multi-vector sentiment classification (Positive, Neutral, Negative), emotion breakdown (Joy, Excitement, Confusion, Sadness, Anger), and toxicity index monitoring.
- **🌍 Demographics & Geography**: Audience footprint mapping across global cities and countries, multi-lingual breakdowns, and platform engagement comparisons.
- **🔥 Trends & Hashtags Radar**: Top trending hashtags leaderboard, topic category distributions (Pricing, Marketing, Delivery, Returns, Support, Product), and brand share-of-voice index.
- **🕸️ KOL Network Topology**: Interactive entity network visualizer, degree centrality, network density calculation, and Key Opinion Leader (influencer) leaderboard with influence scoring.
- **📡 Real-Time WebSocket Streaming**: Live pulse ingestion stream over `/ws/analytics` streaming batch updates with play/pause controls and emotion categorization.
- **🎯 Campaign Tracker & Post Data Lake**: Paginated querying and full-text search across all 12,000 ingested posts, campaign metrics tracker, and PDF report dispatch triggers.
- **🎨 Modern Glassmorphism UI**: High-aesthetic cyber-executive interface with dark & light theme toggle, responsive layout, smooth micro-animations, and live latency monitoring.

---

## 📁 Repository Structure

```
social-media-analytics/
├── backend/
│   ├── app/
│   │   ├── ai_engines/
│   │   │   ├── sentiment_engine.py    # Daily timeline aggregation & sentiment breakdown
│   │   │   ├── demographic_engine.py  # Geographic & language distributions
│   │   │   ├── trend_engine.py        # Hashtags, categories, brand performance
│   │   │   └── network_engine.py      # Network graph, density & KOL ranking
│   │   ├── models/
│   │   │   └── __init__.py            # SQLAlchemy models (User, Post, CampaignMetric)
│   │   ├── services/
│   │   │   ├── dataset_ingestion.py   # DataRepository with 12,000 record CSV loader
│   │   │   ├── cache_service.py       # Resilient Redis cache with in-memory fallback
│   │   │   ├── database.py            # SQLite / PostgreSQL engine & session
│   │   │   └── schema.py              # Pydantic validation schemas
│   │   ├── database.py                # Database connection & get_db dependency
│   │   └── main.py                    # FastAPI application & WebSocket endpoints
│   ├── data/
│   │   ├── Social Media Engagement Dataset.csv # 12,000 post benchmark dataset
│   │   └── Instagram_Analytics.csv             # 30,000 record Instagram analytics dataset
│   ├── tests/
│   │   ├── test_engines.py            # Unit tests for all 4 AI engines
│   │   └── test_main.py               # REST API & WebSocket integration tests
│   ├── alembic/                       # Database migration configurations
│   ├── Dockerfile                     # Production Docker container
│   ├── Procfile                       # Cloud deployment process file (Render/Heroku)
│   └── requirements.txt               # Python package dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LiveFeed.jsx           # Real-time WebSocket streaming feed
│   │   │   ├── NetworkGraph.jsx       # Interactive network visualizer & KOL ranking
│   │   │   └── CampaignsExplorer.jsx  # Campaign creator & 12,000 post data lake
│   │   ├── App.jsx                    # Main analytics dashboard & tab views
│   │   ├── main.jsx                   # React 18 DOM mount
│   │   └── index.css                  # Glassmorphism design system & color tokens
│   ├── index.html                     # HTML5 entry with modern typography
│   ├── vite.config.js                 # Vite configuration with proxy to backend
│   ├── Dockerfile                     # Multi-stage Nginx production container
│   ├── nginx.conf                     # Nginx reverse proxy configuration
│   └── vercel.json                    # Single-page application routing for Vercel
│
├── docker-compose.yml                 # Multi-container orchestration (Backend + Frontend + Redis)
├── render.yaml                        # Render Cloud deployment blueprint
└── README.md                          # Documentation & deployment guide
```

---

## 🛠️ Quick Start (Local Development)

### Prerequisites
- Python 3.12+ (or 3.13)
- Node.js 18+ & npm

### 1. Run the Backend (FastAPI)
```bash
# In backend directory
cd backend

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Or install dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API docs available at: `http://127.0.0.1:8000/docs`

### 2. Run the Frontend (Vite + React)
```bash
# In frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```
Open your browser at: `http://127.0.0.1:3000`

---

## 🧪 Running Tests

The test suite validates all 4 AI engines and all REST endpoints against the 12,000 record dataset.
```bash
# Run pytest from project root
.\backend\venv\Scripts\python.exe -m pytest backend/tests -v
```
All 11 test suites pass with 100% success.

---

## 🚢 Deployment Guide

### Option 1: Docker Compose (One-Command Deployment)
Deploy the entire stack with a single command:
```bash
docker-compose up --build -d
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Redis Cache: `localhost:6379`

### Option 2: Render.com
Use the included `render.yaml` blueprint:
1. Connect your repository on Render.
2. Select **New Blueprint Instance**.
3. Render will automatically spin up:
   - Backend web service via `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Frontend static site with automatic build command `npm install && npm run build`

### Option 3: Vercel (Frontend) + Render / Railway (Backend)
- Deploy `frontend/` to **Vercel** (the included `vercel.json` ensures full SPA support). Set `VITE_API_URL` to your backend URL.
- Deploy `backend/` to **Render** or **Railway** using the included `Dockerfile` or `Procfile`.

---

## 🛡️ License
MIT License. Built for enterprise analytics and high-scale social media intelligence.
