"""
category.py  —  Pydantic schemas for the Category resource

Schema hierarchy:
    CategoryBase      → shared fields (name, slug, description, emoji, gradient)
    CategoryCreate    → used by POST /categories (admin, Phase 5)
    CategoryUpdate    → used by PATCH /categories/{slug} (admin, Phase 5)
    CategoryResponse  → returned to API clients (includes product_count)

from_attributes=True  lets Pydantic read values from SQLAlchemy model instances
instead of plain dicts, which is required in FastAPI endpoints.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CategoryBase(BaseModel):
    name:        str = Field(min_length=2, max_length=100, examples=["Ropa y uniformes"])
    slug:        str = Field(min_length=2, max_length=120, examples=["ropa"])
    description: str = Field(default="", max_length=500)
    emoji:       str = Field(default="📦", max_length=10)
    gradient:    str = Field(default="from-gray-400 to-gray-600", max_length=100)

    @field_validator("slug")
    @classmethod
    def slug_must_be_lowercase(cls, v: str) -> str:
        if v != v.lower():
            raise ValueError("El slug debe estar en minúsculas.")
        if not all(c.isalnum() or c == "-" for c in v):
            raise ValueError("El slug solo puede contener letras, números y guiones.")
        return v


class CategoryCreate(CategoryBase):
    """Payload for creating a new category (admin only)."""
    pass


class CategoryUpdate(BaseModel):
    """All fields optional for partial update (PATCH semantics)."""
    name:        str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    emoji:       str | None = Field(default=None, max_length=10)
    gradient:    str | None = Field(default=None, max_length=100)
    is_active:   bool | None = None


class CategoryResponse(CategoryBase):
    """Returned to API clients — includes DB-managed fields."""

    model_config = ConfigDict(from_attributes=True)

    id:           uuid.UUID
    is_active:    bool
    product_count: int = 0      # Computed by the repository, not in the ORM model
    created_at:   datetime
    updated_at:   datetime
