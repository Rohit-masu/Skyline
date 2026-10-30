"use client";

import type { PropertyQuery } from "@/lib/schema/query";
import { formatPrice } from "@/lib/format";

// Price steps for the min/max selects, in rupees (25 L … 10 Cr). "No max" covers 10 Cr+.
export const PRICE_STEPS = [
  2_500_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 20_000_000, 30_000_000, 50_000_000, 100_000_000,
];

interface PriceRangeProps {
  query: PropertyQuery;
  onChange: (changes: Partial<PropertyQuery>) => void;
  idPrefix: string;
  /** Compact: sits in the search row on desktop, labels for screen readers only. */
  compact?: boolean;
}

const parsePrice = (value: string) => (value === "" ? undefined : Number(value));

export function PriceRange({ query, onChange, idPrefix, compact = false }: PriceRangeProps) {
  // Picking a min above the current max (or the reverse) clears the other side instead of
  // producing an impossible range that the API would reject.
  const setMinPrice = (value: string) => {
    const minPrice = parsePrice(value);
    const maxPrice = minPrice !== undefined && query.maxPrice !== undefined && query.maxPrice < minPrice ? undefined : query.maxPrice;
    onChange({ minPrice, maxPrice });
  };

  const setMaxPrice = (value: string) => {
    const maxPrice = parsePrice(value);
    const minPrice = maxPrice !== undefined && query.minPrice !== undefined && query.minPrice > maxPrice ? undefined : query.minPrice;
    onChange({ minPrice, maxPrice });
  };

  const labelClass = compact ? "sr-only" : "mb-1 block px-1 text-[10px] font-medium uppercase tracking-[0.2em] text-mist";
  const selectClass = compact ? "field cursor-pointer py-3.5 pl-4 pr-8 text-xs" : "field min-h-9 cursor-pointer px-3 py-1.5 text-xs";

  return (
    <div className={compact ? "flex items-center gap-3" : "grid grid-cols-2 gap-3"}>
      <div>
        <label htmlFor={`${idPrefix}-min-price`} className={labelClass}>Min price</label>
        <select id={`${idPrefix}-min-price`} value={query.minPrice ?? ""} onChange={(event) => setMinPrice(event.target.value)} className={selectClass}>
          <option value="">{compact ? "Min price" : "No min"}</option>
          {PRICE_STEPS.map((price) => (
            <option key={price} value={price}>{formatPrice(price)}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-max-price`} className={labelClass}>Max price</label>
        <select id={`${idPrefix}-max-price`} value={query.maxPrice ?? ""} onChange={(event) => setMaxPrice(event.target.value)} className={selectClass}>
          <option value="">{compact ? "Max price" : "No max"}</option>
          {PRICE_STEPS.map((price) => (
            <option key={price} value={price}>{formatPrice(price)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
