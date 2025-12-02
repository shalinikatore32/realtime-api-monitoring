from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from jose import jwt
from pydantic import BaseModel
from database.connection import db
import bcrypt
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

SECRET = os.getenv("JWT_SECRET", "supersecret")
ALGO = "HS256"


class AuthRequest(BaseModel):
    email: str
    password: str


# ----------------------------------------
# SIGNUP (bcrypt v4 hashing)
# ----------------------------------------
@router.post("/signup")
def signup(user: AuthRequest):

    existing = db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(400, "Email already registered")

    # Convert password to bytes
    password_bytes = user.password.encode("utf-8")

    # bcrypt hashing
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode()

    db.users.insert_one({
        "name": user.email.split("@")[0],
        "email": user.email,
        "password": hashed
    })

    return {"status": "registered"}


# ----------------------------------------
# LOGIN (bcrypt v4 verification)
# ----------------------------------------
@router.post("/login")
def login(data: AuthRequest):
    user = db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(401, "Invalid credentials (email)")

    password_bytes = data.password.encode("utf-8")
    stored_password_bytes = user["password"].encode("utf-8")

    # Verify password
    if not bcrypt.checkpw(password_bytes, stored_password_bytes):
        raise HTTPException(401, "Invalid credentials (password)")

    # Generate JWT
    token = jwt.encode(
        {
            "user_id": str(user["_id"]),
            "exp": datetime.utcnow() + timedelta(days=2)
        },
        SECRET,
        algorithm=ALGO
    )

    return {
        "token": token,
        "user_id": str(user["_id"]),
        "email": user["email"]
    }
