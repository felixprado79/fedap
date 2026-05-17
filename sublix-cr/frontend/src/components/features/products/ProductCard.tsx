/**
 * ProductCard — displays a single product in the catalog grid.
 *
 * Layout:
 *   ┌──────────────────────┐
 *   │  [Gradient image]    │  ← real image when URL exists, gradient fallback otherwise
 *   │  emoji  [Category]   │
 *   ├──────────────────────┤
 *   │  Product name        │
 *   │  Short description   │
 *   │  [Tags]              │
 *   │  [Cotizar] [Detalle] │
 *   └──────────────────────┘
 */

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { buildWhatsAppURL, WHATSAPP_MESSAGES } from "@/constants/whatsapp";
import { ROUTES } from "@/constants";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0];
  const hasRealImage = !!primaryImage?.url;
  const whatsappHref = buildWhatsAppURL(WHATSAPP_MESSAGES.product(product.name));
  const detailHref   = `${ROUTES.products}/${product.slug}`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      {/* ── Image area ──────────────────────────────────────────────────────── */}
      <Link href={detailHref} className="relative block aspect-[4/3] overflow-hidden">
        {hasRealImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // CSS gradient placeholder — replaced by real image in production
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${product.category.gradient} transition-transform duration-500 group-hover:scale-105`}
          >
            <span className="text-6xl drop-shadow">{product.category.emoji}</span>
          </div>
        )}

        {/* Featured badge pinned to top-right */}
        {product.is_featured && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-white shadow">
            Destacado
          </span>
        )}
      </Link>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Category */}
        <Badge variant="brand">{product.category.name}</Badge>

        {/* Product name */}
        <Link href={detailHref}>
          <h3 className="font-display text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-brand-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Short description */}
        <p className="flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {product.short_description}
        </p>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Min quantity note */}
        <p className="text-xs text-gray-400">
          Mínimo: {product.min_quantity} {product.min_quantity === 1 ? "unidad" : "unidades"}
        </p>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
          >
            Cotizar
          </a>
          <Link
            href={detailHref}
            className="flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-600 transition-colors hover:border-brand-300 hover:text-brand-600"
            aria-label={`Ver detalle de ${product.name}`}
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
