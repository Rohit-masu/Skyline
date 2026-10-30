"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Compass, Phone } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Residences", href: "/properties" },
    { label: "The Ascent", href: "/#arrival" },
    { label: "Amenities", href: "/#pool" },
    { label: "Floor Plans", href: "/#inside" },
    { label: "Location", href: "/#location" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0f18]/85 backdrop-blur-md border-b border-[rgba(201,163,106,0.15)] py-4 shadow-2xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo / Wordmark */}
          <Link
            href="/"
            className="group flex flex-col items-start focus:outline-none"
            aria-label="Skyline Homepage"
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl sm:text-3xl font-light tracking-[0.25em] text-[#f4eee5] group-hover:text-[#c9a36a] transition-colors duration-300">
                SKYLINE
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a36a] inline-block animate-pulse" />
            </div>
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#8f9ba8] font-sans -mt-0.5">
              Elevated Living · Noida Expressway · Reeltor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] text-[#8f9ba8] hover:text-[#f4eee5] transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9a36a] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/properties"
              className="btn-brass px-5 py-2.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <span>Explore Homes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#f4eee5] hover:text-[#c9a36a] focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#06090f]/95 backdrop-blur-xl md:hidden flex flex-col justify-between p-8 pt-28 animate-fadeIn">
          <nav className="flex flex-col space-y-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a36a] font-sans">
              Navigation
            </span>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-2xl text-[#f4eee5] hover:text-[#c9a36a] tracking-wider transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-8 border-t border-[rgba(201,163,106,0.15)] flex flex-col gap-4">
            <Link
              href="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-brass w-full text-center py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            >
              <span>Explore Residences</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-between text-xs text-[#8f9ba8] pt-2">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#c9a36a]" />
                28.4595° N, 77.0266° E
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#c9a36a]" />
                +91 98100 SKYLINE
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
