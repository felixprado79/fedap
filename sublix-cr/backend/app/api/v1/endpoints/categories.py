"""
categories.py  —  /api/v1/categories endpoints

Public endpoints (no auth required):
    GET /categories         → list all active categories with product counts
    GET /categories/{slug}  → single category detail

Admin endpoints (Phase 5):
    POST  /categories         → create category
    PATCH /categories/{slug}  → update category
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin, get_db
from app.core.exceptions import ConflictException, NotFoundException
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.schemas.common   import ErrorResponse
from app.services.product_service import CategoryService

router = APIRouter()


# ── Public ────────────────────────────────────────────────────────────────────

@router.get(
    "",
    response_model=list[CategoryResponse],
    summary="Listar categorías",
    description="Devuelve todas las categorías activas con la cantidad de productos de cada una.",
)
async def list_categories(
    db: AsyncSession = Depends(get_db),
) -> list[CategoryResponse]:
    service = CategoryService(db)
    rows = await service.list_categories()
    return [CategoryResponse.model_validate(row) for row in rows]


@router.get(
    "/{slug}",
    response_model=CategoryResponse,
    summary="Detalle de una categoría",
    responses={404: {"model": ErrorResponse}},
)
async def get_category(
    slug: str,
    db:   AsyncSession = Depends(get_db),
) -> CategoryResponse:
    service = CategoryService(db)
    try:
        cat = await service.get_category(slug)
        return CategoryResponse.model_validate({**cat.__dict__, "product_count": 0})
    except NotFoundException as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)


# ── Admin ─────────────────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear categoría (admin)",
    dependencies=[Depends(get_current_admin)],
    responses={409: {"model": ErrorResponse}},
)
async def create_category(
    data: CategoryCreate,
    db:   AsyncSession = Depends(get_db),
) -> CategoryResponse:
    service = CategoryService(db)
    try:
        cat = await service.create_category(data)
        return CategoryResponse.model_validate({**cat.__dict__, "product_count": 0})
    except ConflictException as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.message)


@router.patch(
    "/{slug}",
    response_model=CategoryResponse,
    summary="Actualizar categoría (admin)",
    dependencies=[Depends(get_current_admin)],
    responses={404: {"model": ErrorResponse}},
)
async def update_category(
    slug: str,
    data: CategoryUpdate,
    db:   AsyncSession = Depends(get_db),
) -> CategoryResponse:
    service = CategoryService(db)
    try:
        cat = await service.update_category(slug, data)
        return CategoryResponse.model_validate({**cat.__dict__, "product_count": 0})
    except NotFoundException as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
