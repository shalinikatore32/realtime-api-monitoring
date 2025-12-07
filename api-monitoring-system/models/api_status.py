# models/api_status.py

from pydantic import BaseModel, Field
from typing import Optional

class APIStatus(BaseModel):
    api_id: str   
   
    url: str                         # API URL
    state: str                       # UP, DOWN, SLOW
    last_changed: str                # Timestamp of last status transition
    last_checked: str                # Timestamp of last health check
    previous_state: Optional[str]    # Helpful for debugging / transitions
