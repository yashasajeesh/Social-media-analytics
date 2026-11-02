import json
import os
import time
from typing import Optional, Any

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_URL = os.getenv("REDIS_URL", f"redis://{REDIS_HOST}:{REDIS_PORT}/0")

class CacheService:
    def __init__(self):
        self.client = None
        self._memory_cache: dict[str, tuple[Any, float]] = {}
        try:
            import redis
            client = redis.from_url(REDIS_URL, decode_responses=True, socket_connect_timeout=1)
            client.ping()
            self.client = client
            print("[CacheService]: Successfully connected to Redis.")
        except Exception as e:
            # Graceful fallback: app will still function seamlessly without Redis
            self.client = None
            print(f"[Cache Notice]: Redis not active ({e}). Operating in resilient in-memory cache mode.")

    def get(self, key: str) -> Optional[Any]:
        if self.client:
            try:
                data = self.client.get(key)
                return json.loads(data) if data else None
            except Exception:
                pass
        
        # In-memory lookup
        item = self._memory_cache.get(key)
        if item:
            val, expiry = item
            if time.time() < expiry:
                return val
            else:
                del self._memory_cache[key]
        return None

    def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        if self.client:
            try:
                self.client.setex(key, ttl_seconds, json.dumps(value))
                return
            except Exception:
                pass
        
        # In-memory set
        self._memory_cache[key] = (value, time.time() + ttl_seconds)

cache_service = CacheService()
