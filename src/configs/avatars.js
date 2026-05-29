/**
 * Avatar (character) configuration.
 *
 * An avatar ties together the visual renderer, a voice, a personality and a
 * theme. The `render` field selects which renderer the avatar-engine uses, so
 * the visual implementation stays decoupled from the character data. `accent`
 * lets each character tint its own SVG independently of the active UI theme.
 */

export const avatars = [
  {
    id: "sophia",
    name: "Sophia",
    tagline: "Friendly companion",
    avatar: "/avatars/sophia.svg", // static asset (fallback / marketplace preview)
    render: "human", // avatar-engine renderer key
    accent: "#ec4899",
    accent2: "#8b5cf6",
    voice: "female-soft",
    personality: "friendly",
    theme: "modern",
  },
  {
    id: "robotx",
    name: "RobotX",
    tagline: "Technical unit",
    avatar: "/avatars/robotx.svg",
    render: "robot",
    accent: "#22d3ee",
    accent2: "#10b981",
    voice: "robot-deep",
    personality: "technical",
    theme: "cyber",
  },
  {
    id: "neo",
    name: "Neo",
    tagline: "Anime sidekick",
    avatar: "/avatars/neo.svg",
    render: "anime",
    accent: "#fb923c",
    accent2: "#f43f5e",
    voice: "anime-bright",
    personality: "energetic",
    theme: "sunset",
  },
];

export const DEFAULT_AVATAR = "sophia";

export function getAvatar(id) {
  return avatars.find((a) => a.id === id) || avatars[0];
}
