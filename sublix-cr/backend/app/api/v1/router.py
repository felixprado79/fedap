"""
router.py  —  Central API v1 router

All endpoint modules are registered here with their URL prefix and tags.
Adding a new resource = import its router and call include_router().
"""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    products,
    categories,
    orders,
    quotes,
    contact,
)

api_router = APIRouter()

api_router.include_router(auth.router,       prefix="/auth",       tags=["Auth"])
api_router.include_router(products.router,   prefix="/products",   tags=["Products"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(orders.router,     prefix="/orders",     tags=["Orders"])
api_router.include_router(quotes.router,     prefix="/quotes",     tags=["Quotes"])
api_router.include_router(contact.router,    prefix="/contact",    tags=["Contact"])
