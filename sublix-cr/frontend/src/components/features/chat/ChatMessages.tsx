"use client";

/**
 * ChatMessages — scrollable messages area inside the chat window.
 *
 * Responsibilities:
 *  - Renders each ChatMessage bubble
 *  - Shows the animated typing indicator when the bot is composing
 *  - Shows the ChatSummary card on the final step
 *  - Auto-scrolls to the bottom whenever new messages arrive
 */

import { useEffect, useRef } from "react";
import ChatMessage, { TypingIndicator } from "./ChatMessage";
import ChatSummary from "./ChatSummary";
import type { ChatData, ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  isOnSummary: boolean;
  data: ChatData;
  whatsappURL: string;
  onReset: () => void;
}

export default function ChatMessages({
  messages,
  isTyping,
  isOnSummary,
  data,
  whatsappURL,
  onReset,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOnSummary]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">

      {/* Message bubbles */}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* Typing indicator (bot is composing) */}
      {isTyping && <TypingIndicator />}

      {/* Summary card shown as last item in messages */}
      {isOnSummary && !isTyping && (
        <ChatSummary data={data} whatsappURL={whatsappURL} onReset={onReset} />
      )}

      {/* Invisible div at the bottom — scroll target */}
      <div ref={bottomRef} />
    </div>
  );
}
