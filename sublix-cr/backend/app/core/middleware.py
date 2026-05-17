"""
middleware.py  —  Custom ASGI middleware for security and observability

SecurityHeadersMiddleware
    Adds HTTP security headers to every response:
    - X-Content-Type-Options: stops MIME-type sniffing attacks
    - X-Frame-Options: prevents clickjacking
    - Referrer-Policy: controls how much info is sent in the Referer header
    - Permissions-Policy: disables browser features we don't use
    - Strict-Transport-Security: enforces HTTPS (only in production)
    - Content-Security-Policy: allowlist for scripts/styles/images

RequestIDMiddleware
    Stamps every request with a unique X-Request-ID header so individual
    requests can be traced across logs without a full APM setup.
"""

import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.config  import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects security-related HTTP response headers on every request."""

    # Content-Security-Policy: tight allowlist.
    # 'self' = same origin, fonts from Google, no inline scripts.
    # Adjust script-src if you add analytics or third-party JS widgets.
    _CSP = (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self'; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self';"
    )

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        response.headers["X-Content-Type-Options"]  = "nosniff"
        response.headers["X-Frame-Options"]         = "DENY"
        response.headers["Referrer-Policy"]         = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"]      = (
            "camera=(), microphone=(), geolocation=(), payment=()"
        )
        response.headers["Content-Security-Policy"] = self._CSP

        # HSTS only makes sense over a real HTTPS connection (not localhost dev)
        if settings.ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = (
                "max-age=63072000; includeSubDomains; preload"
            )

        # Remove headers that leak server details
        response.headers.pop("Server",       None)
        response.headers.pop("X-Powered-By", None)

        return response


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Attaches a unique request ID to every request/response.

    - If the caller sends X-Request-ID, we honour it (useful for distributed tracing).
    - Otherwise we generate a new UUID4.
    - The ID is echoed back in the response header and added to log context.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

        # Stash in request state so endpoint code can access it if needed
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id

        logger.debug(
            "%(method)s %(path)s → %(status)s [%(rid)s]",
            {
                "method": request.method,
                "path":   request.url.path,
                "status": response.status_code,
                "rid":    request_id,
            },
        )

        return response
