"use client";

/**
 * Header — brand + global audio/conversation controls.
 */

import { motion } from "framer-motion";
import { Sparkles, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { useAssistantStore } from "@/store/useAssistantStore";
import { appConfig } from "@/configs";

function ControlButton({ label, pressed, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-ink/70 transition hover:border-white/20 hover:bg-white/10 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </button>
  );
}

export default function Header({ onMuteToggle, onReset }) {
  const muted = useAssistantStore((s) => s.muted);

  return (
    <header className="glass flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <motion.div
          className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-lg"
          style={{ background: "var(--brand-gradient)", boxShadow: "0 8px 24px -8px rgb(var(--glow) / 0.7)" }}
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <div className="leading-tight">
          <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            <span className="text-gradient">{appConfig.appName}</span>
          </h1>
          <p className="text-[11px] text-ink/40">AI Avatar Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ControlButton label={muted ? "Unmute voice" : "Mute voice"} pressed={muted} onClick={onMuteToggle}>
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </ControlButton>
        <ControlButton label="Reset conversation" onClick={onReset}>
          <RotateCcw className="h-5 w-5" />
        </ControlButton>
      </div>
    </header>
  );
}
