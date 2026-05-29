"use client";

/**
 * AvatarEngine — drives the shared animation primitives (blink + mouth) and
 * delegates the actual drawing to a registered renderer.
 *
 * Animation strategy (performance-minded):
 *  - Blinking runs on a self-rescheduling timeout (random cadence), not a
 *    per-frame loop.
 *  - Mouth movement only runs a requestAnimationFrame loop *while speaking*,
 *    and is torn down the instant speaking stops, so idle avatars cost ~0.
 */

import { useEffect, useRef, useState } from "react";
import { getRenderer } from "./index";

export default function AvatarEngine({ renderKey, accent, accent2, emotion, speaking, image }) {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);
  const rafRef = useRef(null);
  const blinkTimer = useRef(null);

  const { component: Renderer } = getRenderer(renderKey);

  // Random blink loop
  useEffect(() => {
    let active = true;
    const scheduleBlink = () => {
      const delay = 2200 + Math.random() * 2800;
      blinkTimer.current = setTimeout(() => {
        if (!active) return;
        setBlink(true);
        setTimeout(() => active && setBlink(false), 120);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => {
      active = false;
      clearTimeout(blinkTimer.current);
    };
  }, []);

  // Mouth animation only while speaking
  useEffect(() => {
    if (!speaking) {
      cancelAnimationFrame(rafRef.current);
      setMouthOpen(0);
      return;
    }
    let last = 0;
    const animate = (t) => {
      // Pseudo-random talking cadence (~12 updates/sec) for natural mouth motion.
      if (t - last > 80) {
        last = t;
        setMouthOpen(0.25 + Math.random() * 0.75);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speaking]);

  return (
    <Renderer
      accent={accent}
      accent2={accent2}
      blink={blink}
      mouthOpen={mouthOpen}
      emotion={emotion}
      speaking={speaking}
      image={image}
    />
  );
}
