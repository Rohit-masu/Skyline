"use client";

import { useEffect } from "react";

// Back from a detail page must land on the same card. The listing re-renders on Back, so the
// browser's own restoration can run before the cards exist; we save scrollY per listing URL when a
// card is clicked and put it back once results are on screen.

const STORAGE_PREFIX = "skyline:listing-scroll:";

const storageKey = () => STORAGE_PREFIX + window.location.pathname + window.location.search;

/** Call from a click handler on the results grid. */
export function rememberListingScroll(event: React.MouseEvent) {
  const link = (event.target as Element).closest("a[href^='/properties/']");
  if (!link) return;
  try {
    sessionStorage.setItem(storageKey(), String(Math.round(window.scrollY)));
  } catch {
    // Storage can be blocked (private mode); restoration is a nicety, not a requirement.
  }
}

export function useListingScrollRestore(resultsVisible: boolean) {
  useEffect(() => {
    if (!resultsVisible) return;
    try {
      const saved = sessionStorage.getItem(storageKey());
      if (saved === null) return;
      sessionStorage.removeItem(storageKey());
      window.scrollTo({ top: Number(saved), behavior: "instant" });
    } catch {
      // See rememberListingScroll.
    }
  }, [resultsVisible]);
}
