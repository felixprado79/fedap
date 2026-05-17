/**
 * index.ts  —  Shared TypeScript types used across the frontend
 *
 * Business-specific types (Product, Order, etc.) are added in later phases.
 */

// ── API response wrapper ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "staff";
  created_at: string;
}

// ── UI utilities ──────────────────────────────────────────────────────────────
export type PropsWithClassName<T = object> = T & {
  className?: string;
};
