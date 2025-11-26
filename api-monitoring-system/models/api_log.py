# models/api_log.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class APILog(BaseModel):
    id: Optional[str]
    api_id: str                       # maps to APIConfig._id
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status_code: Optional[int]
    response_time: Optional[float]    # in ms
    is_up: bool                       # True = working, False = down
