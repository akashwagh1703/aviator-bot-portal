"use client";

/**
 * LanguageToggle — compact segmented control to switch UI + voice language.
 *
 * Config-driven from the `languages` list, so adding a language requires no
 * component changes.
 */

import { motion } from "framer-motion";
import { languages } from "@/configs";
import { useAssistantStore } from "@/store/useAssistantStore";
import { cn } from "@/lib/utils";

export default function LanguageToggle({ onChange }) {
  const lang = useAssistantStore((s) => s.lang);
  const setLang = useAssistantStore((s) => s.setLang);

  const handle = (id) => {
    if (id === lang) return;
    setLang(id);
    onChange?.(id);
  };

  return (
    <div className="hairline flex items-center rounded-xl p-0.5" role="group" aria-label="Language">
      {languages.map((l) => {
        const active = l.id === lang;
        return (
          <button
            key={l.id}
            onClick={() => handle(l.id)}
            aria-pressed={active}
            className="relative rounded-[0.6rem] px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-[0.6rem]"
                style={{ background: "var(--brand-gradient)" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className={cn("relative", active ? "text-white" : "text-ink/60")}>{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}
