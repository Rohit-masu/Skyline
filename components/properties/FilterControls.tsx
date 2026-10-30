"use client";

import type { PropertyType } from "@/types/property";
import { BHK_OPTIONS, PROPERTY_TYPES, type PropertyQuery } from "@/lib/schema/query";
import { formatPrice } from "@/lib/format";

// Price steps for the min/max selects, in rupees (25 L … 10 Cr). "No max" covers 10 Cr+.
export const PRICE_STEPS = [
  2_500_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 20_000_000, 30_000_000, 50_000_000, 100_000_000,
];

interface FilterControlsProps {
  query: PropertyQuery;
  onChange: (changes: Partial<PropertyQuery>) => void;
  /** Keeps ids unique, because the desktop row and the mobile drawer render this twice. */
  idPrefix: string;
  layout: "row" | "stack";
}

const toggleButton = (pressed: boolean, layout: "row" | "stack" = "row") =>
  `min-h-9 rounded-lg px-3 text-xs transition-colors duration-150 cursor-pointer ${
    pressed
      ? "bg-brass font-semibold text-ink"
      : `text-mist hover:bg-white/5 hover:text-ivory ${layout === "stack" ? "border border-white/10 bg-slate" : ""}`
  }`;

const groupLabel = "px-1 text-[10px] font-medium uppercase tracking-[0.2em] text-mist";

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

export function FilterControls({ query, onChange, idPrefix, layout }: FilterControlsProps) {
  const groupClass =
    layout === "row"
      ? "flex flex-wrap items-center gap-1 rounded-xl border border-white/5 bg-ink/60 p-1"
      : "flex flex-wrap items-center gap-1.5";

  const parsePrice = (value: string) => (value === "" ? undefined : Number(value));

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

  const priceLabelClass = layout === "row" ? "flex items-center gap-2" : "block space-y-1";
  const furnishedValue = query.furnished === undefined ? "any" : String(query.furnished);

  return (
    <div className={layout === "row" ? "flex flex-wrap items-center gap-3" : "space-y-6"}>
      <div role="group" aria-labelledby={`${idPrefix}-bhk`} className={groupClass}>
        <span id={`${idPrefix}-bhk`} className={groupLabel}>BHK</span>
        {BHK_OPTIONS.map((bhk) => (
          <button
            key={bhk}
            type="button"
            aria-pressed={query.bhk.includes(bhk)}
            onClick={() => onChange({ bhk: toggle(query.bhk, bhk).sort((a, b) => a - b) })}
            className={toggleButton(query.bhk.includes(bhk), layout)}
          >
            {bhk} BHK
          </button>
        ))}
      </div>

      <div role="group" aria-labelledby={`${idPrefix}-type`} className={groupClass}>
        <span id={`${idPrefix}-type`} className={groupLabel}>Type</span>
        {PROPERTY_TYPES.map((type: PropertyType) => (
          <button
            key={type}
            type="button"
            aria-pressed={query.type.includes(type)}
            onClick={() => onChange({ type: toggle(query.type, type) })}
            className={toggleButton(query.type.includes(type), layout)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className={layout === "row" ? "flex items-center gap-2" : "grid grid-cols-2 gap-3"}>
        <label className={priceLabelClass}>
          <span className={groupLabel}>Min price</span>
          <select
            value={query.minPrice ?? ""}
            onChange={(event) => setMinPrice(event.target.value)}
            className="field min-h-9 cursor-pointer px-3 py-1.5 text-xs"
          >
            <option value="">No min</option>
            {PRICE_STEPS.map((price) => (
              <option key={price} value={price}>{formatPrice(price)}</option>
            ))}
          </select>
        </label>
        <label className={priceLabelClass}>
          <span className={groupLabel}>Max price</span>
          <select
            value={query.maxPrice ?? ""}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="field min-h-9 cursor-pointer px-3 py-1.5 text-xs"
          >
            {PRICE_STEPS.map((price) => (
              <option key={price} value={price}>{formatPrice(price)}</option>
            ))}
            <option value="">No max</option>
          </select>
        </label>
      </div>

      <fieldset className={groupClass}>
        <legend className="sr-only">Furnishing</legend>
        <span aria-hidden="true" className={groupLabel}>Furnishing</span>
        {[
          { value: "any", label: "Any" },
          { value: "true", label: "Furnished" },
          { value: "false", label: "Unfurnished" },
        ].map((option) => (
          <label key={option.value} className={`${toggleButton(furnishedValue === option.value, layout)} inline-flex items-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brass`}>
            <input
              type="radio"
              name={`${idPrefix}-furnished`}
              value={option.value}
              checked={furnishedValue === option.value}
              onChange={() => onChange({ furnished: option.value === "any" ? undefined : option.value === "true" })}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    </div>
  );
}
