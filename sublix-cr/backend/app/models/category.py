"""
category.py  —  Category SQLAlchemy model

Each product belongs to exactly one category.
Categories drive the filter tabs in the frontend and
the product catalog structure.

Table: categories
"""

from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class Category(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "categories"

    # ── Identity ──────────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    # Slug is the URL-safe identifier: "ropa-deportiva"
    # Unique + indexed because we query by slug on every request.
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=False, default="")

    # ── Display metadata (used by the frontend UI) ─────────────────────────
    emoji: Mapped[str] = mapped_column(String(10), nullable=False, default="📦")

    # Tailwind gradient CSS classes stored as a string.
    # Example: "from-sky-400 to-blue-600"
    gradient: Mapped[str] = mapped_column(String(100), nullable=False, default="from-gray-400 to-gray-600")

    # ── Status ────────────────────────────────────────────────────────────────
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    # ── Relationships ─────────────────────────────────────────────────────────
    # back_populates must match the attribute name on the Product model.
    products: Mapped[list["Product"]] = relationship(  # type: ignore[name-defined]
        "Product",
        back_populates="category",
        lazy="noload",          # Never load products unless explicitly requested
    )

    def __repr__(self) -> str:
        return f"<Category slug={self.slug!r}>"
