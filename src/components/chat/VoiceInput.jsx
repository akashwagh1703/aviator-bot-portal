"use client";

/**
 * VoiceInput — prominent animated mic button using browser speech recognition.
 *
 * Voice-first: recognized text is auto-sent via onTranscript. Hidden when the
 * API is unsupported; surfaces permission/other errors through onError (toasts).
 * Listening state is mirrored to the store so the avatar reacts.
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useAssistantStore } from "@/store/useAssistantStore";

export default function VoiceInput({ lang = "en-IN", disabled, onTranscript, onError }) {
  const setListening = useAssistantStore((s) => s.setListening);

  const { supported, listening, start, stop } = useSpeechRecognition({
    lang,
    onResult: (text) => onTranscript?.(text),
    onError: (e) => {
      const code = e?.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        onError?.("Microphone permission denied. Please enable it in your browser settings.");
      } else if (code === "no-speech") {
        onError?.("I didn't hear anything. Please try again.");
      } else if (code && code !== "aborted") {
        onError?.("Voice input failed. Please try again.");
      }
    },
  });

  // Keep the global listening flag in sync (drives avatar emotion).
  useEffect(() => {
    setListening(listening);
  }, [listening, setListening]);

  if (!supported) return null;

  const toggle = () => (listening ? stop() : start());

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      aria-label={listening ? "Stop listening" : "Speak"}
      aria-pressed={listening}
      className={
        "relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40"
      }
      style={
        listening
          ? { background: "#E53935" }
          : { background: "var(--brand-gradient)" }
      }
    >
      {listening && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl"
          style={{ background: "#E53935" }}
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
      <Mic className="relative h-5 w-5" />
    </motion.button>
  );
}
