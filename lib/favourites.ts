import { useSyncExternalStore } from "react";

// Saved homes live in localStorage (no account needed). useSyncExternalStore gives every heart
// button the same list, renders an empty list on the server (no hydration mismatch) and updates
// other tabs through the "storage" event.

const STORAGE_KEY = "skyline:favourites";
const CHANGE_EVENT = "skyline:favourites-change";
const EMPTY: string[] = [];

let cachedRaw: string | null = null;
let cachedList: string[] = EMPTY;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked (private mode, strict settings)
  }
}

function parse(raw: string | null): string[] {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : EMPTY;
  } catch {
    return EMPTY;
  }
}

/** Returns the same array until storage changes, as useSyncExternalStore requires. */
export function getFavourites(): string[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parse(raw);
  }
  return cachedList;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function toggleFavourite(slug: string) {
  const current = getFavourites();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useFavourites(): string[] {
  return useSyncExternalStore(subscribe, getFavourites, () => EMPTY);
}
