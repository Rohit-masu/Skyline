import Link from "next/link";
import { ArrowUpRight, Compass, Phone, Mail, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#06090f] text-[#8f9ba8] pt-24 pb-12 overflow-hidden border-t border-[rgba(201,163,106,0.15)]">
      {/* Background Watermark */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none w-full text-center overflow-hidden opacity-5"
        aria-hidden="true"
      >
        <span className="font-display text-[18vw] leading-none font-bold tracking-[0.2em] text-[#c9a36a] uppercase whitespace-nowrap">
          SKYLINE
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[rgba(255,255,255,0.06)]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-light tracking-[0.25em] text-[#f4eee5]">
                SKYLINE
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a36a]" />
            </div>
            <p className="text-sm font-sans font-light leading-relaxed text-[#8f9ba8] max-w-sm">
              The Art of Elevated Living. A bespoke collection of 112 residences 
              crafted with architectural precision, soaring 28 levels above the city pulse.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#c9a36a]">
              <ShieldCheck className="w-4 h-4" />
              <span>HARERA NO: RC/REP/HARERA/GGM/2026/89</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#f4eee5] font-sans font-semibold block">
              Exploration
            </span>
            <ul className="space-y-2.5 text-xs font-sans tracking-wide">
              <li>
                <Link href="/properties" className="hover:text-[#c9a36a] transition-colors">
                  All Residences
                </Link>
              </li>
              <li>
                <a href="/#story" className="hover:text-[#c9a36a] transition-colors">
                  The Ascent Story
                </a>
              </li>
              <li>
                <a href="/#amenities" className="hover:text-[#c9a36a] transition-colors">
                  Podium Amenities
                </a>
              </li>
              <li>
                <a href="/#floorplans" className="hover:text-[#c9a36a] transition-colors">
                  Floor Plans & Layouts
                </a>
              </li>
              <li>
                <a href="/#view" className="hover:text-[#c9a36a] transition-colors">
                  The View Experience
                </a>
              </li>
            </ul>
          </div>

          {/* Configurations */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#f4eee5] font-sans font-semibold block">
              Configurations
            </span>
            <ul className="space-y-2.5 text-xs font-sans tracking-wide">
              <li>
                <Link href="/properties?bhk=2" className="hover:text-[#c9a36a] transition-colors">
                  2 BHK Suites (1,250 sq ft)
                </Link>
              </li>
              <li>
                <Link href="/properties?bhk=3" className="hover:text-[#c9a36a] transition-colors">
                  3 BHK Residences (2,100 sq ft)
                </Link>
              </li>
              <li>
                <Link href="/properties?bhk=4" className="hover:text-[#c9a36a] transition-colors">
                  4 BHK Sky Mansions (3,400 sq ft)
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Penthouse" className="hover:text-[#c9a36a] transition-colors">
                  Duplex Penthouses
                </Link>
              </li>
            </ul>
          </div>

          {/* Sales Gallery */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#f4eee5] font-sans font-semibold block">
              Private Gallery
            </span>
            <div className="space-y-3 text-xs font-sans">
              <p className="text-[#8f9ba8] leading-relaxed">
                Skyline by Reeltor Experience Pavilion, Sector 128, Noida Expressway, Uttar Pradesh 201304
              </p>
              <div className="flex items-center gap-2 text-[#f4eee5] hover:text-[#c9a36a] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#c9a36a]" />
                <span>+91 98100 SKYLINE</span>
              </div>
              <div className="flex items-center gap-2 text-[#f4eee5] hover:text-[#c9a36a] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#c9a36a]" />
                <span>concierge@skyline-residences.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8f9ba8]/60 gap-4">
          <p>© 2026 Skyline Residences by Reeltor. All architectural designs and renders are creative representations.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#8f9ba8] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#8f9ba8] cursor-pointer">Terms of Living</span>
            <span className="hover:text-[#8f9ba8] cursor-pointer">Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
