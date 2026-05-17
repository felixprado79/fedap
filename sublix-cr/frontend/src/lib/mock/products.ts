/**
 * mock/products.ts — Static placeholder data used while the API is offline.
 *
 * HOW IT WORKS:
 *   The API service (lib/api/products.ts) checks the env variable
 *   NEXT_PUBLIC_USE_MOCK=true and returns this data instead of hitting FastAPI.
 *   Swap to real API by setting the variable to "false" (or removing it).
 *
 * STRUCTURE:
 *   This file exports functions with the same signature as the real API
 *   so callers never need to know which source is active.
 */

import type { Category, Product, GetProductsParams } from "@/types/product";
import type { PaginatedResponse } from "@/types";

// ── Mock categories ───────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Ropa y uniformes",
    slug: "ropa",
    description: "Camisetas, polos y uniformes sublimados en full color.",
    emoji: "👕",
    gradient: "from-sky-400 to-blue-600",
    product_count: 2,
  },
  {
    id: "cat-2",
    name: "Tazas y mugs",
    slug: "tazas",
    description: "Tazas personalizadas para regalos y uso diario.",
    emoji: "☕",
    gradient: "from-violet-400 to-purple-600",
    product_count: 2,
  },
  {
    id: "cat-3",
    name: "Cuadros y lienzos",
    slug: "cuadros",
    description: "Impresiones de alta resolución sobre lienzo y otros materiales.",
    emoji: "🖼️",
    gradient: "from-pink-400 to-rose-600",
    product_count: 2,
  },
  {
    id: "cat-4",
    name: "Artículos de oficina",
    slug: "oficina",
    description: "Mousepad, portavasos y accesorios de escritorio sublimados.",
    emoji: "🖱️",
    gradient: "from-emerald-400 to-teal-600",
    product_count: 2,
  },
  {
    id: "cat-5",
    name: "Trofeos y reconocimientos",
    slug: "trofeos",
    description: "Placas, medallas y trofeos con sublimación de alta calidad.",
    emoji: "🏆",
    gradient: "from-yellow-400 to-amber-600",
    product_count: 2,
  },
  {
    id: "cat-6",
    name: "Regalos corporativos",
    slug: "corporativo",
    description: "Kits de bienvenida, souvenirs y paquetes para empresas.",
    emoji: "🎁",
    gradient: "from-orange-400 to-red-500",
    product_count: 2,
  },
];

// ── Helper: build a fake image object ────────────────────────────────────────
// Real images come from the backend; this is just a placeholder marker.
function mockImage(id: string, alt: string): Product["images"][number] {
  return { id, url: "", alt, is_primary: true };
}

// ── Mock products ─────────────────────────────────────────────────────────────

