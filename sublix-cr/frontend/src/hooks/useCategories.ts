"use client";

/**
 * useCategories — fetches the full category list once on mount.
 *
 * Categories rarely change, so we fetch them once and keep them in state.
 * In a production app you'd add SWR or React Query for caching + revalidation.
 */

import { useState, useEffect } from "react";
import { getCategories } from "@/lib/api/products";
import type { Category } from "@/types/product";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError("No fue posible cargar las categorías."))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
