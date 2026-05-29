"use client";

/**
 * Global assistant state (Zustand).
 *
 * Holds the selected character, current emotion/voice, audio prefs and the chat
 * history. Conversation + selected character survive page refresh via the
 * `persist` middleware backed by localStorage. UI/runtime-only fields (emotion,
 * speaking, loading) are intentionally NOT persisted to avoid stale states and
 * hydration mismatches.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { appConfig, DEFAULT_AVATAR, DEFAULT_LANG, getAvatar, getPersonality } from "@/configs";

export const EMOTIONS = {
  IDLE: "idle",
  HAPPY: "happy",
  THINKING: "thinking",
  TALKING: "talking",
  LISTENING: "listening",
};

let idSeq = 0;
const newId = () => `${Date.now()}-${idSeq++}`;

function greetingMessage(avatarId) {
  const avatar = getAvatar(avatarId);
  const personality = getPersonality(avatar.personality);
  return {
    id: newId(),
    role: "assistant",
    content: personality.greeting,
    createdAt: Date.now(),
  };
}

export const useAssistantStore = create(
  persist(
    (set, get) => ({
      // --- persisted ---
      avatarId: DEFAULT_AVATAR,
      lang: DEFAULT_LANG,
      muted: false,
      messages: [greetingMessage(DEFAULT_AVATAR)],

      // --- runtime only ---
      emotion: EMOTIONS.IDLE,
      speaking: false,
      listening: false,
      loading: false,

      // --- character ---
      setAvatar: (avatarId) => {
        if (avatarId === get().avatarId) return;
        set({
          avatarId,
          emotion: EMOTIONS.IDLE,
          speaking: false,
          listening: false,
        });
      },

      // --- language ---
      setLang: (lang) => set({ lang }),

      // --- audio prefs ---
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      setMuted: (muted) => set({ muted }),

      // --- emotion / runtime flags ---
      setEmotion: (emotion) => set({ emotion }),
      setSpeaking: (speaking) =>
        set((s) => ({
          speaking,
          emotion: speaking
            ? EMOTIONS.TALKING
            : s.listening
            ? EMOTIONS.LISTENING
            : s.loading
            ? EMOTIONS.THINKING
            : EMOTIONS.IDLE,
        })),
      setListening: (listening) =>
        set((s) => ({
          listening,
          emotion: listening ? EMOTIONS.LISTENING : s.speaking ? EMOTIONS.TALKING : EMOTIONS.IDLE,
        })),
      setLoading: (loading) =>
        set((s) => ({
          loading,
          emotion: loading ? EMOTIONS.THINKING : s.speaking ? EMOTIONS.TALKING : EMOTIONS.IDLE,
        })),

      // --- messages ---
      addMessage: (message) => {
        const msg = { id: newId(), createdAt: Date.now(), ...message };
        set((s) => ({ messages: [...s.messages, msg] }));
        return msg.id;
      },
      updateMessage: (id, patch) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      appendToMessage: (id, chunk) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, content: (m.content || "") + chunk } : m
          ),
        })),
      resetConversation: () => set({ messages: [greetingMessage(get().avatarId)] }),

      /**
       * Build the trimmed message array (most recent `maxHistory`) for the API.
       * Excludes any still-empty streaming placeholders.
       */
      getContextMessages: () => {
        const msgs = get().messages.filter((m) => m.content && m.content.trim().length > 0);
        return msgs.slice(-appConfig.maxHistory).map((m) => ({
          role: m.role,
          content: m.content,
        }));
      },
    }),
    {
      name: appConfig.storageKey,
      storage: createJSONStorage(() => localStorage),
      // Only persist durable fields; runtime flags reset on each load.
      partialize: (s) => ({
        avatarId: s.avatarId,
        lang: s.lang,
        muted: s.muted,
        messages: s.messages,
      }),
    }
  )
);