const ROPA = MOCK_CATEGORIES[0];
const TAZAS = MOCK_CATEGORIES[1];
const CUADROS = MOCK_CATEGORIES[2];
const OFICINA = MOCK_CATEGORIES[3];
const TROFEOS = MOCK_CATEGORIES[4];
const CORP = MOCK_CATEGORIES[5];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p-01",
    name: "Camiseta deportiva full color",
    slug: "camiseta-deportiva-full-color",
    short_description: "Sublimación total sobre tela poliéster de alta calidad. Colores que no se desvanecen.",
    description:
      "Nuestra camiseta deportiva está confeccionada en poliéster 100% de alta gramaje, ideal para sublimación full color. El proceso garantiza que los colores penetren la fibra, logrando diseños que no se agrietan ni destiñen con el lavado. Disponible en todas las tallas. Mínimo desde 1 unidad.",
    category: ROPA,
    images: [mockImage("img-p01", "Camiseta deportiva sublimada")],
    tags: ["deportivo", "full-color", "poliéster", "lavable"],
    is_featured: true,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-01-10T08:00:00Z",
  },
  {
    id: "p-02",
    name: "Polo empresarial sublimado",
    slug: "polo-empresarial-sublimado",
    short_description: "Polo de cuello con tu logo o diseño. Perfecto para uniformes corporativos.",
    description:
      "Polo de manga corta en tela piqué de poliéster, con cuello y puños sublimados. Ideal para equipos de ventas, recepciones y eventos corporativos. Personalización completa: logo, colores institucionales y nombre del empleado.",
    category: ROPA,
    images: [mockImage("img-p02", "Polo empresarial")],
    tags: ["corporativo", "polo", "uniforme"],
    is_featured: false,
    is_active: true,
    min_quantity: 5,
    created_at: "2025-01-12T08:00:00Z",
  },
  {
    id: "p-03",
    name: "Taza estándar 11 oz",
    slug: "taza-estandar-11oz",
    short_description: "Taza de cerámica de 11 oz con tu foto o diseño en alta resolución.",
    description:
      "La taza más popular de nuestro catálogo. Capacidad de 11 oz, cerámica blanca de alta calidad, apta para microondas y lavavajillas. La sublimación cubre el 100% de la superficie imprimible, con colores vibrantes y duraderos. Ideal para regalos personalizados.",
    category: TAZAS,
    images: [mockImage("img-p03", "Taza estándar sublimada")],
    tags: ["regalo", "cerámica", "foto", "cumpleaños"],
    is_featured: true,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-01-15T08:00:00Z",
  },
  {
    id: "p-04",
    name: "Taza mágica cambia color",
    slug: "taza-magica-cambia-color",
    short_description: "La imagen aparece cuando se vierte la bebida caliente. Efecto sorpresa garantizado.",
    description:
      "Taza de cerámica negra que revela tu imagen personalizada cuando se llena con una bebida caliente. El efecto se activa a partir de los 40°C y desaparece al enfriarse. Tecnología de sublimación termosensible aplicada sobre recubrimiento especial.",
    category: TAZAS,
    images: [mockImage("img-p04", "Taza mágica")],
    tags: ["regalo", "sorpresa", "mágica", "termosensible"],
    is_featured: true,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-01-18T08:00:00Z",
  },
  {
    id: "p-05",
    name: "Cuadro familiar en lienzo",
    slug: "cuadro-familiar-lienzo",
    short_description: "Tu foto favorita impresa en lienzo estirado. Marcos incluidos, listo para colgar.",
    description:
      "Impresión fotográfica de alta resolución sobre lienzo de algodón 300g/m². El lienzo viene estirado sobre bastidor de madera de 2cm de espesor, listo para colgar. Disponible en múltiples tamaños: 20×30, 30×40, 40×60, 60×90 cm.",
    category: CUADROS,
    images: [mockImage("img-p05", "Cuadro familiar en lienzo")],
    tags: ["foto", "decoración", "lienzo", "regalo"],
    is_featured: false,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-01-20T08:00:00Z",
  },
  {
    id: "p-06",
    name: "Lienzo panorámico 3 paneles",
    slug: "lienzo-panoramico-3-paneles",
    short_description: "Tríptico en lienzo para decoración de sala o dormitorio. Impacto visual máximo.",
    description:
      "Set de 3 lienzos que conforman una imagen panorámica. Ideal para paisajes, fotos familiares o arte abstracto. Cada panel mide 30×40 cm. Incluye sistema de colgado ajustable para una alineación perfecta en la pared.",
    category: CUADROS,
    images: [mockImage("img-p06", "Lienzo panorámico en 3 paneles")],
    tags: ["decoración", "tríptico", "panorámico", "sala"],
    is_featured: false,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-01-22T08:00:00Z",
  },
  {
    id: "p-07",
    name: "Mousepad XL personalizado",
    slug: "mousepad-xl-personalizado",
    short_description: "Mousepad extendido de 80×40 cm con tu diseño o fotografía. Base antideslizante.",
    description:
      "Mousepad de gran formato para cubrir todo el escritorio. Superficie sublimada de microfibra de alta densidad, con base de goma antideslizante de 3mm. Compatible con todos los tipos de mouse. Bordes cosidos para mayor durabilidad.",
    category: OFICINA,
    images: [mockImage("img-p07", "Mousepad XL")],
    tags: ["oficina", "escritorio", "gaming", "antideslizante"],
    is_featured: false,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-01-25T08:00:00Z",
  },
  {
    id: "p-08",
    name: "Portavasos sublimado set x4",
    slug: "portavasos-sublimado-set-x4",
    short_description: "Set de 4 portavasos de neopreno con sublimación full color. Ideales para regalo.",
    description:
      "Set de 4 portavasos de neopreno de 10×10 cm. Cada uno puede tener un diseño diferente o el mismo. Impresión full color en ambas caras. Incluye estuche de regalo. Perfectos para regalos corporativos o souvenirs de eventos.",
    category: OFICINA,
    images: [mockImage("img-p08", "Portavasos sublimados")],
    tags: ["regalo", "set", "neopreno", "corporativo"],
    is_featured: false,
    is_active: true,
    min_quantity: 4,
    created_at: "2025-01-28T08:00:00Z",
  },
  {
    id: "p-09",
    name: "Placa conmemorativa sublimada",
    slug: "placa-conmemorativa-sublimada",
    short_description: "Placa de aluminio con sublimación full color sobre base de madera. Lista para entregar.",
    description:
      "Placa de reconocimiento confeccionada en aluminio pulido de 1mm con sublimación a todo color, montada sobre base de madera MDF enchapada. Incluye soporte para escritorio y opción de colgar en pared. Tamaño estándar: 20×15 cm.",
    category: TROFEOS,
    images: [mockImage("img-p09", "Placa conmemorativa")],
    tags: ["reconocimiento", "aluminio", "empresa", "premiación"],
    is_featured: false,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-02-01T08:00:00Z",
  },
  {
    id: "p-10",
    name: "Medalla sublimada con cinta",
    slug: "medalla-sublimada-con-cinta",
    short_description: "Medalla de aluminio con sublimación personalizada y cinta de tela incluida.",
    description:
      "Medalla de competencia o reconocimiento en aluminio de 7cm de diámetro con sublimación a todo color. Incluye cinta de poliéster de 80cm en los colores que necesites. Ideal para eventos deportivos, olimpíadas estudiantiles y concursos.",
    category: TROFEOS,
    images: [mockImage("img-p10", "Medalla sublimada")],
    tags: ["deporte", "competencia", "medalla", "aluminio"],
    is_featured: false,
    is_active: true,
    min_quantity: 10,
    created_at: "2025-02-05T08:00:00Z",
  },
  {
    id: "p-11",
    name: "Kit corporativo básico",
    slug: "kit-corporativo-basico",
    short_description: "Taza + mousepad + portavasos personalizados en caja de regalo. Desde 1 kit.",
    description:
      "Kit de bienvenida o regalo corporativo compuesto por: taza 11oz, mousepad de 30×25 cm y portavasos. Todos los artículos sublimados con la identidad visual de tu empresa. Empacados en caja kraft con papel de seda. Personalización disponible en cada componente.",
    category: CORP,
    images: [mockImage("img-p11", "Kit corporativo básico")],
    tags: ["corporativo", "kit", "regalo", "bienvenida"],
    is_featured: true,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-02-10T08:00:00Z",
  },
  {
    id: "p-12",
    name: "Kit ejecutivo premium",
    slug: "kit-ejecutivo-premium",
    short_description: "Taza + camiseta + cuadro + mousepad en maletín personalizado. El regalo más completo.",
    description:
      "Kit premium para reconocer a colaboradores o clientes clave. Incluye: camiseta tipo polo, taza 15oz, mousepad XL, cuadro 20×15 cm y tarjeta personalizada. Todos los artículos sublimados y empacados en maletín de tela negro con logo bordado. Mínimo desde 1 unidad.",
    category: CORP,
    images: [mockImage("img-p12", "Kit ejecutivo premium")],
    tags: ["ejecutivo", "premium", "maletín", "regalo corporativo"],
    is_featured: true,
    is_active: true,
    min_quantity: 1,
    created_at: "2025-02-15T08:00:00Z",
  },
];

// ── Mock service functions (same signature as the real API service) ───────────

export function getMockCategories(): Category[] {
  return MOCK_CATEGORIES;
}

export function getMockProducts(params: GetProductsParams = {}): PaginatedResponse<Product> {
  const { category_slug, search, featured, page = 1, page_size = 12 } = params;

  let filtered = MOCK_PRODUCTS.filter((p) => p.is_active);

  if (category_slug) {
    filtered = filtered.filter((p) => p.category.slug === category_slug);
  }

  if (featured) {
    filtered = filtered.filter((p) => p.is_featured);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const pages = Math.ceil(total / page_size);
  const start = (page - 1) * page_size;
  const items = filtered.slice(start, start + page_size);

  return { items, total, page, page_size, pages };
}

export function getMockProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug && p.is_active);
}

// Import type used by getMockProducts
import type { GetProductsParams, PaginatedResponse } from "@/types/product";
