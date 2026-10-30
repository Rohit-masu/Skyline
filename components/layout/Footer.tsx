import Link from "next/link";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { PAVILION, SOCIAL_LINKS, TOTAL_HOMES } from "@/lib/site";

const LINK_COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Residences", href: "/properties" },
      { label: "The tower", href: "/#arrival" },
      { label: "Amenities", href: "/#pool" },
      { label: "Inside a home", href: "/#inside" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "3D tour", href: "/#build" },
      { label: "Visit the pavilion", href: "/#visit" },
      { label: "Book a visit", href: "/properties" },
      { label: "Contact", href: `mailto:${PAVILION.email}` },
    ],
  },
];

const columnTitle = "text-[11px] uppercase tracking-[0.25em] text-brass";
// Hairline between columns on wide screens (like the reference footer); none when stacked.
const columnDivider = "lg:border-l lg:border-white/5 lg:pl-10";

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

        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr] lg:gap-0">
          <div className="footer-reveal space-y-5 lg:pr-10" style={{ "--i": 1 } as React.CSSProperties}>
            <Link href="/" aria-label="Skyline home" className="inline-flex items-center gap-2">
              <span className="font-display text-2xl font-light tracking-[0.32em] text-ivory">SKYLINE</span>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brass" />
            </Link>
            <p className="max-w-xs text-sm font-light leading-relaxed">
              Elevated living, thoughtfully imagined. {TOTAL_HOMES} residences above Noida Expressway.
            </p>
            <ul className="flex items-center gap-5 pt-1 text-[11px] uppercase tracking-[0.2em]">
              {SOCIAL_LINKS.map((social, index) => (
                <li key={social.label} className={index > 0 ? "border-l border-white/10 pl-5" : ""}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 hover:text-ivory">
                    {social.label}
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {LINK_COLUMNS.map((column, index) => (
            <nav key={column.title} aria-label={column.title} className={`footer-reveal space-y-4 ${columnDivider}`} style={{ "--i": index + 2 } as React.CSSProperties}>
              <h2 className={columnTitle}>{column.title}</h2>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="link-underline hover:text-ivory">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={`footer-reveal space-y-4 ${columnDivider}`} style={{ "--i": 4 } as React.CSSProperties}>
            <h2 className={columnTitle}>Get in touch</h2>
            <address className="space-y-3 text-sm not-italic">
              <a href={`tel:${PAVILION.phoneHref}`} className="group flex items-center gap-3 hover:text-ivory">
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-brass transition-transform duration-200 group-hover:scale-110" />
                {PAVILION.phone}
              </a>
              <a href={`mailto:${PAVILION.email}`} className="group flex items-center gap-3 break-all hover:text-ivory">
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-brass transition-transform duration-200 group-hover:scale-110" />
                {PAVILION.email}
              </a>
              <a href={PAVILION.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 hover:text-ivory">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brass transition-transform duration-200 group-hover:scale-110" />
                <span className="max-w-[15rem]">{PAVILION.address}</span>
                <span className="sr-only">(opens Maps in a new tab)</span>
              </a>
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
