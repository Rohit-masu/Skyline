import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitWords } from "@/components/motion/SplitWords";

// Closing invitation: a full-bleed night photo with GSAP parallax and a magnetic CTA.
export function VisitInvitation() {
  return (
    <section
      id="visit"
      aria-labelledby="visit-title"
      className="relative z-10 overflow-hidden bg-ink px-4 py-36 text-center sm:px-8 lg:px-12 lg:py-48"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {/* Taller than the section so the parallax drift never reveals an edge. */}
        <div data-parallax="8" className="absolute inset-x-0 -inset-y-[12%]">
          <Image src="/images/landing/rooftop-night.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-ink/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="relative mx-auto max-w-3xl space-y-8">
        <p data-reveal className="text-[11px] uppercase tracking-[0.35em] text-brass">07 — Private invitation</p>
        <h2 id="visit-title" data-split className="font-display text-4xl font-light leading-tight tracking-tight text-ivory sm:text-6xl">
          <SplitWords text="Find the home that fits your view." accent={["view."]} />
        </h2>
        <p data-reveal className="mx-auto max-w-xl text-base font-light leading-relaxed text-ivory/75 sm:text-lg">
          Visit the Skyline experience pavilion on Noida Expressway for a private walkthrough of the residences and
          their floor plans.
        </p>
        <div data-reveal className="flex justify-center pt-4">
          <Link
            href="/properties"
            data-magnetic
            className="btn-brass inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs uppercase tracking-widest"
          >
            Browse all residences
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
