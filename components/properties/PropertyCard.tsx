"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Bed, Bath, Maximize2, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import type { Property } from "@/types/property";
import { formatPrice, formatArea, formatNumber } from "@/lib/format";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const [imgSrc, setImgSrc] = useState(
    property.images?.[0] || "/images/landing/hero-tower.jpg"
  );

  return (
    <article
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#141d2b]/50 border border-[rgba(201,163,106,0.18)] hover:border-[#c9a36a] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] hover:-translate-y-1"
      data-testid="property-card"
    >
      {/* Visual Image Presentation */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c121c]">
        <Image
          src={imgSrc}
          alt={`${property.title} - ${property.locality}, ${property.city}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          onError={() => setImgSrc("/images/landing/hero-tower.jpg")}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-black/20 opacity-80" />

        {/* Badges Top Bar */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <span className="bg-[#0a0f18]/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#c9a36a] border border-[rgba(201,163,106,0.25)] uppercase">
            {property.type}
          </span>
          {property.featured ? (
            <span className="bg-[#c9a36a]/90 backdrop-blur-md text-[#0a0f18] px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider flex items-center gap-1 shadow-sm uppercase">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          ) : (
            <span className="bg-[#0a0f18]/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#8f9ba8] border border-white/10">
              FL {property.floor}/{property.totalFloors}
            </span>
          )}
        </div>

        {/* Price Tag Overlay at Bottom of Image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between z-10">
          <div>
            <div className="font-display text-2xl font-light text-[#f4eee5] tracking-tight drop-shadow-md">
              {formatPrice(property.price)}
            </div>
            <div className="text-[11px] font-mono text-[#c9a36a] drop-shadow-sm">
              ₹{formatNumber(property.pricePerSqFt)} / sq.ft
            </div>
          </div>
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-[#0a0f18]/80 text-[#8f9ba8] border border-white/10 uppercase">
            {property.furnished ? "Furnished" : "Unfurnished"}
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Locality */}
          <div className="flex items-center gap-1.5 text-xs text-[#8f9ba8] font-sans font-light">
            <MapPin className="w-3.5 h-3.5 text-[#c9a36a] shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl sm:text-2xl font-light text-[#f4eee5] group-hover:text-[#c9a36a] transition-colors leading-snug line-clamp-1">
            <Link
              href={`/properties/${property.slug}`}
              className="focus:outline-none focus-visible:underline"
              aria-label={`View ${property.title} in ${property.locality}`}
            >
              {property.title}
            </Link>
          </h3>

          {/* Tagline */}
          <p className="text-xs text-[#8f9ba8] font-sans font-light line-clamp-2 leading-relaxed">
            {property.tagline || property.description}
          </p>
        </div>

        {/* Specifications Strip */}
        <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-3 gap-2 text-center text-xs text-[#8f9ba8]">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#0e1624]/60 border border-white/5">
            <Bed className="w-3.5 h-3.5 text-[#c9a36a] mb-1" />
            <span className="font-mono text-[11px] text-[#f4eee5]">{property.bhk} BHK</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#0e1624]/60 border border-white/5">
            <Bath className="w-3.5 h-3.5 text-[#c9a36a] mb-1" />
            <span className="font-mono text-[11px] text-[#f4eee5]">{property.bathrooms} Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#0e1624]/60 border border-white/5">
            <Maximize2 className="w-3.5 h-3.5 text-[#c9a36a] mb-1" />
            <span className="font-mono text-[11px] text-[#f4eee5]">{formatArea(property.areaSqFt)}</span>
          </div>
        </div>

        {/* Action Link Button */}
        <div className="pt-2">
          <Link
            href={`/properties/${property.slug}`}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0e1624] hover:bg-[#c9a36a] text-[#f4eee5] hover:text-[#0a0f18] border border-[rgba(201,163,106,0.3)] hover:border-[#c9a36a] text-xs font-mono font-medium tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group/btn"
          >
            <span>Explore Residence</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
