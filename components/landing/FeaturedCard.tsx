import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import { formatPrice } from "@/lib/format";
import { FavouriteButton } from "@/components/properties/FavouriteButton";

interface FeaturedCardProps {
  property: Property;
  index: number;
  /** The large tile of the bento grid gets a bigger title and wider image sizes. */
  large?: boolean;
}

export function FeaturedCard({ property, index, large = false }: FeaturedCardProps) {
  const number = String(index + 1).padStart(2, "0");
  const image = property.images[0] ?? "/images/landing/hero-tower.jpg";

  // Determine tag matching the luxury reference design
  const tag =
    index === 0 || property.featured
      ? "★ FEATURED"
      : property.type === "penthouse"
      ? "PENTHOUSE"
      : property.furnished
      ? "FURNISHED"
      : property.type.toUpperCase();

  const isFeaturedTag = tag === "★ FEATURED";

  return (
    <article
      data-spotlight
      className="spotlight group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate p-5 sm:p-6 transition-all duration-500 hover:border-brass/35 hover:shadow-2xl"
    >
      <div data-clip-reveal data-reveal-delay={(index % 3) * 0.1} className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt=""
          fill
          sizes={large ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
      </div>

      {/* Top Header: Number, Tag & Favourite */}
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="font-display text-4xl sm:text-5xl font-light leading-none text-ivory/85">
          {number}
        </span>
        <div className="relative z-10 flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur-md transition-colors ${
              isFeaturedTag
                ? "border border-brass/50 bg-brass/25 font-semibold text-brass-light"
                : "border border-white/15 bg-ink/70 font-medium text-ivory/80"
            }`}
          >
            {tag}
          </span>
          <FavouriteButton slug={property.slug} title={property.title} size="sm" />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="space-y-2.5">
        <p className="flex items-center gap-1.5 text-xs text-mist/90">
          <MapPin className="h-3 w-3 shrink-0 text-brass" aria-hidden="true" />
          <span>{property.locality}, {property.city}</span>
        </p>

        <h3 className={`font-display font-light leading-snug text-ivory ${large ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>
          <Link href={`/properties/${property.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-ivory transition-colors">
            {property.title}
          </Link>
        </h3>

        <div className="flex items-center justify-between pt-1">
          <p className="font-display text-2xl font-light text-brass">{formatPrice(property.price)}</p>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-ink/60 text-ivory/70 transition-all duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-ink group-hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
