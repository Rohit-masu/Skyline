"use client";

import { useSyncExternalStore } from "react";
import { PAVILION } from "@/lib/site";

const CHECK_EVERY_MS = 60_000;

function kolkataHour(): number {
  const hour = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(new Date());
  return Number(hour);
}

const isOpenNow = () => {
  const hour = kolkataHour();
  return hour >= PAVILION.opensAt && hour < PAVILION.closesAt;
};

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, CHECK_EVERY_MS);
  return () => clearInterval(timer);
}

// "Open now" depends on the visitor's clock, so it is read on the client only (the landing is
// prerendered at build time). The server renders nothing here, so there is no hydration mismatch.
export function OpenStatus() {
  const open = useSyncExternalStore(subscribe, isOpenNow, () => null);
  if (open === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest ${
        open ? "border-emerald-400/30 text-emerald-300" : "border-white/15 text-mist"
      }`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${open ? "animate-pulse bg-emerald-400" : "bg-mist"}`} />
      {open ? "Open now" : "Closed now"}
    </span>
  );
}
