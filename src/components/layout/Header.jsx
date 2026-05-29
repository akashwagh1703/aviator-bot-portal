"use client";

/**
 * Header — brand + language toggle + global audio/conversation controls.
 */

import { motion } from "framer-motion";
import { Sprout, Volume2, VolumeX, RotateCcw } from "lucide-react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useAssistantStore } from "@/store/useAssistantStore";
import { appConfig, getStrings } from "@/configs";

function ControlButton({ label, pressed, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className="grid h-10 w-10 place-items-center rounded-xl border border-[rgb(var(--border)/0.12)] surface-1 text-ink/70 transition hover:surface-2 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </button>
  );
}

export default function Header({ onMuteToggle, onReset, onLangChange }) {
  const muted = useAssistantStore((s) => s.muted);
  const lang = useAssistantStore((s) => s.lang);
  const t = getStrings(lang);

  return (
    <header className="card flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <motion.div
          className="grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg"
          style={{ background: "var(--brand-gradient)", boxShadow: "0 10px 24px -10px rgb(var(--glow) / 0.6)" }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <Sprout className="h-6 w-6" />
        </motion.div>
        <div className="leading-tight">
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">
            <span className="text-gradient">{appConfig.appName}</span>
          </h1>
          <p className="text-xs text-ink/50">{t.tagline}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle onChange={onLangChange} />
        <ControlButton label={muted ? t.unmute : t.mute} pressed={muted} onClick={onMuteToggle}>
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </ControlButton>
        <ControlButton label={t.reset} onClick={onReset}>
          <RotateCcw className="h-5 w-5" />
        </ControlButton>
      </div>
    </header>
  );
}
