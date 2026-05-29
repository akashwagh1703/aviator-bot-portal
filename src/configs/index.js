/**
 * Centralized configuration access.
 *
 * Everything config-driven funnels through here so components never import raw
 * config files directly. Also centralizes environment-derived settings, keeping
 * a single source of truth that is easy to swap for a DB/API later.
 */

import { avatars, getAvatar, DEFAULT_AVATAR } from "./avatars";
import { voices, getVoice, DEFAULT_VOICE } from "./voices";
import { personalities, getPersonality, DEFAULT_PERSONALITY } from "./personalities";
import { themes, getTheme, DEFAULT_THEME } from "./themes";
import {
  languages,
  strings,
  quickActions,
  getStrings,
  getLanguage,
  DEFAULT_LANG,
} from "./i18n";

export const appConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Kisan Saathi",
  maxHistory: 20,
  storageKey: "kisan-assistant-state-v2",
};

/**
 * Resolve a full, denormalized character profile from an avatar id.
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
  languages,
  strings,
  quickActions,
  getStrings,
  getLanguage,
  DEFAULT_LANG,
};
