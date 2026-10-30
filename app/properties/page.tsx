import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyListingsClient } from "@/components/properties/PropertyListingsClient";
import { PropertyListingsSkeleton } from "@/components/properties/PropertySkeleton";
import { PAGE_SIZE, parseQueryLenient, type PropertyQuery } from "@/lib/schema/query";
import { searchProperties } from "@/lib/properties";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** "3 BHK Penthouses in Worli", "Homes matching “golf”", or plain "Homes". */
function listingTitle(query: PropertyQuery): string {
  const bhk = query.bhk.length > 0 ? `${query.bhk.join(", ")} BHK ` : "";
  const kind = query.type.length === 1 ? `${query.type[0]}s` : "homes";
  const place = query.q ? ` in “${query.q}”` : "";
  const title = `${bhk}${kind}${place}`;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const query = parseQueryLenient(await searchParams);
  const title = listingTitle(query);
  const description = `Browse ${title.toLowerCase()} at Skyline: luxury apartments, duplexes, penthouses and villas with prices, floor plans and visit booking.`;
  return {
    title,
    description,
    alternates: { canonical: "/properties" },
    openGraph: { title: `${title} · Skyline`, description, images: ["/posters/hero.webp"] },
  };
}

// Reading searchParams makes this part dynamic; it streams inside Suspense while the page shell
// (header, title) is static. The server queries the data directly, never its own API over HTTP.
async function Listings({ searchParams }: { searchParams: SearchParams }) {
  const query = parseQueryLenient(await searchParams);
  return <PropertyListingsClient initialQuery={query} initialData={searchProperties(query, PAGE_SIZE)} />;
}

export default function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-ivory selection:bg-brass selection:text-ink">
      <Header />

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-32 pt-28 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-mist">
            <li>
              <Link href="/" className="hover:text-ivory">Skyline</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5 text-mist/50" />
            </li>
            <li aria-current="page" className="font-medium text-brass">Residences</li>
          </ol>
        </nav>

        <header className="mb-12 max-w-3xl space-y-4">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-brass">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brass" />
            Portfolio 2026 · 56 residences
          </p>
          <h1 className="font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Skyline <span className="italic text-brass">Residences</span>
          </h1>
          <p className="text-base font-light leading-relaxed text-mist sm:text-lg">
            From light-filled sky apartments and duplex penthouses to private garden villas, find the home that fits
            how you live.
          </p>
        </header>

        <Suspense fallback={<PropertyListingsSkeleton count={PAGE_SIZE} />}>
          <Listings searchParams={searchParams} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
