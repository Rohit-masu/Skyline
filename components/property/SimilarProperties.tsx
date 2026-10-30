import type { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Sparkles } from "lucide-react";

interface SimilarPropertiesProps {
  properties: Property[];
  currentLocality: string;
}

export function SimilarProperties({ properties, currentLocality }: SimilarPropertiesProps) {
  if (!properties || properties.length === 0) return null;

  return (
    <section
      className="mt-24 pt-16 border-t border-[rgba(255,255,255,0.08)] space-y-10"
      aria-label="Similar Residences"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a36a]" />
            <span className="text-[10px] font-mono tracking-widest text-[#c9a36a] uppercase">
              ARCHITECTURAL COMPLEMENTS
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-light text-[#f4eee5]">
            Similar <span className="italic text-[#c9a36a]">Residences</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8f9ba8] font-sans font-light">
            Alternative configurations and adjacent luxury suites near {currentLocality}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.slice(0, 4).map((prop) => (
          <PropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </section>
  );
}
