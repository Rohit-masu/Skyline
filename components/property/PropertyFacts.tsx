import { Bath, Bed, Building, Car, Check, Layers, Maximize2 } from "lucide-react";
import type { Property } from "@/types/property";
import { formatArea } from "@/lib/format";

const sectionTitle = "text-xs uppercase tracking-[0.2em] text-brass";

export function PropertyFacts({ property }: { property: Property }) {
  const keyFacts = [
    { icon: Bed, label: "Configuration", value: `${property.bhk} BHK ${property.type}` },
    { icon: Maximize2, label: "Carpet area", value: formatArea(property.areaSqFt) },
    { icon: Bath, label: "Bathrooms", value: String(property.bathrooms) },
    { icon: Building, label: "Floor", value: `${property.floor} of ${property.totalFloors}` },
    { icon: Car, label: "Parking", value: `${property.parking} ${property.parking === 1 ? "bay" : "bays"}` },
    { icon: Layers, label: "Furnishing", value: property.furnished ? "Furnished" : "Unfurnished" },
  ];

  const specifications = [
    { label: "Flooring", value: property.specifications.flooring },
    { label: "Ceiling height", value: property.specifications.ceilingHeight },
    { label: "View", value: property.specifications.view },
    { label: "Possession", value: property.specifications.possessionDate },
  ];

  return (
    <>
      <section aria-labelledby="facts-title" className="space-y-4">
        <h2 id="facts-title" className={sectionTitle}>01 — Key facts</h2>
        <dl className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
          {keyFacts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="space-y-1 rounded-2xl border border-white/5 bg-[#0e1624] p-4">
              <dt className="flex items-center gap-2 text-xs text-mist">
                <Icon aria-hidden="true" className="h-4 w-4 text-brass" />
                {label}
              </dt>
              <dd className="font-display text-xl font-light text-ivory">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="about-title" className="space-y-4">
        <h2 id="about-title" className={sectionTitle}>02 — About this home</h2>
        <p className="rounded-2xl border border-brass/15 bg-[#0e1624]/60 p-6 text-base font-light leading-relaxed text-ivory-dim sm:p-8">
          {property.description}
        </p>
      </section>

      <section aria-labelledby="specs-title" className="space-y-4">
        <h2 id="specs-title" className={sectionTitle}>03 — Specifications</h2>
        <dl className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#0e1624]/80">
          {specifications.map(({ label, value }) => (
            <div key={label} className="flex flex-col justify-between gap-1 p-4 text-sm sm:flex-row sm:items-center sm:gap-6 sm:p-5">
              <dt className="shrink-0 text-xs text-mist">{label}</dt>
              <dd className="text-ivory sm:text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="amenities-title" className="space-y-4">
        <h2 id="amenities-title" className={sectionTitle}>04 — Amenities</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {property.amenities.map((amenity) => (
            <li key={amenity} className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0e1624] p-3.5 text-sm text-ivory">
              <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass">
                <Check className="h-3 w-3" />
              </span>
              {amenity}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
