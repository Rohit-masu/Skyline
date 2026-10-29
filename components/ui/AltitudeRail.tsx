"use client";

import { useEffect, useState } from "react";

const LEVELS = [
  { id: "arrival", label: "G", title: "Street Arrival" },
  { id: "amenities", label: "L04", title: "Infinity Podium" },
  { id: "floorplans", label: "L18", title: "Sky Residences" },
  { id: "wellness", label: "L24", title: "Sky Gym & Spa" },
  { id: "featured", label: "L28", title: "Crown Penthouses" },
  { id: "cta", label: "ROOF", title: "Sky Lounge" },
];

export function AltitudeRail() {
  const [activeLevel, setActiveLevel] = useState("arrival");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
        setScrollProgress(progress);

        // Map scroll fraction to nearest level
        const index = Math.min(
          Math.floor(progress * LEVELS.length),
          LEVELS.length - 1
        );
        const level = LEVELS[index];
        if (level) {
          setActiveLevel(level.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-50 md:hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#c9a36a] to-[#dfba82] transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Desktop Right Rail */}
      <aside
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center pointer-events-none"
        aria-label="Tower altitude indicator"
      >
        <div className="flex flex-col items-center gap-6 py-6 px-2.5 rounded-full bg-[#0a0f18]/60 backdrop-blur-md border border-[rgba(201,163,106,0.15)] shadow-xl pointer-events-auto">
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#8f9ba8] font-sans -rotate-90 origin-center mb-2">
            ALTITUDE
          </span>

          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-[rgba(201,163,106,0.3)] to-[rgba(201,163,106,0.1)]" />

          <div className="flex flex-col items-center gap-4">
            {LEVELS.map((lvl) => {
              const isActive = activeLevel === lvl.id;
              return (
                <div
                  key={lvl.id}
                  className="group relative flex items-center justify-center cursor-pointer"
                  title={lvl.title}
                >
                  <span
                    className={`font-mono text-[10px] tracking-wider transition-all duration-300 ${
                      isActive
                        ? "text-[#c9a36a] font-bold scale-110"
                        : "text-[#8f9ba8] opacity-60 hover:opacity-100"
                    }`}
                  >
                    {lvl.label}
                  </span>

                  {/* Tooltip on hover */}
                  <span className="absolute right-8 whitespace-nowrap bg-[#141d2b] border border-[rgba(201,163,106,0.25)] text-[#f4eee5] text-[10px] tracking-wider px-2 py-0.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
                    {lvl.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-[1px] h-8 bg-gradient-to-b from-[rgba(201,163,106,0.1)] via-[rgba(201,163,106,0.3)] to-transparent" />

          {/* Current floor readout */}
          <span className="font-mono text-[9px] text-[#c9a36a] font-semibold">
            {Math.round(scrollProgress * 28)}F
          </span>
        </div>
      </aside>
    </>
  );
}
