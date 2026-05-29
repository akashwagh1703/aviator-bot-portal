/**
 * Theme configuration — "Agri" light themes for a farmer audience.
 *
 * Design goals: bright & sunlight-readable, warm and trustworthy, high contrast
 * (WCAG-AA friendly). Themes are fully config-driven via CSS variables written
 * to <html> at runtime.
 *
 * Tokens are "R G B" strings so they compose with Tailwind's <alpha-value>.
 *  - --base / --base-2 : warm off-white page background
 *  - --surface         : white cards
 *  - --border          : DARK ink used at LOW alpha for borders/overlays
 *                        (keeps subtle separators visible on a light bg)
 *  - --accent          : primary brand color (drives buttons, rings)
 *  - --accent-2        : call-to-action / harvest accent
 *  - --text / --muted  : primary + secondary text
 */

const LIGHT_BASE = {
  "--base": "247 245 238", // warm off-white
  "--base-2": "240 242 233",
  "--surface": "255 255 255",
  "--border": "26 43 31", // deep green-ink, used at low alpha
  "--text": "27 43 31", // #1B2B1F
  "--muted": "90 107 93", // #5A6B5D
};

export const themes = {
  // Kisan Mitra — Crop Green (primary brand).
  green: {
    id: "green",
    name: "Kisan",
    tokens: {
      ...LIGHT_BASE,
      "--accent": "46 125 50", // #2E7D32
      "--accent-2": "249 168 37", // #F9A825 harvest gold
    },
    gradient: "linear-gradient(135deg, #2E7D32 0%, #43A047 55%, #F9A825 100%)",
    glow: "46 125 50",
  },
  // AgroBot — Sky/Water (data & weather).
  sky: {
    id: "sky",
    name: "Agro",
    tokens: {
      ...LIGHT_BASE,
      "--accent": "2 136 209", // #0288D1
      "--accent-2": "67 160 71", // #43A047
    },
    gradient: "linear-gradient(135deg, #0288D1 0%, #29B6F6 55%, #43A047 100%)",
    glow: "2 136 209",
  },
  // Fasal — Harvest Gold (energetic helper).
  gold: {
    id: "gold",
    name: "Fasal",
    tokens: {
      ...LIGHT_BASE,
      "--accent": "245 124 0", // #F57C00
      "--accent-2": "67 160 71", // #43A047
    },
    gradient: "linear-gradient(135deg, #F9A825 0%, #F57C00 55%, #43A047 100%)",
    glow: "245 124 0",
  },
};

export const DEFAULT_THEME = "green";

export function getTheme(id) {
  return themes[id] || themes[DEFAULT_THEME];
}
