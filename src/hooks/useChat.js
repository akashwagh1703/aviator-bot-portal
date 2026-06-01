"use client";

/**
 * useChat — orchestrates a single send/stream/speak cycle.
 *
 * Flow:
 *  1. push the user message + an empty assistant placeholder
 *  2. POST context to /api/chat and read the streamed text deltas
 *  3. append deltas to the placeholder so it renders progressively
 *  4. on completion, hand the full text to the provided `speak` callback
 *
 * Errors (network / API / empty response) are reported via onError so the UI
 * can show a toast, and the placeholder is filled with a graceful message.
 */

import { useCallback, useRef } from "react";
import { useAssistantStore } from "@/store/useAssistantStore";
import { unlockAudioPlayback } from "@/lib/tts/audioUnlock";

export function useChat({ personality, voice, speak, muted, langHint, onError } = {}) {
  const abortRef = useRef(null);

  const addMessage = useAssistantStore((s) => s.addMessage);
  const appendToMessage = useAssistantStore((s) => s.appendToMessage);
  const updateMessage = useAssistantStore((s) => s.updateMessage);
  const setLoading = useAssistantStore((s) => s.setLoading);
  const getContextMessages = useAssistantStore((s) => s.getContextMessages);
  const loading = useAssistantStore((s) => s.loading);

  const send = useCallback(
    async (text) => {
      const content = (text || "").trim();
      if (!content || loading) return;

      void unlockAudioPlayback();
      addMessage({ role: "user", content });
      const context = getContextMessages();
      const assistantId = addMessage({ role: "assistant", content: "", streaming: true });
      setLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: context,
            system: [personality?.systemPrompt, langHint].filter(Boolean).join(" "),
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "The AI service returned an error.");
        }
        if (!res.body) throw new Error("No response stream received.");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            full += chunk;
            appendToMessage(assistantId, chunk);
          }
        }

        if (!full.trim()) {
          const fallback = "Hmm, I didn't catch a response. Could you try asking again?";
          updateMessage(assistantId, { content: fallback, streaming: false });
          speak?.(fallback, voice, { muted });
        } else {
          updateMessage(assistantId, { streaming: false });
          speak?.(full, voice, { muted });
        }
      } catch (err) {
        if (err.name === "AbortError") {
          updateMessage(assistantId, { streaming: false });
        } else {
          const msg = err.message || "Something went wrong reaching the AI.";
          updateMessage(assistantId, {
            content: "Sorry, I couldn't reach the AI right now. Please try again in a moment.",
            streaming: false,
            error: true,
          });
          onError?.(msg);
        }
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [
      loading,
      addMessage,
      getContextMessages,
      setLoading,
      appendToMessage,
      updateMessage,
      personality,
      voice,
      speak,
      muted,
      langHint,
      onError,
    ]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { send, stop };
}
