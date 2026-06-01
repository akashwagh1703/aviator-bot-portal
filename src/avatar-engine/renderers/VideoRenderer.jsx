"use client";

import { useCallback, useEffect, useRef } from "react";
import { EMOTIONS } from "@/store/useAssistantStore";
import {
  isSyncActive,
  registerAvatarVideo,
  stopAvatarTalkVideo,
  unregisterAvatarVideo,
  updateAvatarSegments,
  warmIdleFrame,
} from "@/lib/tts/videoSync";

/**
 * VideoRenderer — registers <video> for audio-master scrub sync.
 * Idle shows the video's first frame (poster); talk frames follow TTS clock.
 */
export default function VideoRenderer({
  video,
  videoWebm,
  poster,
  speaking,
  emotion,
  segments,
}) {
  const ref = useRef(null);
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;

  const pauseAtIdle = useCallback(() => {
    if (isSyncActive()) return;
    stopAvatarTalkVideo();
  }, []);

  useEffect(() => {
    updateAvatarSegments(segmentsRef.current);
  }, [segments]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerAvatarVideo(el, segmentsRef.current);
    el.load();
    void warmIdleFrame();

    return () => {
      stopAvatarTalkVideo();
      unregisterAvatarVideo(el);
    };
  }, [video, videoWebm]);

  useEffect(() => {
    if (!speaking) pauseAtIdle();
  }, [speaking, pauseAtIdle]);

  const listening = emotion === EMOTIONS.LISTENING;
  const thinking = emotion === EMOTIONS.THINKING;
  const happy = emotion === EMOTIONS.HAPPY;

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className="h-full w-full select-none object-contain transition-[filter,opacity,transform] duration-300"
      style={{
        opacity: listening || thinking ? 0.88 : 1,
        filter: listening
          ? "saturate(0.8) brightness(0.92) hue-rotate(-4deg)"
          : thinking
          ? "saturate(0.85) brightness(0.95)"
          : happy
          ? "saturate(1.08) brightness(1.03)"
          : "none",
        transform: listening ? "scale(0.985)" : "scale(1)",
      }}
    >
      {videoWebm ? <source src={videoWebm} type="video/webm" /> : null}
      {video ? <source src={video} type="video/mp4" /> : null}
    </video>
  );
}
