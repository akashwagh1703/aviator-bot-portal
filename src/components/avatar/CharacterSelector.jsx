"use client";

/**
 * CharacterSelector — switch the active character.
 *
 * Selecting a character updates avatar + voice + personality + theme together
 * (all resolved from config). Switching also stops any in-flight speech via the
 * `onSwitch` callback so voices never overlap across characters.
 */

import { motion } from "framer-motion";
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
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" role="tablist" aria-label="Choose a character">
      {avatars.map((a) => {
        const active = a.id === avatarId;
        return (
          <motion.button
            key={a.id}
            role="tab"
            aria-selected={active}
            onClick={() => handleSelect(a.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              active
                ? "border-white/20 bg-white/15 text-white shadow-lg"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            )}
            style={active ? { boxShadow: `0 0 20px -4px ${a.accent}` } : undefined}
          >
            <span
              className="h-3 w-3 rounded-full ring-2 ring-white/20"
              style={{ background: `linear-gradient(135deg, ${a.accent}, ${a.accent2})` }}
              aria-hidden="true"
            />
            <span className="flex flex-col items-start leading-tight">
              <span>{a.name}</span>
              <span className="hidden text-[10px] font-normal text-white/40 sm:block">{a.tagline}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
