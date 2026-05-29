"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import TypingIndicator from "./TypingIndicator";
import { cn, formatTime } from "@/lib/utils";

/** A single chat bubble with fade-in. Shows a typing indicator while empty + streaming. */
export default function ChatMessage({ message, accent }) {
  const isUser = message.role === "user";
  const showTyping = !isUser && message.streaming && !message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex w-full gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-white/10",
          isUser ? "bg-white/10" : "bg-white/5"
        )}
        style={!isUser ? { background: `${accent}22` } : undefined}
        aria-hidden="true"
      >
        {isUser ? (
          <User className="h-4 w-4 text-white/80" />
        ) : (
          <Bot className="h-4 w-4" style={{ color: accent }} />
        )}
      </div>

      <div className={cn("flex max-w-[80%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md",
            isUser
              ? "rounded-tr-sm bg-white/15 text-white"
              : "rounded-tl-sm bg-black/30 text-white/90 ring-1 ring-white/10",
            message.error && "ring-1 ring-rose-500/40"
          )}
        >
          {showTyping ? (
            <TypingIndicator accent={accent} />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>
        {!showTyping && (
          <span className="px-1 text-[10px] text-white/30">{formatTime(message.createdAt)}</span>
        )}
      </div>
    </motion.div>
  );
}
