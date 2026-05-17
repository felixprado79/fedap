"""
base.py  —  SQLAlchemy declarative base

All models inherit from Base.
Importing them here ensures Alembic's autogenerate sees every table
when you run: alembic revision --autogenerate -m "..."
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# ── Model imports (keep in sync with every new model file) ────────────────────
# The noqa comments silence "imported but unused" linter warnings —
# these imports are intentional side effects for Alembic.
from app.models.category      import Category       # noqa: F401, E402
from app.models.product       import Product        # noqa: F401, E402
from app.models.product_image import ProductImage   # noqa: F401, E402
from app.models.contact       import ContactMessage # noqa: F401, E402
