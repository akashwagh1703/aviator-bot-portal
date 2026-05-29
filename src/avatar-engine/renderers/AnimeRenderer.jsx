"use client";

import { motion } from "framer-motion";

/** Anime-style SVG avatar (Neo) — clean modern chibi with big expressive eyes. */
export default function AnimeRenderer({
  accent = "#fb923c",
  accent2 = "#f43f5e",
  blink,
  mouthOpen = 0,
  emotion,
}) {
  const happy = emotion === "happy" || emotion === "talking" || emotion === "idle";
  const eyeScale = blink ? 0.1 : 1;
  const mouthRy = 2 + mouthOpen * 8;

  return (
    <svg viewBox="0 0 240 240" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="an-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.26" />
          <stop offset="100%" stopColor={accent2} stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="an-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3ea" />
          <stop offset="100%" stopColor="#ffdcc5" />
        </linearGradient>
        <linearGradient id="an-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
        <linearGradient id="an-eye" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent2} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <linearGradient id="an-hood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent2} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>

      <circle cx="120" cy="120" r="92" fill="url(#an-bg)" />

      {/* hoodie / shoulders */}
      <path d="M62 224c0-32 26-54 58-54s58 22 58 54z" fill="url(#an-hood)" />
      <path d="M104 176 l16 18 16-18z" fill="#000" opacity="0.12" />

      {/* neck */}
      <rect x="108" y="156" width="24" height="26" rx="11" fill="#f3c4a6" />

      {/* spiky hair back */}
      <path d="M58 124c-6-46 26-80 62-80s68 34 62 80c-6-18-16-26-16-26l4 22-18-16-3 18-13-18-13 18-3-18-18 16 4-22s-10 8-16 26z" fill="url(#an-hair)" />

      {/* face */}
      <path d="M76 116c0-30 20-50 44-50s44 20 44 50c0 34-22 58-44 58s-44-24-44-58z" fill="url(#an-skin)" />

      {/* cheeks */}
      <ellipse cx="92" cy="132" rx="8" ry="5" fill={accent2} opacity="0.28" />
      <ellipse cx="148" cy="132" rx="8" ry="5" fill={accent2} opacity="0.28" />

      {/* big anime eyes */}
      <g>
        <motion.g animate={{ scaleY: eyeScale }} transition={{ duration: 0.08 }} style={{ transformOrigin: "100px 112px" }}>
          <ellipse cx="100" cy="112" rx="12" ry="15" fill="#fff" />
          <ellipse cx="100" cy="114" rx="9" ry="12" fill="url(#an-eye)" />
          <circle cx="96.5" cy="108" r="3.4" fill="#fff" />
          <circle cx="103" cy="118" r="1.8" fill="#fff" opacity="0.8" />
        </motion.g>
        <motion.g animate={{ scaleY: eyeScale }} transition={{ duration: 0.08 }} style={{ transformOrigin: "140px 112px" }}>
          <ellipse cx="140" cy="112" rx="12" ry="15" fill="#fff" />
          <ellipse cx="140" cy="114" rx="9" ry="12" fill="url(#an-eye)" />
          <circle cx="136.5" cy="108" r="3.4" fill="#fff" />
          <circle cx="143" cy="118" r="1.8" fill="#fff" opacity="0.8" />
        </motion.g>
      </g>

      {/* nose hint */}
      <circle cx="120" cy="130" r="1.6" fill="#e0916d" />

      {/* mouth */}
      <motion.path
        d={happy ? "M110 144 q10 9 20 0" : "M112 145 q8 3 16 0"}
        stroke="#b83b52"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        animate={{ opacity: mouthOpen > 0.25 ? 0.3 : 1 }}
      />
      <motion.ellipse cx="120" cy="144" rx="8" fill="#b83b52" animate={{ ry: mouthRy }} transition={{ duration: 0.08 }} />

      {/* hair front bangs */}
      <path d="M64 112c2-30 18-48 56-48s54 18 56 48c-9-11-18-13-18-13l-7 13-9-15-11 15-11-15-9 15-7-13s-9 2-18 13z" fill="url(#an-hair)" />
    </svg>
  );
}
