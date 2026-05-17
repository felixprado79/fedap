/**
 * ProductGrid — renders products in a responsive 3-column grid.
 *
 * States handled:
 *   loading  → shows 9 skeleton cards
 *   error    → shows error message with retry button
 *   empty    → shows friendly empty-state illustration
 *   normal   → renders product cards
 *
 * Pagination bar is rendered below the grid.
 */

"use client";

import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { PackageX, RefreshCw } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  page: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

const SKELETON_COUNT = 9;

export default function ProductGrid({
  products,
  loading,
  error,
  total,
  pages,
  page,
  onPageChange,
  onRetry,
}: ProductGridProps) {
  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 py-20 text-center">
        <PackageX size={40} className="text-red-400" strokeWidth={1.5} />
        <p className="font-medium text-red-700">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <RefreshCw size={15} />
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-20 text-center">
        <PackageX size={40} className="text-gray-300" strokeWidth={1.5} />
        <p className="font-medium text-gray-500">No encontramos productos con esos filtros.</p>
        <p className="text-sm text-gray-400">Prueba con otra categoría o un término de búsqueda diferente.</p>
      </div>
    );
  }

  // ── Product grid ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">
      {/* Results count */}
      <p className="text-sm text-gray-400">
        Mostrando <span className="font-semibold text-gray-600">{products.length}</span> de{" "}
        <span className="font-semibold text-gray-600">{total}</span> productos
      </p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <Pagination currentPage={page} totalPages={pages} onPageChange={onPageChange} />
      )}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Paginación de productos"
    >
      <PageButton
        label="← Anterior"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {pages.map((p) => (
        <PageButton
          key={p}
          label={String(p)}
          active={p === currentPage}
          onClick={() => onPageChange(p)}
        />
      ))}

      <PageButton
        label="Siguiente →"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}

interface PageButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function PageButton({ label, active = false, disabled = false, onClick }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors
        ${active
          ? "bg-brand-500 text-white shadow-sm"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
        }
        disabled:cursor-not-allowed disabled:opacity-40`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </button>
  );
}
