"use client";

/**
 * useSpeechRecognition — wraps the browser SpeechRecognition API (webkit/standard).
 *
 * Gracefully reports `supported = false` when unavailable so the UI can hide or
 * disable the mic. Surfaces transcript + listening state and handles permission
 * / no-speech errors via the onError callback.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechRecognition({ lang = "en-US", onResult, onError, onEnd } = {}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0]?.transcript || "")
        .join(" ")
        .trim();
      if (transcript) onResult?.(transcript);
    };
    recognition.onerror = (event) => {
      setListening(false);
      onError?.(event);
    };
    recognition.onend = () => {
      setListening(false);
      onEnd?.();
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.abort();
      } catch {}
      recognitionRef.current = null;
    };
    // Re-init when language changes; callbacks are read fresh via refs below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const start = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec || listening) return;
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      onError?.(e);
    }
  }, [listening, onError]);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch {}
    setListening(false);
  }, []);

  return { supported, listening, start, stop };
}
