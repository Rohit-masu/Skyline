import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const RING_TEXT = "Book a private visit · Book a private visit · ";

// Round call-to-action: text set on a circular SVG path that turns slowly (CSS .spin-slow, stops
// with reduced motion), with a still arrow in the middle. Pure SVG + CSS, no JavaScript.
export function VisitBadge() {
  return (
    <Link
      href="/properties"
      data-magnetic
      aria-label="Book a private visit: choose a home"
      className="group relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-ink/80 backdrop-blur-md sm:h-36 sm:w-36"
    >
      <svg viewBox="0 0 200 200" aria-hidden="true" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="visit-ring" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text className="fill-brass text-[17px] uppercase tracking-[0.32em]">
          <textPath href="#visit-ring">{RING_TEXT}</textPath>
        </text>
      </svg>
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brass text-ink transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110"
      >
        <ArrowUpRight className="h-6 w-6" />
      </span>
    </Link>
  );
}
