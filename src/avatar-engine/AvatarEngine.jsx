"use client";

/**
 * AvatarEngine — drives the shared animation primitives (blink + mouth) and
 * delegates the actual drawing to a registered renderer.
 *
 * Naturalness strategy:
 *  - Blinking runs on a self-rescheduling timeout with a human-like random
 *    cadence (~2.6–6s) and an occasional quick double-blink. Each blink is a
 *    fast close→open (~110ms).
 *  - Mouth movement only runs a requestAnimationFrame loop *while speaking*.
 *    Targets are refreshed on a speech-like cadence and include frequent near-
 *    closed "pauses" (between words) so it doesn't flap mechanically. Renderers
 *    tween between targets for smooth, organic motion. Torn down instantly when
 *    speaking stops, so idle avatars cost ~0.
 */

import { useEffect, useRef, useState } from "react";
import { getRenderer } from "./index";

export default function AvatarEngine({ renderKey, accent, accent2, emotion, speaking, image }) {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);
  const rafRef = useRef(null);
  const blinkTimer = useRef(null);

  const { component: Renderer } = getRenderer(renderKey);

  // Human-like random blink loop (with occasional double-blink).
  useEffect(() => {
    let active = true;

    const doBlink = (then) => {
      if (!active) return;
      setBlink(true);
      setTimeout(() => {
        if (!active) return;
        setBlink(false);
        then?.();
      }, 110);
    };

    const schedule = () => {
      const delay = 2600 + Math.random() * 3400;
      blinkTimer.current = setTimeout(() => {
        // ~25% of the time, blink twice quickly (very natural).
        if (Math.random() < 0.25) {
          doBlink(() => setTimeout(() => doBlink(schedule), 180));
        } else {
          doBlink(schedule);
        }
      }, delay);
    };

    schedule();
    return () => {
      active = false;
      clearTimeout(blinkTimer.current);
    };
  }, []);

  // Mouth animation only while speaking — natural, speech-like cadence.
  useEffect(() => {
    if (!speaking) {
      cancelAnimationFrame(rafRef.current);
      setMouthOpen(0);
      return;
    }
    let last = 0;
    let nextIn = 0;
    const animate = (t) => {
      if (t - last > nextIn) {
        last = t;
        // Vary the time until the next mouth shape (90–170ms) like syllables.
        nextIn = 90 + Math.random() * 80;
        const r = Math.random();
        // ~22% near-closed pauses (between words), otherwise small→wide openings
        // weighted toward mid openings for realism.
        const target = r < 0.22 ? 0.04 + Math.random() * 0.08 : 0.25 + Math.random() * 0.65;
        setMouthOpen(target);
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
