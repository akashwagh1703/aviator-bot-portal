"use client";

import { motion } from "framer-motion";

/**
 * FarmerRenderer — a fully rigged farmer face (from farmerBot-v3.svg).
 *
 * Every facial feature is a separate, named group so we can drive *real* facial
 * animation from the engine's primitives:
 *  - mouthOpen (0..1): opens the mouth cavity + drops the lower lip (lip-sync)
 *  - blink (bool):     skin-colored eyelids sweep down over each eye
 *  - emotion:          eyebrows raise/furrow + smile-corner emphasis
 *  - idle:             gentle pupil saccades so the gaze feels alive
 *
 * Tween timings are kept short and eased so transitions look organic rather
 * than mechanical. transform-box: view-box makes transform-origin resolve in
 * viewBox (0..500) coordinates.
 */

const EASE = [0.22, 0.61, 0.36, 1];

export default function FarmerRenderer({ mouthOpen = 0, blink, emotion }) {
  // Mouth: keep lips slightly parted at rest so a closed smile still reads.
  const mouthScaleY = 0.1 + mouthOpen * 0.9;
  const lowerLipDy = mouthOpen * 9;
  const cornerLift = emotion === "happy" || emotion === "talking" || emotion === "idle" ? 0 : 2;

  // Eyebrows: raise when positive, lower/furrow when thinking.
  const browDy =
    emotion === "happy" ? -5 : emotion === "talking" ? -2 : emotion === "thinking" ? 3 : emotion === "listening" ? -2 : 0;
  const browFurrow = emotion === "thinking" ? 1 : 0;

  const lidTransition = { duration: 0.085, ease: "easeOut" };
  const browTransition = { type: "spring", stiffness: 220, damping: 18 };

  return (
    <svg viewBox="0 0 500 500" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="fr-skin" cx="50%" cy="45%" r="60%" fx="50%" fy="40%">
          <stop offset="0%" stopColor="#efa36b" />
          <stop offset="40%" stopColor="#d98046" />
          <stop offset="85%" stopColor="#b85c25" />
          <stop offset="100%" stopColor="#8a3c11" />
        </radialGradient>
        <radialGradient id="fr-ear" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d98046" />
          <stop offset="100%" stopColor="#9e4c1b" />
        </radialGradient>
        <radialGradient id="fr-iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6e3c1a" />
          <stop offset="70%" stopColor="#3b1f0c" />
          <stop offset="100%" stopColor="#140a04" />
        </radialGradient>
        <linearGradient id="fr-hatBrim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#edbc5a" />
          <stop offset="50%" stopColor="#c99130" />
          <stop offset="100%" stopColor="#946519" />
        </linearGradient>
        <radialGradient id="fr-hatCrown" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f5c76c" />
          <stop offset="70%" stopColor="#d19934" />
          <stop offset="100%" stopColor="#8a6118" />
        </radialGradient>
        <linearGradient id="fr-upperLip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a65d49" />
          <stop offset="100%" stopColor="#703626" />
        </linearGradient>
        <linearGradient id="fr-lowerLip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b86b56" />
          <stop offset="100%" stopColor="#8a4433" />
        </linearGradient>
      </defs>

      {/* Hat back */}
      <g>
        <ellipse cx="250" cy="180" rx="210" ry="70" fill="#9e6e20" />
      </g>

      {/* Ears */}
      <g>
        <ellipse cx="140" cy="275" rx="22" ry="40" fill="url(#fr-ear)" />
        <path d="M 135 250 Q 120 270 135 295" stroke="#7a3a14" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 145 285 Q 130 295 140 305" stroke="#7a3a14" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="360" cy="275" rx="22" ry="40" fill="url(#fr-ear)" />
        <path d="M 365 250 Q 380 270 365 295" stroke="#7a3a14" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 355 285 Q 370 295 360 305" stroke="#7a3a14" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* Head + weathering */}
      <g>
        <path
          d="M 145,210 C 145,300 165,370 210,410 C 235,430 265,430 290,410 C 335,370 355,300 355,210 C 355,120 310,70 250,70 C 190,70 145,120 145,210 Z"
          fill="url(#fr-skin)"
        />
        <g opacity="0.5">
          <path d="M 165,260 L 145,255 M 165,268 L 140,268 M 165,276 L 145,281" stroke="#692d0b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 335,260 L 355,255 M 335,268 L 360,268 M 335,276 L 355,281" stroke="#692d0b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 210,310 Q 180,340 175,380" stroke="#542104" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 290,310 Q 320,340 325,380" stroke="#542104" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 200,310 Q 185,335 183,365" stroke="#7a3a14" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 300,310 Q 315,335 317,365" stroke="#7a3a14" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 180,285 Q 200,295 220,285 M 280,285 Q 300,295 320,285" stroke="#692d0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* Hair */}
      <g>
        <path d="M 140,190 Q 140,140 170,120 Q 200,100 250,110 Q 300,100 330,120 Q 360,140 360,190 Q 365,230 365,250 Q 350,220 345,190 Q 340,140 250,140 Q 160,140 155,190 Q 150,220 135,250 Q 135,230 140,190 Z" fill="#2d1b11" />
        <path d="M 155,150 Q 170,180 185,155 Q 200,190 220,150 Q 240,180 260,145 Q 280,185 300,150 Q 320,180 345,150 Q 300,110 250,110 Q 200,110 155,150 Z" fill="#3a2317" />
        <path d="M 150,210 Q 130,230 140,250 Q 155,225 155,200" fill="#2d1b11" />
        <path d="M 350,210 Q 370,230 360,250 Q 345,225 345,200" fill="#2d1b11" />
      </g>

      {/* Hat front + crown */}
      <g>
        <path d="M 160,140 C 160,30 220,20 250,20 C 280,20 340,30 340,140 Z" fill="url(#fr-hatCrown)" />
        <g opacity="0.15" stroke="#4a300a" strokeWidth="1.5" fill="none">
          <path d="M 170,110 Q 250,100 330,110 M 180,80 Q 250,70 320,80 M 195,50 Q 250,40 305,50" />
          <path d="M 210,25 L 200,135 M 230,22 L 225,138 M 250,20 L 250,140 M 270,22 L 275,138 M 290,25 L 300,135" />
        </g>
        <path d="M 60,190 Q 250,90 440,190 Q 250,230 60,190 Z" fill="url(#fr-hatBrim)" />
        <g opacity="0.2" stroke="#5c3c0b" strokeWidth="1.5" fill="none">
          <path d="M 90,190 Q 250,130 410,190 M 130,195 Q 250,160 370,195 M 180,205 Q 250,185 320,205" />
        </g>
      </g>

      {/* Eyebrows (animated by emotion) */}
      <motion.g
        animate={{ y: browDy, rotate: browFurrow }}
        transition={browTransition}
        style={{ transformBox: "view-box", transformOrigin: "230px 205px" }}
      >
        <path d="M 175 205 Q 200 190 230 205 Q 210 218 175 205 Z" fill="#291a10" opacity="0.9" />
        <path d="M 175 205 Q 200 190 230 205" stroke="#1f130b" strokeWidth="4" strokeLinecap="round" fill="none" />
      </motion.g>
      <motion.g
        animate={{ y: browDy, rotate: -browFurrow }}
        transition={browTransition}
        style={{ transformBox: "view-box", transformOrigin: "270px 205px" }}
      >
        <path d="M 325 205 Q 300 190 270 205 Q 290 218 325 205 Z" fill="#291a10" opacity="0.9" />
        <path d="M 325 205 Q 300 190 270 205" stroke="#1f130b" strokeWidth="4" strokeLinecap="round" fill="none" />
      </motion.g>

      {/* Eyes */}
      <g>
        {/* left eye */}
        <path d="M 180 235 Q 205 220 230 240" stroke="#8c471c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 185 260 C 195 242, 215 242, 225 260 C 215 272, 195 272, 185 260 Z" fill="#fdfcf8" />
        <path d="M 185 260 C 195 242, 215 242, 225 260 C 215 255, 195 255, 185 260 Z" fill="#000000" opacity="0.15" />
        <motion.g
          animate={{ x: [0, 0, 1.6, -1.4, 0, 0], y: [0, -1, 0, 0.8, 0, 0] }}
          transition={{ duration: 7, times: [0, 0.3, 0.45, 0.6, 0.8, 1], repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="205" cy="258" r="10" fill="url(#fr-iris)" />
          <circle cx="205" cy="258" r="4.5" fill="#050302" />
          <circle cx="202" cy="254" r="2.5" fill="#ffffff" opacity="0.9" />
          <circle cx="209" cy="262" r="1" fill="#ffffff" opacity="0.5" />
        </motion.g>
        <path d="M 183 261 C 195 240, 215 240, 227 261" stroke="#1f1108" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* left eyelid (blink) */}
        <motion.path
          d="M 185 260 C 195 242, 215 242, 225 260 C 215 272, 195 272, 185 260 Z"
          fill="url(#fr-skin)"
          animate={{ scaleY: blink ? 1 : 0 }}
          transition={lidTransition}
          style={{ transformBox: "view-box", transformOrigin: "205px 242px" }}
        />

        {/* right eye */}
        <path d="M 320 235 Q 295 220 270 240" stroke="#8c471c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 315 260 C 305 242, 285 242, 275 260 C 285 272, 305 272, 315 260 Z" fill="#fdfcf8" />
        <path d="M 315 260 C 305 242, 285 242, 275 260 C 285 255, 305 255, 315 260 Z" fill="#000000" opacity="0.15" />
        <motion.g
          animate={{ x: [0, 0, 1.6, -1.4, 0, 0], y: [0, -1, 0, 0.8, 0, 0] }}
          transition={{ duration: 7, times: [0, 0.3, 0.45, 0.6, 0.8, 1], repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="295" cy="258" r="10" fill="url(#fr-iris)" />
          <circle cx="295" cy="258" r="4.5" fill="#050302" />
          <circle cx="292" cy="254" r="2.5" fill="#ffffff" opacity="0.9" />
          <circle cx="299" cy="262" r="1" fill="#ffffff" opacity="0.5" />
        </motion.g>
        <path d="M 317 261 C 305 240, 285 240, 273 261" stroke="#1f1108" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* right eyelid (blink) */}
        <motion.path
          d="M 315 260 C 305 242, 285 242, 275 260 C 285 272, 305 272, 315 260 Z"
          fill="url(#fr-skin)"
          animate={{ scaleY: blink ? 1 : 0 }}
          transition={lidTransition}
          style={{ transformBox: "view-box", transformOrigin: "295px 242px" }}
        />
      </g>

      {/* Nose */}
      <g>
        <path d="M 240 240 L 260 240 L 265 305 L 235 305 Z" fill="#ffffff" opacity="0.1" />
        <path d="M 240 240 Q 235 270 220 300 M 260 240 Q 265 270 280 300" stroke="#9e4c1b" strokeWidth="2" fill="none" />
        <path d="M 215 315 Q 250 335 285 315 Q 250 325 215 315 Z" fill="#8c3e10" opacity="0.7" />
        <path d="M 215 305 C 215 320, 235 325, 235 315" stroke="#5c2404" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 285 305 C 285 320, 265 325, 265 315" stroke="#5c2404" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <ellipse cx="250" cy="305" rx="12" ry="8" fill="#ffffff" opacity="0.2" />
      </g>

      {/* Mouth interior + lower lip (animated open), then mustache on top, then upper lip */}
      <motion.g
        animate={{ scaleY: mouthScaleY }}
        transition={{ duration: 0.08, ease: EASE }}
        style={{ transformBox: "view-box", transformOrigin: "250px 354px" }}
      >
        <path d="M 210 355 Q 250 395 290 355 Q 250 360 210 355 Z" fill="#240c06" />
        <path d="M 213 356 Q 250 375 287 356 Q 250 362 213 356 Z" fill="#fcfaf2" />
        <path d="M 250 359 L 250 366 M 235 358 L 235 363 M 265 358 L 265 363" stroke="#d1c9bd" strokeWidth="1" fill="none" />
        <path d="M 230 375 Q 250 385 270 375 Q 250 390 230 375 Z" fill="#a84e40" />
      </motion.g>

      <motion.g animate={{ y: lowerLipDy }} transition={{ duration: 0.08, ease: EASE }}>
        <path d="M 210 380 Q 250 405 290 380 Q 250 420 210 380 Z" fill="url(#fr-lowerLip)" />
        <path d="M 230 393 Q 250 403 270 393 Q 250 410 230 393 Z" fill="#ffffff" opacity="0.2" />
      </motion.g>

      {/* Mustache (drawn over the parted lips) */}
      <g>
        <path d="M 190 345 Q 220 320 250 330 Q 280 320 310 345 Q 280 360 250 355 Q 220 360 190 345 Z" fill="#291a10" />
        <path d="M 195 343 Q 225 325 250 332 Q 275 325 305 343" stroke="#402a1b" strokeWidth="2.5" fill="none" />
        <path d="M 210 340 Q 230 330 250 335 M 290 340 Q 270 330 250 335" stroke="#4a3424" strokeWidth="1.5" fill="none" />
      </g>

      {/* Upper lip */}
      <path d="M 205 352 Q 225 345 250 348 Q 275 345 295 352 Q 250 356 205 352 Z" fill="url(#fr-upperLip)" />

      {/* Smile corners (lift slightly when neutral/thinking for life) */}
      <motion.path
        d="M 195 348 Q 205 355 215 355 M 285 355 Q 295 355 305 348"
        stroke="#3d1b0d"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={{ y: cornerLift }}
        transition={browTransition}
      />
    </svg>
  );
}
