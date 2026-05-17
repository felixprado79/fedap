/**
 * index.ts  —  Application-wide constants
 */

export const SITE_NAME = "Sublix.cr";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sublix.cr";
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Navigation routes ─────────────────────────────────────────────────────────
export const ROUTES = {
  home:      "/",
  products:  "/productos",
  about:     "/nosotros",
  contact:   "/contacto",
  quote:     "/cotizar",
  // Admin
  admin: {
    dashboard: "/admin/dashboard",
    products:  "/admin/productos",
    orders:    "/admin/pedidos",
    messages:  "/admin/mensajes",
    login:     "/admin/login",
  },
} as const;

// ── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;
