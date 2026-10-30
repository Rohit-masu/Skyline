"use client";

import { useEffect, useState } from "react";

// Must match the scene ids in components/landing/ScrollStory.tsx (and Hero).
const LEVELS = [
  { id: "hero", label: "G", title: "Arrival" },
  { id: "build", label: "L12", title: "The making" },
  { id: "inside", label: "L18", title: "Inside a home" },
  { id: "pool", label: "L04", title: "Podium pool" },
  { id: "gym", label: "L24", title: "Sky gym" },
  { id: "garden", label: "ROOF", title: "Roof garden" },
];

export function AltitudeRail() {
  const [activeLevel, setActiveLevel] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    // Read scroll at most once per frame, not on every scroll event.
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(totalScroll > 0 ? Math.min(Math.max(window.scrollY / totalScroll, 0), 1) : 0);
      });
    };

    // A scene counts as active while it crosses the middle line of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveLevel(entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const level of LEVELS) {
      const section = document.getElementById(level.id);
      if (section) observer.observe(section);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] md:hidden" aria-hidden="true">
        <div className="h-full origin-left bg-gradient-to-r from-brass to-brass-light" style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <nav
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center lg:flex"
        aria-label="Tower altitude"
      >
        <div className="flex flex-col items-center gap-5 rounded-full border border-brass/15 bg-ink/60 px-2.5 py-6 shadow-xl backdrop-blur-md">
          <span className="text-[9px] uppercase tracking-[0.25em] text-mist [writing-mode:vertical-rl] rotate-180" aria-hidden="true">
            Altitude
          </span>
          <span className="h-8 w-px bg-gradient-to-b from-transparent to-brass/30" aria-hidden="true" />
          <ol className="flex flex-col items-center gap-3">
            {LEVELS.map((level) => {
              const isActive = activeLevel === level.id;
              return (
                <li key={level.id}>
                  <a
                    href={`#${level.id}`}
                    title={level.title}
                    aria-current={isActive ? "location" : undefined}
                    className={`block rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wider transition-all duration-300 ${
                      isActive ? "scale-110 font-bold text-brass" : "text-mist hover:text-ivory"
                    }`}
                  >
                    {level.label}
                    <span className="sr-only"> — {level.title}</span>
                  </a>
                </li>
              );
            })}
          </ol>
          <span className="h-8 w-px bg-gradient-to-b from-brass/30 to-transparent" aria-hidden="true" />
          <span className="font-mono text-[9px] font-semibold tabular-nums text-brass" aria-hidden="true">
            {Math.round(scrollProgress * 28)}F
          </span>
        </div>
      </nav>
    </>
  );
}
