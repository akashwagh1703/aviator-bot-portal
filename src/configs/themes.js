/**
 * Theme configuration.
 *
 * Themes are fully config-driven. Each theme exposes a set of design tokens
 * (colors as "R G B" strings so they compose with Tailwind's <alpha-value>,
 * plus a few gradient/glow strings). The active theme is applied at runtime by
 * writing these tokens to CSS variables on <html>, so adding a new theme never
 * requires touching component code.
 */

export const themes = {
  modern: {
    id: "modern",
    name: "Modern",
    tokens: {
      "--base": "9 9 18",
      "--surface": "20 20 35",
      "--accent": "139 92 246", // violet
      "--accent-2": "236 72 153", // pink
      "--text": "237 237 245",
      "--muted": "150 150 170",
    },
    gradient: "linear-gradient(130deg, #6d28d9 0%, #db2777 50%, #7c3aed 100%)",
    glow: "139 92 246",
  },
  cyber: {
    id: "cyber",
    name: "Cyber",
    tokens: {
      "--base": "5 12 20",
      "--surface": "12 24 38",
      "--accent": "34 211 238", // cyan
      "--accent-2": "16 185 129", // emerald
      "--text": "224 242 247",
      "--muted": "130 160 175",
    },
    gradient: "linear-gradient(130deg, #06b6d4 0%, #10b981 50%, #0ea5e9 100%)",
    glow: "34 211 238",
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    tokens: {
      "--base": "20 8 14",
      "--surface": "38 16 24",
      "--accent": "251 146 60", // orange
      "--accent-2": "244 63 94", // rose
      "--text": "253 240 235",
      "--muted": "190 150 140",
    },
    gradient: "linear-gradient(130deg, #f97316 0%, #f43f5e 50%, #fb923c 100%)",
    glow: "251 146 60",
  },
};

export const DEFAULT_THEME = "modern";

export function getTheme(id) {
  return themes[id] || themes[DEFAULT_THEME];
}
