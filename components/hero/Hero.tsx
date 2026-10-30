"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Clock, Compass } from "lucide-react";
import { HeroSpotlight } from "./HeroSpotlight";

const TICKER = ["28 Floors", "112 Residences", "Sky gardens", "Podium infinity pool", "Open-air sky gym", "Roof garden", "Noida Expressway"];

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
  const [istTime, setIstTime] = useState<string>("");

  // Clock is rendered only after mount, so server (UTC) and browser (IST) HTML never mismatch.
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });
    const updateTime = () => setIstTime(formatter.format(new Date()));
    updateTime();
    const interval = setInterval(updateTime, 15_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" data-scene="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24" aria-labelledby="hero-title">
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
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      </div>
      <HeroSpotlight />

      <div className="hero-fade relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-4 font-mono text-[11px] tracking-wider text-mist sm:px-8 lg:px-12">
        <span className="flex items-center gap-2">
          <Compass className="h-3.5 w-3.5 text-brass" aria-hidden="true" />
          28.5355° N, 77.3910° E
          <span className="hidden text-ivory/70 md:inline">· SECTOR 128, NOIDA EXPRESSWAY</span>
        </span>
        <span className="hidden items-center gap-2 sm:flex">
          <Clock className="h-3.5 w-3.5 text-brass" aria-hidden="true" />
          {istTime ? `${istTime} IST · Blue hour` : "IST"}
        </span>
      </div>

      <div className="relative z-10 mx-auto mt-auto w-full max-w-7xl px-4 pb-10 sm:px-8 lg:px-12">
        <p className="hero-fade mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-brass" style={{ animationDelay: "150ms" }}>
          <span className="h-px w-12 bg-brass" aria-hidden="true" />
          Skyline Residences · 01 — Arrival
        </p>

        <h1 id="hero-title" className="font-display text-[clamp(3.2rem,8.5vw,8.5rem)] font-light leading-[0.92] tracking-[-0.02em] text-ivory">
          <span className="sr-only">Living above the city.</span>
          <span className="flex flex-wrap gap-x-[0.25em]">
            <RisingLine text="Living" startMs={250} />
            {/* "above" rises as one word so its shimmer (background-clip: text) keeps working. */}
            <span className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
              <span className="hero-char" style={{ animationDelay: "520ms" }}>
                <span className="text-shimmer italic">above</span>
              </span>
            </span>
          </span>
          <RisingLine text="the city." startMs={780} />
        </h1>

        <p className="hero-fade mt-8 max-w-md text-base font-light leading-relaxed text-ivory/80 sm:text-lg" style={{ animationDelay: "1100ms" }}>
          Twenty-eight floors of glass and warm light above Noida Expressway. Scroll to watch the tower rise, step inside a
          home and visit the pool, the sky gym and the roof garden.
        </p>
        <div className="hero-fade mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "1250ms" }}>
          <Link href="/properties" data-magnetic className="btn-brass group flex items-center gap-3 rounded-full px-8 py-4 text-xs uppercase tracking-widest">
            Explore residences
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <a href="#arrival" className="btn-outline-brass flex items-center gap-2 rounded-full px-6 py-4 text-xs uppercase tracking-widest">
            Rise through the tower
            <ChevronDown className="scroll-nudge h-4 w-4 text-brass" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Endless ticker. The first copy is read by screen readers, the duplicate is decorative. */}
      <div className="hero-fade relative z-10 overflow-hidden border-y border-brass/15 bg-ink/40 py-4 backdrop-blur-sm" style={{ animationDelay: "1400ms" }}>
        <div className="ticker flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? "true" : undefined}>
              {TICKER.map((item) => (
                <li key={item} className="flex items-center gap-10 pr-10 font-display text-lg font-light uppercase tracking-[0.2em] text-ivory/70 sm:text-xl">
                  {item}
                  <span className="h-1.5 w-1.5 rotate-45 bg-brass" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
