"""
category_repo.py  —  Category-specific database queries
"""

from sqlalchemy import func, select

from app.models.category import Category
from app.models.product  import Product
from app.repositories.base_repo import BaseRepository


class CategoryRepository(BaseRepository[Category]):

    async def get_by_slug(self, slug: str) -> Category | None:
        """Returns the active category matching the slug, or None."""
        result = await self.db.execute(
            select(Category).where(Category.slug == slug, Category.is_active == True)
        )
        return result.scalar_one_or_none()

    async def get_all_active(self) -> list[tuple[Category, int]]:
        """Returns all active categories with their product counts.

        Uses a LEFT JOIN + GROUP BY so categories with zero products are included.
        Returns a list of (Category, product_count) tuples.
        """
        result = await self.db.execute(
            select(Category, func.count(Product.id).label("product_count"))
            .outerjoin(
                Product,
                (Product.category_id == Category.id) & (Product.is_active == True),
            )
            .where(Category.is_active == True)
            .group_by(Category.id)
            .order_by(Category.name)
        )
        return list(result.all())

    async def slug_exists(self, slug: str) -> bool:
        """Returns True if any category (active or not) already has this slug."""
        result = await self.db.execute(
            select(func.count()).select_from(Category).where(Category.slug == slug)
        )
        return (result.scalar() or 0) > 0
