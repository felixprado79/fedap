"use client";

/**
 * ChatOptions — renders quick-reply option buttons.
 *
 * Shown when the current step type is "options" or "options_or_text".
 * Each button sends that option's value to the chat hook when clicked.
 */

import { cn } from "@/lib/utils/cn";
import type { ChatOption } from "@/types/chat";

interface ChatOptionsProps {
  options: ChatOption[];
  onSelect: (option: ChatOption) => void;
  disabled?: boolean;
}

export default function ChatOptions({
  options,
  onSelect,
  disabled = false,
}: ChatOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3">
      {options.map((option) => (
        <button
          key={option.value}
          disabled={disabled}
          onClick={() => onSelect(option)}
          className={cn(
            "rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700",
            "transition-all duration-150 hover:border-brand-400 hover:bg-brand-50 hover:shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
            "active:scale-95",
            disabled && "cursor-not-allowed opacity-40"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
