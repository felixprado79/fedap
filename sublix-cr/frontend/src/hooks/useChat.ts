"use client";

/**
 * useChat — state machine for the Sublix.cr chat assistant.
 *
 * Manages the conversation flow:
 *   messages        → everything visible in the chat window
 *   stepId          → which step the bot is currently on
 *   data            → collected answers (productType, quantity, design, notes)
 *   isTyping        → controls the animated "bot is typing…" indicator
 *
 * PUBLIC API:
 *   selectOption(option)   → user clicks a quick-reply button
 *   submitText(text)       → user submits a free-text answer
 *   skip()                 → user skips an optional step
 *   reset()                → restart conversation from scratch
 *   whatsappURL            → computed wa.me link (available on summary step)
 *
 * HOW THE TYPING DELAY WORKS:
 *   When the user answers, we show "isTyping" for BOT_TYPING_DELAY ms,
 *   then append each bot message with MESSAGE_GAP_DELAY between them.
 *   This makes the bot feel responsive without being instant.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { STEPS_MAP } from "@/lib/chat/conversation";
import { buildChatWhatsAppURL } from "@/lib/chat/whatsapp-builder";
import type { ChatData, ChatMessage, ChatOption, StepId } from "@/types/chat";

// ── Timing constants ──────────────────────────────────────────────────────────
const BOT_TYPING_DELAY  = 800;   // ms to show "typing…" before first bot message
const MESSAGE_GAP_DELAY = 500;   // ms between consecutive bot messages

// ── Unique ID generator ───────────────────────────────────────────────────────
let _idCounter = 0;
function uid(): string {
  return `msg-${Date.now()}-${++_idCounter}`;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useChat() {
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [stepId, setStepId]       = useState<StepId>("welcome");
  const [data, setData]           = useState<ChatData>({});
  const [isTyping, setIsTyping]   = useState(false);

  // Prevent state updates on unmounted component
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // ── Internal helpers ────────────────────────────────────────────────────────

  function addUserMessage(content: string) {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content, timestamp: new Date() },
    ]);
  }

  /**
   * Sends the bot messages for a given step with realistic delays.
   * Shows the typing indicator before the first message, then sends each
   * message with a short gap between them.
   */
  const deliverBotMessages = useCallback(
    (nextStepId: StepId, typingDelay = BOT_TYPING_DELAY) => {
      const step = STEPS_MAP.get(nextStepId);
      if (!step) return;

      setIsTyping(true);

      let delay = typingDelay;

      step.botMessages.forEach((content, index) => {
        setTimeout(() => {
          if (!mounted.current) return;

          // Hide typing indicator and show the first message
          if (index === 0) setIsTyping(false);

          setMessages((prev) => [
            ...prev,
            { id: uid(), role: "bot", content, timestamp: new Date() },
          ]);

          // Show typing indicator again between consecutive messages
          if (index < step.botMessages.length - 1) {
            setTimeout(() => {
              if (mounted.current) setIsTyping(true);
            }, 100);
          }
        }, delay);

        delay += MESSAGE_GAP_DELAY + BOT_TYPING_DELAY;
      });

      // Update the active step after all messages are delivered
      setTimeout(() => {
        if (mounted.current) setStepId(nextStepId);
      }, delay - MESSAGE_GAP_DELAY);
    },
    []
  );

  // ── Start conversation on first render ───────────────────────────────────────
  useEffect(() => {
    // Small initial delay feels more natural than instant message
    const t = setTimeout(() => deliverBotMessages("welcome", 400), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Advance to the next step ──────────────────────────────────────────────────

  function advance(currentStepId: StepId) {
    const step = STEPS_MAP.get(currentStepId);
    if (step?.nextStep) {
      deliverBotMessages(step.nextStep);
    }
  }

  // ── User actions ──────────────────────────────────────────────────────────────

  /** User clicks a quick-reply option button. */
  const selectOption = useCallback(
    (option: ChatOption) => {
      const step = STEPS_MAP.get(stepId);
      if (!step) return;

      addUserMessage(option.label);

      // Store the value in the collected data
      if (step.contextKey) {
        setData((prev) => ({ ...prev, [step.contextKey!]: option.value }));
      }

      advance(stepId);
    },
    [stepId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /** User submits a free-text answer. */
  const submitText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const step = STEPS_MAP.get(stepId);
      if (!step) return;

      addUserMessage(trimmed);

      if (step.contextKey) {
        setData((prev) => ({ ...prev, [step.contextKey!]: trimmed }));
      }

      advance(stepId);
    },
    [stepId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /** User skips an optional step (notes). */
  const skip = useCallback(() => {
    addUserMessage("Sin detalles adicionales.");
    advance(stepId);
  }, [stepId]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Restart the conversation from scratch. */
  const reset = useCallback(() => {
    setMessages([]);
    setData({});
    setIsTyping(false);
    // Deliver welcome step again after a brief pause
    setTimeout(() => deliverBotMessages("welcome", 400), 200);
  }, [deliverBotMessages]);

  // ── Computed values ────────────────────────────────────────────────────────────

  const whatsappURL    = buildChatWhatsAppURL(data);
  const currentStep    = STEPS_MAP.get(stepId);
  const isOnSummary    = stepId === "summary";

  return {
    messages,
    stepId,
    currentStep,
    data,
    isTyping,
    isOnSummary,
    whatsappURL,
    selectOption,
    submitText,
    skip,
    reset,
  };
}
