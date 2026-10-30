"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  hrefForPage: (page: number) => string;
  onPageChange: (page: number) => void;
}

/** 1 … 4 5 6 … 10 — always first, last and the neighbours of the current page. */
export function pageNumbers(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "gap", totalPages];
  if (page >= totalPages - 3) return [1, "gap", ...Array.from({ length: 5 }, (_, index) => totalPages - 4 + index)];
  return [1, "gap", page - 1, page, page + 1, "gap", totalPages];
}

const linkBase =
  "flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-xs transition-colors duration-150";

// Real <a href> links: crawlable, work without JavaScript and can open in a new tab. A plain
// left click is intercepted and turned into a pushState update.
export function Pagination({ page, total, pageSize, hrefForPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, target: number) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onPageChange(target);
  };

  const arrow = (target: number, label: string, icon: React.ReactNode) =>
    target < 1 || target > totalPages ? (
      <span aria-hidden="true" className={`${linkBase} border border-white/5 text-mist/40`}>{icon}</span>
    ) : (
      <a
        href={hrefForPage(target)}
        onClick={(event) => handleClick(event, target)}
        aria-label={label}
        className={`${linkBase} border border-brass/20 text-ivory hover:border-brass hover:bg-brass hover:text-ink`}
      >
        {icon}
      </a>
    );

  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row">
      <p className="text-xs text-mist">
        Showing <span className="font-semibold text-ivory">{first}–{last}</span> of{" "}
        <span className="font-semibold text-brass">{total}</span> homes
      </p>

      <ul className="flex items-center gap-1.5">
        <li>{arrow(page - 1, "Previous page", <ChevronLeft aria-hidden="true" className="h-4 w-4" />)}</li>
        {pageNumbers(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-xs text-mist">…</li>
          ) : (
            <li key={item}>
              <a
                href={hrefForPage(item)}
                onClick={(event) => handleClick(event, item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={`${linkBase} ${
                  item === page
                    ? "bg-brass font-bold text-ink"
                    : "border border-white/5 text-mist hover:border-brass/30 hover:text-ivory"
                }`}
              >
                {item}
              </a>
            </li>
          )
        )}
        <li>{arrow(page + 1, "Next page", <ChevronRight aria-hidden="true" className="h-4 w-4" />)}</li>
      </ul>
    </nav>
  );
}
