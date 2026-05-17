"""
product.py  —  Product SQLAlchemy model

Represents a sublimation product in the catalog.
No price column — orders are always quoted per job.

Table: products
"""

import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class Product(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "products"

    # ── Identity ──────────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(200), nullable=False)

    # URL-safe identifier: "camiseta-deportiva-full-color"
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)

    # One-liner shown on product cards (max 200 chars)
    short_description: Mapped[str] = mapped_column(String(300), nullable=False, default="")

    # Full rich-text description shown on the detail page
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")

    # ── Category relationship ──────────────────────────────────────────────────
    category_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="RESTRICT"),  # Prevent orphaned products
        nullable=False,
        index=True,
    )

    category: Mapped["Category"] = relationship(  # type: ignore[name-defined]
        "Category",
        back_populates="products",
        lazy="joined",      # Always JOIN category — we need it for every response
    )

    # ── Media ─────────────────────────────────────────────────────────────────
    images: Mapped[list["ProductImage"]] = relationship(  # type: ignore[name-defined]
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan",   # Images are deleted when the product is deleted
        order_by="ProductImage.sort_order",
        lazy="selectin",    # Load images in a separate SELECT (efficient for lists)
    )

    # Tags stored as a PostgreSQL string array.
    # Example: ["deportivo", "full-color", "lavable"]
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)

    # ── Flags ─────────────────────────────────────────────────────────────────
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    is_active:   Mapped[bool] = mapped_column(Boolean, nullable=False, default=True,  index=True)

    # ── Business rules ────────────────────────────────────────────────────────
    # Minimum units per order (sublimation is efficient at volume)
    min_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    def __repr__(self) -> str:
        return f"<Product slug={self.slug!r} active={self.is_active}>"
