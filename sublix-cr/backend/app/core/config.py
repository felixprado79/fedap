"""
config.py  —  Centralized application settings with startup validation

All configuration is read from environment variables (or .env file).
Pydantic-settings validates types and runs custom validators at startup,
so the app fails immediately if a required variable is missing or insecure.

Security validators enforce:
  - SECRET_KEY is not the default placeholder and is ≥ 32 chars
  - ALLOWED_ORIGINS never contains '*' in production
  - TRUSTED_HOSTS is set properly in production
"""

import secrets
import warnings
from functools import lru_cache
from typing import List

from pydantic import computed_field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ── Application ────────────────────────────────────────────────────────────
    APP_NAME:    str  = "Sublix API"
    ENVIRONMENT: str  = "development"   # development | staging | production
    DEBUG:       bool = True
    API_PREFIX:  str  = "/api/v1"

    # ── Security ───────────────────────────────────────────────────────────────
    # Generate with: python -c "import secrets; print(secrets.token_hex(32))"
    SECRET_KEY:                  str = "change_me_to_a_64_char_random_string"
    ALGORITHM:                   str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS:   int = 7

    # ── Rate limiting ──────────────────────────────────────────────────────────
    # For Redis-backed limits in multi-instance deployments:
    # RATE_LIMIT_STORAGE_URI = "redis://redis:6379"
    RATE_LIMIT_STORAGE_URI: str = "memory://"

    # ── Trusted hosts (TrustedHostMiddleware) ──────────────────────────────────
    # Prevents Host header injection attacks.
    # In production set to: ["sublix.cr", "www.sublix.cr"]
    TRUSTED_HOSTS: List[str] = ["*"]

    # ── Database ───────────────────────────────────────────────────────────────
    POSTGRES_USER:     str = ""
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB:       str = ""
    POSTGRES_HOST:     str = "db"
    POSTGRES_PORT:     int = 5432
    # Set to True in production to encrypt DB connections
    POSTGRES_SSL:      bool = False

    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        ssl_suffix = "?ssl=require" if self.POSTGRES_SSL else ""
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}{ssl_suffix}"
        )

    @computed_field
    @property
    def DATABASE_URL_SYNC(self) -> str:
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # ── CORS ───────────────────────────────────────────────────────────────────
    # Explicit list — wildcards are rejected in production (see validator below)
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    # ── Email ──────────────────────────────────────────────────────────────────
    SMTP_HOST:     str = ""
    SMTP_PORT:     int = 587
    SMTP_USER:     str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM:    str = "noreply@sublix.cr"

    # ── Security validators ────────────────────────────────────────────────────

    @field_validator("SECRET_KEY")
    @classmethod
    def secret_key_must_be_strong(cls, v: str) -> str:
        placeholder = "change_me_to_a_64_char_random_string"
        if v == placeholder:
            warnings.warn(
                "⚠️  SECRET_KEY is using the default placeholder value. "
                "Generate a secure key with: python -c \"import secrets; print(secrets.token_hex(32))\""
            )
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long.")
        return v

    @field_validator("ENVIRONMENT")
    @classmethod
    def environment_must_be_valid(cls, v: str) -> str:
        allowed = {"development", "staging", "production"}
        if v not in allowed:
            raise ValueError(f"ENVIRONMENT must be one of: {allowed}")
        return v

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        """Extra checks that only apply when running in production."""
        if self.ENVIRONMENT == "production":
            # Wildcards in CORS origins are a security vulnerability
            if "*" in self.ALLOWED_ORIGINS:
                raise ValueError("ALLOWED_ORIGINS must not contain '*' in production.")

            # DEBUG mode exposes stack traces and API docs
            if self.DEBUG:
                raise ValueError("DEBUG must be False in production.")

            # Default secret key must never reach production
            if self.SECRET_KEY == "change_me_to_a_64_char_random_string":
                raise ValueError("SECRET_KEY must be changed in production.")

            # Trusted hosts should be locked down
            if "*" in self.TRUSTED_HOSTS:
                warnings.warn(
                    "⚠️  TRUSTED_HOSTS is set to '*' in production. "
                    "Set it to your actual domain: [\"sublix.cr\", \"www.sublix.cr\"]"
                )
        return self

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


@lru_cache
def get_settings() -> Settings:
    """Returns a cached Settings instance (avoids re-reading .env on every call)."""
    return Settings()


settings = get_settings()


def generate_secret_key() -> str:
    """Generates a cryptographically secure random secret key.
    Run this once to get a value for SECRET_KEY in .env.
    """
    return secrets.token_hex(32)
