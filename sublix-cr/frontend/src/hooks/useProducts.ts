"use client";

/**
 * useProducts — hook that manages product listing state.
 *
 * Handles:
 *  - Fetching products from the API (or mock) when filters change
 *  - Debounced search (300ms) so we don't fire a request on every keystroke
 *  - Loading and error states
 *  - Pagination
 *
 * Usage:
 *   const { products, loading, total, page, setPage, setCategory, setSearch }
 *     = useProducts({ page_size: 9 });
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getProducts } from "@/lib/api/products";
import type { Product, GetProductsParams } from "@/types/product";
import type { PaginatedResponse } from "@/types";

interface UseProductsOptions {
  page_size?: number;
  initial_category?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  page: number;
  category: string;
  search: string;
  setPage: (page: number) => void;
  setCategory: (slug: string) => void;
  setSearch: (query: string) => void;
  refresh: () => void;
}

export function useProducts({
  page_size = 12,
  initial_category = "",
}: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<unknown>, "items">>({
    total: 0,
    page: 1,
    page_size,
    pages: 1,
  });

  const [page, setPage]         = useState(1);
  const [category, setCategory] = useState(initial_category);
  const [search, setSearch]     = useState("");

  // Debounced search — holds the current timer so we can cancel it
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = useCallback(
    async (params: GetProductsParams) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getProducts(params);
        setProducts(result.items);
        setPagination({
          total:     result.total,
          page:      result.page,
          page_size: result.page_size,
          pages:     result.pages,
        });
      } catch (err) {
        setError("No fue posible cargar los productos. Intenta de nuevo.");
        console.error("[useProducts]", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Re-fetch whenever page or category changes immediately
  useEffect(() => {
    fetch({ page, page_size, category_slug: category || undefined, search: search || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  // Debounce search input — wait 300ms after the user stops typing
  const handleSearch = useCallback(
    (query: string) => {
      setSearch(query);
      setPage(1); // reset to first page on new search

      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        fetch({ page: 1, page_size, category_slug: category || undefined, search: query || undefined });
      }, 300);
    },
    [category, page_size, fetch]
  );

  // Reset to page 1 when category changes
  const handleSetCategory = useCallback((slug: string) => {
    setCategory(slug);
    setPage(1);
  }, []);

  return {
    products,
    loading,
    error,
    total:    pagination.total,
    pages:    pagination.pages,
    page,
    category,
    search,
    setPage,
    setCategory: handleSetCategory,
    setSearch: handleSearch,
    refresh: () => fetch({ page, page_size, category_slug: category || undefined, search: search || undefined }),
  };
}
