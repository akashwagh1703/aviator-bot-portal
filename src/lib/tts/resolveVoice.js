/** Default Microsoft Edge neural voices for Indian locales. */
export const INDIAN_NEURAL_DEFAULTS = {
  "en-IN": { female: "en-IN-NeerjaNeural", male: "en-IN-PrabhatNeural" },
  "hi-IN": { female: "hi-IN-SwaraNeural", male: "hi-IN-MadhurNeural" },
};

/**
 * Resolve the Edge TTS neural voice id from character voice config + UI language.
 */
export function resolveNeuralVoice(voiceConfig = {}) {
  const lang = voiceConfig.lang || "en-IN";
  const mapped = voiceConfig.neural?.[lang];
  if (mapped) return mapped;

  const base = lang.split("-")[0];
  const fallbackLang = voiceConfig.neural?.[`${base}-IN`];
  if (fallbackLang) return fallbackLang;

  const gender = voiceConfig.gender === "male" ? "male" : "female";
  const localeDefaults = INDIAN_NEURAL_DEFAULTS[lang] || INDIAN_NEURAL_DEFAULTS["en-IN"];
  return localeDefaults[gender];
}

/**
 * Score browser SpeechSynthesis voices — prefer Indian neural / locale matches.
 */
export function pickBrowserVoice(voicesList, voiceConfig = {}) {
  if (!voicesList?.length) return null;

  const lang = voiceConfig.lang || "en-IN";
  const langBase = lang.split("-")[0];
  const prefer = voiceConfig.prefer || [];
  const wantFemale = voiceConfig.gender === "female";

  let best = null;
  let bestScore = -1;

  for (const voice of voicesList) {
    let score = 0;
    const name = voice.name.toLowerCase();
    const voiceLang = voice.lang || "";

    if (voiceLang === lang) score += 120;
    else if (voiceLang.startsWith(`${langBase}-IN`)) score += 100;
    else if (voiceLang.startsWith(langBase)) score += 60;
    if (voiceLang.includes("-IN")) score += 25;

    for (let i = 0; i < prefer.length; i++) {
      const hint = prefer[i].toLowerCase();
      if (name.includes(hint)) score += 45 - i * 3;
    }

    if (wantFemale && /female|neerja|swara|heera|woman|girl/.test(name)) score += 15;
    if (!wantFemale && /male|prabhat|madhur|hemant|man|boy/.test(name)) score += 15;
    if (/natural|neural|online|google/.test(name)) score += 8;

    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }

  return best;
}
