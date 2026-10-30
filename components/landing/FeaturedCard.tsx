import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Property } from "@/types/property";
import { formatArea, formatPrice } from "@/lib/format";
import { FavouriteButton } from "@/components/properties/FavouriteButton";

interface FeaturedCardProps {
  property: Property;
  index: number;
  /** The large tile of the bento grid gets a bigger title and wider image sizes. */
  large?: boolean;
}

// Full-bleed editorial card for the landing's featured grid. The whole card is one link (the
// title's ::after covers it), so keyboard users get one tab stop per home, plus the heart button.
// data-clip-reveal / data-spotlight are animated by the lazy GSAP layer; without it the card is
// simply shown.
export function FeaturedCard({ property, index, large = false }: FeaturedCardProps) {
  const number = String(index + 1).padStart(2, "0");
  const image = property.images[0] ?? "/images/landing/hero-tower.jpg";

  return (
    <article
      data-spotlight
      className="spotlight group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate p-5 sm:p-6"
    >
      <div data-clip-reveal data-reveal-delay={(index % 3) * 0.1} className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt=""
          fill
          sizes={large ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="text-outline font-display text-5xl font-light leading-none sm:text-6xl">
          {number}
        </span>
        <div className="relative z-10 flex items-center gap-2">
          <span className="rounded-full border border-brass/30 bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-widest text-brass backdrop-blur-md">
            {property.type}
          </span>
          <FavouriteButton slug={property.slug} title={property.title} size="sm" />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-ivory/70">{property.locality}, {property.city}</p>
        <h3 className={`font-display font-light leading-tight text-ivory ${large ? "text-3xl sm:text-5xl" : "text-2xl"}`}>
          <Link href={`/properties/${property.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {property.title}
          </Link>
        </h3>
        <div className="flex items-end justify-between gap-4">
          <p className="font-display text-2xl text-brass">{formatPrice(property.price)}</p>
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/40 text-brass transition-all duration-300 group-hover:rotate-45 group-hover:border-brass group-hover:bg-brass group-hover:text-ink"
          >
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
        {/* Specs slide up on hover where hover exists; always visible on touch screens. */}
        <ul className="featured-specs flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-ivory/80">
          <li className="rounded-full border border-white/15 px-3 py-1">{property.bhk} BHK</li>
          <li className="rounded-full border border-white/15 px-3 py-1">{formatArea(property.areaSqFt)}</li>
          <li className="rounded-full border border-white/15 px-3 py-1">Floor {property.floor}</li>
        </ul>
      </div>
    </article>
  );
}
