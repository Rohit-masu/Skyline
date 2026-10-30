"use client";

import { useEffect, useSyncExternalStore } from "react";

const SEEN_KEY = "skyline:intro-seen";
const noSubscription = () => () => {};

function introSeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

// Branded veil while the 3D tower loads. It never blocks content for long and never needs JS
// to go away: CSS hides it as soon as SceneLoader sets html[data-scene-mode] (first 3D frame, or
// the static fallback), and a CSS timer removes it after ~2.4 s regardless. The hero <h1> and
// poster render underneath from the start, so LCP is unaffected. Shown once per session; never
// with reduced motion (.site-intro in globals.css).
export function SiteIntro() {
  // Server snapshot "not seen": the veil is in the first HTML paint; on later visits in the same
  // session the client snapshot removes it right away.
  const seen = useSyncExternalStore(noSubscription, introSeen, () => false);

  useEffect(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage blocked: the intro just shows again next time, which is harmless.
    }
  }, []);

  if (seen) return null;

  return (
    <div aria-hidden="true" className="site-intro pointer-events-none fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-ink">
      <p className="site-intro-word flex items-center gap-3 font-display text-3xl font-light tracking-[0.4em] text-ivory sm:text-4xl">
        SKYLINE
        <span className="h-1.5 w-1.5 rounded-full bg-brass" />
      </p>
      <div className="h-px w-40 overflow-hidden bg-white/10">
        <div className="site-intro-progress h-full origin-left bg-gradient-to-r from-brass-dark via-brass to-brass-light" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.4em] text-mist">Noida Expressway</p>
    </div>
  );
}
