# models/api_alert.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class APIAlert(BaseModel):
    id: Optional[str]
    api_id: str
    
    message: str
    severity: str = "High"           # High | Medium | Low
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    resolved: bool = False,
    read: bool = False
