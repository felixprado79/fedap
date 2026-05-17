/**
 * HeroSection — full-viewport opening section of the homepage.
 *
 * Left: headline, subheadline, two CTAs (WhatsApp + catalog link).
 * Right: decorative gradient orbs that represent vibrant sublimation colors.
 *
 * No images needed — pure CSS art that loads instantly.
 */

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { ROUTES } from "@/constants";
import { buildWhatsAppURL, WHATSAPP_MESSAGES } from "@/constants/whatsapp";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-50 via-white to-violet-50">

      {/* ── Background decoration ─────────────────────────────────────────── */}
      {/* These blobs add depth without any image files */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-300/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-[400px] w-[400px] rounded-full bg-pink-300/15 blur-3xl" />
      </div>

      <div className="container-site relative flex min-h-screen flex-col items-center justify-center gap-16 py-24 lg:flex-row lg:gap-12">

        {/* ── Text content ──────────────────────────────────────────────────── */}
        <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">

          {/* Trust badge */}
          <div className="mb-6 flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm text-brand-700 shadow-sm backdrop-blur-sm">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span>Calidad profesional · Entrega en toda Costa Rica</span>
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Personaliza
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent">
              lo que imaginas
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-500">
            Sublimación de alta calidad para ropa, tazas, cuadros y más.
            Diseños que no se decoloran y colores que duran para siempre.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 lg:justify-start">
            {[
              { value: "500+",  label: "Clientes felices" },
              { value: "10K+",  label: "Productos entregados" },
              { value: "5 años", label: "De experiencia" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href={buildWhatsAppURL(WHATSAPP_MESSAGES.quote)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-green-200 transition-all hover:bg-[#1ebe5d] hover:shadow-xl hover:shadow-green-200 active:scale-95"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Cotizar por WhatsApp
            </a>

            <Link
              href={ROUTES.products}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-7 py-4 text-base font-semibold text-gray-700 transition-all hover:border-brand-300 hover:text-brand-600 active:scale-95"
            >
              Ver productos
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* ── Decorative visual (right side) ────────────────────────────────── */}
        {/* Colorful floating product tiles — purely CSS, no images */}
        <div className="relative w-full max-w-md shrink-0 lg:max-w-lg" aria-hidden="true">
          <div className="grid grid-cols-2 gap-4">
            {HERO_TILES.map((tile) => (
              <div
                key={tile.label}
                className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl ${tile.bg} p-6 shadow-lg`}
              >
                <span className="text-4xl">{tile.emoji}</span>
                <span className="text-center text-sm font-semibold text-white/90">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-gray-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-base">
              ⚡
            </span>
            <div>
              <p className="text-xs font-bold text-gray-900">Entrega rápida</p>
              <p className="text-xs text-gray-400">72 horas hábiles</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll hint ──────────────────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border-2 border-gray-300 flex items-start justify-center pt-1">
          <div className="h-2 w-0.5 rounded-full bg-gray-400" />
        </div>
      </div>
    </section>
  );
}

const HERO_TILES = [
  { label: "Ropa deportiva",   emoji: "👕", bg: "bg-gradient-to-br from-brand-400 to-brand-600" },
  { label: "Tazas",            emoji: "☕", bg: "bg-gradient-to-br from-violet-400 to-violet-600" },
  { label: "Cuadros",          emoji: "🖼️", bg: "bg-gradient-to-br from-pink-400  to-rose-500"   },
  { label: "Corporativo",      emoji: "🎁", bg: "bg-gradient-to-br from-amber-400 to-orange-500" },
] as const;
