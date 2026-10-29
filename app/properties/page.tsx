import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyListingsClient } from "@/components/properties/PropertyListingsClient";
import { PropertyListingsSkeleton } from "@/components/properties/PropertySkeleton";

export const metadata: Metadata = {
  title: "Residences & Penthouses",
  description:
    "Explore 56 bespoke architectural residences, sky penthouses, and private duplexes at Skyline. Browse floor plans, specifications, and pricing.",
  openGraph: {
    title: "Residences & Penthouses | Skyline",
    description:
      "Explore 56 bespoke architectural residences, sky penthouses, and private duplexes at Skyline.",
  },
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-[#0a0f18] flex flex-col justify-between selection:bg-[#c9a36a] selection:text-[#0a0f18]">
      {/* Site Header */}
      <Header />

      {/* Main Content with Suspense for useSearchParams */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="pt-28 pb-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
              <div className="h-10 w-48 bg-white/5 rounded-md mb-8 animate-pulse" />
              <div className="h-12 w-96 bg-white/10 rounded-md mb-12 animate-pulse" />
              <PropertyListingsSkeleton count={12} />
            </div>
          }
        >
          <PropertyListingsClient />
        </Suspense>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
