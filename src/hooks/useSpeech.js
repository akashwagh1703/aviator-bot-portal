"use client";

/**
 * useSpeech — centralized text-to-speech via the browser SpeechSynthesis API.
 *
 * Responsibilities:
 *  - voice resolution from a config voice object (best-match by name hint)
 *  - start/stop/cancel with guaranteed single active utterance (no overlap)
 *  - cleanup on unmount and exposing `supported` for graceful fallback
 *
 * It is intentionally decoupled from the store; the caller wires speaking-state
 * callbacks so the avatar can animate in sync.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeech({ onStart, onEnd, onError } = {}) {
  const [supported, setSupported] = useState(false);
  const [voicesList, setVoicesList] = useState([]);
  const utterRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const loadVoices = () => setVoicesList(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      // Cleanup any in-flight speech when the consumer unmounts.
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
  }, []);

  const pickVoice = useCallback(
    (voiceConfig) => {
      if (!voicesList.length) return null;
      const prefer = voiceConfig?.prefer || [];
      for (const hint of prefer) {
        const match = voicesList.find((v) =>
          v.name.toLowerCase().includes(hint.toLowerCase())
        );
        if (match) return match;
      }
      // Fall back to a voice matching the configured language, else the first.
      return (
        voicesList.find((v) => v.lang === voiceConfig?.lang) ||
        voicesList.find((v) => v.lang?.startsWith("en")) ||
        voicesList[0]
      );
    },
    [voicesList]
  );

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }, []);

  const speak = useCallback(
    (text, voiceConfig = {}, { muted = false } = {}) => {
      if (!supported || !text || muted) {
        // Still fire the lifecycle so UI/emotion state stays consistent.
        onStart?.();
        onEnd?.();
        return;
      }
      // Stop any previous speech before starting new (prevents overlap).
      cancel();

      const utter = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(voiceConfig);
      if (voice) utter.voice = voice;
      utter.lang = voiceConfig.lang || voice?.lang || "en-US";
      utter.pitch = voiceConfig.pitch ?? 1;
      utter.rate = voiceConfig.rate ?? 1;
      utter.volume = voiceConfig.volume ?? 1;

      utter.onstart = () => onStart?.();
      utter.onend = () => onEnd?.();
      utter.onerror = (e) => {
        // "interrupted"/"canceled" happen on normal stop — treat as a clean end.
        if (e?.error === "interrupted" || e?.error === "canceled") {
          onEnd?.();
        } else {
          onError?.(e);
          onEnd?.();
        }
      };

      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
    },
    [supported, pickVoice, cancel, onStart, onEnd, onError]
  );

  return { supported, speak, cancel, voices: voicesList };
}
