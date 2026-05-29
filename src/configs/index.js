/**
 * Centralized configuration access.
 *
 * Everything config-driven funnels through here so components never import raw
 * config files directly. This also centralizes environment-derived settings,
 * keeping a single source of truth that is easy to swap for a DB/API later.
 */

import { avatars, getAvatar, DEFAULT_AVATAR } from "./avatars";
import { voices, getVoice, DEFAULT_VOICE } from "./voices";
import { personalities, getPersonality, DEFAULT_PERSONALITY } from "./personalities";
import { themes, getTheme, DEFAULT_THEME } from "./themes";

export const appConfig = {
  // NEXT_PUBLIC_ vars are safe to read on the client.
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Aether AI",
  // Session conversation memory cap (number of messages kept for context).
  maxHistory: 20,
  // localStorage key for persisted conversation/character state.
  storageKey: "aether-assistant-state",
};

/**
 * Resolve a full, denormalized character profile from an avatar id.
 * Returns the avatar plus its linked voice, personality and theme objects.
 */
export function resolveCharacter(avatarId) {
  const avatar = getAvatar(avatarId);
  return {
    avatar,
    voice: getVoice(avatar.voice),
    personality: getPersonality(avatar.personality),
    theme: getTheme(avatar.theme),
  };
}

export {
  avatars,
  getAvatar,
  DEFAULT_AVATAR,
  voices,
  getVoice,
  DEFAULT_VOICE,
  personalities,
  getPersonality,
  DEFAULT_PERSONALITY,
  themes,
  getTheme,
  DEFAULT_THEME,
};
