"use client";

import { motion } from "framer-motion";

/** Anime-style SVG avatar (Neo). */
export default function AnimeRenderer({ accent = "#fb923c", accent2 = "#f43f5e", blink, mouthOpen = 0, emotion }) {
  const happy = emotion === "happy" || emotion === "talking";
  const eyeScale = blink ? 0.1 : 1;
  const mouthH = 3 + mouthOpen * 14;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="an-skin" cx="50%" cy="42%" r="68%">
          <stop offset="0%" stopColor="#fff1e6" />
          <stop offset="100%" stopColor="#ffd9bf" />
        </radialGradient>
        <linearGradient id="an-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent2} />
        </linearGradient>
        <linearGradient id="an-eye" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent2} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>

      {/* spiky hair back */}
      <path d="M40 110c-6-44 24-78 60-78s66 34 60 78c-6-18-16-26-16-26l4 22-18-16-2 18-14-18-14 18-2-18-18 16 4-22s-10 8-16 26z" fill="url(#an-hair)" />
      {/* face */}
      <path d="M58 96c0-30 18-50 42-50s42 20 42 50c0 34-22 58-42 58s-42-24-42-58z" fill="url(#an-skin)" />
      {/* cheeks */}
      <ellipse cx="74" cy="120" rx="8" ry="5" fill={accent2} opacity="0.25" />
      <ellipse cx="126" cy="120" rx="8" ry="5" fill={accent2} opacity="0.25" />
      {/* big anime eyes */}
      <g>
        <motion.g animate={{ scaleY: eyeScale }} transition={{ duration: 0.08 }} style={{ transformOrigin: "82px 104px" }}>
          <ellipse cx="82" cy="104" rx="11" ry="14" fill="#fff" />
          <ellipse cx="82" cy="106" rx="8" ry="11" fill="url(#an-eye)" />
          <circle cx="79" cy="101" r="3.2" fill="#fff" />
        </motion.g>
        <motion.g animate={{ scaleY: eyeScale }} transition={{ duration: 0.08 }} style={{ transformOrigin: "118px 104px" }}>
          <ellipse cx="118" cy="104" rx="11" ry="14" fill="#fff" />
          <ellipse cx="118" cy="106" rx="8" ry="11" fill="url(#an-eye)" />
          <circle cx="115" cy="101" r="3.2" fill="#fff" />
        </motion.g>
      </g>
      {/* mouth */}
      <motion.ellipse
        cx="100"
        cy="134"
        rx={happy ? 11 : 7}
        animate={{ ry: mouthH }}
        transition={{ duration: 0.1 }}
        fill="#b83b52"
      />
      {/* hair front bangs */}
      <path d="M60 92c2-30 18-48 40-48s38 18 40 48c-8-10-16-12-16-12l-6 12-8-14-10 14-10-14-8 14-6-12s-8 2-16 12z" fill="url(#an-hair)" />
    </svg>
  );
}
