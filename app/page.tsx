import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AltitudeRail } from "@/components/ui/AltitudeRail";
import { Hero } from "@/components/hero/Hero";
import { SceneLoader } from "@/components/landing/SceneLoader";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { FeaturedHomes } from "@/components/landing/FeaturedHomes";
import { VisitInvitation } from "@/components/landing/VisitInvitation";
import { MotionLayer } from "@/components/motion/MotionLayer";
import { SiteIntro } from "@/components/landing/SiteIntro";

// Layering (all in one stacking context): page background < hero poster (z-0) < fixed 3D canvas (z-[1])
// < shades (z-[2]) < story text (z-10) < sections after the story (z-10, opaque, they cover the canvas).
export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-ink text-ivory selection:bg-brass selection:text-ink">
      <SiteIntro />
      <Header />
      <AltitudeRail />
      <SceneLoader />
      <MotionLayer />

      <main>
        {/* The 3D scroll progress runs from the top of the hero to the end of the story. */}
        <div data-story-root>
          <Hero />
          <ScrollStory />
        </div>
        <FeaturedHomes />
        <VisitInvitation />
      </main>

      <Footer />
    </div>
  );
}
