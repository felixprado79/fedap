/**
 * chat.ts — TypeScript types for the Sublix.cr chat assistant.
 *
 * The chat follows a linear step-by-step flow, like a friendly form
 * in conversation format. Each step collects one piece of data and
 * advances to the next automatically.
 */

// ── Conversation steps ────────────────────────────────────────────────────────

/** All possible step identifiers in the conversation flow. */
export type StepId =
  | "welcome"
  | "product_type"
  | "quantity"
  | "design"
  | "notes"
  | "summary";

/**
 * Controls what kind of input is shown to the user in a given step.
 *
 *  options         → only clickable buttons (no text input)
 *  options_or_text → buttons + a text field for custom answers
 *  text            → only a text input field
 *  text_or_skip    → text input + a "skip" button
 *  summary         → read-only recap + WhatsApp CTA
 */
export type StepInputType =
  | "options"
  | "options_or_text"
  | "text"
  | "text_or_skip"
  | "summary";

/** A single selectable quick-reply option shown as a button. */
export interface ChatOption {
  label: string;  // Displayed text, may include emoji
  value: string;  // Stored in ChatData when selected
}

/** Full definition of one conversation step. */
export interface ConversationStep {
  id: StepId;

  /** Messages the bot sends when entering this step (shown sequentially). */
  botMessages: string[];

  type: StepInputType;

  /** Quick-reply buttons shown to the user. */
  options?: ChatOption[];

  /** Placeholder for the text input (when type includes text). */
  placeholder?: string;

  /** Label for the skip button (when type is text_or_skip). */
  skipLabel?: string;

  /** Which field in ChatData this step fills. */
  contextKey?: keyof ChatData;

  /** Which step to go to after this one. */
  nextStep?: StepId;
}

// ── Chat messages (what appears in the conversation window) ───────────────────

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: Date;
}

// ── Collected data across the conversation ────────────────────────────────────

export interface ChatData {
  productType?: string;
  quantity?: string;
  design?: string;
  notes?: string;
}
