/**
 * Avatar engine registry (abstraction layer).
 *
 * Maps a renderer key -> a renderer component. This indirection keeps the rest
 * of the app decoupled from any specific avatar technology. SVG renderers are
 * registered today; Lottie / 3D (e.g. react-three-fiber) renderers can be added
 * here later without changing consumers. Renderers are loaded lazily so unused
 * avatar tech never ships in the initial bundle.
 */

import dynamic from "next/dynamic";

export const RENDERER_TYPES = {
  SVG: "svg",
  VIDEO: "video",
  LOTTIE: "lottie", // reserved for future
  THREE: "three", // reserved for future
};

const fallback = () => null;

export const rendererRegistry = {
  human: {
    type: RENDERER_TYPES.SVG,
    component: dynamic(() => import("./renderers/HumanRenderer"), { ssr: false, loading: fallback }),
  },
  robot: {
    type: RENDERER_TYPES.SVG,
    component: dynamic(() => import("./renderers/RobotRenderer"), { ssr: false, loading: fallback }),
  },
  anime: {
    type: RENDERER_TYPES.SVG,
    component: dynamic(() => import("./renderers/AnimeRenderer"), { ssr: false, loading: fallback }),
  },
  // Pre-made illustration (SVG/PNG) loaded from a file via the `image` prop.
  image: {
    type: RENDERER_TYPES.SVG,
    component: dynamic(() => import("./renderers/ImageRenderer"), { ssr: false, loading: fallback }),
  },
  // Fully rigged farmer face with real mouth/eye/eyebrow animation.
  farmer: {
    type: RENDERER_TYPES.SVG,
    component: dynamic(() => import("./renderers/FarmerRenderer"), { ssr: false, loading: fallback }),
  },
  // Rigged Aviator pilot (farmerBot-v4) — mouth/blink driven by TTS.
  aviator: {
    type: RENDERER_TYPES.SVG,
    component: dynamic(() => import("./renderers/AviatorRenderer"), { ssr: false, loading: fallback }),
  },
  // Pre-rendered talking-head clip (muted; TTS supplies audio).
  video: {
    type: RENDERER_TYPES.VIDEO,
    component: dynamic(() => import("./renderers/VideoRenderer"), { ssr: false, loading: fallback }),
  },
};

export function getRenderer(key) {
  return rendererRegistry[key] || rendererRegistry.human;
}
