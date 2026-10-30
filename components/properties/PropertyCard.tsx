
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize2, MapPin, ChevronRight } from "lucide-react";
import type { Property } from "@/types/property";
import { formatPrice, formatArea } from "@/lib/format";
import { FavouriteButton } from "./FavouriteButton";

const FALLBACK_IMAGE = "/images/landing/hero-tower.jpg";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  index?: number;
  large?: boolean;
}

export function PropertyCard({ property, priority = false, index = 0, large = false }: PropertyCardProps) {
  const image = property.images[0] ?? FALLBACK_IMAGE;
  const number = String(index + 1).padStart(2, "0");

  const tag =
    property.featured
      ? "★ FEATURED"
      : property.type === "Penthouse"
      ? "PENTHOUSE"
      : property.furnished
      ? "FURNISHED"
      : property.type.toUpperCase();

  const isFeaturedTag = tag === "★ FEATURED";

  return (
    <article
      data-spotlight
      data-testid="property-card"
      className="spotlight group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate p-5 sm:p-6 transition-all duration-500 hover:border-brass/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
    >
      {/* Full-Bleed Architectural Photo with Rich Dusk Vignette */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={`${property.title} - ${property.locality}, ${property.city}`}
          fill
          sizes={large ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/20" />
      </div>

      {/* Top Bar: Number, Tag Badge & Favourite Heart */}
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="font-display text-3xl sm:text-4xl font-light leading-none text-ivory/80">
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

      {/* Bottom Editorial Content Area */}
      <div className="space-y-3 pt-12 sm:pt-16">
        {/* Locality */}
        <p className="flex items-center gap-1.5 text-xs text-mist/90">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brass" aria-hidden="true" />
          <span className="truncate">{property.locality}, {property.city}</span>
        </p>

        {/* Title */}
        <h3 className={`font-display font-light leading-snug text-ivory group-hover:text-brass transition-colors ${large ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>
          <Link
            href={`/properties/${property.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:underline"
            aria-label={`View ${property.title} in ${property.locality}`}
          >
            {property.title}
          </Link>
        </h3>

        {/* Tagline / Subtitle (especially pronounced on large cards) */}
        {(large || property.tagline) && (
          <p className="line-clamp-2 text-xs font-light leading-relaxed text-ivory/70">
            {property.tagline || property.description}
          </p>
        )}

        {/* Price & Circular Action Chevron Button */}
        <div className="flex items-center justify-between pt-1">
          <p className="font-display text-2xl font-light text-brass drop-shadow-sm">
            {formatPrice(property.price)}
          </p>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-ink/60 text-ivory/80 transition-all duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-ink group-hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>

        {/* Inline Specs Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 text-[11px] text-ivory/80 font-mono">
          <span className="flex items-center gap-1.5">
            <Bed className="h-3.5 w-3.5 text-brass/80" aria-hidden="true" />
            {property.bhk} BHK
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5 text-brass/80" aria-hidden="true" />
            {property.bathrooms} Baths
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-brass/80" aria-hidden="true" />
            {formatArea(property.areaSqFt)}
          </span>
        </div>
      </div>
    </article>
  );
}
