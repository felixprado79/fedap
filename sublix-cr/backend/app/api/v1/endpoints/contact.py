"""
contact.py  —  /api/v1/contact endpoints

Public endpoint:
    POST /contact   → submit a contact form message (rate-limited: 3/min, 10/hour)

Admin endpoints (Phase 5 — require JWT auth):
    GET   /contact              → paginated inbox
    PATCH /contact/{id}/read    → mark message as read
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps             import PaginationParams, get_current_admin, get_db
from app.core.limiter         import limiter
from app.core.sanitizer       import sanitize_message, sanitize_text
from app.schemas.common       import ErrorResponse, MessageResponse, PaginatedResponse
from app.schemas.contact      import ContactMessageCreate, ContactMessageResponse
from app.services.contact_service import ContactService

router = APIRouter()


# ── Public ────────────────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Enviar mensaje de contacto",
    description=(
        "Valida el formulario, persiste el mensaje en la base de datos "
        "y envía una notificación por email al equipo. "
        "Si el SMTP no está configurado, el mensaje se guarda de todas formas. "
        "Límite: 3 envíos por minuto y 10 por hora por IP."
    ),
    responses={
        422: {"description": "Error de validación — revisa los campos enviados"},
        429: {"description": "Demasiadas solicitudes — espera antes de intentar de nuevo"},
    },
)
@limiter.limit("3/minute;10/hour")
async def submit_contact(
    request: Request,           # required by slowapi for IP-based rate limiting
    data:    ContactMessageCreate,
    db:      AsyncSession = Depends(get_db),
) -> MessageResponse:
    # Sanitize free-text fields before persisting to the database
    data.name    = sanitize_text(data.name,    max_length=100)
    data.subject = sanitize_text(data.subject, max_length=200)
    data.message = sanitize_message(data.message, max_length=2000)

    service = ContactService(db)
    await service.submit_message(data)
    return MessageResponse(
        message="¡Mensaje recibido! Te responderemos a la brevedad. 🎨"
    )


# ── Admin inbox (Phase 5 wires up auth) ───────────────────────────────────────

@router.get(
    "",
    response_model=PaginatedResponse[ContactMessageResponse],
    summary="Bandeja de mensajes (admin)",
    dependencies=[Depends(get_current_admin)],
)
async def list_contact_messages(
    pagination: PaginationParams = Depends(),
    db:         AsyncSession = Depends(get_db),
) -> PaginatedResponse[ContactMessageResponse]:
    from app.models.contact import ContactMessage
    from app.repositories.contact_repo import ContactRepository

    repo = ContactRepository(ContactMessage, db)
    messages, total = await repo.get_all_paginated(
        page=pagination.page, page_size=pagination.page_size
    )
    items = [ContactMessageResponse.model_validate(m) for m in messages]
    return PaginatedResponse.build(
        items=items, total=total, page=pagination.page, page_size=pagination.page_size
    )


@router.patch(
    "/{message_id}/read",
    response_model=ContactMessageResponse,
    summary="Marcar como leído (admin)",
    dependencies=[Depends(get_current_admin)],
    responses={404: {"model": ErrorResponse}},
)
async def mark_message_read(
    message_id: uuid.UUID,
    db:         AsyncSession = Depends(get_db),
) -> ContactMessageResponse:
    from app.models.contact import ContactMessage
    from app.repositories.contact_repo import ContactRepository

    repo = ContactRepository(ContactMessage, db)
    message = await repo.get_by_id(message_id)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mensaje no encontrado.")
    updated = await repo.mark_as_read(message)
    return ContactMessageResponse.model_validate(updated)
