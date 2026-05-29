"use client";

/**
 * ChatInput — text field + send button + voice input.
 *
 * Enter sends (Shift+Enter for newline). Auto-grows up to a max height. The
 * send button is disabled while a response is streaming.
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import VoiceInput from "./VoiceInput";

export default function ChatInput({ accent = "#8b5cf6", disabled, onSend, onVoiceError }) {
  const [value, setValue] = useState("");
  const taRef = useRef(null);

  const submit = (text) => {
    const content = (text ?? value).trim();
    if (!content || disabled) return;
    onSend?.(content);
    setValue("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-black/30 p-2 backdrop-blur-xl">
      <VoiceInput
        disabled={disabled}
        onTranscript={(text) => submit(text)}
        onError={onVoiceError}
      />

      <label htmlFor="chat-input" className="sr-only">
        Type your message
      </label>
      <textarea
        id="chat-input"
        ref={taRef}
        rows={1}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything…"
        className="max-h-[120px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none"
      />

      <motion.button
        type="button"
        onClick={() => submit()}
        disabled={disabled || !value.trim()}
        whileTap={{ scale: 0.92 }}
        aria-label="Send message"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      >
        <SendHorizonal className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
