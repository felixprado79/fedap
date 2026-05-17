"use client";

/**
 * ChatWidget — floating chat assistant trigger + window.
 *
 * Renders two things:
 *  1. A floating button (bottom-right, above the WhatsApp FAB)
 *  2. The chat window (opens above the button, animates in/out)
 *
 * Behaviour:
 *  - A "bubble teaser" appears after 4 seconds if the user hasn't opened the chat.
 *    It shows the bot's first message to draw attention without being intrusive.
 *  - The window opens with a scale + opacity animation.
 *  - Pressing Escape closes the window.
 *  - The unread notification dot disappears once opened.
 *
 * Positioning:
 *  - Trigger button: fixed bottom-24 right-6  (sits above the green WhatsApp FAB)
 *  - Chat window:    fixed bottom-40 right-6   (opens upward from the button)
 */

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen]           = useState(false);
  const [hasNotif, setHasNotif]       = useState(true);   // Red dot
  const [showTeaser, setShowTeaser]   = useState(false);  // Bubble hint
  const teaserTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show the teaser bubble 4 seconds after mount (once, then never again)
  useEffect(() => {
    teaserTimer.current = setTimeout(() => {
      if (!isOpen) setShowTeaser(true);
    }, 4000);

    return () => {
      if (teaserTimer.current) clearTimeout(teaserTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close window on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  function open() {
    setIsOpen(true);
    setHasNotif(false);
    setShowTeaser(false);
    if (teaserTimer.current) clearTimeout(teaserTimer.current);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      {/* ── Chat window ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-40 right-6 z-40 w-[360px]",
          "transition-all duration-300 ease-out",
          // On mobile: full-width minus margins
          "max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:w-full max-sm:rounded-b-none",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        )}
        style={{ height: "520px" }}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="Asistente de cotización Sublix.cr"
      >
        <ChatWindow onClose={close} />
      </div>

      {/* ── Teaser bubble (shown before user opens the chat) ─────────────── */}
      {showTeaser && !isOpen && (
        <div
          className={cn(
            "fixed bottom-[8.5rem] right-20 z-40",
            "max-w-[220px] rounded-2xl rounded-br-sm bg-white px-4 py-3",
            "shadow-lg ring-1 ring-gray-100",
            "animate-in fade-in slide-in-from-bottom-2 duration-300"
          )}
        >
          <p className="text-xs font-medium text-gray-700">
            👋 ¡Hola! ¿Querés cotizar algo? Te ayudo en 1 minuto.
          </p>
          <button
            onClick={() => setShowTeaser(false)}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
            aria-label="Cerrar sugerencia"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {/* ── Floating trigger button ───────────────────────────────────────── */}
      <button
        onClick={isOpen ? close : open}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente de cotización"}
        aria-expanded={isOpen}
        className={cn(
          "fixed bottom-24 right-6 z-40",
          "flex h-14 w-14 items-center justify-center rounded-full shadow-lg",
          "bg-brand-500 text-white",
          "transition-all duration-300 hover:bg-brand-600 hover:shadow-xl active:scale-95",
          // Pulse ring when there's a notification
          hasNotif && !isOpen && "ring-4 ring-brand-200"
        )}
      >
        {/* Swap icon when open/closed */}
        <div
          className={cn(
            "absolute transition-all duration-200",
            isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
          )}
        >
          <X size={22} />
        </div>
        <div
          className={cn(
            "transition-all duration-200",
            isOpen ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
          )}
        >
          <MessageSquare size={22} />
        </div>

        {/* Notification dot */}
        {hasNotif && !isOpen && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>
    </>
  );
}
