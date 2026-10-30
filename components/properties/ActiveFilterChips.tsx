"use client";

import { X } from "lucide-react";
import type { PropertyQuery } from "@/lib/schema/query";
import { formatPrice } from "@/lib/format";

interface ActiveFilterChipsProps {
  query: PropertyQuery;
  onChange: (changes: Partial<PropertyQuery>) => void;
}

interface Chip {
  id: string;
  label: string;
  remove: Partial<PropertyQuery>;
}

function priceLabel(min?: number, max?: number): string {
  if (min !== undefined && max !== undefined) return `${formatPrice(min)} – ${formatPrice(max)}`;
  if (min !== undefined) return `From ${formatPrice(min)}`;
  return `Up to ${formatPrice(max ?? 0)}`;
}

export function ActiveFilterChips({ query, onChange }: ActiveFilterChipsProps) {
  const chips: Chip[] = [];

  if (query.q) chips.push({ id: "q", label: `“${query.q}”`, remove: { q: "" } });
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    chips.push({
      id: "price",
      label: priceLabel(query.minPrice, query.maxPrice),
      remove: { minPrice: undefined, maxPrice: undefined },
    });
  }
  for (const bhk of query.bhk) {
    chips.push({ id: `bhk-${bhk}`, label: `${bhk} BHK`, remove: { bhk: query.bhk.filter((b) => b !== bhk) } });
  }
  for (const type of query.type) {
    chips.push({ id: `type-${type}`, label: type, remove: { type: query.type.filter((t) => t !== type) } });
  }
  if (query.furnished !== undefined) {
    chips.push({
      id: "furnished",
      label: query.furnished ? "Furnished" : "Unfurnished",
      remove: { furnished: undefined },
    });
  }

  if (chips.length === 0) return null;

  return (
    <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li
          key={chip.id}
          className="inline-flex items-center gap-1 rounded-lg border border-brass/30 bg-slate py-1 pl-3 pr-1 text-xs text-ivory"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onChange(chip.remove)}
            aria-label={`Remove filter ${chip.label}`}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-mist hover:text-brass"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
