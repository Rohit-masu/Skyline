"use client";

import type { PropertyType } from "@/types/property";
import { BHK_OPTIONS, PROPERTY_TYPES, type PropertyQuery } from "@/lib/schema/query";
import { PriceRange } from "./PriceRange";

interface FilterControlsProps {
  query: PropertyQuery;
  onChange: (changes: Partial<PropertyQuery>) => void;
  /** Keeps ids unique, because the desktop row and the mobile drawer render this twice. */
  idPrefix: string;
  /** Row: one quiet line on desktop (price lives in the search row). Stack: the mobile drawer. */
  layout: "row" | "stack";
}

const toggleButton = (pressed: boolean, layout: "row" | "stack") =>
  `min-h-9 rounded-full px-3.5 text-xs transition-colors duration-200 cursor-pointer ${
    pressed
      ? "bg-brass font-semibold text-ink"
      : `text-mist hover:text-ivory ${layout === "stack" ? "border border-white/10 bg-slate" : "hover:bg-white/5"}`
  }`;

const groupLabel = "px-1 text-[10px] font-medium uppercase tracking-[0.2em] text-mist";

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

export function FilterControls({ query, onChange, idPrefix, layout }: FilterControlsProps) {
  const row = layout === "row";
  const groupClass = "flex flex-wrap items-center gap-1";
  // On the desktop row "1 BHK" and "Apartment" explain themselves, so those labels are for screen
  // readers only; the drawer shows them.
  const selfExplanatoryLabel = row ? "sr-only" : groupLabel;
  const furnishedValue = query.furnished === undefined ? "any" : String(query.furnished);
  const divider = row ? <span aria-hidden="true" className="h-5 w-px bg-white/10" /> : null;

  return (
    <div className={row ? "flex flex-wrap items-center gap-4" : "space-y-6"}>
      <div role="group" aria-labelledby={`${idPrefix}-bhk`} className={groupClass}>
        <span id={`${idPrefix}-bhk`} className={selfExplanatoryLabel}>BHK</span>
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

      {divider}

      <div role="group" aria-labelledby={`${idPrefix}-type`} className={groupClass}>
        <span id={`${idPrefix}-type`} className={selfExplanatoryLabel}>Type</span>
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

      {!row && <PriceRange query={query} onChange={onChange} idPrefix={idPrefix} />}

      {divider}

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
