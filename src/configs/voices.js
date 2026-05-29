/**
 * Voice configuration.
 *
 * Voices describe how the browser SpeechSynthesis engine should sound. We can't
 * guarantee a specific OS voice is installed, so each voice provides a `gender`
 * + `prefer` list of voice-name hints; the speech hook picks the best available
 * match and falls back gracefully. `lang` is overridden at runtime by the
 * selected UI language (e.g. hi-IN) when available.
 */

export const voices = {
  "warm-female": {
    id: "warm-female",
    name: "Warm Female",
    gender: "female",
    lang: "en-IN",
    pitch: 1.1,
    rate: 0.98,
    volume: 1.0,
    prefer: ["Heera", "Google हिन्दी", "Microsoft Swara", "Google US English", "Female"],
  },
  "clear-male": {
    id: "clear-male",
    name: "Clear Male",
    gender: "male",
    lang: "en-IN",
    pitch: 0.95,
    rate: 0.96,
    volume: 1.0,
    prefer: ["Hemant", "Microsoft Madhur", "Google UK English Male", "Ravi", "Male"],
  },
  "bright-youth": {
    id: "bright-youth",
    name: "Bright Youth",
    gender: "female",
    lang: "en-IN",
    pitch: 1.3,
    rate: 1.04,
    volume: 1.0,
    prefer: ["Google हिन्दी", "Microsoft Swara", "Google US English", "Female"],
  },
};

export const DEFAULT_VOICE = "warm-female";

export function getVoice(id) {
  return voices[id] || voices[DEFAULT_VOICE];
}
