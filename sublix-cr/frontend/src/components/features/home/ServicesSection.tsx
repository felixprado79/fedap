/**
 * ServicesSection — showcases the six main service categories.
 *
 * Each card has an icon, title, and short description.
 * Arranged in a responsive 3-column grid (2 on tablet, 1 on mobile).
 */

import { Shirt, Coffee, Image, Briefcase, Trophy, Gift } from "lucide-react";
import Card from "@/components/ui/Card";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;       // Tailwind bg class for the icon bubble
  textColor: string;   // Tailwind text class for the icon
}

const SERVICES: Service[] = [
  {
    icon: Shirt,
    title: "Ropa deportiva",
    description:
      "Uniformes, camisetas y polos sublimados con tu logo o diseño. Colores vibrantes que no se decoloran con el lavado.",
    color: "bg-brand-100",
    textColor: "text-brand-600",
  },
  {
    icon: Coffee,
    title: "Tazas y mugs",
    description:
      "Tazas personalizadas para regalar o usar a diario. Perfectas para aniversarios, empresas y eventos especiales.",
    color: "bg-violet-100",
    textColor: "text-violet-600",
  },
  {
    icon: Image,
    title: "Cuadros y lienzos",
    description:
      "Impresiones de alta resolución sobre lienzo. Tus fotos favoritas convertidas en arte decorativo.",
    color: "bg-pink-100",
    textColor: "text-pink-600",
  },
  {
    icon: Briefcase,
    title: "Artículos de oficina",
    description:
      "Mousepad, portavasos, libretas y más. Personaliza el espacio de trabajo con la identidad de tu empresa.",
    color: "bg-amber-100",
    textColor: "text-amber-600",
  },
  {
    icon: Trophy,
    title: "Trofeos y reconocimientos",
    description:
      "Placas, trofeos y diplomas sublimados. El detalle perfecto para premiar logros y momentos especiales.",
    color: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
  {
    icon: Gift,
    title: "Regalos corporativos",
    description:
      "Kits de bienvenida, souvenirs y paquetes de regalo con la marca de tu empresa. Producción desde 1 unidad.",
    color: "bg-orange-100",
    textColor: "text-orange-600",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="container-site">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-500">
            Nuestros servicios
          </p>
          <h2 className="font-display text-4xl font-bold text-gray-900">
            Todo lo que podemos personalizar
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Producimos desde 1 unidad. Sin mínimos de pedido, sin letra pequeña.
          </p>
        </div>

        {/* ── Services grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, description, color, textColor }: Service) {
  return (
    <Card hover className="p-7">
      {/* Icon bubble */}
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} className={textColor} strokeWidth={1.75} />
      </div>

      <h3 className="mb-2 font-display text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
    </Card>
  );
}
