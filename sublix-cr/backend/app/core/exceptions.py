"""
exceptions.py  —  Custom exception hierarchy for Sublix.cr

Each exception maps cleanly to an HTTP status code.
The global exception handlers in main.py catch them and return
consistent JSON error responses.

Usage example:
    raise NotFoundException(resource="Product", identifier="camiseta-deportiva")
"""

from uuid import UUID


class SublixException(Exception):
    """Base class for all application exceptions."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class NotFoundException(SublixException):
    """Raised when a requested resource does not exist in the database.

    Translates to HTTP 404.
    """

    def __init__(self, resource: str, identifier: str | int | UUID) -> None:
        super().__init__(f"{resource} '{identifier}' no encontrado.")
        self.resource   = resource
        self.identifier = identifier


class ConflictException(SublixException):
    """Raised when an operation would create a duplicate entry (e.g. slug collision).

    Translates to HTTP 409.
    """

    def __init__(self, resource: str, field: str, value: str) -> None:
        super().__init__(f"{resource} con {field}='{value}' ya existe.")
        self.resource = resource
        self.field    = field
        self.value    = value


class BadRequestException(SublixException):
    """Raised for invalid business-logic requests that pass schema validation
    but are semantically wrong.

    Translates to HTTP 400.
    """


class ServiceUnavailableException(SublixException):
    """Raised when an external service (e.g. email SMTP) is unreachable.

    Translates to HTTP 503 — but we usually catch this internally and
    degrade gracefully instead of propagating it to the client.
    """
