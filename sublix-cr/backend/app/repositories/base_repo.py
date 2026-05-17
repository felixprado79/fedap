"""
base_repo.py  —  Generic async CRUD repository

Every resource repository inherits from BaseRepository[ModelType].
This gives common operations (get_by_id, create, update, delete) for free,
and each subclass only adds queries specific to that resource.

Pattern:
    class ProductRepository(BaseRepository[Product]):
        async def get_by_slug(self, slug: str) -> Product | None:
            ...

Why a repository layer?
    Keeps all SQL out of services and endpoints.
    Easy to unit-test by swapping with an in-memory implementation.
    SQLAlchemy query logic lives in one place.
"""

import uuid
from typing import Any, Generic, Type, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Async CRUD operations for any SQLAlchemy model."""

    def __init__(self, model: Type[ModelType], db: AsyncSession) -> None:
        self.model = model
        self.db    = db

    # ── Read ──────────────────────────────────────────────────────────────────

    async def get_by_id(self, id: uuid.UUID) -> ModelType | None:
        """Returns the record with the given UUID, or None if not found."""
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_all(self) -> list[ModelType]:
        """Returns every row in the table. Use sparingly — prefer paginated queries."""
        result = await self.db.execute(select(self.model))
        return list(result.scalars().all())

    # ── Write ─────────────────────────────────────────────────────────────────

    async def create(self, **kwargs: Any) -> ModelType:
        """Inserts a new record and returns it with DB-generated fields populated."""
        instance = self.model(**kwargs)
        self.db.add(instance)
        await self.db.commit()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: ModelType, **kwargs: Any) -> ModelType:
        """Applies keyword arguments as column updates and commits."""
        for field, value in kwargs.items():
            setattr(instance, field, value)
        await self.db.commit()
        await self.db.refresh(instance)
        return instance

    async def delete(self, instance: ModelType) -> None:
        """Hard-deletes a record from the database."""
        await self.db.delete(instance)
        await self.db.commit()
