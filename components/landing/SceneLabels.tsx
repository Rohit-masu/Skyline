import type { RefObject } from "react";

// Names must match the anchors in three/interior.ts (rooms) and three/amenities.ts (amenities).
const ROOM_LABELS = [
  { anchor: "living", text: "Living" },
  { anchor: "bedroom", text: "Bedroom" },
  { anchor: "kitchen", text: "Kitchen" },
  { anchor: "balcony", text: "Balcony" },
];

const AMENITY_LABELS = [
  { anchor: "pool", level: "L04 · Podium", title: "Infinity pool", detail: "50 m heated lap pool, lit from below" },
  { anchor: "gym", level: "L24 · Sky club", title: "Open-air gym", detail: "Treadmills, free weights, yoga deck" },
  { anchor: "garden", level: "Roof · Crown", title: "Roof garden", detail: "Trees and a fire pit under the crown" },
];

// DOM labels that three/labels.ts pins to 3D points every frame (position and opacity).
// aria-hidden: the story panels describe the same rooms and amenities in real text.
export function SceneLabels({ layerRef }: { layerRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={layerRef} className="pointer-events-none fixed inset-0 z-[5]" aria-hidden="true">
      {ROOM_LABELS.map((label) => (
        <span
          key={label.anchor}
          data-label={label.anchor}
          className="absolute left-0 top-0 flex items-center gap-2 rounded-full border border-brass/40 bg-ink/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-ivory opacity-0"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
          {label.text}
        </span>
      ))}

      {AMENITY_LABELS.map((label) => (
        <div key={label.anchor} data-label={label.anchor} className="absolute left-0 top-0 flex flex-col items-center opacity-0">
          <div className="rounded-xl border border-brass/40 bg-ink/85 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">{label.level}</p>
            <p className="font-display text-lg leading-tight text-ivory">{label.title}</p>
            <p className="text-[11px] text-mist">{label.detail}</p>
          </div>
          {/* Stem and dot pointing at the 3D model. */}
          <span className="h-10 w-px bg-gradient-to-b from-brass to-brass/0" />
          <span className="h-2 w-2 rounded-full bg-brass shadow-[0_0_12px_4px_rgba(201,163,106,0.6)]" />
        </div>
      ))}
    </div>
  );
}
