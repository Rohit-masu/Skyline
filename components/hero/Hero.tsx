"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Compass, Clock } from "lucide-react";

export function Hero() {
  const [istTime, setIstTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setIstTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="arrival"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden pt-28 pb-10"
      aria-label="Arrival Hero Section"
    >
      {/* Background Architectural Tower Image with Cinematic Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landing/hero-tower.jpg"
          alt="Skyline - Slender 28-storey architectural residential tower illuminated at twilight"
          fill
          priority
          sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"
          className="object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
        />

        {/* Cinematic Vignette & Gradients for High Readability and Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/65 to-[#0a0f18]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f18]/90 via-[#0a0f18]/50 to-transparent" />
        <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
      </div>

      {/* Giant Architectural Wordmark Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none w-full text-center overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-display text-[15vw] leading-none font-bold tracking-[0.2em] text-white/[0.03] uppercase whitespace-nowrap">
          SKYLINE
        </span>
      </div>

      {/* Top Meta Bar (Live Coordinates & IST Clock) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 flex items-center justify-between text-xs text-[#8f9ba8] font-mono tracking-wider pt-2">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#c9a36a]" />
          <span>28.4595° N, 77.0266° E</span>
          <span className="text-[rgba(201,163,106,0.3)]">·</span>
          <span className="text-[#f4eee5]/80">GOLF COURSE ROAD, GURGAON</span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#c9a36a]" />
          <span>{istTime ? `${istTime} IST` : "LIVE IST"}</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500/80 inline-block animate-ping ml-1" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-12 lg:py-16 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[#c9a36a]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#c9a36a] font-sans font-medium">
              01 —— ARRIVAL · LUXURY LIVING REDEFINED
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-[#f4eee5] tracking-tight leading-[1.08]">
            Living <span className="italic text-[#c9a36a] font-normal">above</span> the city.
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[#8f9ba8] max-w-xl font-sans font-light leading-relaxed">
            Skyline is a landmark 28-storey residential tower where private sky gardens, 
            cantilevered infinity pools, and panoramic glass vistas redefine the standard of elevated living.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/properties"
              className="btn-brass px-7 py-3.5 rounded-full text-xs uppercase tracking-widest flex items-center gap-3 group"
            >
              <span>Explore Residences</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <a
              href="#story"
              className="btn-outline-brass px-6 py-3.5 rounded-full text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <span>The Ascent Story</span>
              <ChevronDown className="w-4 h-4 text-[#c9a36a]" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Stats Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
        <div className="border-t border-[rgba(201,163,106,0.18)] pt-6 pb-2 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <span className="block font-display text-2xl sm:text-3xl text-[#f4eee5] font-light">
              28 <span className="text-[#c9a36a] text-lg font-normal">Floors</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8f9ba8] font-sans">
              Iconic Slender Silhouette
            </span>
          </div>

          <div>
            <span className="block font-display text-2xl sm:text-3xl text-[#f4eee5] font-light">
              112 <span className="text-[#c9a36a] text-lg font-normal">Homes</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8f9ba8] font-sans">
              2, 3 & 4 BHK + Penthouses
            </span>
          </div>

          <div>
            <span className="block font-display text-2xl sm:text-3xl text-[#f4eee5] font-light">
              1.2 <span className="text-[#c9a36a] text-lg font-normal">Acres</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8f9ba8] font-sans">
              Sky Gardens & Infinity Deck
            </span>
          </div>

          <div>
            <span className="block font-display text-2xl sm:text-3xl text-[#f4eee5] font-light">
              ₹2.4 <span className="text-[#c9a36a] text-lg font-normal">Cr+</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8f9ba8] font-sans">
              Private Tour By Invitation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
