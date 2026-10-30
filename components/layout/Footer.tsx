import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { PAVILION, TOTAL_FLOORS, TOTAL_HOMES } from "@/lib/site";

const EXPLORE_LINKS = [
  { label: "Residences", href: "/properties" },
  { label: "The tower", href: "/#arrival" },
  { label: "Amenities", href: "/#pool" },
  { label: "Visit", href: "/#visit" },
];

const columnTitle = "text-[11px] uppercase tracking-[0.25em] text-ivory/90";

// Quiet, three-column footer. Shown on every page, so the motion is CSS only (scroll-driven,
// .footer-reveal in globals.css): no GSAP on listings/detail, and without support it simply shows.
export function Footer() {
  return (
    <footer className="relative z-10 overflow-clip border-t border-white/5 bg-ink-deep text-mist">
      <div className="section-inner relative pb-10 pt-20 lg:pt-24">
        <div
          className="footer-reveal flex flex-col justify-between gap-8 border-b border-white/5 pb-14 sm:flex-row sm:items-end"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <p className="font-display text-4xl font-light leading-tight tracking-tight text-ivory sm:text-5xl">
            Let&apos;s find <span className="italic text-brass">your floor.</span>
          </p>
          <Link
            href="/properties"
            className="group inline-flex items-center gap-3 self-start text-[11px] uppercase tracking-[0.22em] text-ivory sm:self-auto"
          >
            <span className="link-underline">Explore homes</span>
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full border border-brass/40 text-brass transition-all duration-300 group-hover:rotate-45 group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-[1.5fr_1fr_1.2fr]">
          <div className="footer-reveal space-y-4" style={{ "--i": 1 } as React.CSSProperties}>
            <Link href="/" aria-label="Skyline home" className="inline-flex items-center gap-2">
              <span className="font-display text-lg font-light tracking-[0.32em] text-ivory">SKYLINE</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brass" />
            </Link>
            <p className="max-w-xs text-sm font-light leading-relaxed">
              {TOTAL_HOMES} residences across {TOTAL_FLOORS} floors above Noida Expressway.
            </p>
          </div>

          <nav aria-label="Footer" className="footer-reveal space-y-4" style={{ "--i": 2 } as React.CSSProperties}>
            <h2 className={columnTitle}>Explore</h2>
            <ul className="space-y-2.5 text-sm">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline hover:text-ivory">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-reveal space-y-4" style={{ "--i": 3 } as React.CSSProperties}>
            <h2 className={columnTitle}>Visit</h2>
            <address className="space-y-2.5 text-sm not-italic">
              <p className="max-w-[16rem]">{PAVILION.address}</p>
              <p><a href={`tel:${PAVILION.phoneHref}`} className="link-underline hover:text-ivory">{PAVILION.phone}</a></p>
              <p><a href={`mailto:${PAVILION.email}`} className="link-underline break-all hover:text-ivory">{PAVILION.email}</a></p>
            </address>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-mist/80 sm:flex-row sm:items-center">
          <p>© 2026 Skyline Residences · A fictional project; renders are illustrative · RERA UPRERAPRJ-SKY-2026</p>
          <a href="#" className="group inline-flex items-center gap-2 uppercase tracking-widest hover:text-brass">
            Back to top
            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Big brass wordmark that rises out of the bottom edge as the footer scrolls in. The box
          is shorter than the letters, so their lower part stays cut off (like a horizon). */}
      <div aria-hidden="true" className="footer-brand pointer-events-none h-[10vw] select-none overflow-clip">
        <p className="footer-watermark whitespace-nowrap bg-gradient-to-b from-brass-light via-brass to-brass-dark bg-clip-text text-center font-display text-[16vw] font-semibold uppercase leading-[0.8] tracking-[0.1em] text-transparent">
          Skyline
        </p>
      </div>
    </footer>
  );
}
