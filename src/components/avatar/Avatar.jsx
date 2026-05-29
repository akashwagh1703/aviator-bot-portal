"use client";

/**
 * Avatar — the on-screen character stage.
 *
 * Composes the reusable AvatarEngine with presentation concerns: idle floating,
 * an emotion-reactive glow/ring, and a status label. Reads runtime state from
 * the store; visuals (accent colors) come from the character config.
 */

import { motion } from "framer-motion";
import AvatarEngine from "@/avatar-engine/AvatarEngine";
import { EMOTIONS, useAssistantStore } from "@/store/useAssistantStore";

const EMOTION_LABEL = {
  [EMOTIONS.IDLE]: "Ready",
  [EMOTIONS.HAPPY]: "Happy",
  [EMOTIONS.THINKING]: "Thinking…",
  [EMOTIONS.TALKING]: "Speaking…",
  [EMOTIONS.LISTENING]: "Listening…",
};

export default function Avatar({ character }) {
  const emotion = useAssistantStore((s) => s.emotion);
  const speaking = useAssistantStore((s) => s.speaking);
  const { avatar } = character;

  const ringActive = emotion !== EMOTIONS.IDLE;

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <motion.div
        className="relative"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ambient glow */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${avatar.accent}66, transparent 70%)` }}
          animate={{ scale: speaking ? [1, 1.18, 1] : [1, 1.06, 1], opacity: ringActive ? 0.9 : 0.55 }}
          transition={{ duration: speaking ? 0.6 : 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* reactive ring */}
        <motion.div
          aria-hidden="true"
          className="absolute -inset-3 rounded-full border-2"
          style={{ borderColor: `${avatar.accent}` }}
          animate={{
            opacity: ringActive ? [0.3, 0.7, 0.3] : 0.15,
            scale: ringActive ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="relative grid h-44 w-44 place-items-center rounded-full bg-white/5 p-3 backdrop-blur-md ring-1 ring-white/10 sm:h-56 sm:w-56 md:h-64 md:w-64"
          style={{ boxShadow: `0 0 60px -10px ${avatar.accent}77` }}
        >
          <AvatarEngine
            renderKey={avatar.render}
            accent={avatar.accent}
            accent2={avatar.accent2}
            emotion={emotion}
            speaking={speaking}
          />
        </div>
      </motion.div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{avatar.name}</h2>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm text-white/60">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: avatar.accent }}
            aria-hidden="true"
          />
          {EMOTION_LABEL[emotion] || "Ready"}
        </div>
      </div>
    </div>
  );
}
