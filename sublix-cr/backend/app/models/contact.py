"""
contact.py  —  ContactMessage SQLAlchemy model

Stores messages submitted through the public contact form.
Admin users can read and mark them as handled from the admin panel.

Table: contact_messages
"""

from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import UUIDPrimaryKeyMixin, TimestampMixin


class ContactMessage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "contact_messages"

    # ── Sender info ───────────────────────────────────────────────────────────
    name:    Mapped[str] = mapped_column(String(100),  nullable=False)
    email:   Mapped[str] = mapped_column(String(254),  nullable=False)  # RFC 5321 max length
    phone:   Mapped[str | None] = mapped_column(String(30), nullable=True)

    # ── Message content ───────────────────────────────────────────────────────
    subject: Mapped[str] = mapped_column(String(200),  nullable=False)
    message: Mapped[str] = mapped_column(Text,         nullable=False)

    # ── Admin workflow ────────────────────────────────────────────────────────
    # is_read is flipped to True when an admin opens the message in the panel.
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)

    def __repr__(self) -> str:
        return f"<ContactMessage from={self.email!r} read={self.is_read}>"
