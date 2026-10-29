import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Building2, Layers, KeyRound, Shield, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AltitudeRail } from "@/components/ui/AltitudeRail";
import { Hero } from "@/components/hero/Hero";
import { TowerStorySection } from "@/components/story/TowerStorySection";
import { PROPERTIES_DATA } from "@/data/properties";
import { PropertyCard } from "@/components/properties/PropertyCard";

export default function HomePage() {
  const featuredProperties = PROPERTIES_DATA.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="relative min-h-screen bg-[#0a0f18] text-[#f4eee5] selection:bg-[#c9a36a] selection:text-[#0a0f18]">
      {/* Site-wide Header & Altitude Navigation Rail */}
      <Header />
      <AltitudeRail />

      <main>
        {/* S1: Arrival (Cinematic Hero with Static Fallback for Immediate LCP) */}
        <Hero />

        {/* S2: Manifesto Section */}
        <section
          id="manifesto"
          className="relative py-28 lg:py-36 px-6 sm:px-8 lg:px-12 bg-[#080d15] border-y border-[rgba(201,163,106,0.12)] overflow-hidden"
          aria-label="Design Manifesto"
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#c9a36a] font-sans font-medium block">
              02 —— THE PHILOSOPHY
            </span>

            <blockquote className="font-display text-3xl sm:text-5xl lg:text-6xl font-light text-[#f4eee5] leading-[1.25] tracking-tight">
              “We built Skyline for those who measure a home in{" "}
              <span className="italic text-[#c9a36a]">light</span>,{" "}
              <span className="italic text-[#c9a36a]">air</span> and{" "}
              <span className="italic text-[#c9a36a]">silence</span> — not square feet alone.”
            </blockquote>

            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent mx-auto" />

            <p className="text-sm sm:text-base text-[#8f9ba8] max-w-xl mx-auto font-sans font-light leading-relaxed">
              Every curve of the facade, every orientation of the private terraces, 
              and every drop of morning light is engineered to offer a peaceful sanctuary 28 floors above the city.
            </p>
          </div>
        </section>

        {/* S3: Scroll-driven 3D Story (Lazy-loaded Three.js Tower Experience) */}
        <TowerStorySection />

        {/* S4: Inside A Home (Floor Plan & Interior Showcase) */}
        <section
          id="floorplans"
          className="relative py-28 lg:py-36 px-6 sm:px-8 lg:px-12 bg-[#06090f] border-t border-[rgba(201,163,106,0.12)]"
          aria-label="Inside The Residences"
        >
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#c9a36a] font-sans font-medium block">
                  03 —— RESIDENCE BLUEPRINTS
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-light text-[#f4eee5] leading-tight">
                  Step <span className="italic text-[#c9a36a]">inside</span> pure refinement.
                </h2>
                <p className="text-sm sm:text-base text-[#8f9ba8] font-sans font-light">
                  Explore our signature 3 BHK Sky Suite. Intelligently segregated private and social zones 
                  with imported Italian marble and expansive panoramic glass balconies.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/properties"
                  className="btn-brass px-6 py-3 rounded-full text-xs uppercase tracking-widest flex items-center gap-2"
                >
                  <span>View All 50+ Floor Plans</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Blueprint Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[rgba(201,163,106,0.25)] relative aspect-[16/10] bg-[#0c121c]">
                <Image
                  src="/images/landing/interior-living.jpg"
                  alt="Skyline 3 BHK Master Living Pavilion"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 bg-[#0a0f18]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-mono text-[#c9a36a] border border-[rgba(201,163,106,0.3)]">
                  LEVEL 18 · SIGNATURE SKY SUITE
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-mono text-[#c9a36a] uppercase">FLOOR PLAN SPECIFICATIONS</span>
                  <h3 className="font-display text-2xl text-[#f4eee5]">The 3 BHK Grand Living Deck</h3>
                  <p className="text-xs text-[#8f9ba8] leading-relaxed">
                    Designed with 11-foot clear finished ceilings and floor-to-ceiling double-glazed thermal acoustic glass, framing uninterrupted panoramic views of Sector 128 Noida.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between text-sm py-2 border-b border-[rgba(255,255,255,0.06)]">
                    <span className="text-[#8f9ba8]">Carpet Area</span>
                    <span className="text-[#f4eee5] font-mono">2,450 sq.ft</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-[rgba(255,255,255,0.06)]">
                    <span className="text-[#8f9ba8]">Sunset Balcony Deck</span>
                    <span className="text-[#f4eee5] font-mono">60-ft Continuous Glass Railing</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-[rgba(255,255,255,0.06)]">
                    <span className="text-[#8f9ba8]">Private Elevators</span>
                    <span className="text-[#c9a36a] font-mono">2 High-Speed Keycard Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S5: Featured Residences Portfolio Strip */}
        <section
          id="featured"
          className="relative py-28 lg:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto"
          aria-label="Featured Residences"
        >
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#c9a36a] font-mono block">
                  04 —— FEATURED SELECTION
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-light text-[#f4eee5] leading-tight">
                  Hand-Curated <span className="italic text-[#c9a36a]">Residences</span>
                </h2>
                <p className="text-sm text-[#8f9ba8] font-sans font-light">
                  A preview of our most exclusive penthouses, duplex suites, and sky apartments.
                </p>
              </div>

              <Link
                href="/properties"
                className="btn-outline-brass px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-mono flex items-center gap-2 hover:bg-[#c9a36a] hover:text-[#0a0f18] transition-colors"
              >
                <span>View All 56 Residences</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProperties.map((prop, idx) => (
                <PropertyCard key={prop.id} property={prop} priority={idx < 3} />
              ))}
            </div>
          </div>
        </section>

        {/* S6: Podium & Sky Amenities */}
        <section
          id="amenities"
          className="relative py-28 lg:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[rgba(201,163,106,0.12)]"
          aria-label="Podium Amenities"
        >
          <div className="space-y-16">
            <div className="max-w-2xl space-y-4">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#c9a36a] font-sans font-medium block">
                05 —— PRIVATE AMENITIES
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-light text-[#f4eee5] leading-tight">
                Everything, <span className="italic text-[#c9a36a]">one lift away</span>.
              </h2>
              <p className="text-sm sm:text-base text-[#8f9ba8] font-sans font-light">
                Curated for wellness, leisure and private entertaining without leaving your vertical sanctuary.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Infinity Pool */}
              <div className="group rounded-2xl overflow-hidden bg-[#141d2b]/40 border border-[rgba(201,163,106,0.18)] hover:border-[#c9a36a] transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/landing/amenity-pool.jpg"
                    alt="Cantilevered Infinity Swimming Pool"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#0a0f18]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#c9a36a] border border-[rgba(201,163,106,0.2)]">
                    LEVEL 04 PODIUM
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-2xl text-[#f4eee5] group-hover:text-[#c9a36a] transition-colors">
                    Cantilevered Infinity Pool
                  </h3>
                  <p className="text-xs text-[#8f9ba8] leading-relaxed">
                    A temperature-controlled 50-meter lap pool extending past the podium edge, 
                    flanked by private cabanas and underwater acoustic sound.
                  </p>
                </div>
              </div>

              {/* Card 2: Sky Gym & Wellness */}
              <div className="group rounded-2xl overflow-hidden bg-[#141d2b]/40 border border-[rgba(201,163,106,0.18)] hover:border-[#c9a36a] transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/landing/amenity-gym.jpg"
                    alt="Level 24 Sky Fitness Pavilion"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#0a0f18]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#c9a36a] border border-[rgba(201,163,106,0.2)]">
                    LEVEL 24 SKY CLUB
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-2xl text-[#f4eee5] group-hover:text-[#c9a36a] transition-colors">
                    Sky Wellness Suite
                  </h3>
                  <p className="text-xs text-[#8f9ba8] leading-relaxed">
                    Equipped with Technogym Artis series, dedicated reformer Pilates studio, 
                    cryo-sauna and panoramic sunset meditation decks.
                  </p>
                </div>
              </div>

              {/* Card 3: Rooftop Sky Lounge */}
              <div className="group rounded-2xl overflow-hidden bg-[#141d2b]/40 border border-[rgba(201,163,106,0.18)] hover:border-[#c9a36a] transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/landing/rooftop-night.jpg"
                    alt="Level 28 Rooftop Starlit Lounge"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#0a0f18]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#c9a36a] border border-[rgba(201,163,106,0.2)]">
                    LEVEL 28 ROOFTOP
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-2xl text-[#f4eee5] group-hover:text-[#c9a36a] transition-colors">
                    Crown Starlit Lounge
                  </h3>
                  <p className="text-xs text-[#8f9ba8] leading-relaxed">
                    Open-air astronomical firepit lounge, private dining chef reservation pavilion, 
                    and uninterrupted 360-degree city views.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S7: Private Visit Call to Action */}
        <section
          id="cta"
          className="relative py-32 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-[#0a0f18] via-[#0e1624] to-[#06090f] border-t border-[rgba(201,163,106,0.2)] text-center overflow-hidden"
          aria-label="Private Consultation Call to Action"
        >
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#c9a36a] font-sans font-medium block">
              06 —— PRIVATE INVITATION
            </span>

            <h2 className="font-display text-4xl sm:text-6xl font-light text-[#f4eee5] tracking-tight leading-tight">
              Find the home that <span className="italic text-[#c9a36a]">fits your view</span>.
            </h2>

            <p className="text-base sm:text-lg text-[#8f9ba8] max-w-xl mx-auto font-sans font-light leading-relaxed">
              Step into the Skyline Experience Pavilion by Reeltor on Noida Expressway (Sector 128) for a private viewing 
              of architectural mockups and customized floor specifications.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-5">
              <Link
                href="/properties"
                className="btn-brass px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center gap-3"
              >
                <span>Browse All Residences</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Architectural Luxury Footer */}
      <Footer />
    </div>
  );
}
