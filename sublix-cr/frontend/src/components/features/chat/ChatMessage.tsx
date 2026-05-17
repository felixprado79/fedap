/**
 * ChatMessage — renders a single message bubble in the conversation.
 *
 * Bot messages: left-aligned, white bubble, preceded by a bot avatar.
 * User messages: right-aligned, brand-colored bubble.
 *
 * Bot message content can include **bold** text — wrapped with <strong>.
 */

import { cn } from "@/lib/utils/cn";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "bot";

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isBot ? "items-end justify-start" : "items-end justify-end"
      )}
    >
      {/* Bot avatar */}
      {isBot && (
        <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm shadow-sm">
          ⚡
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isBot
            ? "rounded-bl-sm bg-white text-gray-800 ring-1 ring-gray-100"
            : "rounded-br-sm bg-brand-500 text-white"
        )}
      >
        {/* Render **bold** text in bot messages */}
        {isBot ? (
          <span dangerouslySetInnerHTML={{ __html: renderBold(message.content) }} />
        ) : (
          <span>{message.content}</span>
        )}
      </div>
    </div>
  );
}

// ── Typing indicator shown while the bot is "thinking" ────────────────────────

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm shadow-sm">
        ⚡
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gray-400 chat-typing-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts **text** to <strong>text</strong> for bot messages.
 * Input is always internal/hardcoded — not user-generated — so this is safe.
 */
function renderBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
