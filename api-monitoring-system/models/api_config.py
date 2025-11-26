# models/api_config.py
from pydantic import BaseModel, HttpUrl
from typing import Optional

class APIConfig(BaseModel):
    name: str
    url: HttpUrl
    method: str
    frequency: int
