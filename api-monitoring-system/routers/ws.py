# routers/ws.py
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import jwt
from database.redis_async import subscribe, unsubscribe, make_channel
import os
from datetime import datetime

router = APIRouter()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGO = "HS256"

@router.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket, token: str = Query(None)):
    await websocket.accept()

    if not token:
        await websocket.send_json({"error": "missing_token"})
        await websocket.close()
        return

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        user_id = str(payload.get("user_id"))
        if not user_id:
            await websocket.send_json({"error": "invalid_token"})
            await websocket.close()
            return
    except Exception:
        await websocket.send_json({"error": "invalid_token"})
        await websocket.close()
        return

    channel = make_channel(user_id)
    pubsub = None

    try:
        pubsub = await subscribe(channel)
        await websocket.send_json({"type": "info", "message": "connected", "user_id": user_id})

        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message:
                data = message.get("data")
                try:
                    payload = json.loads(data)
                except Exception:
                    payload = {"raw": data}
                await websocket.send_json({"type": "alert", "data": payload})

            try:
                await websocket.send_json({"type": "heartbeat", "timestamp": datetime.utcnow().isoformat()})
            except Exception:
                break
    except WebSocketDisconnect:
        pass
    finally:
        if pubsub:
            await unsubscribe(pubsub)
        try:
            await websocket.close()
        except Exception:
            pass
    return