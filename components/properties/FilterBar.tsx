"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Building2,
  Check,
} from "lucide-react";
import type { PropertyType, PropertySort } from "@/types/property";

export interface FilterState {
  q: string;
  minPrice?: number;
  maxPrice?: number;
  bhk: number[];
  type: PropertyType[];
  furnished?: boolean;
  sort: PropertySort;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
  isLoading: boolean;
}

const PROPERTY_TYPES: PropertyType[] = [
  "Apartment",
  "Penthouse",
  "Duplex",
  "Villa",
];

const PRICE_PRESETS = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under ₹5 Cr", min: undefined, max: 50000000 },
  { label: "₹5 – ₹10 Cr", min: 50000000, max: 100000000 },
  { label: "₹10 – ₹25 Cr", min: 100000000, max: 250000000 },
  { label: "Above ₹25 Cr", min: 250000000, max: undefined },
];

export function FilterBar({
  filters,
  onFilterChange,
  onReset,
  totalResults,
  isLoading,
}: FilterBarProps) {
  // Local search input state for smooth 60fps typing without debounce lag in input field
  const [searchInput, setSearchInput] = useState(filters.q);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync local input with props when URL changes externally (e.g. back/forward)
  useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      onFilterChange({ q: val });
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    onFilterChange({ q: "" });
  };

  const toggleBhk = (num: number) => {
    const exists = filters.bhk.includes(num);
    const updated = exists
      ? filters.bhk.filter((n) => n !== num)
      : [...filters.bhk, num].sort((a, b) => a - b);
    onFilterChange({ bhk: updated });
  };

  const toggleType = (t: PropertyType) => {
    const exists = filters.type.includes(t);
    const updated = exists
      ? filters.type.filter((item) => item !== t)
      : [...filters.type, t];
    onFilterChange({ type: updated });
  };

  const handlePricePreset = (min?: number, max?: number) => {
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  // Determine active price preset label
  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice
  );

  // Check how many active filters are applied (excluding default sort and empty search)
  const activeFilterCount =
    (filters.q ? 1 : 0) +
    filters.bhk.length +
    filters.type.length +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.furnished !== undefined ? 1 : 0);

  return (
    <div className="space-y-4 mb-10">
      {/* Top Controls Bar: Search & Primary Quick Selectors */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3.5">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search residences by name, locality or city
          </label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f9ba8]" />
          <input
            id="search-input"
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by residence, locality (e.g. Golf Course Road, Worli)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-[#141d2b]/60 border border-[rgba(201,163,106,0.2)] text-[#f4eee5] placeholder-[#8f9ba8]/70 text-sm font-sans focus:outline-none focus:border-[#c9a36a] focus:ring-1 focus:ring-[#c9a36a] transition-all"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#8f9ba8] hover:text-[#f4eee5] transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <label htmlFor="sort-select" className="sr-only">
              Sort residences
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={filters.sort}
                onChange={(e) =>
                  onFilterChange({ sort: e.target.value as PropertySort })
                }
                className="w-full appearance-none pl-9 pr-8 py-3.5 rounded-xl bg-[#141d2b]/60 border border-[rgba(201,163,106,0.2)] text-[#f4eee5] text-xs font-mono tracking-wider focus:outline-none focus:border-[#c9a36a] cursor-pointer"
              >
                <option value="newest" className="bg-[#0a0f18] text-[#f4eee5]">
                  Sort: Newest First
                </option>
                <option value="price_asc" className="bg-[#0a0f18] text-[#f4eee5]">
                  Sort: Price Low → High
                </option>
                <option value="price_desc" className="bg-[#0a0f18] text-[#f4eee5]">
                  Sort: Price High → Low
                </option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#c9a36a] pointer-events-none" />
            </div>
          </div>

          {/* Mobile Filter Drawer Toggle Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#141d2b]/60 border border-[rgba(201,163,106,0.2)] text-[#f4eee5] text-xs font-mono tracking-wider hover:border-[#c9a36a] cursor-pointer"
            aria-label="Open filter parameters"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#c9a36a]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#c9a36a] text-[#0a0f18] font-bold text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Filter Chips / Pill Row */}
      <div className="hidden lg:flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e1624]/60 border border-[rgba(255,255,255,0.06)]">
        {/* Left Side: BHK, Type, Price, Furnished */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {/* BHK Pill Group */}
          <div className="flex items-center gap-1.5 bg-[#0a0f18]/60 p-1 rounded-xl border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#8f9ba8] px-2 font-medium">
              BHK:
            </span>
            {[1, 2, 3, 4].map((num) => {
              const isSelected = filters.bhk.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => toggleBhk(num)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#c9a36a] text-[#0a0f18] font-bold shadow-sm"
                      : "text-[#8f9ba8] hover:text-[#f4eee5] hover:bg-white/5"
                  }`}
                >
                  {num} BHK
                </button>
              );
            })}
          </div>

          {/* Property Type Group */}
          <div className="flex items-center gap-1.5 bg-[#0a0f18]/60 p-1 rounded-xl border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#8f9ba8] px-2 font-medium">
              Type:
            </span>
            {PROPERTY_TYPES.map((t) => {
              const isSelected = filters.type.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#c9a36a] text-[#0a0f18] font-bold shadow-sm"
                      : "text-[#8f9ba8] hover:text-[#f4eee5] hover:bg-white/5"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Price Range Dropdown / Presets */}
          <div className="relative">
            <select
              value={activePricePreset?.label || "Custom"}
              onChange={(e) => {
                const preset = PRICE_PRESETS.find(
                  (p) => p.label === e.target.value
                );
                if (preset) handlePricePreset(preset.min, preset.max);
              }}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-xl bg-[#0a0f18]/60 border border-white/5 text-xs text-[#f4eee5] font-mono cursor-pointer focus:border-[#c9a36a]"
              aria-label="Filter by price range"
            >
              {PRICE_PRESETS.map((p) => (
                <option key={p.label} value={p.label} className="bg-[#0a0f18] text-[#f4eee5]">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Furnishing Status */}
          <div className="flex items-center gap-1 bg-[#0a0f18]/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => onFilterChange({ furnished: undefined })}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                filters.furnished === undefined
                  ? "bg-[#c9a36a] text-[#0a0f18] font-bold"
                  : "text-[#8f9ba8] hover:text-[#f4eee5]"
              }`}
            >
              All Furnish
            </button>
            <button
              onClick={() => onFilterChange({ furnished: true })}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                filters.furnished === true
                  ? "bg-[#c9a36a] text-[#0a0f18] font-bold"
                  : "text-[#8f9ba8] hover:text-[#f4eee5]"
              }`}
            >
              Furnished
            </button>
            <button
              onClick={() => onFilterChange({ furnished: false })}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                filters.furnished === false
                  ? "bg-[#c9a36a] text-[#0a0f18] font-bold"
                  : "text-[#8f9ba8] hover:text-[#f4eee5]"
              }`}
            >
              Unfurnished
            </button>
          </div>
        </div>

        {/* Reset All Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-[#c9a36a] hover:text-[#dfba82] font-mono cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Active Filter Chips & Result Count Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {/* Result Count Indicator */}
          <span className="text-[#8f9ba8] py-1">
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 text-[#c9a36a]">
                <span className="w-2 h-2 rounded-full bg-[#c9a36a] animate-ping" />
                Filtering residences...
              </span>
            ) : (
              <span>
                Found{" "}
                <strong className="text-[#f4eee5] font-semibold">
                  {totalResults}
                </strong>{" "}
                available residences
              </span>
            )}
          </span>

          {/* Active Chips */}
          {filters.q && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141d2b] border border-[rgba(201,163,106,0.3)] text-[#f4eee5]">
              <span>Search: &ldquo;{filters.q}&rdquo;</span>
              <button
                onClick={handleClearSearch}
                className="hover:text-[#c9a36a] cursor-pointer ml-1"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.bhk.map((num) => (
            <span
              key={`chip-bhk-${num}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141d2b] border border-[rgba(201,163,106,0.3)] text-[#f4eee5]"
            >
              <span>{num} BHK</span>
              <button
                onClick={() => toggleBhk(num)}
                className="hover:text-[#c9a36a] cursor-pointer ml-1"
                aria-label={`Remove ${num} BHK filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.type.map((t) => (
            <span
              key={`chip-type-${t}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141d2b] border border-[rgba(201,163,106,0.3)] text-[#f4eee5]"
            >
              <span>{t}</span>
              <button
                onClick={() => toggleType(t)}
                className="hover:text-[#c9a36a] cursor-pointer ml-1"
                aria-label={`Remove ${t} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141d2b] border border-[rgba(201,163,106,0.3)] text-[#f4eee5]">
              <span>{activePricePreset?.label || "Custom Price"}</span>
              <button
                onClick={() => handlePricePreset(undefined, undefined)}
                className="hover:text-[#c9a36a] cursor-pointer ml-1"
                aria-label="Remove price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.furnished !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141d2b] border border-[rgba(201,163,106,0.3)] text-[#f4eee5]">
              <span>{filters.furnished ? "Furnished" : "Unfurnished"}</span>
              <button
                onClick={() => onFilterChange({ furnished: undefined })}
                className="hover:text-[#c9a36a] cursor-pointer ml-1"
                aria-label="Remove furnishing filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#0e1624] border-l border-[rgba(201,163,106,0.2)] h-full p-6 flex flex-col justify-between overflow-y-auto z-10 space-y-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#c9a36a]" />
                  <h3 className="font-display text-lg text-[#f4eee5]">
                    Refine Residences
                  </h3>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-[#8f9ba8] hover:text-[#f4eee5] cursor-pointer"
                  aria-label="Close filter drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* BHK Configuration */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#8f9ba8] font-mono block">
                  Configuration (BHK)
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {[1, 2, 3, 4].map((num) => {
                    const isSelected = filters.bhk.includes(num);
                    return (
                      <button
                        key={num}
                        onClick={() => toggleBhk(num)}
                        className={`p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#c9a36a] text-[#0a0f18] font-bold border-[#c9a36a]"
                            : "bg-[#141d2b] text-[#8f9ba8] border-white/5 hover:text-[#f4eee5]"
                        }`}
                      >
                        {num} BHK
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#8f9ba8] font-mono block">
                  Property Type
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {PROPERTY_TYPES.map((t) => {
                    const isSelected = filters.type.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#c9a36a] text-[#0a0f18] font-bold border-[#c9a36a]"
                            : "bg-[#141d2b] text-[#8f9ba8] border-white/5 hover:text-[#f4eee5]"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#8f9ba8] font-mono block">
                  Price Range
                </span>
                <div className="space-y-1.5 font-mono">
                  {PRICE_PRESETS.map((p) => {
                    const isSelected =
                      p.min === filters.minPrice && p.max === filters.maxPrice;
                    return (
                      <button
                        key={p.label}
                        onClick={() => handlePricePreset(p.min, p.max)}
                        className={`w-full p-2.5 rounded-xl text-xs text-left border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#c9a36a] text-[#0a0f18] font-bold border-[#c9a36a]"
                            : "bg-[#141d2b] text-[#8f9ba8] border-white/5 hover:text-[#f4eee5]"
                        }`}
                      >
                        <span>{p.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Furnishing Status */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#8f9ba8] font-mono block">
                  Furnishing
                </span>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-center">
                  <button
                    onClick={() => onFilterChange({ furnished: undefined })}
                    className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
                      filters.furnished === undefined
                        ? "bg-[#c9a36a] text-[#0a0f18] font-bold border-[#c9a36a]"
                        : "bg-[#141d2b] text-[#8f9ba8] border-white/5"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => onFilterChange({ furnished: true })}
                    className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
                      filters.furnished === true
                        ? "bg-[#c9a36a] text-[#0a0f18] font-bold border-[#c9a36a]"
                        : "bg-[#141d2b] text-[#8f9ba8] border-white/5"
                    }`}
                  >
                    Furnished
                  </button>
                  <button
                    onClick={() => onFilterChange({ furnished: false })}
                    className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
                      filters.furnished === false
                        ? "bg-[#c9a36a] text-[#0a0f18] font-bold border-[#c9a36a]"
                        : "bg-[#141d2b] text-[#8f9ba8] border-white/5"
                    }`}
                  >
                    Unfurnished
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 space-y-3 font-mono">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full btn-brass py-3 rounded-xl text-xs uppercase tracking-widest font-semibold cursor-pointer"
              >
                View {totalResults} Residences
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    onReset();
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-xs text-[#8f9ba8] hover:text-[#f4eee5] cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
