"use client";

/**
 * CharacterSelector — switch the active character.
 *
 * Selecting a character updates avatar + voice + personality + theme together
 * (all resolved from config). Switching also stops any in-flight speech via the
 * `onSwitch` callback so voices never overlap across characters.
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { avatars } from "@/configs";
import { useAssistantStore } from "@/store/useAssistantStore";
import { cn } from "@/lib/utils";

export default function CharacterSelector({ onSwitch }) {
  const avatarId = useAssistantStore((s) => s.avatarId);
  const setAvatar = useAssistantStore((s) => s.setAvatar);

  const handleSelect = (id) => {
    if (id === avatarId) return;
    onSwitch?.(); // stop audio before switching
    setAvatar(id);
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5" role="tablist" aria-label="Choose a character">
      {avatars.map((a) => {
        const activeChar = a.id === avatarId;
        return (
          <motion.button
            key={a.id}
            role="tab"
            aria-selected={activeChar}
            onClick={() => handleSelect(a.id)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group relative flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              activeChar
                ? "border-[rgb(var(--border)/0.16)] bg-[rgb(var(--surface))] shadow-md"
                : "border-[rgb(var(--border)/0.1)] surface-1 hover:surface-2"
            )}
            style={activeChar ? { boxShadow: `0 12px 28px -14px ${a.accent}` } : undefined}
          >
            {activeChar && (
              <span
                className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full text-white"
                style={{ background: a.accent }}
                aria-hidden="true"
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            )}
            {a.image ? (
              <span
                className="grid h-12 w-12 place-items-center overflow-hidden rounded-full ring-2 ring-[rgb(var(--border)/0.1)]"
                style={{ background: `linear-gradient(135deg, ${a.accent}22, ${a.accent2}22)` }}
                aria-hidden="true"
              >
                <img src={a.image} alt="" className="h-full w-full object-cover" draggable={false} />
              </span>
            ) : (
              <span
                className="h-12 w-12 rounded-full ring-2 ring-[rgb(var(--border)/0.1)] transition"
                style={{ background: `linear-gradient(135deg, ${a.accent}, ${a.accent2})` }}
                aria-hidden="true"
              />
            )}
            <span className="flex flex-col leading-tight">
              <span className={cn("text-sm font-bold", activeChar ? "text-ink" : "text-ink/80")}>
                {a.name}
              </span>
              <span className="text-[11px] text-ink/45">{a.tagline}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
