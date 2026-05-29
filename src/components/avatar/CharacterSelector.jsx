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
    <div className="grid grid-cols-3 gap-2 sm:gap-3" role="tablist" aria-label="Choose a character">
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
                ? "border-white/20 bg-white/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.07]"
            )}
            style={activeChar ? { boxShadow: `0 10px 30px -12px ${a.accent}` } : undefined}
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
            <span
              className="h-11 w-11 rounded-full ring-2 ring-white/15 transition group-hover:ring-white/25"
              style={{ background: `linear-gradient(135deg, ${a.accent}, ${a.accent2})` }}
              aria-hidden="true"
            />
            <span className="flex flex-col leading-tight">
              <span className={cn("text-sm font-semibold", activeChar ? "text-ink" : "text-ink/80")}>
                {a.name}
              </span>
              <span className="text-[10px] text-ink/40">{a.tagline}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
