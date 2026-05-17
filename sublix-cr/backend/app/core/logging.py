"""
logging.py  —  Structured logging setup for Sublix.cr

Python's built-in logging module is configured here with a format
that's readable in development and parseable by log aggregators in production.

Import and use:
    from app.core.logging import get_logger
    logger = get_logger(__name__)
    logger.info("Product created", extra={"slug": product.slug})
"""

import logging
import sys

from app.core.config import settings


def configure_logging() -> None:
    """Call once at application startup (inside main.py lifespan)."""

    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    fmt = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    datefmt = "%Y-%m-%d %H:%M:%S"

    logging.basicConfig(
        level=log_level,
        format=fmt,
        datefmt=datefmt,
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    # Silence noisy third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.DEBUG else logging.WARNING
    )


def get_logger(name: str) -> logging.Logger:
    """Returns a logger pre-configured with the app's log level."""
    return logging.getLogger(name)
