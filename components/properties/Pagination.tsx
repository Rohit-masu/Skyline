"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <nav
      className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-6"
      aria-label="Property Pagination"
    >
      {/* Result Range Display */}
      <div className="text-xs font-mono text-[#8f9ba8]">
        Showing <span className="text-[#f4eee5] font-semibold">{startItem}–{endItem}</span> of{" "}
        <span className="text-[#c9a36a] font-semibold">{total}</span> residences
      </div>

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2.5 rounded-xl border border-[rgba(201,163,106,0.2)] bg-[#141d2b]/40 text-[#f4eee5] hover:bg-[#c9a36a] hover:text-[#0a0f18] hover:border-[#c9a36a] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a36a]"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-9 h-9 flex items-center justify-center text-xs font-mono text-[#8f9ba8]"
                >
                  …
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === page;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? "page" : undefined}
                className={`w-9 h-9 rounded-xl text-xs font-mono transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a36a] ${
                  isActive
                    ? "bg-[#c9a36a] text-[#0a0f18] font-bold shadow-[0_2px_12px_rgba(201,163,106,0.35)]"
                    : "border border-[rgba(255,255,255,0.06)] bg-[#141d2b]/30 text-[#8f9ba8] hover:text-[#f4eee5] hover:border-[rgba(201,163,106,0.3)] hover:bg-[#141d2b]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2.5 rounded-xl border border-[rgba(201,163,106,0.2)] bg-[#141d2b]/40 text-[#f4eee5] hover:bg-[#c9a36a] hover:text-[#0a0f18] hover:border-[#c9a36a] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a36a]"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
