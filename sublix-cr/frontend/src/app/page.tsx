/**
 * page.tsx — Homepage (/)
 *
 * Composes all landing page sections in order:
 *   1. Header (navigation)
 *   2. Hero (headline + CTAs)
 *   3. Services (what we offer)
 *   4. Product gallery (curated examples)
 *   5. WhatsApp CTA band (conversion)
 *   6. Footer
 */

import Header            from "@/components/layout/Header";
import Footer            from "@/components/layout/Footer";
import HeroSection       from "@/components/features/home/HeroSection";
import ServicesSection   from "@/components/features/home/ServicesSection";
import ProductGallery    from "@/components/features/home/ProductGallery";
import WhatsAppCTASection from "@/components/features/home/WhatsAppCTASection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductGallery />
        <WhatsAppCTASection />
      </main>
      <Footer />
    </>
  );
}
