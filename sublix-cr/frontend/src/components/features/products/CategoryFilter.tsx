"use client";

/**
 * CategoryFilter — horizontal scrollable tab bar for filtering products.
 *
 * Renders a "Todos" tab first, then one tab per category.
 * The active tab is highlighted with the brand color.
 * On mobile, the bar scrolls horizontally so all tabs are reachable.
 */

import { cn } from "@/lib/utils/cn";
import Skeleton from "@/components/ui/Skeleton";
import type { Category } from "@/types/product";

interface CategoryFilterProps {
  categories: Category[];
  activeSlug: string;
  loading?: boolean;
  onChange: (slug: string) => void;
}

export default function CategoryFilter({
  categories,
  activeSlug,
  loading = false,
  onChange,
}: CategoryFilterProps) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 shrink-0" rounded="full" />
        ))}
      </div>
    );
  }

  return (
    /* Hide scrollbar visually but keep it functional on touch devices */
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Filtrar por categoría"
    >
      {/* "Todos" tab */}
      <FilterTab
        label="Todos"
        count={categories.reduce((sum, c) => sum + c.product_count, 0)}
        active={activeSlug === ""}
        onClick={() => onChange("")}
      />

      {/* One tab per category */}
      {categories.map((cat) => (
        <FilterTab
          key={cat.slug}
          label={`${cat.emoji} ${cat.name}`}
          count={cat.product_count}
          active={activeSlug === cat.slug}
          onClick={() => onChange(cat.slug)}
        />
      ))}
    </div>
  );
}

// ── FilterTab ─────────────────────────────────────────────────────────────────

interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function FilterTab({ label, count, active, onClick }: FilterTabProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
        "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
        active
          ? "bg-brand-500 text-white shadow-sm shadow-brand-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-xs font-bold",
          active ? "bg-white/20 text-white" : "bg-white text-gray-500"
        )}
      >
        {count}
      </span>
    </button>
  );
}
