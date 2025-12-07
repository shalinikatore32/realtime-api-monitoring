# database/redis_async.py
import asyncio
import json
import os
from redis.asyncio import Redis as AsyncRedis
from config.settings import REDIS_HOST, REDIS_PORT, REDIS_DB

# create a singleton async redis client
async_redis = AsyncRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)

def make_channel(user_id: str) -> str:
    return f"alerts:{user_id}"

async def subscribe(channel: str):
    """
    Returns an aioredis PubSub object subscribed to the given channel.
    Caller must iterate over pubsub.listen() / pubsub.get_message() (see ws router).
    """
    pubsub = async_redis.pubsub()
    await pubsub.subscribe(channel)
    return pubsub

async def unsubscribe(pubsub):
    try:
        await pubsub.close()
    except Exception:
        pass
