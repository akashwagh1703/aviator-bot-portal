"use client";

/**
 * ChatInput — text field + send button + prominent voice input.
 *
 * Enter sends (Shift+Enter for newline). Auto-grows up to a max height. The
 * send button is disabled while a response is streaming. Placeholder + speech
 * locale follow the selected language.
 */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";
import VoiceInput from "./VoiceInput";
import { useAssistantStore } from "@/store/useAssistantStore";
import { getLanguage, getStrings } from "@/configs";
import { cn } from "@/lib/utils";

export default function ChatInput({ accent = "#2E7D32", disabled, onSend, onVoiceError }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const taRef = useRef(null);

  const lang = useAssistantStore((s) => s.lang);
  const t = getStrings(lang);
  const speechLang = getLanguage(lang).speechLang;

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
    <div
      className={cn(
        "flex items-end gap-2 rounded-2xl border bg-[rgb(var(--surface))] p-2 transition",
        focused ? "border-[rgb(var(--border)/0.2)]" : "border-[rgb(var(--border)/0.12)]"
      )}
      style={focused ? { boxShadow: `0 0 0 3px ${accent}22` } : undefined}
    >
      <VoiceInput
        lang={speechLang}
        disabled={disabled}
        onTranscript={(text) => submit(text)}
        onError={onVoiceError}
      />

      <label htmlFor="chat-input" className="sr-only">
        {t.placeholder}
      </label>
      <textarea
        id="chat-input"
        ref={taRef}
        rows={1}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={t.placeholder}
        className="max-h-[120px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] text-ink placeholder-ink/40 focus:outline-none"
      />

      <motion.button
        type="button"
        onClick={() => submit()}
        disabled={disabled || !value.trim()}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        aria-label="Send message"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 8px 20px -8px ${accent}` }}
      >
        <SendHorizonal className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
