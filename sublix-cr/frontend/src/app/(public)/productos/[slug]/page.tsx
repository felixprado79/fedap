"use client";

/**
 * /productos/[slug] — Product detail page.
 *
 * Shows:
 *  - Large image (gradient placeholder until real photo is uploaded)
 *  - Full description, tags, minimum quantity
 *  - Prominent WhatsApp CTA
 *  - Related products from the same category
 *
 * The slug comes from the URL: /productos/camiseta-deportiva-full-color
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Tag, Package, ChevronRight } from "lucide-react";

import { getProductBySlug, getProducts } from "@/lib/api/products";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import ProductCard from "@/components/features/products/ProductCard";
import { buildWhatsAppURL, WHATSAPP_MESSAGES } from "@/constants/whatsapp";
import { ROUTES } from "@/constants";
import type { Product } from "@/types/product";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct]       = useState<Product | null>(null);
  const [related, setRelated]       = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setNotFound(false);

    getProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        // Fetch 3 related products from the same category, excluding this one
        return getProducts({ category_slug: p.category.slug, page_size: 4 }).then((res) => {
          setRelated(res.items.filter((r) => r.id !== p.id).slice(0, 3));
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="container-site flex flex-col items-center py-32 text-center">
        <p className="text-6xl">🔍</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-gray-900">
          Producto no encontrado
        </h1>
        <p className="mt-2 text-gray-500">
          El producto que buscas no existe o fue removido del catálogo.
        </p>
        <Link
          href={ROUTES.products}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || !product) {
    return <ProductDetailSkeleton />;
  }

  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];
  const hasRealImage = !!primaryImage?.url;
  const whatsappHref = buildWhatsAppURL(WHATSAPP_MESSAGES.product(product.name));

  return (
    <div className="container-site py-10">

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-gray-400" aria-label="Breadcrumb">
        <Link href={ROUTES.home} className="hover:text-brand-500">Inicio</Link>
        <ChevronRight size={14} />
        <Link href={ROUTES.products} className="hover:text-brand-500">Productos</Link>
        <ChevronRight size={14} />
        <Link href={`${ROUTES.products}?categoria=${product.category.slug}`} className="hover:text-brand-500">
          {product.category.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      {/* ── Main content: two columns ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Left: image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl shadow-sm">
          {hasRealImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${product.category.gradient}`}
            >
              <span className="text-9xl drop-shadow-lg">{product.category.emoji}</span>
            </div>
          )}

          {product.is_featured && (
            <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1.5 text-sm font-bold text-white shadow-md">
              ⭐ Destacado
            </span>
          )}
        </div>

        {/* Right: info + CTA */}
        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="brand">{product.category.name}</Badge>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
          </div>

          {/* Short description (styled differently from full) */}
          <p className="text-lg leading-relaxed text-gray-600">
            {product.short_description}
          </p>

          {/* Full description */}
          <div className="rounded-2xl bg-gray-50 p-5">
            <p className="text-sm leading-relaxed text-gray-500">{product.description}</p>
          </div>

          {/* Meta: min quantity */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Package size={16} className="text-brand-400" />
            <span>
              Pedido mínimo:{" "}
              <strong className="text-gray-700">
                {product.min_quantity} {product.min_quantity === 1 ? "unidad" : "unidades"}
              </strong>
            </span>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-gray-400" />
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="mt-2 rounded-2xl border border-green-100 bg-green-50 p-5">
            <p className="mb-3 text-sm font-medium text-green-800">
              ¿Querés cotizar este producto? Escríbenos y te respondemos en menos de 2 horas.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-[#1ebe5d] hover:shadow-lg active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Cotizar por WhatsApp
            </a>
          </div>

          {/* Back link */}
          <Link
            href={ROUTES.products}
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand-500"
          >
            <ArrowLeft size={15} />
            Volver al catálogo
          </Link>
        </div>
      </div>

      {/* ── Related products ──────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">
            Otros productos en {product.category.name}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <div className="container-site py-10">
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" rounded="full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" rounded="full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-square w-full" rounded="lg" />
        <div className="flex flex-col gap-5">
          <Skeleton className="h-5 w-24" rounded="full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-32 w-full" rounded="lg" />
          <Skeleton className="h-14 w-full" rounded="lg" />
        </div>
      </div>
    </div>
  );
}
