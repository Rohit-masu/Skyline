import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedProperties, getPortfolioStats } from "@/lib/properties";
import { TOTAL_FLOORS } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";
import { FeaturedCard } from "./FeaturedCard";

const FEATURED_COUNT = 6;

// Bento layout on desktop: the first home is a 2×2 tile, two homes stack beside it, three fill the
// row below. Rows have a fixed height, so nothing shifts while images load.
const TILE_CLASSES = ["lg:col-span-2 lg:row-span-2", "", "", "", "", ""];

// Opaque background (and z-10) so it slides over the fixed 3D canvas once the story ends.
export function FeaturedHomes() {
  // Same data functions as GET /api/properties (see notes/DECISIONS.md): no HTTP hop at build time.
  const featured = getFeaturedProperties(FEATURED_COUNT);
  const stats = getPortfolioStats();
  const lowestCrore = (stats.lowestPrice / 10_000_000).toFixed(1);

  const statItems = [
    { value: String(stats.homes), label: "Residences" },
    { value: String(stats.cities), label: "Cities" },
    { value: String(TOTAL_FLOORS), label: "Floors" },
    { value: lowestCrore, prefix: "₹", suffix: " Cr", label: "Starting price" },
  ];

  return (
    <section id="featured" aria-labelledby="featured-title" className="section-shell border-t border-brass/15 bg-ink">
      <div className="section-inner space-y-16">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="featured-title"
            number="06"
            eyebrow="Featured residences"
            title="Hand-picked homes, ready to visit."
            accent={["Hand-picked"]}
            intro="Six homes our team would show first: different floors, sizes and views, all open for a private visit this month."
          />
          <Link
            href="/properties"
            data-reveal
            data-magnetic
            className="btn-outline-brass inline-flex shrink-0 items-center gap-2 self-start rounded-full px-6 py-3 text-xs uppercase tracking-widest lg:self-auto"
          >
            View all residences
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Numbers count up once when scrolled into view (data-count); the server already renders the final value. */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {statItems.map((stat, index) => (
            <div key={stat.label} data-reveal data-reveal-delay={index * 0.08} className="flex flex-col gap-2 bg-ink p-6 sm:p-8">
              <dt className="order-2 text-[11px] uppercase tracking-[0.25em] text-mist">{stat.label}</dt>
              <dd className="order-1 font-display text-4xl font-light text-ivory sm:text-5xl">
                {stat.prefix}
                <span data-count={stat.value}>{stat.value}</span>
                {stat.suffix && <span className="text-2xl text-brass sm:text-3xl">{stat.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="grid auto-rows-[24rem] grid-cols-1 gap-5 md:grid-cols-2 lg:auto-rows-[20rem] lg:grid-cols-3">
          {featured.map((property, index) => (
            <li key={property.id} className={TILE_CLASSES[index] ?? ""}>
              <FeaturedCard property={property} index={index} large={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
