/**
 * Strip markdown / noisy formatting before sending text to TTS engines.
 */
export function textForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[-–—•●▪]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
