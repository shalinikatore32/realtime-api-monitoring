from fastapi import APIRouter, Request
from middleware.auth import get_current_user
from database.connection import db

router = APIRouter(prefix="/api", tags=["Metrics"])

@router.get("/metrics")
async def get_metrics(request: Request):
    user_id = await get_current_user(request)

    # Total logs for this user
    total_requests = db.logs.count_documents({"user_id": user_id})

    # Successful requests (is_up = True)
    success_requests = db.logs.count_documents({"user_id": user_id, "is_up": True})

    success_rate = 0
    if total_requests > 0:
        success_rate = round((success_requests / total_requests) * 100, 2)

    # Average response time
    pipeline = [
        {"$match": {"user_id": user_id, "response_time": {"$ne": None}}},
        {"$group": {"_id": None, "avg": {"$avg": "$response_time"}}},
    ]

    result = list(db.logs.aggregate(pipeline))
    avg_response = round(result[0]["avg"], 2) if result else None

    return {
        "total_requests": total_requests,
        "success_rate": success_rate,
        "avg_response": avg_response or 0,
    }
