"use client";

import { useEffect, useRef, useState } from "react";
import { SceneLabels } from "./SceneLabels";

// Fallback delay when requestIdleCallback is missing (Safari).
const IDLE_FALLBACK_MS = 1200;

type SceneMode = "static" | "3d";

function setPageMode(mode: SceneMode | null): void {
  if (mode) document.documentElement.dataset.sceneMode = mode;
  else delete document.documentElement.dataset.sceneMode;
}

function prefersStatic(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return true;
  try {
    return !document.createElement("canvas").getContext("webgl2");
  } catch {
    return true;
  }
}

function whenIdle(callback: () => void): () => void {
  // The DOM types claim it always exists, but Safari still ships without it.
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: IDLE_FALLBACK_MS * 2 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, IDLE_FALLBACK_MS);
  return () => window.clearTimeout(id);
}

// Decides between the 3D story and the static story, and lazy-loads three.js after first paint.
// The fixed canvas only shows once the first frame has rendered (never a blank or black flash),
// The pinned hero (z-[2]) covers it until the hero lifts away.
export function SceneLoader() {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelLayerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const labelLayer = labelLayerRef.current;
    const tooltip = tooltipRef.current;
    const storyRoot = document.querySelector<HTMLElement>("[data-story-root]");
    if (!host || !labelLayer || !tooltip || !storyRoot) return;

    if (prefersStatic()) {
      setPageMode("static");
      return () => setPageMode(null);
    }

    let cancelled = false;
    let dispose: (() => void) | undefined;

    function fallBackToStatic(): void {
      dispose?.();
      dispose = undefined;
      setReady(false);
      setPageMode("static");
    }

    const cancelIdle = whenIdle(() => {
      import("@/three/boot")
        .then(({ boot }) => {
          // Strict Mode or a quick navigation may have unmounted us while the chunk downloaded.
          if (cancelled) return;
          dispose = boot({
            host,
            storyRoot,
            labelLayer,
            tooltip,
            onFirstFrame: () => {
              setPageMode("3d");
              setReady(true);
            },
            onContextLost: fallBackToStatic,
          });
        })
        .catch(() => {
          if (!cancelled) fallBackToStatic();
        });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      dispose?.();
      setPageMode(null);
    };
  }, []);

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-[1] transition-opacity duration-1000 ease-out ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <div ref={hostRef} className="absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full" />
        {/* Left and bottom shade keep the story text readable over bright parts of the scene. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent md:h-1/3 md:from-ink/70 md:via-transparent" />
      </div>

      <SceneLabels layerRef={labelLayerRef} />

      <div
        ref={tooltipRef}
        hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] rounded-md border border-brass/40 bg-ink/90 px-3 py-1.5 font-mono text-[11px] tracking-wider text-brass"
        aria-hidden="true"
      />
    </>
  );
}
