-- ─────────────────────────────────────────────────────────────────────────────
-- init.sql  —  Runs once when the PostgreSQL container is first created
--
-- Sets up extensions used by the application.
-- Tables are created by Alembic migrations, not here.
-- ─────────────────────────────────────────────────────────────────────────────

-- UUID generation (used as primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Case-insensitive text search
CREATE EXTENSION IF NOT EXISTS "citext";
