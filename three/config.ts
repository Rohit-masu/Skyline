// Every tunable value of the 3D scene lives here, so a live change is a one-line edit.

export type QualityTier = "high" | "low";

// Must match the data-scene attributes rendered by components/landing/ScrollStory.tsx.
export const SCENE_IDS = ["hero", "arrival", "build", "inside", "pool", "gym", "garden", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

// How quickly the damped progress catches up with the real scroll position (higher = snappier).
export const SCROLL_DAMPING = 6;

// Largest frame delta we accept, so returning from a background tab never jumps.
export const MAX_FRAME_DELTA = 1 / 30;

// Both tiers keep all 28 floors because the camera keyframes and the gym floor depend on them;
// the low tier saves its cost on shadows, pixel ratio and the surrounding city instead.
export const TIER_SETTINGS = {
  high: { maxPixelRatio: 2, shadows: true, bloom: true, cityBlocks: 220, trees: 90 },
  low: { maxPixelRatio: 1.5, shadows: false, bloom: false, cityBlocks: 110, trees: 45 },
} as const;

// Glow around bright pixels (lit windows, crown, pool). threshold: how bright a pixel must be to glow.
export const BLOOM = { strength: 0.5, radius: 0.55, threshold: 0.9 } as const;

export const TOWER = {
  floors: 28,
  floorHeight: 1.1,
  podiumHeight: 3.2,
  width: 9,
  depth: 9,
  // Floor (1-based, as people count) that opens up in the "inside a home" scene.
  showcaseFloor: 18,
  // Floor (1-based) with the open-air sky gym terrace.
  gymFloor: 24,
  // How far the floors above the showcase floor lift to reveal the plan.
  liftAboveShowcase: 7,
  // How high a floor starts above its final position during build-up,
  // plus an extra gap per floor so the spread tower fans out (top floor: 2.4 + 27 * 0.2).
  dropHeight: 2.4,
  spreadPerFloor: 0.2,
} as const;

export const POINTER_PARALLAX = { strength: 1.4, damping: 4 } as const;

export function pickTier(): QualityTier {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const fewCores = (navigator.hardwareConcurrency ?? 4) <= 4;
  return isTouch || fewCores ? "low" : "high";
}
