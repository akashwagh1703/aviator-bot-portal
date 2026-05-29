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
  accent = "#2E7D32",
  accent2 = "#F9A825",
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
        <linearGradient id="hr-cloth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
        <linearGradient id="hr-hat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent2} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>

      {/* soft backdrop disc */}
      <circle cx="120" cy="120" r="92" fill="url(#hr-bg)" />

      {/* shoulders / clothing */}
      <path d="M58 224c0-34 28-58 62-58s62 24 62 58z" fill="url(#hr-cloth)" />
      <path d="M58 224c0-34 28-58 62-58s62 24 62 58z" fill="#000" opacity="0.06" />

      {/* neck */}
      <rect x="106" y="150" width="28" height="30" rx="12" fill="#f0ad88" />

      {/* hair (natural dark) */}
      <path d="M64 116c0-40 25-66 56-66s56 26 56 66c0 12-3 22-3 22l-9-22-12 6-12-9-16 9-12-6-9 22S64 128 64 116z" fill="#4a3320" />

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

      {/* farmer hat (band + dome + brim) */}
      <ellipse cx="120" cy="70" rx="78" ry="18" fill="url(#hr-hat)" />
      <ellipse cx="120" cy="70" rx="78" ry="18" fill="#000" opacity="0.08" />
      <path d="M70 70c0-30 22-46 50-46s50 16 50 46c-14-9-31-13-50-13s-36 4-50 13z" fill="url(#hr-hat)" />
      <rect x="84" y="60" width="72" height="9" rx="4" fill="#000" opacity="0.12" />
    </svg>
  );
}
