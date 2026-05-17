"""
contact_repo.py  —  ContactMessage database queries
"""

from sqlalchemy import select

from app.models.contact import ContactMessage
from app.repositories.base_repo import BaseRepository


class ContactRepository(BaseRepository[ContactMessage]):

    async def get_unread(self) -> list[ContactMessage]:
        """Returns all unread messages, newest first.
        Used by the admin notification badge.
        """
        result = await self.db.execute(
            select(ContactMessage)
            .where(ContactMessage.is_read == False)
            .order_by(ContactMessage.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_all_paginated(
        self, page: int = 1, page_size: int = 20
    ) -> tuple[list[ContactMessage], int]:
        """Returns a page of messages for the admin inbox, newest first."""
        from sqlalchemy import func

        total = (await self.db.scalar(
            select(func.count()).select_from(ContactMessage)
        )) or 0

        result = await self.db.execute(
            select(ContactMessage)
            .order_by(ContactMessage.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        return list(result.scalars().all()), total

    async def mark_as_read(self, message: ContactMessage) -> ContactMessage:
        """Marks a single message as read."""
        return await self.update(message, is_read=True)
