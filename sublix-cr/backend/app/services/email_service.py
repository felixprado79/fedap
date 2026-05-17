"""
email_service.py  —  Email notification service

Sends transactional emails via SMTP using fastapi-mail.

GRACEFUL DEGRADATION:
    If SMTP credentials are missing (e.g. in local dev), the service
    logs the email content to the console instead of failing.
    This allows the full request to succeed without an email server.

Usage:
    await EmailService.send_contact_notification(message)
"""

import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:

    @staticmethod
    async def send_contact_notification(
        sender_name: str,
        sender_email: str,
        subject: str,
        message_body: str,
    ) -> None:
        """Notifies the admin team that a new contact message arrived.

        Falls back to console logging if SMTP is not configured.
        """
        if not settings.SMTP_HOST:
            # Dev mode: just log it — no email server needed
            logger.info(
                "📧 [EMAIL NOT SENT — SMTP not configured]\n"
                f"  To:      {settings.EMAIL_FROM}\n"
                f"  From:    {sender_name} <{sender_email}>\n"
                f"  Subject: {subject}\n"
                f"  Body:    {message_body[:200]}..."
            )
            return

        # Production path: send via fastapi-mail
        try:
            from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

            conf = ConnectionConfig(
                MAIL_USERNAME   = settings.SMTP_USER,
                MAIL_PASSWORD   = settings.SMTP_PASSWORD,
                MAIL_FROM       = settings.EMAIL_FROM,
                MAIL_PORT       = settings.SMTP_PORT,
                MAIL_SERVER     = settings.SMTP_HOST,
                MAIL_STARTTLS   = True,
                MAIL_SSL_TLS    = False,
                USE_CREDENTIALS = True,
            )

            email = MessageSchema(
                subject     = f"[Sublix.cr] Nuevo mensaje: {subject}",
                recipients  = [settings.EMAIL_FROM],
                body        = _build_email_body(sender_name, sender_email, message_body),
                subtype     = MessageType.plain,
            )

            fm = FastMail(conf)
            await fm.send_message(email)
            logger.info(f"Contact notification email sent for '{subject}'")

        except Exception as exc:
            # Never let email failure block the HTTP response
            logger.error(f"Failed to send contact notification email: {exc}")


def _build_email_body(name: str, email: str, body: str) -> str:
    """Formats the plain-text email body."""
    return (
        f"Nuevo mensaje de contacto recibido en Sublix.cr\n"
        f"{'=' * 50}\n\n"
        f"De:      {name} <{email}>\n\n"
        f"Mensaje:\n{body}\n\n"
        f"{'=' * 50}\n"
        f"Responde directamente a: {email}"
    )
