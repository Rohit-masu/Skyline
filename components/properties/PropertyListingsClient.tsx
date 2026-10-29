"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { Property, PropertyType, PropertySort, PropertiesResponse } from "@/types/property";
import { FilterBar, type FilterState } from "./FilterBar";
import { PropertyCard } from "./PropertyCard";
import { PropertyListingsSkeleton } from "./PropertySkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Pagination } from "./Pagination";

const DEFAULT_SORT: PropertySort = "newest";
const ITEMS_PER_PAGE = 12;

export function PropertyListingsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Data state
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active in-flight request controller
  const abortControllerRef = useRef<AbortController | null>(null);

  // Parse filters directly from URL searchParams (URL is the single source of truth)
  const currentQ = searchParams.get("q") ?? "";
  const currentMinPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  const currentBhk = searchParams.get("bhk")
    ? searchParams
        .get("bhk")!
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n) && n >= 1 && n <= 4)
    : [];

  const currentType = searchParams.get("type")
    ? (searchParams
        .get("type")!
        .split(",")
        .filter((t): t is PropertyType =>
          ["Apartment", "Penthouse", "Duplex", "Villa"].includes(t)
        ))
    : [];

  const currentFurnished = searchParams.has("furnished")
    ? searchParams.get("furnished") === "true"
    : undefined;

  const currentSort = (searchParams.get("sort") as PropertySort) || DEFAULT_SORT;

  const currentPage = searchParams.get("page")
    ? Math.max(1, Number(searchParams.get("page")) || 1)
    : 1;

  const activeFilters: FilterState = {
    q: currentQ,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    bhk: currentBhk,
    type: currentType,
    furnished: currentFurnished,
    sort: currentSort,
  };

  // Helper to push new query state to URL
  const updateQuery = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === null || val === "" || val === undefined) {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Handler for filter changes: resets page to 1
  const handleFilterChange = (updates: Partial<FilterState>) => {
    const nextState = { ...activeFilters, ...updates };
    const queryUpdates: Record<string, string | null> = {
      page: "1", // always reset page on filter edit
      q: nextState.q ? nextState.q.trim() : null,
      minPrice: nextState.minPrice !== undefined ? String(nextState.minPrice) : null,
      maxPrice: nextState.maxPrice !== undefined ? String(nextState.maxPrice) : null,
      bhk: nextState.bhk.length > 0 ? nextState.bhk.join(",") : null,
      type: nextState.type.length > 0 ? nextState.type.join(",") : null,
      furnished:
        nextState.furnished !== undefined ? String(nextState.furnished) : null,
      sort: nextState.sort !== DEFAULT_SORT ? nextState.sort : null,
    };
    updateQuery(queryUpdates);
  };

  // Handler for pagination change
  const handlePageChange = (newPage: number) => {
    updateQuery({ page: newPage > 1 ? String(newPage) : null });
    // Smooth scroll back to listings top
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // Handler for clearing all filters
  const handleReset = () => {
    router.push(pathname, { scroll: false });
  };

  // Fetch data on searchParams change with race-condition abortion
  const fetchData = useCallback(async () => {
    // Abort previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(searchParams.toString());
      if (!queryParams.has("limit")) {
        queryParams.set("limit", String(ITEMS_PER_PAGE));
      }

      const res = await fetch(`/api/properties?${queryParams.toString()}`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data: PropertiesResponse = await res.json();
      setProperties(data.items || []);
      setTotal(data.total || 0);
      setIsLoading(false);
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        // Request was deliberately cancelled by a newer request, do nothing
        return;
      }
      setError((err as Error)?.message || "Failed to load properties");
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const hasActiveFilters =
    Boolean(currentQ) ||
    currentBhk.length > 0 ||
    currentType.length > 0 ||
    currentMinPrice !== undefined ||
    currentMaxPrice !== undefined ||
    currentFurnished !== undefined;

  return (
    <div className="min-h-screen bg-[#0a0f18] text-[#f4eee5] pt-28 pb-32 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs font-mono text-[#8f9ba8]">
          <li className="flex items-center gap-1.5 hover:text-[#f4eee5] transition-colors">
            <Home className="w-3.5 h-3.5 text-[#c9a36a]" />
            <Link href="/">Skyline</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 text-[#8f9ba8]/50" />
          </li>
          <li className="text-[#c9a36a] font-medium" aria-current="page">
            Residences
          </li>
        </ol>
      </nav>

      {/* Editorial Header */}
      <header className="mb-12 space-y-4 max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c9a36a]" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#c9a36a] font-mono font-medium">
            PORTFOLIO 2026 -- 56 EXCLUSIVE RESIDENCES
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#f4eee5] tracking-tight leading-tight">
          Skyline <span className="italic text-[#c9a36a]">Residences</span>
        </h1>
        <p className="text-base sm:text-lg text-[#8f9ba8] font-sans font-light leading-relaxed">
          From light-filled sky apartments and duplex penthouses to private garden villas, explore modern architectural sanctuaries crafted for elevated living.
        </p>
      </header>

      {/* Filter and Control Bar */}
      <FilterBar
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        totalResults={total}
        isLoading={isLoading}
      />

      {/* Listings Presentation Area */}
      <main id="listings-grid" aria-label="Properties Grid">
        {error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : isLoading ? (
          <PropertyListingsSkeleton count={ITEMS_PER_PAGE} />
        ) : properties.length === 0 ? (
          <EmptyState onReset={handleReset} hasActiveFilters={hasActiveFilters} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {properties.map((property, idx) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  priority={idx < 3}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              page={currentPage}
              total={total}
              limit={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}
