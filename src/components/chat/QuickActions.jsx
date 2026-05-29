"use client";

/**
 * QuickActions — one-tap farmer shortcuts (weather, crop help, market, schemes).
 *
 * Each chip sends a localized prompt straight to the assistant, giving instant
 * value without typing — important for a voice/low-literacy audience.
 */

import { motion } from "framer-motion";
import { quickActions } from "@/configs";
import { useAssistantStore } from "@/store/useAssistantStore";

export default function QuickActions({ disabled, onAction }) {
  const lang = useAssistantStore((s) => s.lang);

  return (
    <div className="scroll-area -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Quick actions">
      {quickActions.map((a) => {
        const Icon = a.icon;
        return (
          <motion.button
            key={a.id}
            type="button"
            disabled={disabled}
            onClick={() => onAction?.(a.prompt[lang] || a.prompt.en)}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[rgb(var(--border)/0.12)] bg-[rgb(var(--surface))] px-3.5 py-2 text-sm font-semibold text-ink/80 shadow-sm transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-white"
              style={{ background: a.color }}
              aria-hidden="true"
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            {a.label[lang] || a.label.en}
          </motion.button>
        );
      })}
    </div>
  );
}
