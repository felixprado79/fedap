"""
contact_service.py  —  Business logic for contact form submissions

Flow for a new message:
    1. Validate input (done by Pydantic in the endpoint before this is called)
    2. Persist the message to the database
    3. Send an email notification to the admin (non-blocking — failure is logged)
    4. Return the created message
"""

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact       import ContactMessage
from app.repositories.contact_repo import ContactRepository
from app.schemas.contact      import ContactMessageCreate, ContactMessageResponse
from app.services.email_service import EmailService


class ContactService:

    def __init__(self, db: AsyncSession) -> None:
        self.repo = ContactRepository(ContactMessage, db)

    async def submit_message(
        self, data: ContactMessageCreate
    ) -> ContactMessageResponse:
        """Saves the contact message and triggers an admin email notification."""

        # Persist to database
        message = await self.repo.create(
            name    = data.name,
            email   = str(data.email),
            phone   = data.phone,
            subject = data.subject,
            message = data.message,
        )

        # Send notification email — failure here never blocks the response
        await EmailService.send_contact_notification(
            sender_name  = message.name,
            sender_email = message.email,
            subject      = message.subject,
            message_body = message.message,
        )

        return ContactMessageResponse.model_validate(message)
