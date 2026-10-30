import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PAVILION } from "@/lib/site";

// Closing invitation: the same heading pattern as Featured homes, plus a card with the sales
// pavilion's address and hours (this is where the header's "Location" link lands).
export function VisitInvitation() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="section-shell relative overflow-hidden bg-ink">
      <div className="absolute inset-0" aria-hidden="true">
        {/* Taller than the section so the parallax drift never reveals an edge. */}
        <div data-parallax="8" className="absolute inset-x-0 -inset-y-[12%]">
          <Image src="/images/landing/rooftop-night.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-ink/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="section-inner relative grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-10">
          <SectionHeading
            id="visit-title"
            number="07"
            eyebrow="Visit the pavilion"
            title="Find the home that fits your view."
            accent={["view."]}
            intro="Walk through full-size show apartments and the floor plans at our experience pavilion on Noida Expressway. Visits are private and take about an hour."
          />
          <div data-reveal data-reveal-delay="0.25" className="flex flex-wrap gap-4">
            <Link
              href="/properties"
              data-magnetic
              className="btn-brass inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs uppercase tracking-widest"
            >
              Browse all residences
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`tel:${PAVILION.phoneHref}`}
              data-magnetic
              className="btn-outline-brass inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs uppercase tracking-widest"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call the pavilion
            </a>
          </div>
        </div>

        <address data-reveal data-reveal-delay="0.2" className="not-italic">
          <div className="space-y-6 rounded-3xl border border-brass/20 bg-[#0e1624]/80 p-8 shadow-2xl backdrop-blur-md sm:p-10">
            <p className="font-display text-2xl font-light text-ivory">{PAVILION.name}</p>
            <ul className="space-y-4 text-sm text-ivory-dim">
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                {PAVILION.address}
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                {PAVILION.hours}
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                <a href={`tel:${PAVILION.phoneHref}`} className="hover:text-brass">{PAVILION.phone}</a>
              </li>
            </ul>
            <a
              href={PAVILION.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brass underline-offset-4 hover:underline"
            >
              Open in Maps
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </address>
      </div>
    </section>
  );
}
