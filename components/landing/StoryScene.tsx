import Image from "next/image";
import type { ReactNode } from "react";

interface StorySceneProps {
  id: string;
  // Section height in vh. Longer = the scene lasts longer while scrolling.
  heightVh: number;
  eyebrow: string;
  level: string;
  still: { src: string; alt: string };
  children: ReactNode;
}

// One chapter of the scroll story: a tall section with a sticky, full-screen stage.
// 3D mode: the stage is transparent over the fixed canvas and the panel fades with --scene-p.
// Static mode (reduced motion, no WebGL, no JS): the still photo is shown behind the panel.
export function StoryScene({ id, heightVh, eyebrow, level, still, children }: StorySceneProps) {
  return (
    <section
      id={id}
      data-scene={id}
      aria-labelledby={`${id}-title`}
      className="story-scene relative"
      style={{ height: `${heightVh}vh` }}
    >
      {/* z-10 sits on the sticky stage itself: sticky always creates a stacking context,
          so a z-index on the panel inside could never lift it above the fixed canvas (z-[1]). */}
      {/* Phones: text sits low, leaving the top of the screen to the 3D subject and its labels. */}
      <div className="sticky top-0 z-10 flex h-[100svh] items-end overflow-hidden pb-[10svh] md:items-center md:pb-0">
        <div className="story-still absolute inset-0">
          <Image src={still.src} alt={still.alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
        </div>

        <div className="story-panel relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="max-w-xl space-y-6">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium uppercase tracking-[0.35em] text-brass">
              <span>{eyebrow}</span>
              <span className="h-px w-10 bg-brass/50" aria-hidden="true" />
              <span className="font-mono tracking-[0.2em] text-mist">{level}</span>
            </p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
