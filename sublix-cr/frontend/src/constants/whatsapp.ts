/**
 * whatsapp.ts — WhatsApp contact configuration for Sublix.cr
 *
 * Replace WHATSAPP_NUMBER with the real business number before going live.
 * Format: country code + number, no spaces or dashes.
 * Costa Rica example: 506 + 8888-8888 → "50688888888"
 */

export const WHATSAPP_NUMBER = "50688888888"; // TODO: replace with real number

export const WHATSAPP_MESSAGES = {
  default: "Hola, me gustaría cotizar un pedido de sublimación. 🎨",
  quote:   "Hola, quiero solicitar una cotización personalizada.",
  product: (name: string) => `Hola, me interesa el producto: *${name}*. ¿Pueden darme más información?`,
} as const;

/** Returns a full wa.me URL with the given message pre-filled. */
export function buildWhatsAppURL(message: string = WHATSAPP_MESSAGES.default): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
