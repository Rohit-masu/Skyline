"use client";

import { useEffect } from "react";

// Loads GSAP only after hydration, in its own chunk, and only when the visitor allows motion.
// Without it (reduced motion, slow network, JS error) every element simply stays visible.
export function MotionLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let stop: (() => void) | undefined;

    import("./animations").then(({ startAnimations }) => {
      // React Strict Mode mounts twice in development; the first mount may already be gone.
      if (!cancelled) stop = startAnimations();
    });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return null;
}
