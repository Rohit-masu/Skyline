"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { MAX_SEARCH_LENGTH } from "@/lib/schema/query";

export const SEARCH_DEBOUNCE_MS = 300;

interface SearchBoxProps {
  /** The search term currently in the URL. */
  value: string;
  onCommit: (text: string) => void;
}

// The input keeps its own in-progress text (the only local state on the listings page) and writes
// it to the URL after a pause in typing.
export function SearchBox({ value, onCommit }: SearchBoxProps) {
  const [text, setText] = useState(value);
  const [lastCommitted, setLastCommitted] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The URL changed from outside (Back/Forward, "clear filters"): show the new term. Our own
  // commits are ignored here, so text typed after the commit is never overwritten.
  if (value !== previousValue) {
    setPreviousValue(value);
    if (value !== lastCommitted) {
      setText(value);
      setLastCommitted(value);
    }
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const commit = (next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setLastCommitted(next.trim());
    onCommit(next);
  };

  const handleChange = (next: string) => {
    setText(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), SEARCH_DEBOUNCE_MS);
  };

  const clear = () => {
    setText("");
    commit("");
  };

  return (
    <div className="relative flex-1">
      <label htmlFor="listing-search" className="sr-only">
        Search homes by name, locality or city
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
      <input
        id="listing-search"
        type="search"
        value={text}
        maxLength={MAX_SEARCH_LENGTH}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit(text);
        }}
        placeholder="Search by home, locality or city (e.g. Worli, Golf Course Road)"
        autoComplete="off"
        className="field py-3.5 pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-mist hover:text-ivory"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
