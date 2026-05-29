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
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-white/10"
        style={
          isUser
            ? { background: "rgb(var(--surface) / 0.7)" }
            : { background: `linear-gradient(135deg, ${accent}, ${accent}88)` }
        }
        aria-hidden="true"
      >
        {isUser ? (
          <User className="h-4 w-4 text-ink/80" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      <div className={cn("flex max-w-[82%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-md ring-1",
            isUser
              ? "rounded-tr-md text-white ring-white/10"
              : "rounded-tl-md bg-white/[0.04] text-ink/90 ring-white/10",
            message.error && "ring-rose-500/40"
          )}
          style={
            isUser
              ? { background: "linear-gradient(135deg, rgb(var(--accent) / 0.9), rgb(var(--accent-2) / 0.85))" }
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
          <span className="px-1 text-[10px] text-ink/30">{formatTime(message.createdAt)}</span>
        )}
      </div>
    </motion.div>
  );
}
