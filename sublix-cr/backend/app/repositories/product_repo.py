"""
product_repo.py  —  Product-specific database queries

The most complex repository because it supports:
  - Filtering by category slug, search term, and featured flag
  - Pagination (offset/limit)
  - Eager loading of category and images to avoid N+1 queries
"""

from sqlalchemy import func, or_, select
from sqlalchemy.orm import selectinload

from app.models.category      import Category
from app.models.product       import Product
from app.models.product_image import ProductImage
from app.repositories.base_repo import BaseRepository


class ProductRepository(BaseRepository[Product]):

    async def get_by_slug(self, slug: str) -> Product | None:
        """Returns an active product by its URL slug, with category and images loaded."""
        result = await self.db.execute(
            select(Product)
            .join(Category)
            .options(selectinload(Product.images))
            .where(Product.slug == slug, Product.is_active == True)
        )
        return result.scalar_one_or_none()

    async def get_paginated(
        self,
        category_slug: str | None = None,
        search: str | None = None,
        featured: bool | None = None,
        page: int = 1,
        page_size: int = 12,
    ) -> tuple[list[Product], int]:
        """Returns a page of products and the total count of matching records.

        All filters are optional and composable — e.g. you can filter by
        category AND search at the same time.

        Returns:
            (items, total) — items is the current page, total is the full count.
        """
        # Base query: only active products, always load category + images
        base = (
            select(Product)
            .join(Category)
            .options(selectinload(Product.images))
            .where(Product.is_active == True)
        )

        # ── Apply filters ─────────────────────────────────────────────────────
        if category_slug:
            base = base.where(Category.slug == category_slug)

        if featured is not None:
            base = base.where(Product.is_featured == featured)

        if search:
            term = f"%{search}%"
            # Search across name, short description, and tags (array overlap)
            base = base.where(
                or_(
                    Product.name.ilike(term),
                    Product.short_description.ilike(term),
                )
            )

        # ── Count total matching records (before pagination) ──────────────────
        count_query = select(func.count()).select_from(base.subquery())
        total: int  = (await self.db.scalar(count_query)) or 0

        # ── Apply ordering and pagination ─────────────────────────────────────
        paginated = (
            base
            .order_by(Product.is_featured.desc(), Product.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        result   = await self.db.execute(paginated)
        products = list(result.scalars().all())

        return products, total

    async def slug_exists(self, slug: str, exclude_id=None) -> bool:
        """Returns True if a product with this slug already exists.

        Pass exclude_id when checking during an update to allow the
        product to keep its own slug without triggering a conflict error.
        """
        q = select(func.count()).select_from(Product).where(Product.slug == slug)
        if exclude_id is not None:
            q = q.where(Product.id != exclude_id)
        return ((await self.db.scalar(q)) or 0) > 0
