"""
products.py  —  /api/v1/products endpoints

Public endpoints (no auth required):
    GET  /products          → paginated list with optional filters  (60/minute per IP)
    GET  /products/{slug}   → single product detail                 (60/minute per IP)

Admin endpoints (require auth — Phase 5):
    POST   /products          → create product
    PATCH  /products/{slug}   → update product
    DELETE /products/{slug}   → soft-delete product

Response schemas are defined in app/schemas/product.py.
Business rules live in app/services/product_service.py.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps         import PaginationParams, get_current_admin, get_db
from app.core.exceptions  import ConflictException, NotFoundException
from app.core.limiter     import limiter
from app.schemas.common   import ErrorResponse, MessageResponse, PaginatedResponse
from app.schemas.product  import ProductCreate, ProductListItem, ProductResponse, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# Public endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get(
    "",
    response_model=PaginatedResponse[ProductListItem],
    summary="Listar productos",
    description=(
        "Devuelve un listado paginado de productos activos. "
        "Acepta filtros opcionales por categoría, texto de búsqueda y destacados. "
        "Límite: 60 solicitudes por minuto por IP."
    ),
    responses={
        429: {"description": "Demasiadas solicitudes"},
        500: {"model": ErrorResponse},
    },
)
@limiter.limit("60/minute")
async def list_products(
    request:       Request,     # required by slowapi
    category_slug: str | None  = Query(default=None, description="Slug de categoría"),
    search:        str | None  = Query(default=None, min_length=1, max_length=100),
    featured:      bool | None = Query(default=None, description="true = solo destacados"),
    pagination:    PaginationParams = Depends(),
    db:            AsyncSession = Depends(get_db),
) -> PaginatedResponse[ProductListItem]:
    service = ProductService(db)
    return await service.list_products(
        category_slug = category_slug,
        search        = search,
        featured      = featured,
        page          = pagination.page,
        page_size     = pagination.page_size,
    )


@router.get(
    "/{slug}",
    response_model=ProductResponse,
    summary="Detalle de un producto",
    responses={
        404: {"model": ErrorResponse, "description": "Producto no encontrado"},
        429: {"description": "Demasiadas solicitudes"},
    },
)
@limiter.limit("60/minute")
async def get_product(
    request: Request,       # required by slowapi
    slug:    str,
    db:      AsyncSession = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)
    try:
        return await service.get_product(slug)
    except NotFoundException as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)


# ─────────────────────────────────────────────────────────────────────────────
# Admin endpoints (Phase 5 wires up JWT auth via get_current_admin)
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear producto (admin)",
    dependencies=[Depends(get_current_admin)],
    responses={409: {"model": ErrorResponse, "description": "Slug duplicado"}},
)
async def create_product(
    data: ProductCreate,
    db:   AsyncSession = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)
    try:
        return await service.create_product(data)
    except ConflictException as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.message)


@router.patch(
    "/{slug}",
    response_model=ProductResponse,
    summary="Actualizar producto (admin)",
    dependencies=[Depends(get_current_admin)],
    responses={404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}},
)
async def update_product(
    slug: str,
    data: ProductUpdate,
    db:   AsyncSession = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)
    try:
        return await service.update_product(slug, data)
    except NotFoundException as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
    except ConflictException as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.message)


@router.delete(
    "/{slug}",
    response_model=MessageResponse,
    summary="Eliminar producto — soft delete (admin)",
    dependencies=[Depends(get_current_admin)],
    responses={404: {"model": ErrorResponse}},
)
async def delete_product(
    slug: str,
    db:   AsyncSession = Depends(get_db),
) -> MessageResponse:
    service = ProductService(db)
    try:
        await service.delete_product(slug)
        return MessageResponse(message=f"Producto '{slug}' desactivado correctamente.")
    except NotFoundException as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
