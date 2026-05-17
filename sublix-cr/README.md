# Sublix.cr — Professional Website

Website for Sublix.cr, a sublimation company based in Costa Rica.

## Tech Stack

| Layer     | Technology                   |
|-----------|------------------------------|
| Frontend  | Next.js 15, TypeScript, Tailwind CSS |
| Backend   | FastAPI, SQLAlchemy (async)  |
| Database  | PostgreSQL 16                |
| Infra     | Docker, Nginx                |

## Quick Start (Development)

```bash
# 1. Clone the repo
git clone https://github.com/your-org/sublix-cr.git
cd sublix-cr

# 2. Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Fill in your values in each .env file

# 4. Start all services
docker compose up --build
```

Services will be available at:
- Frontend → http://localhost:3000
- API →      http://localhost:8000
- API docs → http://localhost:8000/api/docs

## Project Structure

```
sublix-cr/
├── frontend/           # Next.js application
│   └── src/
│       ├── app/        # Pages (App Router)
│       ├── components/ # UI, layout, and feature components
│       ├── lib/        # API client, utilities
│       ├── hooks/      # Custom React hooks
│       ├── store/      # Zustand global state
│       ├── types/      # TypeScript interfaces
│       └── constants/  # App-wide constants
│
├── backend/            # FastAPI application
│   └── app/
│       ├── api/v1/     # REST endpoints
│       ├── core/       # Config, security, logging
│       ├── db/         # Session, base model
│       ├── models/     # SQLAlchemy ORM models
│       ├── schemas/    # Pydantic request/response schemas
│       ├── services/   # Business logic
│       └── repositories/ # Data access layer
│
├── docker/             # Dockerfiles and Nginx config
├── docs/               # Developer documentation
├── docker-compose.yml       # Development
└── docker-compose.prod.yml  # Production overrides
```

## Phase Roadmap

- [x] Phase 1 — Project scaffolding
- [ ] Phase 2 — Database schema (models + migrations)
- [ ] Phase 3 — FastAPI CRUD endpoints + JWT auth
- [ ] Phase 4 — Next.js layout, routing, design system
- [ ] Phase 5 — Product catalog
- [ ] Phase 6 — Contact / quote form
- [ ] Phase 7 — Admin panel
- [ ] Phase 8 — Auth flow (admin login)
- [ ] Phase 9 — SEO and performance
- [ ] Phase 10 — Production hardening

## Database Migrations

```bash
# Enter the backend container
docker compose exec backend bash

# Create a new migration after changing models
alembic revision --autogenerate -m "describe your change"

# Apply pending migrations
alembic upgrade head

# Roll back one migration
alembic downgrade -1
```

## Documentation

- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
