/**
 * Theme configuration.
 *
 * Themes are fully config-driven. Each theme exposes a cohesive set of design
 * tokens as "R G B" strings (so they compose with Tailwind's <alpha-value>),
 * plus gradient/glow strings. The active theme is applied at runtime by writing
 * these tokens to CSS variables on <html>, so adding a theme never requires
 * touching component code.
 *
 * Palette principles:
 *  - a deep, near-neutral base for a premium dark UI
 *  - a slightly lifted surface for cards/panels
 *  - two harmonious accents per theme that form the brand gradient
 *  - high-contrast text + a muted variant for secondary copy
 */

export const themes = {
  // Sophia — Aurora: violet → fuchsia on deep indigo.
  modern: {
    id: "modern",
    name: "Aurora",
    tokens: {
      "--base": "14 13 26",
      "--base-2": "20 18 38",
      "--surface": "30 27 56",
      "--border": "255 255 255",
      "--accent": "139 92 246",
      "--accent-2": "232 121 249",
      "--text": "245 243 255",
      "--muted": "166 160 196",
    },
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 55%, #f472b6 100%)",
    glow: "139 92 246",
  },
  // RobotX — Quantum: cyan → blue on deep slate.
  cyber: {
    id: "cyber",
    name: "Quantum",
    tokens: {
      "--base": "8 14 24",
      "--base-2": "12 21 36",
      "--surface": "18 30 50",
      "--border": "255 255 255",
      "--accent": "34 211 238",
      "--accent-2": "59 130 246",
      "--text": "236 246 252",
      "--muted": "148 170 190",
    },
    gradient: "linear-gradient(135deg, #22d3ee 0%, #38bdf8 50%, #3b82f6 100%)",
    glow: "34 211 238",
  },
  // Neo — Ember: amber → rose on warm dark plum.
  sunset: {
    id: "sunset",
    name: "Ember",
    tokens: {
      "--base": "22 13 18",
      "--base-2": "33 18 25",
      "--surface": "48 26 35",
      "--border": "255 255 255",
      "--accent": "251 146 60",
      "--accent-2": "244 63 94",
      "--text": "253 244 240",
      "--muted": "201 168 162",
    },
    gradient: "linear-gradient(135deg, #fbbf24 0%, #fb7185 55%, #f43f5e 100%)",
    glow: "251 146 60",
  },
};

export const DEFAULT_THEME = "modern";

export function getTheme(id) {
  return themes[id] || themes[DEFAULT_THEME];
}
