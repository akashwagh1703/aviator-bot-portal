"use client";

import { motion } from "framer-motion";

/**
 * Human-style SVG avatar (Sophia).
 *
 * Receives animation primitives from the engine rather than reading global
 * state directly, so the renderer stays dumb and reusable:
 *  - blink:   boolean, drives eye-lid closing
 *  - mouthOpen: 0..1, drives mouth height while talking
 *  - emotion: string, lets the renderer tweak expression (e.g. smile)
 */
export default function HumanRenderer({ accent = "#ec4899", accent2 = "#8b5cf6", blink, mouthOpen = 0, emotion }) {
  const happy = emotion === "happy" || emotion === "talking";
  const eyeHeight = blink ? 1 : 7;
  const mouthH = 4 + mouthOpen * 16;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="hr-skin" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffe0c7" />
          <stop offset="100%" stopColor="#f3b58c" />
        </radialGradient>
        <linearGradient id="hr-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent2} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>

      {/* hair back */}
      <path d="M44 96c0-40 24-66 56-66s56 26 56 66c0 24-8 40-8 40l-12-30-20 8-16-10-16 10-20-8-12 30S44 120 44 96z" fill="url(#hr-hair)" />
      {/* face */}
      <ellipse cx="100" cy="104" rx="48" ry="52" fill="url(#hr-skin)" />
      {/* cheeks */}
      <ellipse cx="74" cy="116" rx="9" ry="6" fill={accent} opacity="0.22" />
      <ellipse cx="126" cy="116" rx="9" ry="6" fill={accent} opacity="0.22" />
      {/* eyes */}
      <g fill="#2b2b3a">
        <motion.ellipse cx="82" cy="98" rx="6" animate={{ ry: eyeHeight }} transition={{ duration: 0.08 }} />
        <motion.ellipse cx="118" cy="98" rx="6" animate={{ ry: eyeHeight }} transition={{ duration: 0.08 }} />
      </g>
      {/* eyebrows */}
      <path d="M74 86q8 -5 16 0" stroke="#7a5a48" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M110 86q8 -5 16 0" stroke="#7a5a48" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* mouth */}
      <motion.path
        d={happy ? `M84 128 q16 ${10 + mouthOpen * 8} 32 0` : `M86 130 q14 ${4 + mouthOpen * 6} 28 0`}
        animate={{ strokeWidth: 3 + mouthOpen * 2 }}
        stroke="#c0506a"
        fill={mouthOpen > 0.15 ? "#9a2b46" : "none"}
        strokeLinecap="round"
      />
      <motion.ellipse cx="100" cy="132" rx="9" animate={{ ry: mouthH / 2 }} fill="#9a2b46" opacity={mouthOpen > 0.2 ? 0.9 : 0} />
      {/* hair front */}
      <path d="M52 92c4-36 26-58 48-58s44 22 48 58c-10-12-22-18-22-18s-10 12-26 12-26-12-26-12-10 6-22 18z" fill="url(#hr-hair)" />
    </svg>
  );
}
