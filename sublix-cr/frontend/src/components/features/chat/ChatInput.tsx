"use client";

/**
 * ChatInput — free-text input shown at the bottom of the chat window.
 *
 * Used for steps where the user types a custom answer (quantity, notes).
 * Pressing Enter or the send button submits the value.
 *
 * Shows an optional "skip" button when the step allows skipping.
 */

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  placeholder?: string;
  skipLabel?: string;
  onSubmit: (text: string) => void;
  onSkip?: () => void;
  disabled?: boolean;
}

export default function ChatInput({
  placeholder = "Escribe tu respuesta…",
  skipLabel,
  onSubmit,
  onSkip,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input automatically when it becomes visible
  useEffect(() => {
    if (!disabled) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [disabled]);

  function handleSubmit() {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="border-t border-gray-100 px-3 py-3">
      {/* Text input + send button */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={500}
          className={cn(
            "flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800",
            "placeholder-gray-400 outline-none transition-colors",
            "focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          aria-label="Escribe tu respuesta"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            "bg-brand-500 text-white shadow-sm",
            "transition-all hover:bg-brand-600 active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-40"
          )}
          aria-label="Enviar respuesta"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Skip button for optional steps */}
      {skipLabel && onSkip && (
        <button
          onClick={onSkip}
          disabled={disabled}
          className="mt-2 w-full text-center text-xs text-gray-400 transition-colors hover:text-brand-500 disabled:opacity-40"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}
