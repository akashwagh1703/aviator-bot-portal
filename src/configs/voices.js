/**
 * Voice configuration.
 *
 * Voices describe how the browser SpeechSynthesis engine should sound for a
 * given character. We can't guarantee a specific OS voice is installed, so each
 * voice provides a `gender` + `prefer` list of voice-name hints; the speech hook
 * picks the best available match and falls back gracefully.
 */

export const voices = {
  "female-soft": {
    id: "female-soft",
    name: "Soft Female",
    gender: "female",
    lang: "en-US",
    pitch: 1.15,
    rate: 1.0,
    volume: 1.0,
    prefer: ["Samantha", "Google US English", "Microsoft Aria", "Zira", "Female"],
  },
  "robot-deep": {
    id: "robot-deep",
    name: "Robotic",
    gender: "male",
    lang: "en-US",
    pitch: 0.6,
    rate: 0.92,
    volume: 1.0,
    prefer: ["Microsoft David", "Google UK English Male", "Daniel", "Male"],
  },
  "anime-bright": {
    id: "anime-bright",
    name: "Bright Youth",
    gender: "female",
    lang: "en-US",
    pitch: 1.4,
    rate: 1.08,
    volume: 1.0,
    prefer: ["Google US English", "Microsoft Aria", "Kyoko", "Female"],
  },
};

export const DEFAULT_VOICE = "female-soft";

export function getVoice(id) {
  return voices[id] || voices[DEFAULT_VOICE];
}
