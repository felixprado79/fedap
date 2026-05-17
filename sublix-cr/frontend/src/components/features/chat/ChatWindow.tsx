"use client";

/**
 * ChatWindow — the main chat interface panel.
 *
 * Layout:
 *  ┌──────────────────────┐
 *  │ Header (title + X)   │  ← gradient, always visible
 *  ├──────────────────────┤
 *  │                      │
 *  │ Messages (scroll)    │  ← grows, has internal scroll
 *  │                      │
 *  ├──────────────────────┤
 *  │ Options / Input      │  ← changes based on current step type
 *  └──────────────────────┘
 *
 * The input area adapts to the current step:
 *   "options"         → only ChatOptions
 *   "options_or_text" → ChatOptions + ChatInput
 *   "text"            → only ChatInput
 *   "text_or_skip"    → ChatInput with skip button
 *   "summary"         → nothing (CTA is inside the summary card)
 */

import { X, Zap } from "lucide-react";

import ChatMessages from "./ChatMessages";
import ChatOptions  from "./ChatOptions";
import ChatInput    from "./ChatInput";
import { useChat }  from "@/hooks/useChat";

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const {
    messages,
    currentStep,
    isTyping,
    isOnSummary,
    data,
    whatsappURL,
    selectOption,
    submitText,
    skip,
    reset,
  } = useChat();

  const stepType = currentStep?.type ?? "options";

  // Disable inputs while the bot is still "typing"
  const inputDisabled = isTyping;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl ring-1 ring-gray-200">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-3.5">
        {/* Bot avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Zap size={18} className="text-white" strokeWidth={2.5} />
        </div>

        {/* Title */}
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Asistente Sublix.cr</p>
          <p className="flex items-center gap-1.5 text-xs text-brand-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            En línea · Respuesta en 2 horas
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Cerrar chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Messages area ─────────────────────────────────────────────────── */}
      <ChatMessages
        messages={messages}
        isTyping={isTyping}
        isOnSummary={isOnSummary}
        data={data}
        whatsappURL={whatsappURL}
        onReset={reset}
      />

      {/* ── Input area (hidden on summary step) ───────────────────────────── */}
      {!isOnSummary && (
        <div className="shrink-0 border-t border-gray-100 bg-white">

          {/* Quick reply buttons */}
          {(stepType === "options" || stepType === "options_or_text") &&
            currentStep?.options && (
              <ChatOptions
                options={currentStep.options}
                onSelect={selectOption}
                disabled={inputDisabled}
              />
            )}

          {/* Text input */}
          {(stepType === "text" ||
            stepType === "text_or_skip" ||
            stepType === "options_or_text") && (
            <ChatInput
              placeholder={currentStep?.placeholder}
              skipLabel={stepType === "text_or_skip" ? currentStep?.skipLabel : undefined}
              onSubmit={submitText}
              onSkip={stepType === "text_or_skip" ? skip : undefined}
              disabled={inputDisabled}
            />
          )}
        </div>
      )}
    </div>
  );
}
