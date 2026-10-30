import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { ChevronRight, MapPin, Shield, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyFacts } from "@/components/property/PropertyFacts";
import { LocationBlock } from "@/components/property/LocationBlock";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { FavouriteButton } from "@/components/properties/FavouriteButton";
import { getAllSlugs, getPropertyBySlug, getSimilarProperties } from "@/lib/properties";
import { formatNumber, formatPrice } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Every seeded home is rendered at build time. "use cache" + cacheLife("hours") is the cacheComponents
// version of `revalidate = 3600`. Because the whole page is cached, an unknown slug renders in one
// blocking pass and notFound() can still send a real 404 status (README → Caching).
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = getPropertyBySlug((await params).slug);
  if (!property) return { title: "Home not found" };

  const title = `${property.title} — ${property.bhk} BHK ${property.type} in ${property.locality}`;
  const description = `${property.tagline}. ${property.bhk} BHK ${property.type.toLowerCase()} in ${property.locality}, ${property.city} for ${formatPrice(property.price)}.`;
  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: { title, description, type: "website", images: property.images[0] ? [property.images[0]] : undefined },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  "use cache";
  cacheLife("hours");
  const property = getPropertyBySlug((await params).slug);
  if (!property) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-ink text-ivory selection:bg-brass selection:text-ink">
      <Header />

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-32 pt-28 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-mist">
            <li><Link href="/" className="hover:text-ivory">Skyline</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5 text-mist/50" /></li>
            <li><Link href="/properties" className="hover:text-ivory">Residences</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5 text-mist/50" /></li>
            <li aria-current="page" className="max-w-[200px] truncate font-medium text-brass sm:max-w-none">{property.title}</li>
          </ol>
        </nav>

        <header className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2.5 text-[10px] uppercase tracking-widest">
              <span className="rounded-full border border-brass/30 bg-slate px-3 py-1 text-brass">{property.type}</span>
              <span className="rounded-full border border-white/10 bg-[#0e1624] px-3 py-1 text-mist">
                Floor {property.floor} of {property.totalFloors}
              </span>
              {property.featured && (
                <span className="flex items-center gap-1 rounded-full bg-brass px-3 py-1 font-bold text-ink">
                  <Sparkles aria-hidden="true" className="h-3 w-3" />
                  Featured
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-mist">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-brass" />
              {property.locality}, {property.city}
            </p>
            <p className="text-sm font-light italic text-ivory-dim sm:text-base">{property.tagline}</p>
          </div>

          <div className="flex shrink-0 items-end gap-4">
            <div className="space-y-1 rounded-2xl border border-brass/20 bg-slate/40 p-4 sm:p-6 lg:text-right">
              <p className="text-[10px] uppercase tracking-widest text-mist">Price</p>
              <p className="font-display text-3xl font-light text-brass sm:text-4xl">{formatPrice(property.price)}</p>
              <p className="text-xs text-mist">₹{formatNumber(property.pricePerSqFt)} / sq.ft</p>
            </div>
            <FavouriteButton slug={property.slug} title={property.title} />
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-12 lg:col-span-7 xl:col-span-8">
            <PropertyGallery images={property.images} title={property.title} />
            <PropertyFacts property={property} />
            <LocationBlock property={property} />
          </div>

          <aside aria-label="Book a visit" className="space-y-6 lg:sticky lg:top-28 lg:col-span-5 xl:col-span-4">
            <EnquiryForm propertySlug={property.slug} propertyTitle={property.title} />
            <p className="flex gap-3 rounded-2xl border border-white/5 bg-[#0e1624]/50 p-5 text-xs leading-relaxed text-mist">
              <Shield aria-hidden="true" className="h-4 w-4 shrink-0 text-brass" />
              Your details go only to the Skyline sales team. We never share them with brokers.
            </p>
          </aside>
        </div>

        <SimilarProperties properties={getSimilarProperties(property)} currentLocality={property.locality} />
      </main>

      <Footer />
    </div>
  );
}
