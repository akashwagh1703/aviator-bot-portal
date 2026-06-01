/**
 * Voice configuration.
 *
 * Primary TTS: Microsoft Edge neural voices via /api/tts (Indian locales).
 * Fallback: browser SpeechSynthesis with scored Indian voice matching.
 */

export const voices = {
  "warm-female": {
    id: "warm-female",
    name: "Warm Female (Indian)",
    gender: "female",
    lang: "en-IN",
    provider: "edge",
    neural: {
      "en-IN": "en-IN-NeerjaNeural",
      "hi-IN": "hi-IN-SwaraNeural",
    },
    edgeRate: "-6%",
    edgePitch: "+2Hz",
    pitch: 1.05,
    rate: 0.94,
    volume: 1.0,
    prefer: [
      "Neerja",
      "Swara",
      "Heera",
      "Microsoft Swara",
      "Google UK English Female",
      "Female",
      "India",
    ],
  },
  "clear-male": {
    id: "clear-male",
    name: "Clear Male (Indian)",
    gender: "male",
    lang: "en-IN",
    provider: "edge",
    neural: {
      "en-IN": "en-IN-PrabhatNeural",
      "hi-IN": "hi-IN-MadhurNeural",
    },
    edgeRate: "-8%",
    edgePitch: "-1Hz",
    pitch: 0.92,
    rate: 0.92,
    volume: 1.0,
    prefer: [
      "Prabhat",
      "Madhur",
      "Hemant",
      "Microsoft Madhur",
      "Google UK English Male",
      "Male",
      "India",
    ],
  },
  "bright-youth": {
    id: "bright-youth",
    name: "Bright Youth (Indian)",
    gender: "female",
    lang: "en-IN",
    provider: "edge",
    neural: {
      "en-IN": "en-IN-NeerjaNeural",
      "hi-IN": "hi-IN-SwaraNeural",
    },
    edgeRate: "+2%",
    edgePitch: "+4Hz",
    pitch: 1.15,
    rate: 1.02,
    volume: 1.0,
    prefer: ["Neerja", "Swara", "Heera", "Microsoft Swara", "Female", "India"],
  },
};

export const DEFAULT_VOICE = "warm-female";

export function getVoice(id) {
  return voices[id] || voices[DEFAULT_VOICE];
}
