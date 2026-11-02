from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = "admin"

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class CampaignMetricBase(BaseModel):
    campaign_name: str
    platform: str
    engagement_rate: float = 0.0
    sentiment_score: float = 0.0

class CampaignMetricCreate(CampaignMetricBase):
    pass

class CampaignMetricResponse(CampaignMetricBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class SocialPostBase(BaseModel):
    post_id: str
    user_id: str
    platform: str
    content: str
    sentiment_score: float
    sentiment_label: str
    toxicity_score: float
    emotion_type: str
    likes_count: int = 0
    hashtags: Optional[str] = None
    location: Optional[str] = None

class SocialPostResponse(SocialPostBase):
    id: int
    timestamp: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
