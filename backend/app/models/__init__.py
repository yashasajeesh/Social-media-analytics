from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class SocialPostModel(Base):
    __tablename__ = "social_posts"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(String, unique=True, index=True)
    user_id = Column(String, index=True)
    timestamp = Column(DateTime, index=True)
    platform = Column(String, index=True)
    content = Column(String)
    sentiment_score = Column(Float)
    sentiment_label = Column(String)
    toxicity_score = Column(Float)
    emotion_type = Column(String)
    likes_count = Column(Integer, default=0)
    hashtags = Column(String, nullable=True)
    location = Column(String, nullable=True)

# Alias for compatibility with migrations and services
Post = SocialPostModel

class CampaignMetric(Base):
    __tablename__ = "campaign_metrics"

    id = Column(Integer, primary_key=True, index=True)
    campaign_name = Column(String, index=True, nullable=False)
    platform = Column(String, nullable=False)
    engagement_rate = Column(Float, default=0.0)
    sentiment_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

__all__ = ["Base", "SocialPostModel", "Post", "CampaignMetric", "User"]
