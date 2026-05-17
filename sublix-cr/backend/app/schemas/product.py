"""
product.py  —  Pydantic schemas for the Product resource

Schema hierarchy:
    ProductImageResponse  → image as returned by the API
    ProductBase           → shared writable fields
    ProductCreate         → POST body (admin)
    ProductUpdate         → PATCH body (admin, all fields optional)
    ProductListItem       → lightweight schema for list endpoints (no full description)
    ProductResponse       → full schema for detail endpoint

Design decision:
    We expose two different response schemas because the list endpoint
    returns dozens of items — sending the full description for each one
    wastes bandwidth. The detail endpoint returns everything.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator
from slugify import slugify

from app.schemas.category import CategoryResponse


# ── Image schema ──────────────────────────────────────────────────────────────

class ProductImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id:         uuid.UUID
    url:        str
    alt:        str
    is_primary: bool
    sort_order: int


# ── Product base ──────────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name:              str = Field(min_length=2,  max_length=200, examples=["Camiseta deportiva"])
    short_description: str = Field(default="",    max_length=300)
    description:       str = Field(default="",    min_length=0)
    tags:              list[str] = Field(default_factory=list, max_length=20)
    is_featured:       bool = Field(default=False)
    min_quantity:      int  = Field(default=1, ge=1, le=10_000)


class ProductCreate(ProductBase):
    """POST /products payload — slug is auto-generated from name if not supplied."""

    category_id: uuid.UUID
    slug: str | None = Field(
        default=None,
        description="Dejar en blanco para generarlo automáticamente desde el nombre.",
    )

    @field_validator("slug", mode="before")
    @classmethod
    def auto_generate_slug(cls, v: str | None, info) -> str:
        if v:
            return slugify(v)
        # Generate from name when slug is not provided
        name = info.data.get("name", "")
        return slugify(name) if name else ""


class ProductUpdate(BaseModel):
    """PATCH /products/{slug} — every field is optional."""

    name:              str | None = Field(default=None, min_length=2, max_length=200)
    short_description: str | None = Field(default=None, max_length=300)
    description:       str | None = None
    category_id:       uuid.UUID | None = None
    tags:              list[str] | None = None
    is_featured:       bool | None = None
    is_active:         bool | None = None
    min_quantity:      int | None  = Field(default=None, ge=1)


# ── Response schemas ──────────────────────────────────────────────────────────

class ProductListItem(BaseModel):
    """Lightweight schema used in paginated list responses.

    Omits the full description to reduce payload size.
    """

    model_config = ConfigDict(from_attributes=True)

    id:                uuid.UUID
    name:              str
    slug:              str
    short_description: str
    category:          CategoryResponse
    images:            list[ProductImageResponse]
    tags:              list[str]
    is_featured:       bool
    is_active:         bool
    min_quantity:      int
    created_at:        datetime


class ProductResponse(ProductListItem):
    """Full product detail — includes the complete description."""

    description: str
    updated_at:  datetime
