/**
 * layout.tsx  —  Root layout for the entire Sublix.cr application
 *
 * Wraps every page with:
 *  - HTML metadata (SEO, Open Graph)
 *  - Global fonts
 *  - Theme provider (light/dark mode)
 *  - Global CSS
 */

import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import WhatsAppFAB  from "@/components/common/WhatsAppFAB";
import ChatWidget   from "@/components/features/chat/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sublix.cr — Sublimación profesional en Costa Rica",
    template: "%s | Sublix.cr",
  },
  description:
    "Empresa costarricense especializada en sublimación de alta calidad para ropa, tazas, cuadros y más.",
  keywords: ["sublimación", "Costa Rica", "personalización", "ropa sublimada"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sublix.cr"
  ),
  openGraph: {
    siteName: "Sublix.cr",
    locale: "es_CR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        {children}
        {/* Floating WhatsApp button — visible on every page after scrolling */}
        <WhatsAppFAB />
        {/* Chat assistant — floating button at bottom-24, opens upward */}
        <ChatWidget />
      </body>
    </html>
  );
}
