/**
 * (public)/layout.tsx — Shared layout for all public-facing pages.
 *
 * Every page inside the (public) route group (productos, nosotros, etc.)
 * gets the Header and Footer automatically without repeating the imports.
 *
 * The homepage (app/page.tsx) is outside this group and handles its
 * own Header/Footer directly.
 */

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
    </>
  );
}
