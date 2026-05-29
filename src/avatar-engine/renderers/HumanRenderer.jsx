"use client";

import { motion } from "framer-motion";

/**
 * Human-style SVG avatar (Sophia) — clean, modern flat-illustration look.
 *
 * Animation primitives are supplied by the engine so the renderer stays dumb
 * and reusable:
 *  - blink:     boolean -> eye-lid closing
 *  - mouthOpen: 0..1     -> mouth height while talking
 *  - emotion:   string   -> expression tweaks (e.g. smile)
 */
export default function HumanRenderer({
  accent = "#d946ef",
  accent2 = "#8b5cf6",
  blink,
  mouthOpen = 0,
  emotion,
}) {
  const happy = emotion === "happy" || emotion === "talking" || emotion === "idle";
  const lidY = blink ? 96 : 88; // upper lid covers eye when blinking
  const mouthRy = 2.2 + mouthOpen * 9;

  return (
    <svg viewBox="0 0 240 240" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="hr-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent2} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="hr-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe7d4" />
          <stop offset="100%" stopColor="#f6bd9b" />
        </linearGradient>
        <linearGradient id="hr-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent2} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <linearGradient id="hr-cloth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
      </defs>

      {/* soft backdrop disc */}
      <circle cx="120" cy="120" r="92" fill="url(#hr-bg)" />

      {/* shoulders / clothing */}
      <path d="M58 224c0-34 28-58 62-58s62 24 62 58z" fill="url(#hr-cloth)" />
      <path d="M58 224c0-34 28-58 62-58s62 24 62 58z" fill="#000" opacity="0.06" />

      {/* neck */}
      <rect x="106" y="150" width="28" height="30" rx="12" fill="#f0ad88" />

      {/* hair back */}
      <path d="M58 118c0-44 27-72 62-72s62 28 62 72c0 18-5 32-5 32l-12-26-14 8-13-10-18 10-14-8-12 26S58 136 58 118z" fill="url(#hr-hair)" />

      {/* face */}
      <path d="M74 116c0-30 20-50 46-50s46 20 46 50c0 34-22 58-46 58s-46-24-46-58z" fill="url(#hr-skin)" />

      {/* cheeks */}
      <ellipse cx="92" cy="128" rx="9" ry="6" fill={accent} opacity="0.2" />
      <ellipse cx="148" cy="128" rx="9" ry="6" fill={accent} opacity="0.2" />

      {/* eyebrows */}
      <path d="M88 96q12 -6 22 -1" stroke="#7c4a36" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M130 95q10 -5 22 1" stroke="#7c4a36" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* eyes (whites + iris), upper lid animates the blink */}
      <g>
        <ellipse cx="100" cy="108" rx="9" ry="8" fill="#fff" />
        <circle cx="101" cy="109" r="4.6" fill="#5b3a2e" />
        <circle cx="99.3" cy="107.3" r="1.5" fill="#fff" />
        <ellipse cx="140" cy="108" rx="9" ry="8" fill="#fff" />
        <circle cx="141" cy="109" r="4.6" fill="#5b3a2e" />
        <circle cx="139.3" cy="107.3" r="1.5" fill="#fff" />
        {/* lids */}
        <motion.rect x="90" width="20" height="16" rx="8" fill="url(#hr-skin)" animate={{ y: lidY }} transition={{ duration: 0.08 }} />
        <motion.rect x="130" width="20" height="16" rx="8" fill="url(#hr-skin)" animate={{ y: lidY }} transition={{ duration: 0.08 }} />
      </g>

      {/* nose */}
      <path d="M120 116v12" stroke="#e0916d" strokeWidth="3" strokeLinecap="round" />

      {/* mouth */}
      <motion.path
        d={happy ? "M104 140 q16 12 32 0" : "M106 142 q14 4 28 0"}
        stroke="#c84f6b"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={{ opacity: mouthOpen > 0.25 ? 0.4 : 1 }}
      />
      <motion.ellipse cx="120" cy="142" rx="10" fill="#a83452" animate={{ ry: mouthRy }} transition={{ duration: 0.08 }} />

      {/* hair front bangs */}
      <path d="M66 112c2-40 25-66 54-66s52 26 54 66c-12-16-26-20-26-20s-9 11-28 11-28-11-28-11-13 4-26 20z" fill="url(#hr-hair)" />
    </svg>
  );
}
