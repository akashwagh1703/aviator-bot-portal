"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * AviatorRenderer — photoreal aviatorv1.png with pixel-based motion.
 * Blink: upper eyelids only (skin-toned). Speech: clipped jaw layer from the PNG.
 */

const PORTRAIT = "/avatars/aviatorv1.png";

const EYE_L = { cx: 198, cy: 187, rx: 23, ry: 10, skin: "#dc7f42", skinDark: "#b86530" };
const EYE_R = { cx: 302, cy: 187, rx: 23, ry: 10, skin: "#dc7f42", skinDark: "#b86530" };
const JAW = {
  originX: "49.6%",
  originY: "52%",
  clip: "polygon(31% 48.2%, 69% 48.2%, 72% 59.6%, 50% 61%, 28% 59.6%)",
};

const SPEAK_SPRING = { stiffness: 180, damping: 22, mass: 0.55 };
const BLINK_SPRING = { stiffness: 420, damping: 32, mass: 0.35 };

function upperLid({ cx, cy, rx, ry, skin, skinDark }) {
  const top = cy - ry - 5;
  const fold = cy - 1;
  const x0 = cx - rx - 3;
  const x1 = cx + rx + 3;
  return {
    d: `M ${x0} ${fold + 2} Q ${cx - rx * 0.4} ${top} ${cx} ${top - 1} Q ${cx + rx * 0.4} ${top} ${x1} ${fold + 2} L ${x1} ${fold + 8} Q ${cx} ${top + 7} ${x0} ${fold + 8} Z`,
    origin: `${cx}px ${top - 1}px`,
    gradId: `av-lid-${cx}`,
    skin,
    skinDark,
  };
}

const lidL = upperLid(EYE_L);
const lidR = upperLid(EYE_R);

export default function AviatorRenderer({ mouthOpen = 0, blink, speaking }) {
  const open = useSpring(0, SPEAK_SPRING);
  const lidLClose = useSpring(0, BLINK_SPRING);
  const lidRClose = useSpring(0, BLINK_SPRING);

  useEffect(() => {
    open.set(speaking ? mouthOpen : 0);
  }, [mouthOpen, speaking, open]);

  useEffect(() => {
    if (!blink) {
      lidLClose.set(0);
      lidRClose.set(0);
      return;
    }
    lidLClose.set(1);
    const t = setTimeout(() => lidRClose.set(1), 16);
    return () => clearTimeout(t);
  }, [blink, lidLClose, lidRClose]);

  const jawScale = useTransform(open, [0, 0.35, 1], [1, 1.012, 1.028]);
  const jawY = useTransform(open, [0, 1], [0, 1.4]);
  const jawOpacity = useTransform(open, [0, 0.04, 1], [0, 0.92, 1]);

  const lidScaleL = useTransform(lidLClose, [0, 1], [0.03, 0.94]);
  const lidScaleR = useTransform(lidRClose, [0, 1], [0.03, 0.94]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={PORTRAIT}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain"
      />

      {/* Jaw — real PNG pixels, subtle open/close while speaking */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: JAW.clip,
          transformOrigin: `${JAW.originX} ${JAW.originY}`,
          scaleY: jawScale,
          y: jawY,
          opacity: jawOpacity,
        }}
      >
        <img
          src={PORTRAIT}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain"
        />
      </motion.div>

      <svg
        viewBox="0 0 500 500"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={lidL.gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lidL.skinDark} />
            <stop offset="55%" stopColor={lidL.skin} />
            <stop offset="100%" stopColor={lidL.skin} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={lidR.gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lidR.skinDark} />
            <stop offset="55%" stopColor={lidR.skin} />
            <stop offset="100%" stopColor={lidR.skin} stopOpacity="0" />
          </linearGradient>
          <filter id="av-lid-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.45" />
          </filter>
        </defs>

        {/* Upper eyelid blink — slides down, feathered edge */}
        <motion.path
          d={lidL.d}
          fill={`url(#${lidL.gradId})`}
          filter="url(#av-lid-soft)"
          style={{
            scaleY: lidScaleL,
            transformBox: "view-box",
            transformOrigin: lidL.origin,
          }}
        />
        <motion.path
          d={lidR.d}
          fill={`url(#${lidR.gradId})`}
          filter="url(#av-lid-soft)"
          style={{
            scaleY: lidScaleR,
            transformBox: "view-box",
            transformOrigin: lidR.origin,
          }}
        />
      </svg>
    </div>
  );
}
