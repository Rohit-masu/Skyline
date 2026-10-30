"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { PAVILION } from "@/lib/site";

const NAV_LINKS = [
  { label: "Residences", href: "/properties" },
  { label: "The tower", href: "/#arrival" },
  { label: "Amenities", href: "/#pool" },
  { label: "Visit", href: "/#visit" },
];

// Minimal bar: wordmark, four links, one quiet call to action. The height never changes on
// scroll (no layout jump); only a translucent background fades in.
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // While the mobile menu is open: no page scroll behind it, Escape closes it.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) => href === "/properties" && pathname.startsWith("/properties");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          scrolled || menuOpen ? "border-white/5 bg-ink/70 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Skyline home" className="group flex items-center gap-2">
            <span className="font-display text-xl font-light tracking-[0.32em] text-ivory transition-colors duration-300 group-hover:text-brass">
              SKYLINE
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brass" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`link-underline text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${
                  isActive(link.href) ? "text-ivory [background-size:100%_1px]" : "text-mist hover:text-ivory"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/properties"
            className="hidden items-center gap-2 rounded-full border border-brass/40 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors duration-300 hover:border-brass hover:bg-brass hover:text-ink md:inline-flex"
          >
            Explore homes
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-ivory md:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div id="mobile-menu" className="animate-fade-in fixed inset-0 z-40 flex flex-col justify-between bg-ink-deep/97 px-6 pb-10 pt-28 backdrop-blur-xl md:hidden">
          <nav aria-label="Main" className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl font-light text-ivory transition-colors hover:text-brass"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-5 border-t border-white/10 pt-8">
            <Link
              href="/properties"
              onClick={() => setMenuOpen(false)}
              className="btn-brass flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs uppercase tracking-widest"
            >
              Explore homes
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a href={`tel:${PAVILION.phoneHref}`} className="flex items-center justify-center gap-2 text-xs text-mist">
              <Phone aria-hidden="true" className="h-3.5 w-3.5 text-brass" />
              {PAVILION.phone}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
