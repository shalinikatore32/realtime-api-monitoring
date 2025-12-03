# database/redis_client.py
import json
from redis import Redis
from config.settings import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_TTL_SECONDS

redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)

def make_key(*parts) -> str:
    """Consistent key factory: join parts by colon."""
    return ":".join(parts)

def set_json(key: str, value: dict, ex: int | None = REDIS_TTL_SECONDS):
    redis_client.set(key, json.dumps(value, default=str), ex=ex)

def get_json(key: str):
    raw = redis_client.get(key)
    return json.loads(raw) if raw else None

def push_recent_list(key: str, value: dict, maxlen: int = 50):
    raw = json.dumps(value, default=str)
    redis_client.lpush(key, raw)
    redis_client.ltrim(key, 0, maxlen - 1)

def get_recent_list(key: str, start: int = 0, end: int = -1):
    items = redis_client.lrange(key, start, end)
    return [json.loads(i) for i in items] if items else []
