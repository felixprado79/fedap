/**
 * conversation.ts — Full conversation flow for the Sublix.cr chat assistant.
 *
 * This file is pure data — no React, no state, no side effects.
 * To change a question or add a step, just edit this array.
 *
 * HOW TO ADD A NEW STEP:
 *  1. Add a new StepId in types/chat.ts
 *  2. Add the step object here
 *  3. Update the `nextStep` of the previous step to point to it
 */

import type { ConversationStep } from "@/types/chat";

export const CONVERSATION_STEPS: ConversationStep[] = [

  // ── Step 1: Welcome ─────────────────────────────────────────────────────────
  {
    id: "welcome",
    botMessages: [
      "¡Hola! 👋 Soy el asistente de **Sublix.cr**.",
      "Te ayudo a preparar tu cotización en menos de 1 minuto. ¿Empezamos?",
    ],
    type: "options",
    options: [{ label: "¡Vamos! 🚀", value: "start" }],
    nextStep: "product_type",
  },

  // ── Step 2: Product type ─────────────────────────────────────────────────────
  {
    id: "product_type",
    botMessages: ["¿Qué tipo de producto querés personalizar?"],
    type: "options",
    options: [
      { label: "👕 Ropa deportiva",      value: "Ropa deportiva" },
      { label: "☕ Tazas y mugs",        value: "Tazas y mugs" },
      { label: "🖼️ Cuadros y lienzos",  value: "Cuadros y lienzos" },
      { label: "🖱️ Artículos de oficina", value: "Artículos de oficina" },
      { label: "🏆 Trofeos",             value: "Trofeos" },
      { label: "🎁 Regalo corporativo",  value: "Regalo corporativo" },
      { label: "Otro producto",          value: "Otro producto" },
    ],
    contextKey: "productType",
    nextStep: "quantity",
  },

  // ── Step 3: Quantity ─────────────────────────────────────────────────────────
  {
    id: "quantity",
    botMessages: ["¿Cuántas unidades necesitás?"],
    type: "options_or_text",
    options: [
      { label: "1",       value: "1 unidad" },
      { label: "5",       value: "5 unidades" },
      { label: "10",      value: "10 unidades" },
      { label: "20",      value: "20 unidades" },
      { label: "50",      value: "50 unidades" },
      { label: "Más de 50", value: "Más de 50 unidades" },
    ],
    placeholder: "O escribe la cantidad exacta…",
    contextKey: "quantity",
    nextStep: "design",
  },

  // ── Step 4: Design status ─────────────────────────────────────────────────────
  {
    id: "design",
    botMessages: ["¿Ya tenés un diseño o necesitás ayuda con él?"],
    type: "options",
    options: [
      { label: "✅ Tengo mi diseño listo",         value: "Tengo mi propio diseño listo" },
      { label: "🎨 Necesito ayuda con el diseño",  value: "Necesito ayuda para crear el diseño" },
      { label: "🤔 Aún no lo sé",                  value: "Aún no tengo definido el diseño" },
    ],
    contextKey: "design",
    nextStep: "notes",
  },

  // ── Step 5: Additional notes (optional) ──────────────────────────────────────
  {
    id: "notes",
    botMessages: [
      "¿Querés agregar algún detalle? Por ejemplo: colores, fecha límite o nombre de tu equipo.",
    ],
    type: "text_or_skip",
    placeholder: "Escribe aquí tus detalles…",
    skipLabel: "No, continuar →",
    contextKey: "notes",
    nextStep: "summary",
  },

  // ── Step 6: Summary ───────────────────────────────────────────────────────────
  {
    id: "summary",
    botMessages: [
      "¡Perfecto! 🎉 Aquí está el resumen de tu cotización.",
      "Hacé clic en el botón para enviarnos el mensaje directo por WhatsApp.",
    ],
    type: "summary",
  },
];

/** O(1) lookup by step ID — used throughout the hook and components. */
export const STEPS_MAP = new Map<string, ConversationStep>(
  CONVERSATION_STEPS.map((s) => [s.id, s])
);
