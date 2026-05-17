"""
common.py  —  Shared Pydantic schemas used across the API

PaginatedResponse[T] is generic so every list endpoint can reuse it:
    PaginatedResponse[ProductResponse]
    PaginatedResponse[ContactMessageResponse]
"""

import math
from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Standardised paginated list response sent by every list endpoint."""

    items:     list[T]
    total:     int = Field(description="Total number of matching records in the DB")
    page:      int = Field(description="Current page number (1-based)")
    page_size: int = Field(description="Maximum records per page")
    pages:     int = Field(description="Total number of pages")

    @classmethod
    def build(cls, items: list[T], total: int, page: int, page_size: int) -> "PaginatedResponse[T]":
        """Factory method — calculates page count automatically."""
        pages = math.ceil(total / page_size) if page_size else 1
        return cls(items=items, total=total, page=page, page_size=page_size, pages=pages)


class MessageResponse(BaseModel):
    """Generic success message response used for actions like form submissions."""
    message: str


class ErrorResponse(BaseModel):
    """Consistent error shape for all HTTP error responses."""
    error:   str            # Machine-readable error code, e.g. "not_found"
    message: str            # Human-readable message
    details: list | None = None  # Optional validation error details
