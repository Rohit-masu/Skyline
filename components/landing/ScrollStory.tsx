import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitWords } from "@/components/motion/SplitWords";
import { StoryScene } from "./StoryScene";

// Scene lengths in vh. The 3D camera keyframes are tied to scenes, not pixels,
// so changing a number here stretches or shortens that chapter and nothing else.
const SCENE_HEIGHTS = { arrival: 180, build: 230, inside: 240, pool: 150, gym: 150, garden: 150, cta: 170 };

const headingClass = "font-display text-4xl font-light leading-[1.05] tracking-tight text-ivory sm:text-6xl";
const bodyClass = "max-w-md text-base font-light leading-relaxed text-ivory/75";

const AMENITIES = [
  {
    id: "pool",
    level: "L04 · PODIUM",
    title: "An infinity pool on level four.",
    accent: ["infinity"],
    body: "A heated 50-metre lap pool on the podium roof, lit from below after dark, with cabanas along a teak deck.",
    still: { src: "/posters/pool.webp", alt: "Render of the infinity pool on the podium roof" },
  },
  {
    id: "gym",
    level: "L24 · SKY CLUB",
    title: "An open-air gym, twenty-four floors up.",
    accent: ["open-air"],
    body: "Level 24 has a fitness terrace that juts out from the tower: treadmills, free weights and a yoga deck, with the whole city as the view.",
    still: { src: "/posters/gym.webp", alt: "Render of the open-air gym terrace on level 24" },
  },
  {
    id: "garden",
    level: "ROOF · CROWN",
    title: "A garden on the roof.",
    accent: ["garden"],
    body: "A planted roof with a fire pit under the crown's brass fins. The quietest place in the city, twenty-eight floors up.",
    still: { src: "/posters/garden.webp", alt: "Render of the roof garden under the crown" },
  },
] as const;

export function ScrollStory() {
  return (
    <>
      <StoryScene
        id="arrival"
        heightVh={SCENE_HEIGHTS.arrival}
        eyebrow="Arrival"
        level="G · GROUND"
        still={{ src: "/posters/arrival.webp", alt: "Render of Skyline tower in the city at blue hour" }}
      >
        <h2 id="arrival-title" className="sr-only">Our philosophy</h2>
        <blockquote data-scrub-words className="font-display text-3xl font-light leading-[1.2] text-ivory sm:text-5xl">
          <SplitWords
            text="We built Skyline for people who measure a home in light, air and silence — not square feet alone."
            accent={["light,", "air", "silence"]}
          />
        </blockquote>
      </StoryScene>

      <StoryScene
        id="build"
        heightVh={SCENE_HEIGHTS.build}
        eyebrow="The making"
        level="L01 → L28"
        still={{ src: "/posters/build.webp", alt: "Render of the tower floors stacking into place" }}
      >
        <h2 id="build-title" className={headingClass}>
          Rising, <span className="italic text-brass">floor by floor</span>.
        </h2>
        <p className={bodyClass}>
          Post-tensioned slabs, a seismic core and double-glazed facades, stacked with the patience of a watchmaker.
        </p>
        <dl className="grid max-w-md grid-cols-2 gap-6 border-t border-brass/20 pt-6">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.25em] text-mist">Floors</dt>
            <dd className="font-display text-5xl font-light tabular-nums text-ivory" data-count-to="28">28</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.25em] text-mist">Residences</dt>
            <dd className="font-display text-5xl font-light tabular-nums text-ivory" data-count-to="112">112</dd>
          </div>
        </dl>
      </StoryScene>

      <StoryScene
        id="inside"
        heightVh={SCENE_HEIGHTS.inside}
        eyebrow="Inside a home"
        level="L18 · SKY SUITE"
        still={{ src: "/posters/inside.webp", alt: "Render of the level 18 floor plan with the floors above lifted" }}
      >
        <h2 id="inside-title" className={headingClass}>
          Step <span className="italic text-brass">inside</span> level eighteen.
        </h2>
        <p className={bodyClass}>
          A 3 BHK laid out around the light: living and balcony to the west for sunsets, bedrooms to the quiet east,
          11-foot ceilings throughout.
        </p>
        <ul className="grid max-w-md grid-cols-2 gap-3 text-sm text-ivory/80">
          {["2,450 sq ft carpet", "60 ft glass balcony", "Private lift lobby", "Italian marble"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-brass" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </StoryScene>

      {AMENITIES.map((amenity, index) => (
        <StoryScene
          key={amenity.id}
          id={amenity.id}
          heightVh={SCENE_HEIGHTS[amenity.id]}
          eyebrow={`Amenities · ${index + 1}/3`}
          level={amenity.level}
          still={amenity.still}
        >
          <h2 id={`${amenity.id}-title`} data-split className={headingClass}>
            <SplitWords text={amenity.title} accent={[...amenity.accent]} />
          </h2>
          <p className={bodyClass}>{amenity.body}</p>
        </StoryScene>
      ))}

      <StoryScene
        id="cta"
        heightVh={SCENE_HEIGHTS.cta}
        eyebrow="Your view"
        level="ROOF"
        still={{ src: "/posters/cta.webp", alt: "Render of Skyline tower at night" }}
      >
        <h2 id="cta-title" className={headingClass}>
          The view is <span className="italic text-brass">waiting</span>.
        </h2>
        <p className={bodyClass}>56 residences, from compact sky studios to duplex penthouses under the crown.</p>
        <Link
          href="/properties"
          data-magnetic
          className="btn-brass inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs uppercase tracking-widest"
        >
          Explore homes
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </StoryScene>
    </>
  );
}
