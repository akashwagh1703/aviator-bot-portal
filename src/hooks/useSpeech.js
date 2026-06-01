"use client";

/**
 * useSpeech — Indian TTS with server neural voices + browser fallback.
 *
 * Video avatars: audio and talk-clip start/stop in the same tick via videoSync.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { pickBrowserVoice, resolveNeuralVoice } from "@/lib/tts/resolveVoice";
import { textForSpeech } from "@/lib/tts/sanitize";
import { unlockAudioPlayback } from "@/lib/tts/audioUnlock";
import {
  startBrowserTalkSync,
  startSyncedPlayback,
  stopAvatarTalkVideo,
  stopSyncedPlayback,
} from "@/lib/tts/videoSync";

export function useSpeech({ onStart, onEnd, onError } = {}) {
  const [browserSupported, setBrowserSupported] = useState(false);
  const [voicesList, setVoicesList] = useState([]);
  const abortRef = useRef(null);
  const audioRef = useRef(null);
  const utterRef = useRef(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      setBrowserSupported(true);
      const loadVoices = () => setVoicesList(window.speechSynthesis.getVoices());
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    };
  }, []);

  const finishPlayback = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    stopSyncedPlayback();
    onEnd?.();
  }, [onEnd]);

  const stopAudio = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
      if (audio._blobUrl) URL.revokeObjectURL(audio._blobUrl);
      audioRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    const wasActive = activeRef.current;
    stopAudio();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (wasActive) finishPlayback();
  }, [stopAudio, finishPlayback]);

  const speakWithEdge = useCallback(
    (text, voiceConfig, { onAudioStart, onAudioEnd } = {}) =>
      new Promise((resolve, reject) => {
        const controller = new AbortController();
        abortRef.current = controller;

        const neuralVoice = resolveNeuralVoice(voiceConfig);

        fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voice: neuralVoice,
            rate: voiceConfig.edgeRate,
            pitch: voiceConfig.edgePitch,
            volume: voiceConfig.edgeVolume,
          }),
          signal: controller.signal,
        })
          .then(async (res) => {
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error || "TTS request failed.");
            }
            return res.blob();
          })
          .then(async (blob) => {
            if (controller.signal.aborted) {
              resolve();
              return;
            }

            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio._blobUrl = url;
            audioRef.current = audio;

            audio.onended = () => {
              URL.revokeObjectURL(url);
              audioRef.current = null;
              onAudioEnd?.();
              resolve();
            };
            audio.onerror = () => {
              URL.revokeObjectURL(url);
              audioRef.current = null;
              reject(new Error("Audio playback failed."));
            };

            await new Promise((resolve) => {
              if (audio.readyState >= 1) resolve();
              else audio.addEventListener("loadedmetadata", resolve, { once: true });
            });

            await unlockAudioPlayback();
            const audioOk = await startSyncedPlayback(audio);
            if (controller.signal.aborted) {
              resolve();
              return;
            }
            if (audioOk) {
              onAudioStart?.();
            } else {
              reject(new Error("Audio playback was blocked by the browser."));
            }
          })
          .catch((err) => {
            if (err.name === "AbortError") resolve();
            else reject(err);
          });
      }),
    []
  );

  const speakWithBrowser = useCallback(
    async (text, voiceConfig = {}) => {
      if (!browserSupported || typeof window === "undefined") return;

      try {
        window.speechSynthesis.cancel();
      } catch {}

      const utter = new SpeechSynthesisUtterance(text);
      const voice = pickBrowserVoice(voicesList, voiceConfig);
      if (voice) utter.voice = voice;
      utter.lang = voiceConfig.lang || voice?.lang || "en-IN";
      utter.pitch = voiceConfig.pitch ?? 1;
      utter.rate = voiceConfig.rate ?? 1;
      utter.volume = voiceConfig.volume ?? 1;

      utter.onstart = async () => {
        await startBrowserTalkSync();
        onStart?.();
      };
      utter.onend = () => finishPlayback();
      utter.onerror = (e) => {
        if (e?.error === "interrupted" || e?.error === "canceled") {
          finishPlayback();
        } else {
          onError?.(e);
          finishPlayback();
        }
      };

      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
    },
    [browserSupported, voicesList, onStart, onError, finishPlayback]
  );

  const speak = useCallback(
    async (text, voiceConfig = {}, { muted = false } = {}) => {
      const spoken = textForSpeech(text);
      cancel();

      if (!spoken || muted) return;

      await unlockAudioPlayback();
      activeRef.current = true;
      const useEdge = voiceConfig.provider !== "browser";

      if (useEdge) {
        try {
          await speakWithEdge(spoken, voiceConfig, {
            onAudioStart: onStart,
            onAudioEnd: finishPlayback,
          });
          return;
        } catch (err) {
          stopAudio();
          stopAvatarTalkVideo();
          if (err.name === "AbortError") {
            activeRef.current = false;
            return;
          }
        }
      }

      if (browserSupported) {
        try {
          await speakWithBrowser(spoken, voiceConfig);
        } catch {
          activeRef.current = false;
          onError?.(new Error("Speech playback failed."));
        }
        return;
      }

      activeRef.current = false;
      onError?.(new Error("No TTS available."));
    },
    [cancel, stopAudio, speakWithEdge, speakWithBrowser, browserSupported, onStart, finishPlayback, onError]
  );

  return {
    supported: true,
    browserSupported,
    speak,
    cancel,
    voices: voicesList,
  };
}
