"use client";

/**
 * Header — brand + global audio/conversation controls.
 */

import { motion } from "framer-motion";
import { Sparkles, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { useAssistantStore } from "@/store/useAssistantStore";
import { appConfig } from "@/configs";

export default function Header({ onMuteToggle, onReset }) {
  const muted = useAssistantStore((s) => s.muted);

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <motion.div
          className="grid h-9 w-9 place-items-center rounded-xl text-white"
          style={{ background: "var(--brand-gradient)" }}
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <div className="leading-tight">
          <h1 className="text-base font-semibold text-white sm:text-lg">{appConfig.appName}</h1>
          <p className="text-[11px] text-white/40">AI Avatar Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onMuteToggle}
          aria-label={muted ? "Unmute voice" : "Mute voice"}
          aria-pressed={muted}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <button
          onClick={onReset}
          aria-label="Reset conversation"
          className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
