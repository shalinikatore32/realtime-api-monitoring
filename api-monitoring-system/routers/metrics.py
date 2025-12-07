from fastapi import APIRouter, Request
from middleware.auth import get_current_user
from database.connection import db

router = APIRouter(prefix="/api", tags=["Metrics"])

async def _get_user_api_ids(user_id: str):
    apis = list(db.apis.find({"user_id": user_id}, {"_id": 1}))
    return [str(a["_id"]) for a in apis]

@router.get("/metrics")
async def get_metrics(request: Request):
    user_id = await get_current_user(request)

    api_ids = await _get_user_api_ids(user_id)

    # Total logs for this user's APIs
    total_requests = db.logs.count_documents({"api_id": {"$in": api_ids}})

    # Successful requests (is_up = True)
    success_requests = db.logs.count_documents({"api_id": {"$in": api_ids}, "is_up": True})

    success_rate = 0
    if total_requests > 0:
        success_rate = round((success_requests / total_requests) * 100, 2)

    # Average response time
    pipeline = [
        {"$match": {"api_id": {"$in": api_ids}, "response_time": {"$ne": None}}},
        {"$group": {"_id": None, "avg": {"$avg": "$response_time"}}},
    ]

    result = list(db.logs.aggregate(pipeline))
    avg_response = round(result[0]["avg"], 2) if result else None

    return {
        "total_requests": total_requests,
        "success_rate": success_rate,
        "avg_response": avg_response or 0,
    }
