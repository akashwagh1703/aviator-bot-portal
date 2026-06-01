/** Unlock browser audio playback (requires a recent user gesture). */
let unlocked = false;

export async function unlockAudioPlayback() {
  if (typeof window === "undefined" || unlocked) return true;

  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      const ctx = new Ctx();
      await ctx.resume();
      await ctx.close();
    }

    const silent = new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="
    );
    silent.volume = 0.01;
    await silent.play();
    unlocked = true;
    return true;
  } catch {
    return false;
  }
}

export function isAudioUnlocked() {
  return unlocked;
}
