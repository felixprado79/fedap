# ─────────────────────────────────────────────────────────────────────────────
# docker/backend/Dockerfile  —  FastAPI container
#
# Uses a two-stage build:
#   Stage 1 (builder) → install dependencies into a virtual env
#   Stage 2 (runtime) → copy only what's needed, keeps the image lean
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build dependencies ───────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# System libraries required by some Python packages (e.g. psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip \
  && pip install --prefix=/install --no-cache-dir -r requirements.txt


# ── Stage 2: Runtime image ────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY . .

# Expose FastAPI default port
EXPOSE 8000

# Start with uvicorn in development mode (hot reload)
# Production overrides this via docker-compose.prod.yml
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
