"use client";

/**
 * AvatarEngine — drives blink + mouth primitives for all renderers.
 *
 * Mouth uses per-frame lerp toward syllable-like targets so motion eases in/out
 * instead of snapping. Blink keeps human-like random cadence with double-blinks.
 */

import { useEffect, useRef, useState } from "react";
import { getRenderer } from "./index";

const MOUTH_LERP = 0.16;
const MOUTH_IDLE_LERP = 0.12;

function nextMouthTarget(state, isPhotoreal) {
  const r = Math.random();

  if (state.syllablesLeft <= 0) {
    if (r < 0.26) {
      state.syllablesLeft = 0;
      return {
        target: isPhotoreal ? 0.01 + Math.random() * 0.03 : 0.03 + Math.random() * 0.09,
        delay: isPhotoreal ? 160 + Math.random() * 220 : 140 + Math.random() * 200,
      };
    }
    state.syllablesLeft = 2 + Math.floor(Math.random() * 5);
  } else {
    state.syllablesLeft -= 1;
  }

  const roll = Math.random();
  const target = isPhotoreal
    ? roll < 0.3
      ? 0.02 + Math.random() * 0.05
      : 0.07 + Math.random() * 0.28
    : roll < 0.15
      ? 0.12 + Math.random() * 0.18
      : roll < 0.55
        ? 0.28 + Math.random() * 0.32
        : 0.45 + Math.random() * 0.4;

  return { target, delay: isPhotoreal ? 85 + Math.random() * 90 : 72 + Math.random() * 78 };
}

export default function AvatarEngine({
  renderKey,
  accent,
  accent2,
  emotion,
  speaking,
  image,
  video,
  videoWebm,
  poster,
  segments,
}) {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);
  const rafRef = useRef(null);
  const blinkTimer = useRef(null);
  const mouthRef = useRef(0);
  const isVideo = renderKey === "video";
  const isPhotoreal = renderKey === "aviator";

  const { component: Renderer } = getRenderer(renderKey);

  useEffect(() => {
    if (isVideo) return;
    let active = true;

    const doBlink = (then) => {
      if (!active) return;
      setBlink(true);
      setTimeout(() => {
        if (!active) return;
        setBlink(false);
        then?.();
      }, 95 + Math.random() * 35);
    };

    const schedule = () => {
      const delay = 2800 + Math.random() * 3800;
      blinkTimer.current = setTimeout(() => {
        if (Math.random() < 0.22) {
          doBlink(() => setTimeout(() => doBlink(schedule), 160 + Math.random() * 60));
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
  }, [isVideo]);

  useEffect(() => {
    if (isVideo) return;

    if (!speaking) {
      cancelAnimationFrame(rafRef.current);
      const easeClosed = () => {
        const current = mouthRef.current;
        if (current < 0.008) {
          mouthRef.current = 0;
          setMouthOpen(0);
          return;
        }
        mouthRef.current = current * (1 - MOUTH_IDLE_LERP);
        setMouthOpen(mouthRef.current);
        rafRef.current = requestAnimationFrame(easeClosed);
      };
      rafRef.current = requestAnimationFrame(easeClosed);
      return () => cancelAnimationFrame(rafRef.current);
    }

    const speech = { syllablesLeft: 0, target: 0.15, nextAt: 0 };
    let target = 0.2;

    const loop = (t) => {
      if (t >= speech.nextAt) {
        const next = nextMouthTarget(speech, isPhotoreal);
        target = next.target;
        speech.nextAt = t + next.delay;
      }

      const delta = target - mouthRef.current;
      mouthRef.current += delta * MOUTH_LERP;
      setMouthOpen(mouthRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speaking, isVideo, isPhotoreal]);

  return (
    <Renderer
      accent={accent}
      accent2={accent2}
      blink={blink}
      mouthOpen={mouthOpen}
      emotion={emotion}
      speaking={speaking}
      image={image}
      video={video}
      videoWebm={videoWebm}
      poster={poster}
      segments={segments}
    />
  );
}
