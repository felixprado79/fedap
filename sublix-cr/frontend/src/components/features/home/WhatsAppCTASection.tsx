/**
 * WhatsAppCTASection — full-width conversion section before the footer.
 *
 * Strong visual contrast with a gradient background.
 * Single clear action: open WhatsApp chat.
 */

import { buildWhatsAppURL, WHATSAPP_MESSAGES } from "@/constants/whatsapp";
import { MessageCircle } from "lucide-react";

export default function WhatsAppCTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-violet-600 py-24">

      {/* Subtle background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="container-site relative text-center">
        <div className="mx-auto max-w-2xl">

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <MessageCircle size={32} className="text-white" strokeWidth={1.5} />
          </div>

          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
            ¿Listo para crear algo increíble?
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-brand-100">
            Escríbenos por WhatsApp y recibe tu cotización en menos de 2 horas.
            Sin formularios complicados, sin esperas.
          </p>

          {/* WhatsApp CTA */}
          <a
            href={buildWhatsAppURL(WHATSAPP_MESSAGES.quote)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-green-900/30 transition-all hover:bg-[#1ebe5d] hover:scale-105 active:scale-95"
          >
            {/* WhatsApp icon */}
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Iniciar conversación en WhatsApp
          </a>

          {/* Reassurance line */}
          <p className="mt-4 text-sm text-brand-200">
            Respondemos en horario de lunes a viernes, 8 a.m. – 6 p.m.
          </p>
        </div>
      </div>
    </section>
  );
}
