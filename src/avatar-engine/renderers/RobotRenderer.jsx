"use client";

import { motion } from "framer-motion";

/** Robot-style SVG avatar (RobotX). */
export default function RobotRenderer({ accent = "#22d3ee", accent2 = "#10b981", blink, mouthOpen = 0, emotion }) {
  const eyeH = blink ? 1 : 10;
  const bars = 5;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="rb-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a3550" />
          <stop offset="100%" stopColor="#0e1626" />
        </linearGradient>
        <linearGradient id="rb-glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
      </defs>

      {/* antenna */}
      <line x1="100" y1="28" x2="100" y2="48" stroke="#5a6a85" strokeWidth="4" strokeLinecap="round" />
      <motion.circle cx="100" cy="24" r="6" fill={accent} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity }} />
      {/* head */}
      <rect x="48" y="48" width="104" height="96" rx="22" fill="url(#rb-metal)" stroke={accent} strokeWidth="2" />
      {/* ears */}
      <rect x="40" y="84" width="10" height="28" rx="4" fill="#3a4660" />
      <rect x="150" y="84" width="10" height="28" rx="4" fill="#3a4660" />
      {/* visor */}
      <rect x="62" y="74" width="76" height="34" rx="14" fill="#070d18" stroke={accent} strokeWidth="1.5" />
      {/* eyes */}
      <g fill="url(#rb-glow)">
        <motion.rect x="76" width="14" rx="3" animate={{ y: 91 - eyeH / 2, height: eyeH }} transition={{ duration: 0.08 }} />
        <motion.rect x="110" width="14" rx="3" animate={{ y: 91 - eyeH / 2, height: eyeH }} transition={{ duration: 0.08 }} />
      </g>
      {/* mouth speaker grille — bars react to mouthOpen */}
      <rect x="70" y="118" width="60" height="20" rx="6" fill="#0a1322" stroke="#33405c" />
      <g fill={accent}>
        {Array.from({ length: bars }).map((_, i) => {
          const h = 4 + mouthOpen * 12 * ((i % 2) + 1) * 0.6;
          return (
            <motion.rect
              key={i}
              x={78 + i * 10}
              width="5"
              rx="2"
              animate={{ y: 128 - h / 2, height: Math.max(3, h) }}
              transition={{ duration: 0.1 }}
            />
          );
        })}
      </g>
      {emotion === "happy" && <circle cx="100" cy="128" r="2" fill={accent2} />}
    </svg>
  );
}
