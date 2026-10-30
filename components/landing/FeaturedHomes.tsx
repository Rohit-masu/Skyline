import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { getFeaturedProperties } from "@/lib/properties";
import { SectionHeading } from "./SectionHeading";

const FEATURED_COUNT = 6;

// Opaque background (and z-10) so it slides over the fixed 3D canvas once the story ends.
export function FeaturedHomes() {
  // Same data function as GET /api/properties (see notes/DECISIONS.md): no HTTP hop to our own API at build time.
  const featured = getFeaturedProperties(FEATURED_COUNT);

  return (
    <section id="featured" aria-labelledby="featured-title" className="section-shell border-t border-brass/15 bg-ink">
      <div className="section-inner space-y-14">
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

        <ul className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((property, index) => (
            <li key={property.id} data-reveal data-reveal-delay={(index % 3) * 0.12} className="flex">
              <PropertyCard property={property} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
