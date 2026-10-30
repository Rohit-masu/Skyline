import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedProperties, getPortfolioStats } from "@/lib/properties";
import { TOTAL_FLOORS } from "@/lib/site";
import { FeaturedCard } from "./FeaturedCard";
import { CurvedTransition } from "./CurvedTransition";

const FEATURED_COUNT = 6;

// Bento layout on desktop: the first home is a 2×2 tile, two homes stack beside it, three fill the
// row below. Rows have a fixed height, so nothing shifts while images load.
const TILE_CLASSES = ["lg:col-span-2 lg:row-span-2", "", "", "", "", ""];

// Opaque background (and z-10) with curved atmospheric transition so it smoothly envelopes
// the fixed 3D canvas once the story ends, eliminating any sudden hard cuts.
export function FeaturedHomes() {
  const featured = getFeaturedProperties(FEATURED_COUNT);
  const stats = getPortfolioStats();
  const lowestCrore = (stats.lowestPrice / 10_000_000).toFixed(1);

  return (
    <section id="featured" aria-labelledby="featured-title" className="relative z-10 bg-ink pt-0 pb-16 sm:pb-24">
      {/* Smooth Curved Architectural Horizon Transition from 3D Story into Section 06 */}
      <div className="-mt-14 sm:-mt-20 lg:-mt-24 relative z-20">
        <CurvedTransition glow={true} />
      </div>

      <div className="section-inner space-y-12 sm:space-y-16 pt-6 sm:pt-10">
        {/* Eyebrow */}
        <p data-reveal className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-brass">
          <span aria-hidden="true" className="h-px w-10 bg-brass/60" />
          06 — The Residence Collection
        </p>

        {/* 3-Column Editorial Header: Title | Intro | Inline Stats & CTA */}
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          {/* Column 1: Main Title */}
          <div className="lg:col-span-5">
            <h2
              id="featured-title"
              className="font-display text-4xl font-light leading-[1.04] tracking-tight text-ivory sm:text-5xl lg:text-6xl"
            >
              <span>A collection</span>
              <span className="block text-brass italic font-normal">with a view.</span>
            </h2>
          </div>

          {/* Column 2: Editorial Description */}
          <div className="lg:col-span-3">
            <p data-reveal data-reveal-delay="0.1" className="text-xs sm:text-sm font-light leading-relaxed text-mist">
              Six distinctive residences, thoughtfully curated for elevated living. Explore spaces designed around exceptional
              views and considered details.
            </p>
          </div>

          {/* Column 3: Compact Inline Stats & View All CTA */}
          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
            <div data-reveal data-reveal-delay="0.2" className="flex items-center gap-4 sm:gap-6 border-b border-white/10 pb-4">
              <div className="flex flex-col">
                <span className="font-display text-2xl font-light text-ivory sm:text-3xl">
                  <span data-count={String(stats.homes)}>{stats.homes}</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-mist/80">Residences</span>
              </div>
              <span className="h-8 w-px bg-white/10" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-light text-ivory sm:text-3xl">
                  <span data-count={String(TOTAL_FLOORS)}>{TOTAL_FLOORS}</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-mist/80">Floors</span>
              </div>
              <span className="h-8 w-px bg-white/10" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-light text-ivory sm:text-3xl">
                  ₹{lowestCrore}<span className="text-xl text-brass"> Cr</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-mist/80">Starting price</span>
              </div>
            </div>

            <Link
              href="/properties"
              data-reveal
              data-magnetic
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brass transition-colors hover:text-ivory"
            >
              <span>View all residences</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <ul className="grid auto-rows-[24rem] grid-cols-1 gap-5 md:grid-cols-2 lg:auto-rows-[20rem] lg:grid-cols-3">
          {featured.map((property, index) => (
            <li key={property.id} className={TILE_CLASSES[index] ?? ""}>
              <FeaturedCard property={property} index={index} large={index === 0} />
            </li>
          ))}
        </ul>
      </div>

      {/* Smooth Transition (6 -> 7) matching the design */}
      <div className="mt-16 sm:mt-24 lg:mt-32">
        <CurvedTransition inverted={true} />
      </div>
    </section>
  );
}
