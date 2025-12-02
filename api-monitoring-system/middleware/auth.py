from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt
import os

SECRET = os.getenv("JWT_SECRET", "supersecret")
ALGO = "HS256"

bearer = HTTPBearer()

async def get_current_user(request: Request):
    token = None
    try:
        token = await bearer(request)
        payload = jwt.decode(token.credentials, SECRET, algorithms=[ALGO])
        return payload["user_id"]
    except Exception:
        raise HTTPException(401, "Invalid or expired token")
