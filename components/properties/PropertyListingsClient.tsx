"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { PropertiesResponse } from "@/types/property";
import {
  PAGE_SIZE,
  hasActiveFilters,
  parseQueryLenient,
  serializeQuery,
  type PropertyQuery,
} from "@/lib/schema/query";
import { FilterBar } from "./FilterBar";
import { PropertyCard } from "./PropertyCard";
import { PropertyListingsSkeleton } from "./PropertySkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Pagination } from "./Pagination";
import { useListingResults } from "./useListingResults";
import { rememberListingScroll, useListingScrollRestore } from "./useListingScrollRestore";

const GRID_ID = "listings-grid";

interface PropertyListingsClientProps {
  initialQuery: PropertyQuery;
  initialData: PropertiesResponse;
}

// The URL is the only source of truth. Next keeps useSearchParams in sync with the native History
// API, so writing the URL with pushState/replaceState re-renders this component without a router
// navigation (no server round trip, no double fetch).
export function PropertyListingsClient({ initialQuery, initialData }: PropertyListingsClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseQueryLenient(searchParams);
  const queryKey = serializeQuery(query);

  const { data, error, isLoading, retry } = useListingResults(queryKey, serializeQuery(initialQuery), initialData);
  useListingScrollRestore(!isLoading);

  const urlFor = (next: PropertyQuery) => {
    const search = serializeQuery(next);
    return search ? `${pathname}?${search}` : pathname;
  };

  // Read the live URL (not the render-time `query`): a debounced search that fires after a filter
  // click must keep that filter, not overwrite it with an older snapshot.
  const currentQuery = () => parseQueryLenient(new URLSearchParams(window.location.search));

  const changeFilters = (changes: Partial<PropertyQuery>) => {
    window.history.pushState(null, "", urlFor({ ...currentQuery(), ...changes, page: 1 }));
  };

  const changeSearch = (text: string) => {
    window.history.replaceState(null, "", urlFor({ ...currentQuery(), q: text, page: 1 }));
  };

  const changePage = (page: number) => {
    window.history.pushState(null, "", urlFor({ ...currentQuery(), page }));
    document.getElementById(GRID_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearFilters = () => {
    window.history.pushState(null, "", pathname);
  };

  return (
    <>
      <FilterBar
        query={query}
        onFiltersChange={changeFilters}
        onSearchChange={changeSearch}
        onReset={clearFilters}
        totalResults={data?.total}
      />

      <section id={GRID_ID} aria-label="Search results" aria-busy={isLoading} className="scroll-mt-28" onClickCapture={rememberListingScroll}>
        {error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : !data ? (
          <PropertyListingsSkeleton count={PAGE_SIZE} />
        ) : data.items.length === 0 ? (
          <EmptyState onReset={clearFilters} hasActiveFilters={hasActiveFilters(query)} />
        ) : (
          <>
            {/* Keyed by the query so a new result set fades in instead of swapping in place. */}
            <div key={queryKey} className="grid animate-fade-in grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((property, index) => (
                <PropertyCard key={property.id} property={property} priority={index < 3} />
              ))}
            </div>
            <Pagination
              page={query.page}
              total={data.total}
              pageSize={PAGE_SIZE}
              hrefForPage={(page) => urlFor({ ...query, page })}
              onPageChange={changePage}
            />
          </>
        )}
      </section>
    </>
  );
}
