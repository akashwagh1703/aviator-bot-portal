"use client";

import { motion } from "framer-motion";

/**
 * ImageRenderer — displays a pre-made avatar illustration (SVG/PNG) supplied via
 * the `image` prop.
 *
 * Used for rich, pre-designed art that isn't broken into addressable parts, so
 * mouth/blink can't be driven. Instead we animate at the container level:
 *  - a gentle idle sway always
 *  - a subtle "talking" bob/scale while speaking
 * The surrounding glow/ring (see Avatar) still reacts to emotion.
 */
export default function ImageRenderer({ image, speaking }) {
  return (
    <motion.img
      src={image}
      alt=""
      draggable={false}
      className="h-full w-full select-none object-contain"
      animate={
        speaking
          ? { scale: [1, 1.035, 1], rotate: [0, 0.6, -0.6, 0] }
          : { scale: [1, 1.012, 1], rotate: 0 }
      }
      transition={{ duration: speaking ? 0.55 : 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
