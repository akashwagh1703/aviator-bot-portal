"use client";

import { motion } from "framer-motion";

/** Robot-style SVG avatar (RobotX) — sleek modern droid with a glowing visor. */
export default function RobotRenderer({
  accent = "#22d3ee",
  accent2 = "#3b82f6",
  blink,
  mouthOpen = 0,
  emotion,
}) {
  const eyeScale = blink ? 0.12 : 1;
  const bars = 5;

  return (
    <svg viewBox="0 0 240 240" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="rb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent2} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="rb-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8eef7" />
          <stop offset="55%" stopColor="#c3cedd" />
          <stop offset="100%" stopColor="#9aa7bd" />
        </linearGradient>
        <linearGradient id="rb-glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
      </defs>

      <circle cx="120" cy="120" r="92" fill="url(#rb-bg)" />

      {/* antenna */}
      <line x1="120" y1="36" x2="120" y2="58" stroke="#8a98ad" strokeWidth="5" strokeLinecap="round" />
      <motion.circle cx="120" cy="32" r="7" fill="url(#rb-glow)" animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />

      {/* neck + body hint */}
      <rect x="108" y="158" width="24" height="20" rx="8" fill="#aab6c8" />
      <path d="M70 224c0-30 22-50 50-50s50 20 50 50z" fill="url(#rb-shell)" />
      <circle cx="120" cy="206" r="9" fill="url(#rb-glow)" opacity="0.9" />

      {/* ears */}
      <rect x="56" y="104" width="12" height="34" rx="6" fill="#aab6c8" />
      <rect x="172" y="104" width="12" height="34" rx="6" fill="#aab6c8" />
      <circle cx="62" cy="121" r="3" fill={accent} />
      <circle cx="178" cy="121" r="3" fill={accent} />

      {/* head shell */}
      <rect x="64" y="62" width="112" height="104" rx="34" fill="url(#rb-shell)" />
      <rect x="64" y="62" width="112" height="104" rx="34" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5" />

      {/* visor */}
      <rect x="78" y="86" width="84" height="46" rx="22" fill="#0b1422" />
      <rect x="78" y="86" width="84" height="46" rx="22" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.7" />

      {/* eyes */}
      <g fill="url(#rb-glow)">
        <motion.g animate={{ scaleY: eyeScale }} transition={{ duration: 0.08 }} style={{ transformOrigin: "102px 109px" }}>
          <circle cx="102" cy="109" r="9" />
        </motion.g>
        <motion.g animate={{ scaleY: eyeScale }} transition={{ duration: 0.08 }} style={{ transformOrigin: "138px 109px" }}>
          <circle cx="138" cy="109" r="9" />
        </motion.g>
      </g>
      {emotion === "happy" && (
        <>
          <path d="M96 116 q6 5 12 0" stroke="#0b1422" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M132 116 q6 5 12 0" stroke="#0b1422" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* mouth speaker grille — bars react to mouthOpen */}
      <rect x="92" y="142" width="56" height="18" rx="7" fill="#0b1422" />
      <g fill={accent}>
        {Array.from({ length: bars }).map((_, i) => {
          const h = 4 + mouthOpen * 11 * (((i % 3) + 1) * 0.5);
          return (
            <motion.rect
              key={i}
              x={100 + i * 9}
              width="4.5"
              rx="2"
              animate={{ y: 151 - h / 2, height: Math.max(3, h) }}
              transition={{ duration: 0.09 }}
            />
          );
        })}
      </g>
    </svg>
  );
}
