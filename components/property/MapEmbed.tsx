"use client";

import { useState } from "react";
import { Map as MapIcon } from "lucide-react";

interface MapEmbedProps {
  lat: number;
  lng: number;
  label: string;
}

const MAP_SPAN = 0.02; // degrees around the pin (~2 km)

// The OpenStreetMap iframe brings third-party scripts and cookies, so it loads only on request
// (keeps Lighthouse Performance and Best Practices clean).
export function MapEmbed({ lat, lng, label }: MapEmbedProps) {
  const [visible, setVisible] = useState(false);

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="btn-outline-brass inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs uppercase tracking-wider"
      >
        <MapIcon aria-hidden="true" className="h-4 w-4" />
        Show map
      </button>
    );
  }

  const bbox = [lng - MAP_SPAN, lat - MAP_SPAN, lng + MAP_SPAN, lat + MAP_SPAN].join(",");
  return (
    <iframe
      title={`Map of ${label}`}
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
      loading="lazy"
      className="aspect-[16/9] w-full rounded-xl border border-white/10"
    />
  );
}
