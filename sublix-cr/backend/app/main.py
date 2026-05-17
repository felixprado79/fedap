"""
main.py  —  FastAPI application entry point for Sublix.cr

Startup sequence:
    1. configure_logging()      → structured log format
    2. RequestIDMiddleware      → trace ID on every request
    3. SecurityHeadersMiddleware→ X-Frame-Options, CSP, HSTS, etc.
    4. TrustedHostMiddleware    → reject requests with unknown Host header
    5. GZipMiddleware           → compress responses ≥ 1 KB
    6. CORSMiddleware           → allow configured frontend origins
    7. slowapi state            → rate limiter attached to app.state
    8. Exception handlers       → convert domain + rate-limit errors to JSON
    9. api_router               → all versioned endpoints
   10. /health                  → load balancer probe
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors    import CORSMiddleware
from fastapi.middleware.gzip    import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.core.config     import settings
from app.core.limiter    import limiter
from app.core.logging    import configure_logging, get_logger
from app.core.middleware import RequestIDMiddleware, SecurityHeadersMiddleware
from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    NotFoundException,
    SublixException,
)
from app.api.v1.router import api_router

logger = get_logger(__name__)


# ── Lifespan (startup / shutdown hooks) ──────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    logger.info(f"🚀 {settings.APP_NAME} starting in {settings.ENVIRONMENT} mode")
    yield
    logger.info("👋 Application shutdown")


# ── App instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs"        if settings.DEBUG else None,
    redoc_url="/api/redoc"      if settings.DEBUG else None,
    openapi_url="/api/openapi.json" if settings.DEBUG else None,
)

# Attach the rate limiter to app.state so slowapi can find it
app.state.limiter = limiter


# ── Middleware stack (order matters — outermost runs first on request) ─────────

# Stamp each request with a unique trace ID before anything else runs
app.add_middleware(RequestIDMiddleware)

# Inject security headers into every outgoing response
app.add_middleware(SecurityHeadersMiddleware)

# Reject requests with Host headers not in our allowlist (prevents Host injection)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.TRUSTED_HOSTS,
)

# Compress text responses that are at least 1 KB — reduces bandwidth
app.add_middleware(GZipMiddleware, minimum_size=1024)

# CORS — must come after TrustedHostMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)


# ── Global exception handlers ─────────────────────────────────────────────────

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """Rate limit hit — return 429 with a Retry-After hint."""
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={
            "error":   "rate_limit_exceeded",
            "message": "Demasiadas solicitudes. Por favor espera un momento antes de intentar de nuevo.",
        },
        headers={"Retry-After": "60"},
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Pydantic validation failed — returns field-level error details."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error":   "validation_error",
            "message": "Los datos enviados contienen errores de validación.",
            "details": exc.errors(),
        },
    )


@app.exception_handler(NotFoundException)
async def not_found_handler(request: Request, exc: NotFoundException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"error": "not_found", "message": exc.message},
    )


@app.exception_handler(ConflictException)
async def conflict_handler(request: Request, exc: ConflictException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"error": "conflict", "message": exc.message},
    )


@app.exception_handler(BadRequestException)
async def bad_request_handler(request: Request, exc: BadRequestException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"error": "bad_request", "message": exc.message},
    )


@app.exception_handler(SublixException)
async def generic_domain_error_handler(request: Request, exc: SublixException) -> JSONResponse:
    """Catch-all for any unhandled domain exception."""
    logger.error(f"Unhandled domain exception: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "internal_error", "message": "Error interno del servidor."},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Last-resort handler for unexpected Python exceptions."""
    logger.exception(f"Unexpected error on {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "internal_error", "message": "Error interno del servidor."},
    )


# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix=settings.API_PREFIX)


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"], include_in_schema=False)
async def health_check():
    return {"status": "ok", "service": settings.APP_NAME, "environment": settings.ENVIRONMENT}
