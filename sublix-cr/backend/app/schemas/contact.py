"""
contact.py  —  Pydantic schemas for the contact form

ContactMessageCreate  → validated payload from the public form
ContactMessageResponse → what the admin sees in the admin panel
"""

import re
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ContactMessageCreate(BaseModel):
    """Incoming contact form payload.

    All string fields are stripped of whitespace on input.
    The phone field is optional but validated if provided.
    """

    name: str = Field(
        min_length=2,
        max_length=100,
        examples=["María García"],
        description="Nombre completo del remitente.",
    )

    email: EmailStr = Field(
        examples=["maria@ejemplo.com"],
        description="Correo electrónico de contacto.",
    )

    phone: str | None = Field(
        default=None,
        max_length=30,
        examples=["+506 8888-8888"],
        description="Número de teléfono (opcional).",
    )

    subject: str = Field(
        min_length=5,
        max_length=200,
        examples=["Cotización de 50 camisetas deportivas"],
    )

    message: str = Field(
        min_length=20,
        max_length=2000,
        examples=["Hola, me gustaría cotizar 50 camisetas con mi logo."],
    )

    # ── Validators ────────────────────────────────────────────────────────────

    @field_validator("name", "subject", "message", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip() if isinstance(v, str) else v

    @field_validator("phone", mode="before")
    @classmethod
    def validate_phone(cls, v: str | None) -> str | None:
        if v is None:
            return None
        cleaned = v.strip()
        # Allow common phone formats: digits, spaces, hyphens, +, ()
        if not re.match(r"^[\d\s\-\+\(\)]{6,30}$", cleaned):
            raise ValueError("Formato de teléfono inválido.")
        return cleaned


class ContactMessageResponse(BaseModel):
    """Full contact message as seen by the admin."""

    model_config = ConfigDict(from_attributes=True)

    id:         uuid.UUID
    name:       str
    email:      str
    phone:      str | None
    subject:    str
    message:    str
    is_read:    bool
    created_at: datetime
    updated_at: datetime
