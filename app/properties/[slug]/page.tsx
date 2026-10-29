import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bed,
  Bath,
  Maximize2,
  Car,
  MapPin,
  ChevronRight,
  Home,
  Check,
  Compass,
  Building,
  Calendar,
  Layers,
  Sparkles,
  Shield,
  PhoneCall,
} from "lucide-react";
import { PROPERTIES_DATA } from "@/data/properties";
import type { Property } from "@/types/property";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { formatPrice, formatArea, formatNumber } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROPERTIES_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = PROPERTIES_DATA.find((p) => p.slug === slug);

  if (!property) {
    return {
      title: "Residence Not Found — Skyline",
      description: "The requested residential suite does not exist.",
    };
  }

  const metaTitle = `${property.title} — ${property.locality}, ${property.city}`;
  const metaDesc = `${property.tagline || property.description.slice(0, 150)} | ${property.bhk} BHK ${property.type} at ${property.locality}. Available from ${formatPrice(property.price)}.`;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: property.images?.[0] ? [{ url: property.images[0] }] : undefined,
    },
  };
}

function getSimilarProperties(current: Property): Property[] {
  const candidates = PROPERTIES_DATA.filter((p) => p.slug !== current.slug);

  candidates.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.locality === current.locality) scoreA += 100;
    else if (a.city === current.city) scoreA += 50;

    if (b.locality === current.locality) scoreB += 100;
    else if (b.city === current.city) scoreB += 50;

    if (a.bhk === current.bhk) scoreA += 30;
    if (b.bhk === current.bhk) scoreB += 30;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    const diffA = Math.abs(a.price - current.price);
    const diffB = Math.abs(b.price - current.price);
    return diffA - diffB;
  });

  return candidates.slice(0, 4);
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = PROPERTIES_DATA.find((p) => p.slug === slug);

  if (!property) {
    notFound();
  }

  const similar = getSimilarProperties(property);

  return (
    <div className="min-h-screen bg-[#0a0f18] text-[#f4eee5] flex flex-col justify-between selection:bg-[#c9a36a] selection:text-[#0a0f18]">
      <Header />

      <main className="flex-1 pt-28 pb-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#8f9ba8]">
            <li className="flex items-center gap-1.5 hover:text-[#f4eee5] transition-colors">
              <Home className="w-3.5 h-3.5 text-[#c9a36a]" />
              <Link href="/">Skyline</Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-[#8f9ba8]/50" />
            </li>
            <li className="hover:text-[#f4eee5] transition-colors">
              <Link href="/properties">Residences</Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-[#8f9ba8]/50" />
            </li>
            <li className="text-[#c9a36a] font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
              {property.title}
            </li>
          </ol>
        </nav>

        {/* Hero Title & Price Header */}
        <header className="mb-10 pb-8 border-b border-[rgba(255,255,255,0.08)] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-[#141d2b] px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#c9a36a] border border-[rgba(201,163,106,0.3)] uppercase">
                {property.type}
              </span>
              <span className="bg-[#0e1624] px-3 py-1 rounded-full text-[10px] font-mono text-[#8f9ba8] border border-white/10 uppercase">
                Floor {property.floor} of {property.totalFloors}
              </span>
              {property.featured && (
                <span className="bg-[#c9a36a] text-[#0a0f18] px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Featured Residence
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#f4eee5] tracking-tight leading-tight">
              {property.title}
            </h1>

            {/* Locality & Tagline */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sm text-[#8f9ba8] font-sans">
                <MapPin className="w-4 h-4 text-[#c9a36a] shrink-0" />
                <span>
                  {property.locality}, {property.city}
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#8f9ba8]/90 font-sans font-light italic">
                &ldquo;{property.tagline}&rdquo;
              </p>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="lg:text-right space-y-1 bg-[#141d2b]/40 p-4 sm:p-6 rounded-2xl border border-[rgba(201,163,106,0.2)] shrink-0">
            <span className="text-[10px] font-mono tracking-widest text-[#8f9ba8] uppercase block">
              OFFERING PRICE
            </span>
            <div className="font-display text-3xl sm:text-4xl font-light text-[#c9a36a]">
              {formatPrice(property.price)}
            </div>
            <div className="text-xs font-mono text-[#8f9ba8]">
              ₹{formatNumber(property.pricePerSqFt)} / sq.ft &bull;{" "}
              <span className="text-[#f4eee5]">{property.furnished ? "Fully Furnished" : "Unfurnished"}</span>
            </div>
          </div>
        </header>

        {/* Two-Column Layout: Main Details (Left) + Enquiry Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12">
            {/* Interactive Keyboard Photo Gallery */}
            <PropertyGallery
              images={property.images}
              title={property.title}
              propertyType={property.type}
            />

            {/* Architectural Key Figures Grid */}
            <section aria-label="Key Architectural Figures" className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a36a]">
                01 -- KEY ARCHITECTURAL METRICS
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#0e1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#8f9ba8] text-xs font-mono">
                    <Bed className="w-4 h-4 text-[#c9a36a]" />
                    <span>Configuration</span>
                  </div>
                  <div className="text-xl font-display font-light text-[#f4eee5]">
                    {property.bhk} BHK Suite
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#8f9ba8] text-xs font-mono">
                    <Maximize2 className="w-4 h-4 text-[#c9a36a]" />
                    <span>Carpet Area</span>
                  </div>
                  <div className="text-xl font-display font-light text-[#f4eee5]">
                    {formatArea(property.areaSqFt)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#8f9ba8] text-xs font-mono">
                    <Bath className="w-4 h-4 text-[#c9a36a]" />
                    <span>Bathrooms</span>
                  </div>
                  <div className="text-xl font-display font-light text-[#f4eee5]">
                    {property.bathrooms} En-Suite
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#8f9ba8] text-xs font-mono">
                    <Building className="w-4 h-4 text-[#c9a36a]" />
                    <span>Elevation</span>
                  </div>
                  <div className="text-xl font-display font-light text-[#f4eee5]">
                    Level {property.floor} / {property.totalFloors}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#8f9ba8] text-xs font-mono">
                    <Car className="w-4 h-4 text-[#c9a36a]" />
                    <span>Basement Parking</span>
                  </div>
                  <div className="text-xl font-display font-light text-[#f4eee5]">
                    {property.parking} Dedicated Bays
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1624] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#8f9ba8] text-xs font-mono">
                    <Layers className="w-4 h-4 text-[#c9a36a]" />
                    <span>Furnishing</span>
                  </div>
                  <div className="text-xl font-display font-light text-[#f4eee5]">
                    {property.furnished ? "Designer Ready" : "Bare Shell"}
                  </div>
                </div>
              </div>
            </section>

            {/* Overview / Narrative */}
            <section aria-label="Architectural Description" className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a36a]">
                02 -- ARCHITECTURAL NARRATIVE
              </h2>
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1624]/60 border border-[rgba(201,163,106,0.15)] leading-relaxed text-[#d8d0c2] font-sans font-light text-base space-y-4">
                <p>{property.description}</p>
                <p className="text-sm text-[#8f9ba8]">
                  Carefully positioned to capture maximum southern light and evening sunset vistas over {property.locality}. Double-glazed acoustic thermal facade panels guarantee a tranquil, private vertical refuge.
                </p>
              </div>
            </section>

            {/* Bespoke Specifications Table */}
            <section aria-label="Specifications" className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a36a]">
                03 -- TECHNICAL SPECIFICATIONS
              </h2>
              <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#0e1624]/80">
                <div className="divide-y divide-white/5">
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <span className="text-[#8f9ba8] font-mono text-xs">Flooring Materials</span>
                    <span className="text-[#f4eee5] font-sans font-medium text-right">
                      {property.specifications.flooring}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <span className="text-[#8f9ba8] font-mono text-xs">Clear Ceiling Height</span>
                    <span className="text-[#c9a36a] font-mono font-semibold text-right">
                      {property.specifications.ceilingHeight}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <span className="text-[#8f9ba8] font-mono text-xs">Orientation & Vistas</span>
                    <span className="text-[#f4eee5] font-sans text-right">
                      {property.specifications.view}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <span className="text-[#8f9ba8] font-mono text-xs">Target Possession Date</span>
                    <span className="text-[#c9a36a] font-mono text-right">
                      {property.specifications.possessionDate}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Curated Amenities Checklist */}
            <section aria-label="Curated Amenities" className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a36a]">
                04 -- PRIVATE CLUB & RESIDENCY AMENITIES
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0e1624] border border-white/5 flex items-center gap-3 text-sm text-[#f4eee5]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#c9a36a]/15 text-[#c9a36a] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location & Neighborhood Block */}
            <section aria-label="Location Details" className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a36a]">
                05 -- URBAN GEOGRAPHY & ACCESS
              </h2>
              <div className="p-6 rounded-2xl bg-[#0e1624]/60 border border-[rgba(201,163,106,0.18)] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl text-[#f4eee5]">
                      {property.locality}
                    </h3>
                    <p className="text-xs font-mono text-[#8f9ba8]">
                      {property.city}, India &bull; Lat: {property.coordinates.lat.toFixed(4)}, Lng: {property.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#c9a36a]/10 text-[#c9a36a] border border-[#c9a36a]/30 uppercase">
                    Prime Sector
                  </span>
                </div>
                <p className="text-xs text-[#8f9ba8] leading-relaxed">
                  Located within walking proximity to prominent business clubs, international schools, and metro transit corridors, while buffered by private landscaped perimeter gardens.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar Column (4-5 cols) - Sticky Consultation Form */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Private Consultation Enquiry Form */}
            <EnquiryForm
              propertySlug={property.slug}
              propertyTitle={property.title}
            />

            {/* Direct Relationship Manager Guarantee */}
            <div className="p-5 rounded-2xl bg-[#0e1624]/50 border border-white/5 space-y-3 text-xs text-[#8f9ba8]">
              <div className="flex items-center gap-2 text-[#c9a36a] font-mono">
                <Shield className="w-4 h-4" />
                <span className="uppercase text-[10px] tracking-wider">
                  SKYLINE PRIVACY PROMISE
                </span>
              </div>
              <p className="leading-relaxed">
                All inquiries are processed by dedicated Senior Client Partners under strict non-disclosure. No third-party brokering.
              </p>
            </div>
          </aside>
        </div>

        {/* Similar Residences Strip (Up to 4) */}
        <SimilarProperties
          properties={similar}
          currentLocality={property.locality}
        />
      </main>

      <Footer />
    </div>
  );
}
