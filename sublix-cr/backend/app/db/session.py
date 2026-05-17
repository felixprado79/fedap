"""
session.py  —  Async SQLAlchemy session factory

Provides:
  - async_engine   → connection pool to PostgreSQL
  - AsyncSessionLocal → factory for database sessions
  - get_db()       → FastAPI dependency that yields a session per request
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

# One engine per application (connection pool is reused across requests)
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,        # Log SQL queries in development
    pool_pre_ping=True,         # Detect stale connections before using them
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,     # Avoids lazy-load errors after commit
    class_=AsyncSession,
)


async def get_db() -> AsyncSession:
    """
    FastAPI dependency — inject with: db: AsyncSession = Depends(get_db)
    Opens a session, yields it, then closes it after the request finishes.
    """
    async with AsyncSessionLocal() as session:
        yield session
