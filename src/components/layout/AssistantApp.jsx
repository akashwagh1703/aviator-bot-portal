"use client";

/**
 * AssistantApp — top-level client orchestrator.
 *
 * Ties together character config, theme engine, language, speech (TTS), chat
 * streaming and audio management.
 *
 * Audio rules enforced here:
 *  - stop speech before switching characters / language
 *  - cancel speech on unmount
 *  - respect the mute toggle
 */

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

import Header from "./Header";
import Avatar from "@/components/avatar/Avatar";
import CharacterSelector from "@/components/avatar/CharacterSelector";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import QuickActions from "@/components/chat/QuickActions";
import { useToast } from "@/components/ui/Toast";

import { useAssistantStore } from "@/store/useAssistantStore";
import { useSpeech } from "@/hooks/useSpeech";
import { useChat } from "@/hooks/useChat";
import { resolveCharacter, getLanguage, getStrings } from "@/configs";
import { applyTheme } from "@/lib/utils";

export default function AssistantApp() {
  const { toast } = useToast();

  const avatarId = useAssistantStore((s) => s.avatarId);
  const lang = useAssistantStore((s) => s.lang);
  const muted = useAssistantStore((s) => s.muted);
  const loading = useAssistantStore((s) => s.loading);
  const toggleMute = useAssistantStore((s) => s.toggleMute);
  const resetConversation = useAssistantStore((s) => s.resetConversation);
  const setSpeaking = useAssistantStore((s) => s.setSpeaking);

  const character = useMemo(() => resolveCharacter(avatarId), [avatarId]);
  const language = getLanguage(lang);
  const t = getStrings(lang);

  // Voice config follows the selected language locale for better pronunciation.
  const voice = useMemo(
    () => ({ ...character.voice, lang: language.speechLang }),
    [character.voice, language.speechLang]
  );

  const speechWarned = useRef(false);
  const { supported: ttsSupported, speak, cancel } = useSpeech({
    onStart: () => setSpeaking(true),
    onEnd: () => setSpeaking(false),
    onError: () => toast("Voice playback failed.", "error"),
  });

  const { send } = useChat({
    personality: character.personality,
    voice,
    langHint: language.aiHint,
    speak,
    muted,
    onError: (msg) => toast(msg, "error"),
  });

  // Apply theme whenever the character (theme) changes.
  useEffect(() => {
    applyTheme(character.theme);
  }, [character.theme]);

  useEffect(() => {
    if (!ttsSupported && !speechWarned.current) {
      speechWarned.current = true;
      toast("Voice output isn't supported in this browser. Text still works.", "info");
    }
  }, [ttsSupported, toast]);

  useEffect(() => () => cancel(), [cancel]);

  const handleSwitch = () => {
    cancel();
    setSpeaking(false);
  };

  const handleMute = () => {
    if (!muted) cancel();
    toggleMute();
  };

  const handleReset = () => {
    cancel();
    setSpeaking(false);
    resetConversation();
  };

  const handleLangChange = () => {
    cancel();
    setSpeaking(false);
  };

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <Header onMuteToggle={handleMute} onReset={handleReset} onLangChange={handleLangChange} />

      <main className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-[minmax(280px,0.85fr)_1.15fr] lg:gap-6">
        {/* Avatar stage */}
        <motion.section
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[var(--radius)] p-6 md:sticky md:top-6 md:self-start"
          aria-label="Assistant avatar"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-36 opacity-60"
            style={{ background: "radial-gradient(80% 100% at 50% 0%, rgb(var(--accent) / 0.14), transparent 70%)" }}
          />
          <Avatar character={character} />
          <div className="w-full">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink/40">
              {t.chooseAssistant}
            </p>
            <CharacterSelector onSwitch={handleSwitch} />
          </div>
        </motion.section>

        {/* Chat panel */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="card flex min-h-[62svh] flex-col gap-3 rounded-[var(--radius)] p-4 sm:p-5 md:min-h-0"
        >
          <ChatWindow accent={character.avatar.accent} />

          <div className="space-y-2.5">
            <QuickActions disabled={loading} onAction={send} />
            <ChatInput
              accent={character.avatar.accent}
              disabled={loading}
              onSend={send}
              onVoiceError={(msg) => toast(msg, "error")}
            />
          </div>
        </motion.section>
      </main>
    </div>
  );
}
