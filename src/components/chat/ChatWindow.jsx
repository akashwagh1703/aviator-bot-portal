"use client";

/**
 * ChatWindow — scrollable message list with smooth auto-scroll to newest.
 */

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import { useAssistantStore } from "@/store/useAssistantStore";

export default function ChatWindow({ accent }) {
  const messages = useAssistantStore((s) => s.messages);
  const bottomRef = useRef(null);

  // Smooth-scroll to the latest content as it streams in.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div
      className="flex-1 space-y-4 overflow-y-auto px-1 py-2 [scrollbar-width:thin]"
      role="log"
      aria-live="polite"
      aria-label="Conversation"
    >
      <AnimatePresence initial={false}>
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} accent={accent} />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
