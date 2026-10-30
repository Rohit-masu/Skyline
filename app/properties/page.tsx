import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyListingsClient } from "@/components/properties/PropertyListingsClient";
import { PropertyListingsSkeleton } from "@/components/properties/PropertySkeleton";
import { PAGE_SIZE, parseQueryLenient, type PropertyQuery } from "@/lib/schema/query";
import { getPortfolioStats, searchProperties } from "@/lib/properties";
import { TOTAL_FLOORS } from "@/lib/site";

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
  const stats = getPortfolioStats();
  const lowestCrore = (stats.lowestPrice / 10_000_000).toFixed(1);

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

        {/* Editorial Masthead with Inline Stats matching the Reference Image */}
        {/* Quiet masthead: one line of facts instead of a stats block (the landing already has one). */}
        <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              Skyline <span className="italic text-brass">Residences</span>
            </h1>
            <p className="max-w-xl text-sm font-light leading-relaxed text-mist sm:text-base">
              Sky apartments, duplex penthouses and garden villas, all open for a private visit.
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-mist">
            {stats.homes} residences <span className="text-brass">·</span> {TOTAL_FLOORS} floors{" "}
            <span className="text-brass">·</span> from ₹{lowestCrore} Cr
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
