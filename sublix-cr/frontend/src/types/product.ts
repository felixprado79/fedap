/**
 * product.ts — Domain types for products and categories.
 *
 * These interfaces mirror the Pydantic schemas in the FastAPI backend
 * (backend/app/schemas/product.py), defined in Phase 3 of the backend.
 *
 * No prices here — sublimation orders are always quoted per job.
 */

// ── Category ──────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  emoji: string;                  // Displayed in UI filters and cards
  gradient: string;               // Tailwind gradient classes for placeholder images
  product_count: number;
}

// ── Product ───────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;                    // Absolute URL from the backend / CDN
  alt: string;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;                   // URL-safe identifier: "camiseta-deportiva"
  short_description: string;      // One-liner shown on cards (max 120 chars)
  description: string;            // Full rich text shown on detail page
  category: Category;
  images: ProductImage[];
  tags: string[];                 // e.g. ["deportivo", "full-color", "lavable"]
  is_featured: boolean;           // Shown in the hero gallery on the homepage
  is_active: boolean;
  min_quantity: number;           // Minimum units per order
  created_at: string;             // ISO-8601 timestamp
}

// ── API query params ──────────────────────────────────────────────────────────

export interface GetProductsParams {
  category_slug?: string;
  search?: string;
  featured?: boolean;
  page?: number;
  page_size?: number;
}

// ── Paginated list shape (reuses the generic from types/index.ts) ─────────────
export type { PaginatedResponse } from "@/types";
