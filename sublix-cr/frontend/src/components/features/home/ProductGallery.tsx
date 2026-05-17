"use client";

/**
 * ProductGallery — curated product showcase on the homepage.
 *
 * Displays 8 placeholder product tiles arranged in a masonry-like grid.
 * In Phase 5 these are replaced with real products fetched from the API.
 *
 * Each tile:
 *   - Gradient background (category color)
 *   - Product name + category badge
 *   - WhatsApp CTA on hover
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { ROUTES } from "@/constants";
import { buildWhatsAppURL, WHATSAPP_MESSAGES } from "@/constants/whatsapp";

interface ProductPlaceholder {
  id: number;
  name: string;
  category: string;
  emoji: string;
  gradient: string;
  tall?: boolean; // makes the card span 2 rows for a masonry feel
}

// Swap these with real API data in Phase 5
const PLACEHOLDER_PRODUCTS: ProductPlaceholder[] = [
  {
    id: 1,
    name: "Camiseta deportiva",
    category: "Ropa",
    emoji: "👕",
    gradient: "from-sky-400 to-blue-600",
    tall: true,
  },
  {
    id: 2,
    name: "Taza personalizada",
    category: "Tazas",
    emoji: "☕",
    gradient: "from-violet-400 to-purple-600",
  },
  {
    id: 3,
    name: "Mousepad XL",
    category: "Oficina",
    emoji: "🖱️",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    id: 4,
    name: "Cuadro en lienzo",
    category: "Cuadros",
    emoji: "🖼️",
    gradient: "from-pink-400 to-rose-600",
    tall: true,
  },
  {
    id: 5,
    name: "Kit corporativo",
    category: "Corporativo",
    emoji: "🎁",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: 6,
    name: "Uniforme escolar",
    category: "Ropa",
    emoji: "🎒",
    gradient: "from-cyan-400 to-sky-600",
  },
  {
    id: 7,
    name: "Placa conmemorativa",
    category: "Trofeos",
    emoji: "🏆",
    gradient: "from-yellow-400 to-amber-600",
  },
  {
    id: 8,
    name: "Bolso sublimado",
    category: "Accesorios",
    emoji: "👜",
    gradient: "from-indigo-400 to-violet-600",
    tall: true,
  },
];

export default function ProductGallery() {
  return (
    <section className="bg-white py-24">
      <div className="container-site">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-500">
              Galería de productos
            </p>
            <h2 className="font-display text-4xl font-bold text-gray-900">
              Lo que creamos
            </h2>
          </div>
          <Link
            href={ROUTES.products}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-700"
          >
            Ver todos los productos
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* ── Masonry grid ────────────────────────────────────────────────── */}
        {/*
          CSS grid with auto rows. Cards with `tall` span 2 rows,
          creating the staggered masonry look without JS.
        */}
        <div
          className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          style={{ gridAutoRows: "180px" }}
        >
          {PLACEHOLDER_PRODUCTS.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTile({ product }: { product: ProductPlaceholder }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${product.gradient} cursor-pointer ${
        product.tall ? "row-span-2" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Emoji centered */}
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 transition-transform duration-300 group-hover:scale-95">
        <span className="text-5xl drop-shadow-sm">{product.emoji}</span>
        <span className="text-center text-sm font-semibold text-white/90 drop-shadow">
          {product.name}
        </span>
        <Badge variant="gray" className="border-0 bg-white/20 text-white backdrop-blur-sm">
          {product.category}
        </Badge>
      </div>

      {/* Hover overlay — WhatsApp CTA */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 p-4 backdrop-blur-sm transition-all duration-300 ${
          hovered ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <p className="text-center text-sm font-semibold text-white">{product.name}</p>
        <a
          href={buildWhatsAppURL(WHATSAPP_MESSAGES.product(product.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
        >
          Cotizar por WhatsApp
        </a>
      </div>
    </div>
  );
}
