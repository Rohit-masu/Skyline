"use client";

import { useEffect, useRef } from "react";

// A soft brass light that follows the pointer across the hero.
// Writes two CSS variables at most once per frame; no React re-render while the pointer moves.
export function HeroSpotlight() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const hero = light?.parentElement;
    if (!light || !hero) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = hero.getBoundingClientRect();
        light.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
        light.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
        light.style.opacity = "1";
      });
    };
    const onLeave = () => {
      light.style.opacity = "0";
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={lightRef} className="hero-spotlight pointer-events-none absolute inset-0 z-[2] opacity-0" aria-hidden="true" />;
}
