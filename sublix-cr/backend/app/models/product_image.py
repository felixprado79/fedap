"""
product_image.py  —  ProductImage SQLAlchemy model

A product can have multiple images.
The primary image (is_primary=True) is shown on list cards.
Additional images appear in the detail page gallery.

Table: product_images
"""

import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class ProductImage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "product_images"

    # ── Parent product ────────────────────────────────────────────────────────
    product_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),  # Images are orphaned otherwise
        nullable=False,
        index=True,
    )

    product: Mapped["Product"] = relationship(  # type: ignore[name-defined]
        "Product",
        back_populates="images",
    )

    # ── Image data ────────────────────────────────────────────────────────────
    # Absolute URL pointing to the file stored in object storage (S3, Cloudflare R2, etc.)
    url: Mapped[str] = mapped_column(String(500), nullable=False)

    # Accessible alt text for screen readers
    alt: Mapped[str] = mapped_column(String(200), nullable=False, default="")

    # The primary image is used as the thumbnail on list pages
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # Controls display order in the gallery (lower = first)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    def __repr__(self) -> str:
        return f"<ProductImage product_id={self.product_id} primary={self.is_primary}>"
