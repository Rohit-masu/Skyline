import { ExternalLink, MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import { MapEmbed } from "./MapEmbed";

// A few well-known places per city; the seed data has no per-home landmarks (see DECISIONS.md).
const NEARBY_LANDMARKS: Record<string, string[]> = {
  Gurgaon: ["Cyber Hub", "Golf Course Road metro", "Ambience Mall", "IGI Airport (25 min)"],
  Delhi: ["Khan Market", "Lodhi Garden", "India Gate", "IGI Airport (30 min)"],
  Mumbai: ["Bandra–Worli Sea Link", "BKC business district", "Marine Drive", "CSM Airport (35 min)"],
  Bangalore: ["UB City", "Cubbon Park", "Indiranagar 100 ft Road", "Kempegowda Airport (50 min)"],
  Hyderabad: ["HITEC City", "Durgam Cheruvu lake", "Jubilee Hills Road 36", "RGI Airport (40 min)"],
  Goa: ["Candolim beach", "Fort Aguada", "Panaji old quarter", "Mopa Airport (45 min)"],
};

export function LocationBlock({ property }: { property: Property }) {
  const { lat, lng } = property.coordinates;
  const landmarks = NEARBY_LANDMARKS[property.city] ?? [];
  const place = `${property.locality}, ${property.city}`;

  return (
    <section aria-labelledby="location-title" className="space-y-4">
      <h2 id="location-title" className="text-xs uppercase tracking-[0.2em] text-brass">
        05 — Location
      </h2>
      <div className="space-y-5 rounded-2xl border border-brass/20 bg-[#0e1624]/60 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-display text-xl text-ivory">
              <MapPin aria-hidden="true" className="h-4 w-4 text-brass" />
              {property.locality}
            </p>
            <p className="text-xs text-mist">{property.city}, India</p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-brass underline-offset-4 hover:underline"
          >
            Open in Maps
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        {landmarks.length > 0 && (
          <div>
            <h3 className="mb-2 text-[11px] uppercase tracking-[0.2em] text-mist">Nearby</h3>
            <ul className="grid grid-cols-1 gap-2 text-sm text-ivory-dim sm:grid-cols-2">
              {landmarks.map((landmark) => (
                <li key={landmark} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brass" />
                  {landmark}
                </li>
              ))}
            </ul>
          </div>
        )}

        <MapEmbed lat={lat} lng={lng} label={place} />
      </div>
    </section>
  );
}
