"use client";

/**
 * /productos — Product catalog page.
 *
 * Features:
 *  - Category filter tabs (horizontal scroll on mobile)
 *  - Debounced search bar
 *  - Responsive 3-column product grid
 *  - Loading skeletons while fetching
 *  - Paginated results
 *
 * Data flow:
 *  useCategories() → categories for the filter bar
 *  useProducts()   → filtered + paginated product list
 *
 * To connect to the real API:
 *  Set NEXT_PUBLIC_USE_MOCK=false in frontend/.env.local
 */

import { useProducts }   from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import CategoryFilter    from "@/components/features/products/CategoryFilter";
import SearchBar         from "@/components/features/products/SearchBar";
import ProductGrid       from "@/components/features/products/ProductGrid";

export default function ProductosPage() {
  const { categories, loading: catsLoading } = useCategories();

  const {
    products,
    loading,
    error,
    total,
    pages,
    page,
    category,
    search,
    setPage,
    setCategory,
    setSearch,
    refresh,
  } = useProducts({ page_size: 9 });

  return (
    <div className="container-site py-14">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-500">
          Catálogo
        </p>
        <h1 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl">
          Nuestros productos
        </h1>
        <p className="mt-3 max-w-xl text-lg text-gray-500">
          Sublimación full color desde 1 unidad. Diseña, personaliza y cotiza
          directamente por WhatsApp.
        </p>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="w-full sm:max-w-xs">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Category tabs */}
        <div className="flex-1 overflow-hidden">
          <CategoryFilter
            categories={categories}
            activeSlug={category}
            loading={catsLoading}
            onChange={setCategory}
          />
        </div>
      </div>

      {/* ── Product grid + pagination ──────────────────────────────────────── */}
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        total={total}
        pages={pages}
        page={page}
        onPageChange={setPage}
        onRetry={refresh}
      />
    </div>
  );
}
