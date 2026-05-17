/**
 * whatsapp-builder.ts — Builds the structured WhatsApp message from chat data.
 *
 * Generates a pre-filled wa.me URL that opens WhatsApp with the full
 * cotización message ready to send to Sublix.cr.
 *
 * Output message example:
 *   Hola Sublix.cr 👋
 *
 *   Vengo del asistente del sitio web con esta cotización:
 *
 *   📦 *Producto:*  Ropa deportiva
 *   📊 *Cantidad:*  20 unidades
 *   🎨 *Diseño:*    Tengo mi propio diseño listo
 *   📝 *Nota:*      Camisetas para mi equipo de fútbol
 *
 *   ¿Pueden enviarme la cotización? ¡Gracias!
 */

import { WHATSAPP_NUMBER } from "@/constants/whatsapp";
import type { ChatData } from "@/types/chat";

/**
 * Builds the plain-text WhatsApp message from the collected chat data.
 * Returns an empty string if required fields are missing.
 */
export function buildChatWhatsAppMessage(data: ChatData): string {
  const lines: string[] = [
    "Hola Sublix.cr 👋",
    "",
    "Vengo del asistente del sitio web con esta cotización:",
    "",
    `📦 *Producto:*  ${data.productType ?? "—"}`,
    `📊 *Cantidad:*  ${data.quantity ?? "—"}`,
    `🎨 *Diseño:*    ${data.design ?? "—"}`,
  ];

  if (data.notes) {
    lines.push(`📝 *Nota:*      ${data.notes}`);
  }

  lines.push("", "¿Pueden enviarme la cotización? ¡Gracias!");

  return lines.join("\n");
}

/**
 * Returns the full wa.me URL with the message pre-filled.
 * Opens WhatsApp (app or web) when visited.
 */
export function buildChatWhatsAppURL(data: ChatData): string {
  const message = buildChatWhatsAppMessage(data);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Summary items shown in the chat summary card before the user clicks CTA.
 */
export function getSummaryItems(
  data: ChatData
): Array<{ icon: string; label: string; value: string }> {
  const items = [
    { icon: "📦", label: "Producto",  value: data.productType ?? "—" },
    { icon: "📊", label: "Cantidad",  value: data.quantity    ?? "—" },
    { icon: "🎨", label: "Diseño",    value: data.design      ?? "—" },
  ];

  if (data.notes) {
    items.push({ icon: "📝", label: "Nota", value: data.notes });
  }

  return items;
}
