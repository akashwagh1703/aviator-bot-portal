"use client";

/**
 * AssistantApp — top-level client orchestrator.
 *
 * Ties together character config, theme engine, speech (TTS), chat streaming
 * and audio management. Rendering is gated on `mounted` to avoid hydration
 * mismatches from the persisted (localStorage) store.
 *
 * Audio rules enforced here:
 *  - stop speech before switching characters
 *  - cancel speech on unmount
 *  - respect the mute toggle
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import Header from "./Header";
import Avatar from "@/components/avatar/Avatar";
import CharacterSelector from "@/components/avatar/CharacterSelector";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { useToast } from "@/components/ui/Toast";

import { useAssistantStore } from "@/store/useAssistantStore";
import { useSpeech } from "@/hooks/useSpeech";
import { useChat } from "@/hooks/useChat";
import { resolveCharacter } from "@/configs";
import { applyTheme } from "@/lib/utils";

export default function AssistantApp() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const avatarId = useAssistantStore((s) => s.avatarId);
  const muted = useAssistantStore((s) => s.muted);
  const loading = useAssistantStore((s) => s.loading);
  const toggleMute = useAssistantStore((s) => s.toggleMute);
  const resetConversation = useAssistantStore((s) => s.resetConversation);
  const setSpeaking = useAssistantStore((s) => s.setSpeaking);

  const character = useMemo(() => resolveCharacter(avatarId), [avatarId]);

  // Speech engine — sync speaking state to the store so the avatar animates.
  const speechWarned = useRef(false);
  const { supported: ttsSupported, speak, cancel } = useSpeech({
    onStart: () => setSpeaking(true),
    onEnd: () => setSpeaking(false),
    onError: () => toast("Voice playback failed.", "error"),
  });

  const { send } = useChat({
    personality: character.personality,
    voice: character.voice,
    speak,
    muted,
    onError: (msg) => toast(msg, "error"),
  });

  useEffect(() => setMounted(true), []);

  // Apply theme whenever the character (theme) changes.
  useEffect(() => {
    applyTheme(character.theme);
  }, [character.theme]);

  // Warn once if TTS isn't supported by the browser.
  useEffect(() => {
    if (mounted && !ttsSupported && !speechWarned.current) {
      speechWarned.current = true;
      toast("Voice output isn't supported in this browser. Text still works.", "info");
    }
  }, [mounted, ttsSupported, toast]);

  // Cancel any speech when the component unmounts.
  useEffect(() => () => cancel(), [cancel]);

  const handleSwitch = () => {
    cancel(); // stop audio before switching characters
    setSpeaking(false);
  };

  const handleMute = () => {
    if (!muted) cancel(); // muting should silence current speech immediately
    toggleMute();
  };

  const handleReset = () => {
    cancel();
    setSpeaking(false);
    resetConversation();
  };

  if (!mounted) {
    // Lightweight placeholder until the persisted store hydrates.
    return (
      <div className="grid min-h-[100svh] place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <Header onMuteToggle={handleMute} onReset={handleReset} />

      <main className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-[minmax(280px,0.85fr)_1.15fr] lg:gap-6">
        {/* Avatar stage */}
        <motion.section
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[var(--radius)] p-6 md:sticky md:top-6 md:self-start"
          aria-label="Assistant avatar"
        >
          {/* top accent wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-50"
            style={{ background: "radial-gradient(80% 100% at 50% 0%, rgb(var(--accent) / 0.25), transparent 70%)" }}
          />
          <Avatar character={character} />
          <div className="w-full">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-ink/40">
              Choose your assistant
            </p>
            <CharacterSelector onSwitch={handleSwitch} />
          </div>
        </motion.section>

        {/* Chat panel */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="glass flex min-h-[62svh] flex-col gap-3 rounded-[var(--radius)] p-4 sm:p-5 md:min-h-0"
        >
          <ChatWindow accent={character.avatar.accent} />
          <ChatInput
            accent={character.avatar.accent}
            disabled={loading}
            onSend={send}
            onVoiceError={(msg) => toast(msg, "error")}
          />
        </motion.section>
      </main>
    </div>
  );
}
