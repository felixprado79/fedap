/**
 * sanitize.ts  —  Client-side input sanitization helpers
 *
 * These run in the browser before data is submitted to the API.
 * They are a UX-layer defence: the backend also sanitizes on arrival.
 * Never rely solely on client-side sanitization for security.
 */

/**
 * Remove HTML tags from a string.
 * Prevents users from accidentally (or deliberately) injecting markup
 * through form fields that only expect plain text.
 */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

/**
 * Collapse consecutive whitespace (spaces, tabs, newlines) into a single space
 * and trim the edges. Good for name and subject fields.
 */
export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Full sanitization for a short text field (name, subject, etc.).
 * Strips HTML → collapses whitespace → truncates to maxLength.
 */
export function sanitizeText(value: string, maxLength = 200): string {
  let result = stripHtml(value);
  result = normalizeWhitespace(result);
  if (result.length > maxLength) {
    result = result.slice(0, maxLength).trimEnd();
  }
  return result;
}

/**
 * Sanitization for a long-form message body.
 * Strips HTML, collapses horizontal whitespace, but preserves single newlines
 * so paragraph breaks are kept. Truncates at maxLength characters.
 */
export function sanitizeMessage(value: string, maxLength = 2000): string {
  let result = stripHtml(value);
  // Collapse 3+ newlines to 2 (keep paragraph breaks, remove blank pages)
  result = result.replace(/\n{3,}/g, "\n\n");
  // Collapse horizontal whitespace only
  result = result.replace(/[ \t]+/g, " ");
  result = result.trim();
  if (result.length > maxLength) {
    result = result.slice(0, maxLength).trimEnd();
  }
  return result;
}

/**
 * Truncate a string to maxLength and append "…" if it was cut.
 * Use for display purposes, not for form submission.
 */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - 1).trimEnd() + "…";
}
