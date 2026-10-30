"use client";

import { useRef } from "react";
import { ArrowUpDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import type { PropertySort } from "@/types/property";
import { SORT_OPTIONS, hasActiveFilters, type PropertyQuery } from "@/lib/schema/query";
import { SearchBox } from "./SearchBox";
import { FilterControls } from "./FilterControls";
import { ActiveFilterChips } from "./ActiveFilterChips";

const SORT_LABELS: Record<PropertySort, string> = {
  newest: "Newest first",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
};

interface FilterBarProps {
  query: PropertyQuery;
  onFiltersChange: (changes: Partial<PropertyQuery>) => void;
  onSearchChange: (text: string) => void;
  onReset: () => void;
  /** Undefined while results are loading. */
  totalResults?: number;
}

export function FilterBar({ query, onFiltersChange, onSearchChange, onReset, totalResults }: FilterBarProps) {
  const drawer = useRef<HTMLDialogElement>(null);
  const activeCount =
    (query.q ? 1 : 0) +
    (query.minPrice !== undefined || query.maxPrice !== undefined ? 1 : 0) +
    query.bhk.length +
    query.type.length +
    (query.furnished !== undefined ? 1 : 0);

  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBox value={query.q} onCommit={onSearchChange} />

        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:flex-initial">
            <label htmlFor="listing-sort" className="sr-only">Sort homes</label>
            <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brass" />
            <select
              id="listing-sort"
              value={query.sort}
              onChange={(event) => onFiltersChange({ sort: event.target.value as PropertySort })}
              className="field cursor-pointer py-3.5 pl-10 pr-4 text-xs tracking-wide"
            >
              {SORT_OPTIONS.map((sort) => (
                <option key={sort} value={sort}>{SORT_LABELS[sort]}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => drawer.current?.showModal()}
            className="field flex w-auto cursor-pointer items-center gap-2 px-4 py-3.5 text-xs tracking-wide lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-brass" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[10px] font-bold text-ink">
                <span className="sr-only">, </span>{activeCount}<span className="sr-only"> active</span>
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="hidden items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0e1624]/60 p-3 lg:flex">
        <FilterControls query={query} onChange={onFiltersChange} idPrefix="desktop" layout="row" />
        {hasActiveFilters(query) && (
          <button type="button" onClick={onReset} className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-brass hover:text-brass-light">
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Reset all
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <p aria-live="polite" className="py-1 text-mist">
          {totalResults === undefined ? (
            "Loading homes…"
          ) : (
            <>
              <strong className="font-semibold text-ivory">{totalResults}</strong> {totalResults === 1 ? "home" : "homes"} found
            </>
          )}
        </p>
        <ActiveFilterChips query={query} onChange={onFiltersChange} />
      </div>

      {/* Native <dialog>: focus trap, Escape to close and inert background come from the browser. */}
      <dialog
        ref={drawer}
        aria-labelledby="filter-drawer-title"
        className="filter-drawer"
        onClick={(event) => {
          if (event.target === drawer.current) drawer.current.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <h2 id="filter-drawer-title" className="font-display text-xl">Refine homes</h2>
            <button
              type="button"
              onClick={() => drawer.current?.close()}
              aria-label="Close filters"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-mist hover:text-ivory"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <FilterControls query={query} onChange={onFiltersChange} idPrefix="drawer" layout="stack" />
          </div>
          <div className="space-y-3 border-t border-white/10 p-5">
            <button
              type="button"
              onClick={() => drawer.current?.close()}
              className="btn-brass w-full cursor-pointer rounded-xl py-3 text-xs uppercase tracking-widest"
            >
              {totalResults === undefined ? "Show homes" : `Show ${totalResults} ${totalResults === 1 ? "home" : "homes"}`}
            </button>
            {hasActiveFilters(query) && (
              <button
                type="button"
                onClick={onReset}
                className="w-full cursor-pointer rounded-xl border border-white/10 py-2.5 text-xs text-mist hover:text-ivory"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
