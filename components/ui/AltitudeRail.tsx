"use client";

import { useEffect, useState } from "react";

// Must match the scene ids in components/landing/ScrollStory.tsx (and Hero).
// Displayed in top-down tower order (Floor 28 down to 01).
const LEVELS = [
  { id: "garden", label: "28", title: "Roof garden" },
  { id: "gym", label: "24", title: "Sky gym" },
  { id: "inside", label: "18", title: "Inside a home" },
  { id: "pool", label: "12", title: "Podium pool" },
  { id: "build", label: "06", title: "The making" },
  { id: "hero", label: "01", title: "Arrival" },
];

export function AltitudeRail() {
  const [activeLevel, setActiveLevel] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  // The rail belongs to the 3D story; it fades out once Featured homes and the footer scroll in.
  const [inStory, setInStory] = useState(true);

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

    const storyRoot = document.querySelector("[data-story-root]");
    const storyObserver = new IntersectionObserver(([entry]) => setInStory(entry?.isIntersecting ?? false), {
      rootMargin: "-50% 0px -50% 0px",
    });
    if (storyRoot) storyObserver.observe(storyRoot);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      storyObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] md:hidden" aria-hidden="true">
        <div className="h-full origin-left bg-gradient-to-r from-brass to-brass-light" style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <nav
        className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center transition-opacity duration-500 lg:flex ${
          inStory ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Tower altitude"
        inert={!inStory}
      >
        <div className="flex flex-col items-center gap-4 rounded-full border border-white/10 bg-ink/75 px-3 py-6 shadow-2xl backdrop-blur-md">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-mist/70" aria-hidden="true">
            Floor
          </span>
          <span className="h-3 w-px bg-white/10" aria-hidden="true" />
          <ol className="flex flex-col items-center gap-4">
            {LEVELS.map((level) => {
              const isActive = activeLevel === level.id;
              return (
                <li key={level.id} className="relative flex flex-col items-center justify-center">
                  <a
                    href={`#${level.id}`}
                    title={level.title}
                    aria-current={isActive ? "location" : undefined}
                    className={`block font-mono text-[11px] tracking-wider transition-all duration-300 ${
                      isActive ? "font-semibold text-brass scale-110" : "text-mist/60 hover:text-ivory"
                    }`}
                  >
                    {level.label}
                    <span className="sr-only"> — {level.title}</span>
                  </a>
                  {isActive && (
                    <span className="mt-1 h-1 w-1 rounded-full bg-brass shadow-[0_0_6px_#c9a36a]" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
