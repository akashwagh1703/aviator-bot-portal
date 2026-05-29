/** Small shared helpers. */

/** Conditionally join class names (lightweight clsx). */
export function cn(...args) {
  return args.flat().filter(Boolean).join(" ");
}

/**
 * Apply a theme config's tokens to the document root as CSS variables.
 * Centralizing this here keeps the theme engine config-driven and avoids
 * dynamic Tailwind class generation (which purge would strip).
 */
export function applyTheme(theme) {
  if (typeof document === "undefined" || !theme?.tokens) return;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(key, value);
  }
  if (theme.gradient) root.style.setProperty("--brand-gradient", theme.gradient);
  if (theme.glow) root.style.setProperty("--glow", theme.glow);
}

/** Format a timestamp as HH:MM for message bubbles. */
export function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
