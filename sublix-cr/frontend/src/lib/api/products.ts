/**
 * lib/api/products.ts — API service layer for products and categories.
 *
 * HOW THE MOCK SWITCH WORKS:
 *   If NEXT_PUBLIC_USE_MOCK=true in .env.local, every function returns
 *   data from the local mock file — no network calls, works offline.
 *   Set to "false" (or remove the variable) to hit the real FastAPI backend.
 *
 *   This pattern lets students develop and test the UI without running
 *   the backend. Swapping is a single environment variable change.
 *
 * API ENDPOINTS (FastAPI — Phase 3 backend):
 *   GET /api/v1/products            → list with filters
 *   GET /api/v1/products/{slug}     → single product
 *   GET /api/v1/categories          → list all categories
 *   GET /api/v1/categories/{slug}   → single category
 */

import apiClient from "./client";
import {
  getMockProducts,
  getMockProductBySlug,
  getMockCategories,
} from "@/lib/mock/products";
import type { Category, Product, GetProductsParams } from "@/types/product";
import type { PaginatedResponse } from "@/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ── Products ──────────────────────────────────────────────────────────────────

/**
 * Returns a paginated list of products.
 * Supports optional filters: category slug, search text, featured flag.
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<PaginatedResponse<Product>> {
  if (USE_MOCK) {
    // Simulate a short network delay so loading states are visible in dev
    await delay(350);
    return getMockProducts(params);
  }

  const { data } = await apiClient.get<PaginatedResponse<Product>>(
    "/api/v1/products",
    { params }
  );
  return data;
}

/**
 * Returns a single product by its URL slug.
 * Throws if the product is not found (404 from API).
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  if (USE_MOCK) {
    await delay(200);
    const product = getMockProductBySlug(slug);
    if (!product) throw new Error(`Product not found: ${slug}`);
    return product;
  }

  const { data } = await apiClient.get<Product>(`/api/v1/products/${slug}`);
  return data;
}

// ── Categories ────────────────────────────────────────────────────────────────

/**
 * Returns all active categories.
 */
export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    await delay(150);
    return getMockCategories();
  }

  const { data } = await apiClient.get<Category[]>("/api/v1/categories");
  return data;
}

// ── Utility ───────────────────────────────────────────────────────────────────

/** Simulates network latency so dev and prod loading behaviour match. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
