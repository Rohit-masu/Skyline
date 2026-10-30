"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Compass } from "lucide-react";
import { PAVILION } from "@/lib/site";
import { HeroSpotlight } from "./HeroSpotlight";

// One headline line, split into letters that rise out of a mask on load (CSS only).
// Screen readers read the h1's sr-only copy; the animated letters are aria-hidden.
function RisingLine({ text, startMs }: { text: string; startMs: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
      {text.split("").map((letter, index) => (
        <span key={index} className="hero-char" style={{ animationDelay: `${startMs + index * 45}ms` }}>
          {letter === " " ? " " : letter}
        </span>
      ))}
    </span>
  );
}

// S1 Arrival. The poster is a still rendered from our own 3D scene at the hero camera
// (scripts/capture-posters.mjs), so when the live canvas fades in above it (z-[1]) the picture
// does not change style, it starts moving. Poster + h1 paint before any WebGL code downloads.
// Layers: poster z-0 < 3D canvas z-[1] < shade z-[2] < text z-10. No z-index on the section.
export function Hero() {
  return (
    <section
      id="hero"
      data-scene="hero"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24 pb-8 sm:pb-12"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/posters/hero.webp"
          alt="Skyline tower at blue hour, rendered from the 3D model"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/75 to-transparent" />
      </div>
      <HeroSpotlight />

      {/* Location meta: a quiet detail, not content (small, muted; full mist colour keeps AA contrast),
          and a link to the site on Maps.
          Phones show the coordinates only, so the line never wraps at 360 px. */}
      <div className="hero-fade relative z-10 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-8 lg:px-12">
        <a
          href={PAVILION.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-wider text-mist transition-colors duration-300 hover:text-ivory"
        >
          <Compass className="h-3.5 w-3.5 text-brass transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
          <span>28.5355° N, 77.3910° E</span>
          <span className="hidden sm:inline">· SECTOR 128, NOIDA EXPRESSWAY</span>
          <span className="sr-only">(open in Maps, new tab)</span>
        </a>
      </div>

      {/* Main Editorial Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12">
        <p
          className="hero-fade mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-brass"
          style={{ animationDelay: "150ms" }}
        >
          <span className="h-px w-8 bg-brass" aria-hidden="true" />
          A new perspective
        </p>

        <h1
          id="hero-title"
          className="font-display text-[clamp(2.75rem,5.4vw,5.4rem)] font-light leading-[1.04] tracking-[-0.02em] text-ivory"
        >
          <span className="sr-only">A higher way to live.</span>
          <span className="block">
            <RisingLine text="A higher way" startMs={250} />
          </span>
          <span className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
            <span className="hero-char" style={{ animationDelay: "560ms" }}>
              <span className="text-shimmer italic">to live.</span>
            </span>
          </span>
        </h1>

        <p
          className="hero-fade mt-6 max-w-md text-sm sm:text-base font-light leading-relaxed text-ivory/75"
          style={{ animationDelay: "950ms" }}
        >
          Twenty-eight levels of considered living. Discover refined residences, private wellness and panoramic views above
          Noida Expressway.
        </p>

        <div className="hero-fade mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "1150ms" }}>
          <Link
            href="/properties"
            data-magnetic
            className="btn-brass group flex items-center gap-3 rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-widest"
          >
            Discover residences
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <a
            href="#arrival"
            className="btn-outline-brass flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-widest"
          >
            Explore the tower
            <ChevronDown className="scroll-nudge h-4 w-4 text-brass" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
