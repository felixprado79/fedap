"""
mixins.py  —  Reusable SQLAlchemy column mixins

Every model in this project inherits from these mixins so we don't
repeat boilerplate columns (primary key, timestamps) in every file.

UUIDPrimaryKeyMixin  → id (UUID, auto-generated, primary key)
TimestampMixin       → created_at, updated_at (auto-managed by the DB)
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column


class UUIDPrimaryKeyMixin:
    """Adds a UUID primary key that is generated automatically on insert."""

    id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )


class TimestampMixin:
    """Adds created_at and updated_at columns managed by PostgreSQL.

    server_default=func.now() → DB sets the value at INSERT time.
    onupdate=func.now()       → DB updates the value at UPDATE time.
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
