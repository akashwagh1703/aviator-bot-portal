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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex w-full gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-[rgb(var(--border)/0.08)]"
        style={
          isUser
            ? { background: "rgb(var(--border) / 0.08)" }
            : { background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }
        }
        aria-hidden="true"
      >
        {isUser ? (
          <User className="h-4 w-4 text-ink/70" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      <div className={cn("flex max-w-[82%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm",
            isUser
              ? "rounded-tr-md text-white"
              : "rounded-tl-md bg-[rgb(var(--surface))] text-ink/90 ring-1 ring-[rgb(var(--border)/0.1)]",
            message.error && "ring-2 ring-rose-400/50"
          )}
          style={
            isUser
              ? { background: "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))" }
              : undefined
          }
        >
          {showTyping ? (
            <TypingIndicator accent={accent} />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>
        {!showTyping && (
          <span className="px-1 text-[11px] text-ink/35">{formatTime(message.createdAt)}</span>
        )}
      </div>
    </motion.div>
  );
}
