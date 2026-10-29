"use client";

import { SearchX, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function EmptyState({ onReset, hasActiveFilters }: EmptyStateProps) {
  return (
    <div className="py-20 px-6 text-center max-w-xl mx-auto rounded-3xl bg-[#141d2b]/30 border border-[rgba(201,163,106,0.15)] my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#0e1624] border border-[rgba(201,163,106,0.25)] flex items-center justify-center mx-auto mb-6 text-[#c9a36a]">
        <SearchX className="w-8 h-8" />
      </div>

      <span className="text-[11px] font-mono tracking-widest text-[#c9a36a] uppercase block mb-2">
        0 Residences Available
      </span>

      <h3 className="font-display text-2xl sm:text-3xl font-light text-[#f4eee5] mb-3">
        No homes match your exact criteria
      </h3>

      <p className="text-sm text-[#8f9ba8] font-sans font-light leading-relaxed mb-8">
        We couldn&apos;t find any residences matching your active filters. Try broadening your price range, selecting different BHK configurations, or resetting all parameters.
      </p>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="btn-brass px-7 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear All Filters</span>
        </button>
      )}
    </div>
  );
}
