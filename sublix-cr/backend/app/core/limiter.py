"""
limiter.py  —  Rate limiting setup using slowapi (wraps the 'limits' library)

Default storage: in-memory (resets on restart).
For multi-instance / production: set RATE_LIMIT_STORAGE_URI=redis://redis:6379

Usage in an endpoint:
    from app.core.limiter import limiter
    from fastapi import Request

    @router.post("")
    @limiter.limit("3/minute")
    async def my_endpoint(request: Request, ...):
        ...

Note: slowapi requires the `request: Request` parameter to be present in every
rate-limited endpoint so it can extract the client IP.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings

# One global Limiter instance — imported everywhere rate limiting is needed.
# key_func=get_remote_address → limits are per client IP.
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=settings.RATE_LIMIT_STORAGE_URI,
    # Automatically adds X-RateLimit-* headers to responses.
    headers_enabled=True,
)
