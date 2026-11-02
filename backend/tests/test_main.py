from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Active"
    assert "dataset_records" in data

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["dataset_loaded"] is True

def test_sentiment_endpoint():
    response = client.get("/api/v1/analytics/sentiment")
    assert response.status_code == 200
    data = response.json()
    assert "timeline" in data
    assert "sentiment_breakdown" in data

def test_demographics_endpoint():
    response = client.get("/api/v1/analytics/demographics")
    assert response.status_code == 200
    data = response.json()
    assert "geographic_distribution" in data

def test_trends_endpoint():
    response = client.get("/api/v1/analytics/trends")
    assert response.status_code == 200
    data = response.json()
    assert "trending_hashtags" in data

def test_network_endpoint():
    response = client.get("/api/v1/analytics/network")
    assert response.status_code == 200
    data = response.json()
    assert "graph_stats" in data
    assert "top_kols" in data

def test_auth_and_campaigns():
    # Test Login
    login_resp = client.post("/api/v1/auth/login", json={"username": "admin", "password": "analytics123"})
    assert login_resp.status_code == 200
    token = login_resp.json().get("access_token")
    assert token is not None

    # Test Campaign retrieval
    camp_resp = client.get("/api/v1/campaigns")
    assert camp_resp.status_code == 200
    assert isinstance(camp_resp.json(), list)

    # Test PDF Report trigger
    pdf_resp = client.post("/api/v1/reports/trigger-pdf")
    assert pdf_resp.status_code == 202
    assert "task_id" in pdf_resp.json()
