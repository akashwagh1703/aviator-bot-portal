/**
 * Avatar (character) configuration — farming assistants.
 *
 * An avatar ties together the visual renderer, a voice, a personality and a
 * theme. `render` selects the avatar-engine renderer; `accent`/`accent2` tint
 * the SVG independently of the active UI theme.
 */

export const avatars = [
  {
    id: "aviator",
    name: "Aviator",
    tagline: "Your AI farm pilot",
    avatar: "/avatars/aviatorv1.png",
    image: "/avatars/aviatorv1.png",
    render: "aviator",
    accent: "#9ACD32",
    accent2: "#FFFFFF",
    voice: "clear-male",
    personality: "mitra",
    theme: "green",
  },
  {
    id: "farmerbot",
    name: "Farmer Bot",
    tagline: "Smart farm companion",
    avatar: "/avatars/farmerBot-v3.svg", // rigged source art (also used as selector thumbnail)
    image: "/avatars/farmerBot-v3.svg",
    render: "farmer", // fully rigged renderer with real facial animation
    accent: "#43A047",
    accent2: "#F9A825",
    voice: "clear-male",
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
    id: "kisan-video",
    name: "Digital Mitra",
    tagline: "Photoreal farm guide",
    avatar: "/avatars/kisan-mitra-poster.jpg",
    image: "/avatars/kisan-mitra-poster.jpg",
    poster: "/avatars/kisan-mitra-poster.jpg",
    video: "/avatars/kisan-mitra.mp4",
    videoWebm: "/avatars/kisan-mitra.webm",
    videoSegments: {
      idle: [0, 2.5],
      talk: [3.2, 9.5],
      cycleSec: 4.2,
    },
    render: "video",
    frame: "wide",
    accent: "#2E7D32",
    accent2: "#F9A825",
    voice: "clear-male",
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

export const DEFAULT_AVATAR = "aviator";

export function getAvatar(id) {
  return avatars.find((a) => a.id === id) || avatars[0];
}
