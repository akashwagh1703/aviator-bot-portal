"use client";

/**
 * Avatar — the on-screen character stage.
 *
 * Composes the reusable AvatarEngine with presentation concerns: idle floating,
 * an emotion-reactive glow/ring, a pedestal reflection, and a status pill.
 * Reads runtime state from the store; visuals (accent colors) come from config.
 */

import { motion } from "framer-motion";
import AvatarEngine from "@/avatar-engine/AvatarEngine";
import { EMOTIONS, useAssistantStore } from "@/store/useAssistantStore";

const EMOTION_META = {
  [EMOTIONS.IDLE]: { label: "Ready", dot: true },
  [EMOTIONS.HAPPY]: { label: "Happy", dot: true },
  [EMOTIONS.THINKING]: { label: "Thinking", pulse: true },
  [EMOTIONS.TALKING]: { label: "Speaking", pulse: true },
  [EMOTIONS.LISTENING]: { label: "Listening", pulse: true },
};

export default function Avatar({ character }) {
  const emotion = useAssistantStore((s) => s.emotion);
  const speaking = useAssistantStore((s) => s.speaking);
  const { avatar, personality } = character;

  const active = emotion !== EMOTIONS.IDLE;
  const meta = EMOTION_META[emotion] || EMOTION_META[EMOTIONS.IDLE];

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      <motion.div
        className="relative"
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ambient glow */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${avatar.accent}55, transparent 70%)` }}
          animate={{ scale: speaking ? [1, 1.2, 1] : [1, 1.07, 1], opacity: active ? 0.95 : 0.6 }}
          transition={{ duration: speaking ? 0.6 : 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* reactive ring */}
        <motion.div
          aria-hidden="true"
          className="absolute -inset-2 rounded-full border"
          style={{ borderColor: avatar.accent }}
          animate={{ opacity: active ? [0.35, 0.75, 0.35] : 0.18, scale: active ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* disc */}
        <div
          className="relative grid h-48 w-48 place-items-center overflow-hidden rounded-full p-3 ring-1 ring-white/10 backdrop-blur-md sm:h-56 sm:w-56 md:h-60 md:w-60"
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, ${avatar.accent}22, rgb(var(--surface) / 0.5))`,
            boxShadow: `0 0 70px -12px ${avatar.accent}88, inset 0 1px 0 rgb(255 255 255 / 0.08)`,
          }}
        >
          <AvatarEngine
            renderKey={avatar.render}
            accent={avatar.accent}
            accent2={avatar.accent2}
            emotion={emotion}
            speaking={speaking}
          />
        </div>

        {/* pedestal reflection */}
        <div
          aria-hidden="true"
          className="absolute -bottom-3 left-1/2 h-5 w-32 -translate-x-1/2 rounded-[50%] blur-md"
          style={{ background: `${avatar.accent}66` }}
        />
      </motion.div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">{avatar.name}</h2>
        <p className="mt-0.5 text-sm text-ink/45">{personality?.description || avatar.tagline}</p>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink/70">
          <motion.span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: avatar.accent }}
            animate={meta.pulse ? { opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] } : { opacity: 1 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            aria-hidden="true"
          />
          {meta.label}
        </div>
      </div>
    </div>
  );
}
