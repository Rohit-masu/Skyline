import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { SplitWords } from "@/components/motion/SplitWords";
import { PROPERTIES_DATA } from "@/data/properties";

const FEATURED_COUNT = 6;

// Opaque background (and z-10) so it slides over the fixed 3D canvas once the story ends.
export function FeaturedHomes() {
  const featured = PROPERTIES_DATA.filter((property) => property.featured).slice(0, FEATURED_COUNT);

  return (
    <section
      id="featured"
      aria-labelledby="featured-title"
      className="relative z-10 border-t border-brass/15 bg-ink px-4 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-7xl space-y-14">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-4">
            <p data-reveal className="text-[11px] uppercase tracking-[0.35em] text-brass">06 — Featured residences</p>
            <h2 id="featured-title" data-split className="font-display text-4xl font-light leading-tight text-ivory sm:text-6xl">
              <SplitWords text="Hand-picked homes, ready to visit." accent={["Hand-picked"]} />
            </h2>
          </div>
          <Link
            href="/properties"
            data-magnetic
            className="btn-outline-brass inline-flex items-center gap-2 self-start rounded-full px-6 py-3 text-xs uppercase tracking-widest sm:self-auto"
          >
            View all residences
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((property, index) => (
            <div key={property.id} data-reveal data-reveal-delay={(index % 3) * 0.12}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
