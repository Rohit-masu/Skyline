"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Compass, Sparkles, Layers, Shield, Eye } from "lucide-react";

// Lazy-load Three.js canvas dynamically so initial page bundle remains tiny
const TowerCanvas = dynamic(
  () => import("./TowerCanvas").then((mod) => mod.TowerCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#0a0f18] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-[#c9a36a]/30 border-t-[#c9a36a] animate-spin" />
      </div>
    ),
  }
);

export function TowerStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentScene, setCurrentScene] = useState(1);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Track scroll progress along the 450vh container
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Interactive mouse / touch parallax (satisfies "one interaction beyond scrolling")
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;
    setPointer({ x, y });
  };

  // If reduced motion is preferred, render an accessible editorial slide experience
  if (reducedMotion) {
    return (
      <section
        id="story"
        className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-16"
        aria-label="Tower Story and Architecture"
      >
        <div className="max-w-2xl space-y-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#c9a36a] font-mono">
            ARCHITECTURAL STORY
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-[#f4eee5]">
            The Art of Vertical Sanctuary
          </h2>
          <p className="text-sm text-[#8f9ba8] font-sans">
            Rising 28 floors along Noida Expressway (Sector 128), engineered with post-tensioned cantilevered slabs and panoramic vistas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#0e1624] border border-[rgba(201,163,106,0.2)] space-y-4">
            <span className="text-xs font-mono text-[#c9a36a]">01 -- THE ARRIVAL</span>
            <h3 className="font-display text-2xl text-[#f4eee5]">Twilit Elevation</h3>
            <p className="text-xs text-[#8f9ba8] leading-relaxed">
              Slender silhouette harmonizing private residential quietude with metropolitan connectivity.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0e1624] border border-[rgba(201,163,106,0.2)] space-y-4">
            <span className="text-xs font-mono text-[#c9a36a]">02 -- THE APARTMENTS</span>
            <h3 className="font-display text-2xl text-[#f4eee5]">Triple-Aspect Suites</h3>
            <p className="text-xs text-[#8f9ba8] leading-relaxed">
              11-ft ceilings, imported marble floors, and 60-ft continuous glass balcony decks.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0e1624] border border-[rgba(201,163,106,0.2)] space-y-4">
            <span className="text-xs font-mono text-[#c9a36a]">03 -- THE RETREAT</span>
            <h3 className="font-display text-2xl text-[#f4eee5]">Podium & Sky Club</h3>
            <p className="text-xs text-[#8f9ba8] leading-relaxed">
              Cantilevered lap pool, Technogym sky fitness suite, and starlit crown lounge.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/properties"
            className="btn-brass px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2"
          >
            <span>Explore All 56 Residences</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  // Altitude text indicator based on current scene
  const getAltitudeBadge = () => {
    switch (currentScene) {
      case 1:
        return "LEVEL 01 -- GROUND ELEVATION";
      case 2:
        return "LEVEL 12 -- STRUCTURAL MIDPOINT";
      case 3:
        return "LEVEL 18 -- SKYLINE SUITE REVEAL";
      case 4:
        return "LEVEL 24 -- PRIVATE SKY RETREAT";
      case 5:
      default:
        return "LEVEL 28 -- THE STARRY CROWN";
    }
  };

  return (
    <section
      ref={containerRef}
      id="story"
      onMouseMove={handleMouseMove}
      className="relative h-[450vh] bg-[#0a0f18] selection:bg-[#c9a36a] selection:text-[#0a0f18]"
      aria-label="Scroll-driven 3D Architectural Story"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Dynamic 3D WebGL Canvas */}
        <TowerCanvas
          progress={scrollProgress}
          pointerX={pointer.x}
          pointerY={pointer.y}
          onSceneChange={setCurrentScene}
        />

        {/* Ambient Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-[#0a0f18]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f18]/80 via-transparent to-[#0a0f18]/40 pointer-events-none" />

        {/* Top HUD: Elevation Badge & Live Scene Indicator */}
        <div className="relative z-20 px-6 sm:px-8 lg:px-12 pt-24 sm:pt-28 flex items-center justify-between text-xs font-mono text-[#8f9ba8] pointer-events-none">
          <div className="flex items-center gap-2 bg-[#0a0f18]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[rgba(201,163,106,0.25)] text-[#c9a36a]">
            <Compass className="w-3.5 h-3.5" />
            <span>{getAltitudeBadge()}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-[#0a0f18]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5">
            <span className="text-[10px] uppercase text-[#8f9ba8]">Scroll Story</span>
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c9a36a] transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[#f4eee5] font-semibold text-[11px]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

        {/* Center / Side Synced DOM Overlays */}
        <div className="relative z-20 px-6 sm:px-8 lg:px-12 my-auto pointer-events-none">
          <div className="max-w-xl pointer-events-auto transition-all duration-500">
            {/* Scene 1: Arrival */}
            {currentScene === 1 && (
              <div className="space-y-4 animate-fade-in bg-[#0a0f18]/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[rgba(201,163,106,0.2)]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a36a] font-mono block">
                  01 -- THE ARRIVAL
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#f4eee5] leading-tight">
                  Vertical Sanctuary on <span className="italic text-[#c9a36a]">Noida Expressway</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#8f9ba8] font-sans font-light leading-relaxed">
                  Located in Sector 128, Skyline integrates slender post-tensioned geometry with sweeping unhindered vistas across verdant golf landscapes.
                </p>
                <div className="text-[11px] font-mono text-[#c9a36a] flex items-center gap-2 pt-2">
                  <span>Scroll downwards to assemble the tower floors</span>
                  <span className="animate-bounce">↓</span>
                </div>
              </div>
            )}

            {/* Scene 2: Vertical Assembly */}
            {currentScene === 2 && (
              <div className="space-y-4 animate-fade-in bg-[#0a0f18]/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[rgba(201,163,106,0.2)]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a36a] font-mono block">
                  02 -- VERTICAL ASSEMBLY
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#f4eee5] leading-tight">
                  28 Floors <span className="italic text-[#c9a36a]">Seamlessly Unified</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#8f9ba8] font-sans font-light leading-relaxed">
                  Each cantilevered slab is engineered with German acoustic double-glazing, expansive wrap-around balconies, and private elevator vestibules.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[#8f9ba8] pt-2">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#c9a36a]" />
                    <span>28 Slabs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#c9a36a]" />
                    <span>Zone V Seismic Core</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 3: Inside a Home / Interior Reveal */}
            {currentScene === 3 && (
              <div className="space-y-4 animate-fade-in bg-[#0a0f18]/75 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[rgba(201,163,106,0.25)]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a36a] font-mono block">
                  03 -- INTERIOR REVEAL
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#f4eee5] leading-tight">
                  Level 18 <span className="italic text-[#c9a36a]">Skyline Suite</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#8f9ba8] font-sans font-light leading-relaxed">
                  Step inside an architectural 3 BHK layout. Floor-to-ceiling acoustic glass partitions open directly to evening western horizons.
                </p>
                <div className="space-y-2 pt-2 font-mono text-xs text-[#d8d0c2]">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-[#c9a36a]" />
                    <span>11-ft Clear Finished Ceiling Height</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-[#c9a36a]" />
                    <span>60-ft Continuous Glass Railing Deck</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-[#c9a36a]" />
                    <span>Imported Italian Statuario Marble</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 4: Amenities */}
            {currentScene === 4 && (
              <div className="space-y-4 animate-fade-in bg-[#0a0f18]/75 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[rgba(201,163,106,0.25)]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a36a] font-mono block">
                  04 -- THE VERTICAL CLUB
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#f4eee5] leading-tight">
                  Everything, <span className="italic text-[#c9a36a]">One Lift Away</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[#c9a36a] text-[10px] block">LEVEL 04</span>
                    <strong className="text-[#f4eee5] block">Infinity Pool</strong>
                    <span className="text-[11px] text-[#8f9ba8]">50m Cantilever</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[#c9a36a] text-[10px] block">LEVEL 24</span>
                    <strong className="text-[#f4eee5] block">Sky Gym</strong>
                    <span className="text-[11px] text-[#8f9ba8]">Technogym Suite</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[#c9a36a] text-[10px] block">LEVEL 28</span>
                    <strong className="text-[#f4eee5] block">Crown Lounge</strong>
                    <span className="text-[11px] text-[#8f9ba8]">Starlit Firepit</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 5: Settle & CTA */}
            {currentScene === 5 && (
              <div className="space-y-5 animate-fade-in bg-[#0a0f18]/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#c9a36a] shadow-2xl">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a36a] font-mono block">
                  05 -- PRIVATE INVITATION
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#f4eee5] leading-tight">
                  The View <span className="italic text-[#c9a36a]">Is Yours</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#8f9ba8] font-sans font-light leading-relaxed">
                  Browse all 56 residences and duplex penthouses or visit the Skyline Experience Pavilion by Reeltor on Sector 128, Noida Expressway.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/properties"
                    className="btn-brass px-7 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-lg"
                  >
                    <span>Browse All Residences</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Instructions / Reeltor Anchor */}
        <div className="relative z-20 px-6 sm:px-8 lg:px-12 pb-6 flex items-center justify-between text-xs font-mono text-[#8f9ba8]/80 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c9a36a]" />
            <span>SKYLINE BY REELTOR &bull; NOIDA EXPRESSWAY</span>
          </div>

          <div className="hidden sm:block text-[11px]">
            Scroll up / down to traverse the architectural ascent
          </div>
        </div>
      </div>
    </section>
  );
}
