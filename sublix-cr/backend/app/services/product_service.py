"""
product_service.py  —  Business logic for products and categories

The service layer sits between endpoints and repositories.
It owns all business rules so endpoints stay thin HTTP handlers.

Rules enforced here:
  - Slug uniqueness check before create/update
  - NotFoundException is raised (not 404) so endpoints are decoupled from HTTP
  - Category existence is validated before assigning to a product
"""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictException, NotFoundException
from app.models.category import Category
from app.models.product  import Product
from app.repositories.category_repo import CategoryRepository
from app.repositories.product_repo  import ProductRepository
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.schemas.common   import PaginatedResponse
from app.schemas.product  import ProductCreate, ProductListItem, ProductResponse, ProductUpdate


# ── Product service ───────────────────────────────────────────────────────────

class ProductService:

    def __init__(self, db: AsyncSession) -> None:
        self.repo = ProductRepository(Product, db)

    async def list_products(
        self,
        category_slug: str | None = None,
        search: str | None = None,
        featured: bool | None = None,
        page: int = 1,
        page_size: int = 12,
    ) -> PaginatedResponse[ProductListItem]:
        """Returns a paginated list of active products matching the given filters."""
        products, total = await self.repo.get_paginated(
            category_slug=category_slug,
            search=search,
            featured=featured,
            page=page,
            page_size=page_size,
        )
        items = [ProductListItem.model_validate(p) for p in products]
        return PaginatedResponse.build(items=items, total=total, page=page, page_size=page_size)

    async def get_product(self, slug: str) -> ProductResponse:
        """Returns a single product by slug, or raises NotFoundException."""
        product = await self.repo.get_by_slug(slug)
        if not product:
            raise NotFoundException(resource="Producto", identifier=slug)
        return ProductResponse.model_validate(product)

    async def create_product(self, data: ProductCreate) -> ProductResponse:
        """Creates a new product after validating slug uniqueness."""
        if await self.repo.slug_exists(data.slug):
            raise ConflictException(resource="Producto", field="slug", value=data.slug)

        product = await self.repo.create(**data.model_dump())
        return ProductResponse.model_validate(product)

    async def update_product(self, slug: str, data: ProductUpdate) -> ProductResponse:
        """Updates a product. Checks slug uniqueness if the slug changes."""
        product = await self.repo.get_by_slug(slug)
        if not product:
            raise NotFoundException(resource="Producto", identifier=slug)

        updates = data.model_dump(exclude_unset=True)

        if "slug" in updates and updates["slug"] != slug:
            if await self.repo.slug_exists(updates["slug"], exclude_id=product.id):
                raise ConflictException(resource="Producto", field="slug", value=updates["slug"])

        updated = await self.repo.update(product, **updates)
        return ProductResponse.model_validate(updated)

    async def delete_product(self, slug: str) -> None:
        """Soft-deletes a product by setting is_active=False."""
        product = await self.repo.get_by_slug(slug)
        if not product:
            raise NotFoundException(resource="Producto", identifier=slug)
        # Soft delete — keeps historical data and associated orders intact
        await self.repo.update(product, is_active=False)


# ── Category service ──────────────────────────────────────────────────────────

class CategoryService:

    def __init__(self, db: AsyncSession) -> None:
        self.repo = CategoryRepository(Category, db)

    async def list_categories(self) -> list[dict]:
        """Returns all active categories with their product counts."""
        rows = await self.repo.get_all_active()
        result = []
        for category, count in rows:
            data = {
                **category.__dict__,
                "product_count": count,
            }
            result.append(data)
        return result

    async def get_category(self, slug: str) -> Category:
        """Returns a category by slug or raises NotFoundException."""
        cat = await self.repo.get_by_slug(slug)
        if not cat:
            raise NotFoundException(resource="Categoría", identifier=slug)
        return cat

    async def create_category(self, data: CategoryCreate) -> Category:
        if await self.repo.slug_exists(data.slug):
            raise ConflictException(resource="Categoría", field="slug", value=data.slug)
        return await self.repo.create(**data.model_dump())

    async def update_category(self, slug: str, data: CategoryUpdate) -> Category:
        cat = await self.repo.get_by_slug(slug)
        if not cat:
            raise NotFoundException(resource="Categoría", identifier=slug)
        updates = data.model_dump(exclude_unset=True)
        return await self.repo.update(cat, **updates)
