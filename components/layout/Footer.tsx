import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { PAVILION, TOTAL_FLOORS, TOTAL_HOMES } from "@/lib/site";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "All residences", href: "/properties" },
      { label: "The tower story", href: "/#arrival" },
      { label: "Inside a home", href: "/#inside" },
      { label: "Amenities", href: "/#pool" },
      { label: "Visit the pavilion", href: "/#visit" },
    ],
  },
  {
    title: "Homes",
    links: [
      { label: "2 BHK apartments", href: "/properties?bhk=2" },
      { label: "3 BHK apartments", href: "/properties?bhk=3" },
      { label: "4 BHK residences", href: "/properties?bhk=4" },
      { label: "Penthouses", href: "/properties?type=Penthouse" },
      { label: "Villas", href: "/properties?type=Villa" },
    ],
  },
];

// Shown on every page, so the motion is CSS only (scroll-driven, see .footer-reveal in
// globals.css): no GSAP on listings/detail, and without support everything is simply visible.
export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-brass/15 bg-ink-deep text-mist">
      <div className="section-inner relative pb-10 pt-24">
        <div className="grid grid-cols-1 gap-12 border-b border-white/5 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="footer-reveal space-y-6" style={{ "--i": 0 } as React.CSSProperties}>
            <Link href="/" className="inline-flex items-center gap-2" aria-label="Skyline home">
              <span className="font-display text-3xl font-light tracking-[0.25em] text-ivory">SKYLINE</span>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brass" />
            </Link>
            <p className="max-w-xs text-sm font-light leading-relaxed">
              {TOTAL_HOMES} residences across {TOTAL_FLOORS} floors above Noida Expressway, with a podium pool, a sky gym and
              a roof garden.
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-brass/80">RERA reg. UPRERAPRJ-SKY-2026</p>
          </div>

          {COLUMNS.map((column, index) => (
            <nav key={column.title} aria-label={column.title} className="footer-reveal space-y-5" style={{ "--i": index + 1 } as React.CSSProperties}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ivory">{column.title}</h2>
              <ul className="space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline hover:text-ivory">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer-reveal space-y-5" style={{ "--i": 3 } as React.CSSProperties}>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ivory">Contact</h2>
            <address className="space-y-3 text-sm not-italic">
              <p className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                {PAVILION.address}
              </p>
              <a href={`tel:${PAVILION.phoneHref}`} className="flex gap-3 hover:text-ivory">
                <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                {PAVILION.phone}
              </a>
              <a href={`mailto:${PAVILION.email}`} className="flex gap-3 break-all hover:text-ivory">
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                {PAVILION.email}
              </a>
            </address>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-mist/80 sm:flex-row sm:items-center">
          <p>© 2026 Skyline Residences. A fictional project; renders and photos are illustrative.</p>
          <a href="#" className="group inline-flex items-center gap-2 uppercase tracking-widest hover:text-brass">
            Back to top
            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <p aria-hidden="true" className="footer-watermark pointer-events-none select-none whitespace-nowrap text-center font-display text-[18vw] font-bold uppercase leading-[0.8] tracking-[0.2em] text-brass/[0.06]">
        Skyline
      </p>
    </footer>
  );
}
