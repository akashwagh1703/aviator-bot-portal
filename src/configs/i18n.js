/**
 * Internationalization config (config-driven).
 *
 * Bundles UI strings + quick-action prompts for each supported language. The
 * active language also drives speech-recognition locale and a hint appended to
 * the AI system prompt so replies come back in the farmer's language.
 *
 * Kept intentionally small and local (no i18n library) per the lightweight,
 * config-only architecture.
 */

import { Cloud, Sprout, IndianRupee, Landmark } from "lucide-react";

export const languages = [
  { id: "en", label: "English", short: "EN", speechLang: "en-IN", aiHint: "Reply in simple English." },
  { id: "hi", label: "हिंदी", short: "हि", speechLang: "hi-IN", aiHint: "सरल हिंदी में उत्तर दें (Reply in simple Hindi)." },
];

export const DEFAULT_LANG = "en";

export const strings = {
  en: {
    tagline: "Your farming assistant",
    chooseAssistant: "Choose your assistant",
    quickHelp: "How can I help you today?",
    placeholder: "Type or tap the mic to ask…",
    listening: "Listening…",
    speakNow: "Press to speak",
    mute: "Mute voice",
    unmute: "Unmute voice",
    reset: "New chat",
    ready: "Ready",
    thinking: "Thinking",
    speaking: "Speaking",
    happy: "Happy",
  },
  hi: {
    tagline: "आपका खेती सहायक",
    chooseAssistant: "अपना सहायक चुनें",
    quickHelp: "मैं आपकी कैसे मदद करूँ?",
    placeholder: "लिखें या बोलने के लिए माइक दबाएँ…",
    listening: "सुन रहा हूँ…",
    speakNow: "बोलने के लिए दबाएँ",
    mute: "आवाज़ बंद करें",
    unmute: "आवाज़ चालू करें",
    reset: "नई बातचीत",
    ready: "तैयार",
    thinking: "सोच रहा हूँ",
    speaking: "बोल रहा हूँ",
    happy: "खुश",
  },
};

/**
 * Quick-action shortcuts — the bread-and-butter farmer tasks. Each provides a
 * localized label + the message to send to the AI.
 */
export const quickActions = [
  {
    id: "weather",
    icon: Cloud,
    color: "#0288D1",
    label: { en: "Weather", hi: "मौसम" },
    prompt: {
      en: "What's the weather forecast for farming this week and any advice?",
      hi: "इस सप्ताह खेती के लिए मौसम का पूर्वानुमान और सलाह क्या है?",
    },
  },
  {
    id: "crop",
    icon: Sprout,
    color: "#43A047",
    label: { en: "Crop help", hi: "फसल सहायता" },
    prompt: {
      en: "My crop leaves are turning yellow. What could be the problem and the remedy?",
      hi: "मेरी फसल की पत्तियाँ पीली हो रही हैं। समस्या और उपाय क्या हो सकता है?",
    },
  },
  {
    id: "market",
    icon: IndianRupee,
    color: "#F9A825",
    label: { en: "Market price", hi: "मंडी भाव" },
    prompt: {
      en: "Give me general guidance on checking today's mandi market prices for my crops.",
      hi: "मेरी फसलों के लिए आज के मंडी भाव जानने हेतु सामान्य मार्गदर्शन दें।",
    },
  },
  {
    id: "scheme",
    icon: Landmark,
    color: "#6D4C41",
    label: { en: "Govt schemes", hi: "सरकारी योजना" },
    prompt: {
      en: "Tell me about useful government schemes and subsidies for farmers.",
      hi: "किसानों के लिए उपयोगी सरकारी योजनाओं और सब्सिडी के बारे में बताएँ।",
    },
  },
];

export function getStrings(lang) {
  return strings[lang] || strings[DEFAULT_LANG];
}

export function getLanguage(id) {
  return languages.find((l) => l.id === id) || languages[0];
}
