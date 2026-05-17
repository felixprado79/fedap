"""
sanitizer.py  —  Input sanitization utilities for the Sublix.cr API

These helpers are applied to free-text fields (names, messages, notes) before
they are persisted to the database. They are NOT a replacement for Pydantic
validation — they run after type checks pass, as a second defence layer.

Why sanitize on the backend even though Pydantic validates?
  Pydantic confirms types and lengths. Sanitization removes dangerous content
  that is technically "valid" (e.g., a name that is 50 chars of HTML).
"""

import html
import re
import unicodedata


# Regex that matches any HTML tag — used to strip markup from text fields.
# Using a simple tag pattern is safe here because we strip ALL tags,
# not try to allowlist them (which would require a proper parser).
_HTML_TAG_RE = re.compile(r"<[^>]+>", re.IGNORECASE)

# Consecutive whitespace (spaces, tabs, newlines) → single space
_WHITESPACE_RE = re.compile(r"\s+")


def strip_html(value: str) -> str:
    """Remove all HTML tags and decode HTML entities.

    Example:
        strip_html('<script>alert("xss")</script> Hello') → 'alert("xss") Hello'
    Note: we strip the tag but keep inner text — this avoids silently eating
    content that users legitimately typed around angle brackets.
    """
    without_tags = _HTML_TAG_RE.sub("", value)
    return html.unescape(without_tags)


def normalize_whitespace(value: str) -> str:
    """Collapse runs of whitespace into a single space and strip edges."""
    return _WHITESPACE_RE.sub(" ", value).strip()


def normalize_unicode(value: str) -> str:
    """Normalize Unicode to NFC form — prevents homoglyph spoofing.

    NFC: Canonical Decomposition followed by Canonical Composition.
    This ensures ñ is stored as a single code point, not n + combining tilde.
    """
    return unicodedata.normalize("NFC", value)


def sanitize_text(value: str, max_length: int | None = None) -> str:
    """Full sanitization pipeline for a free-text field.

    Applies: HTML stripping → Unicode normalization → whitespace collapsing → truncation.
    Use this for names, subjects, and short free-text inputs.
    """
    value = strip_html(value)
    value = normalize_unicode(value)
    value = normalize_whitespace(value)
    if max_length and len(value) > max_length:
        value = value[:max_length].rstrip()
    return value


def sanitize_message(value: str, max_length: int = 2000) -> str:
    """Sanitize a long-form message body.

    Like sanitize_text but preserves intentional newlines (single newlines are
    kept; only runs of 3+ newlines are collapsed to 2).
    """
    value = strip_html(value)
    value = normalize_unicode(value)
    # Collapse 3+ newlines to 2, but preserve paragraph breaks
    value = re.sub(r"\n{3,}", "\n\n", value)
    # Collapse horizontal whitespace only (not newlines)
    value = re.sub(r"[ \t]+", " ", value)
    value = value.strip()
    if len(value) > max_length:
        value = value[:max_length].rstrip()
    return value
