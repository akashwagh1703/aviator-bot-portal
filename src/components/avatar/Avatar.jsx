"use client";

/**
 * Avatar — the on-screen character stage.
 *
 * Composes the reusable AvatarEngine with presentation concerns: idle floating,
 * an emotion-reactive glow/ring, a pedestal shadow, and a localized status pill.
 */

import { motion } from "framer-motion";
import AvatarEngine from "@/avatar-engine/AvatarEngine";
import { EMOTIONS, useAssistantStore } from "@/store/useAssistantStore";
import { getStrings } from "@/configs";

export default function Avatar({ character }) {
  const emotion = useAssistantStore((s) => s.emotion);
  const speaking = useAssistantStore((s) => s.speaking);
  const listening = useAssistantStore((s) => s.listening);
  const lang = useAssistantStore((s) => s.lang);
  const t = getStrings(lang);
  const { avatar, personality } = character;

  const active = emotion !== EMOTIONS.IDLE;
  const isWide = avatar.frame === "wide";
  const label =
    emotion === EMOTIONS.LISTENING
      ? t.listening
      : emotion === EMOTIONS.THINKING
      ? t.thinking
      : emotion === EMOTIONS.TALKING
      ? t.speaking
      : emotion === EMOTIONS.HAPPY
      ? t.happy
      : t.ready;
  const pulse = active && emotion !== EMOTIONS.HAPPY;

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ambient glow */}
        <motion.div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 blur-3xl ${isWide ? "rounded-3xl" : "rounded-full"}`}
          style={{ background: `radial-gradient(circle, ${avatar.accent}40, transparent 70%)` }}
          animate={{ scale: speaking ? [1, 1.18, 1] : [1, 1.06, 1], opacity: active ? 0.9 : 0.5 }}
          transition={{ duration: speaking ? 0.6 : 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* reactive ring */}
        <motion.div
          aria-hidden="true"
          className={`absolute -inset-2 border-2 ${isWide ? "rounded-[2rem]" : "rounded-full"}`}
          style={{ borderColor: avatar.accent }}
          animate={{ opacity: active ? [0.3, 0.7, 0.3] : 0.2, scale: active ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* stage — circular disc for built-in avatars, rounded card for wide art */}
        <div
          className={
            isWide
              ? "relative grid aspect-[3/2] w-64 place-items-center overflow-hidden rounded-[1.75rem] p-3 ring-1 ring-[rgb(var(--border)/0.08)] sm:w-80 md:w-[22rem]"
              : "relative grid h-44 w-44 place-items-center overflow-hidden rounded-full p-3 ring-1 ring-[rgb(var(--border)/0.08)] sm:h-52 sm:w-52 md:h-56 md:w-56"
          }
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, ${avatar.accent}1f, rgb(var(--surface)))`,
            boxShadow: `0 0 60px -16px ${avatar.accent}aa, 0 18px 40px -20px rgb(var(--border) / 0.35)`,
          }}
        >
          <AvatarEngine
            renderKey={avatar.render}
            accent={avatar.accent}
            accent2={avatar.accent2}
            emotion={emotion}
            speaking={speaking}
            image={avatar.image}
            video={avatar.video}
            videoWebm={avatar.videoWebm}
            poster={avatar.poster}
            segments={avatar.videoSegments}
          />
        </div>

        {/* pedestal shadow */}
        <div
          aria-hidden="true"
          className="absolute -bottom-2 left-1/2 h-4 w-28 -translate-x-1/2 rounded-[50%] blur-md"
          style={{ background: `rgb(var(--border) / 0.25)` }}
        />
      </motion.div>

      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">{avatar.name}</h2>
        <p className="mt-0.5 text-sm text-ink/55">{personality?.description || avatar.tagline}</p>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border)/0.12)] surface-1 px-3.5 py-1.5 text-sm font-semibold text-ink/75">
          <motion.span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: listening ? "#E53935" : avatar.accent }}
            animate={pulse ? { opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] } : { opacity: 1 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            aria-hidden="true"
          />
          {label}
        </div>
      </div>
    </div>
  );
}
