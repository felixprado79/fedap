"""
deps.py  —  FastAPI dependency injection utilities

Dependencies are injected into endpoints via Depends().
They promote reuse and make endpoints easy to test by swapping deps.

Available dependencies:
    get_db              → AsyncSession for database access
    PaginationParams    → page + page_size query params validated together
    get_current_admin   → JWT authentication guard (stub — implemented in Phase 5)
"""

from fastapi import Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db  # re-export so endpoints import from one place

# ── Pagination ────────────────────────────────────────────────────────────────

class PaginationParams:
    """Reusable query parameters for any paginated list endpoint.

    Usage in an endpoint:
        @router.get("/products")
        async def list_products(pagination: PaginationParams = Depends()):
            page      = pagination.page
            page_size = pagination.page_size
    """

    def __init__(
        self,
        page: int = Query(default=1, ge=1, description="Número de página (comienza en 1)"),
        page_size: int = Query(
            default=12, ge=1, le=100,
            description="Cantidad de resultados por página (máximo 100)",
        ),
    ) -> None:
        self.page      = page
        self.page_size = page_size


# ── Auth guard stub ───────────────────────────────────────────────────────────

async def get_current_admin(
    db: AsyncSession = Depends(get_db),
) -> None:
    """Protects admin-only endpoints.

    Phase 4: returns 501 Not Implemented — auth is added in Phase 5.
    Replace this entire function body in Phase 5 with JWT validation.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Autenticación de administrador aún no implementada (Fase 5).",
    )
