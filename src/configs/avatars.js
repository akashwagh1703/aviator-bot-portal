/**
 * Avatar (character) configuration — farming assistants.
 *
 * An avatar ties together the visual renderer, a voice, a personality and a
 * theme. `render` selects the avatar-engine renderer; `accent`/`accent2` tint
 * the SVG independently of the active UI theme.
 */

export const avatars = [
  {
    id: "farmerbot",
    name: "Farmer Bot",
    tagline: "Smart farm companion",
    avatar: "/avatars/farmerBot.svg",
    image: "/avatars/farmerBot.svg", // pre-made illustration used by the image renderer
    render: "image",
    frame: "wide", // landscape art -> rounded card instead of a circular disc
    accent: "#43A047",
    accent2: "#F9A825",
    voice: "warm-female",
    personality: "mitra",
    theme: "green",
  },
  {
    id: "mitra",
    name: "Kisan Mitra",
    tagline: "Friendly farm guide",
    avatar: "/avatars/mitra.svg",
    render: "human",
    accent: "#2E7D32",
    accent2: "#F9A825",
    voice: "warm-female",
    personality: "mitra",
    theme: "green",
  },
  {
    id: "agrobot",
    name: "AgroBot",
    tagline: "Crop & weather expert",
    avatar: "/avatars/agrobot.svg",
    render: "robot",
    accent: "#0288D1",
    accent2: "#43A047",
    voice: "clear-male",
    personality: "expert",
    theme: "sky",
  },
  {
    id: "fasal",
    name: "Fasal",
    tagline: "Energetic helper",
    avatar: "/avatars/fasal.svg",
    render: "anime",
    accent: "#F57C00",
    accent2: "#43A047",
    voice: "bright-youth",
    personality: "helper",
    theme: "gold",
  },
];

export const DEFAULT_AVATAR = "farmerbot";

export function getAvatar(id) {
  return avatars.find((a) => a.id === id) || avatars[0];
}
