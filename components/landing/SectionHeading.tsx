import { SplitWords } from "@/components/motion/SplitWords";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  accent?: string[];
  intro?: string;
  align?: "left" | "center";
}

// One heading pattern for every section after the story, so they read as one system:
// eyebrow with a brass hairline, word-by-word heading, optional intro. The data-*
// attributes are picked up by the lazy GSAP layer (components/motion/animations.ts).
export function SectionHeading({ id, eyebrow, title, accent, intro, align = "left" }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`max-w-2xl space-y-5 ${centered ? "mx-auto text-center" : ""}`}>
      <p data-reveal className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-brass ${centered ? "justify-center" : ""}`}>
        <span aria-hidden="true" className="h-px w-10 bg-brass/60" />
        {eyebrow}
      </p>
      <h2 id={id} data-split className="font-display text-4xl font-light leading-[1.05] tracking-tight text-ivory sm:text-6xl">
        <SplitWords text={title} accent={accent} />
      </h2>
      {intro && (
        <p data-reveal data-reveal-delay="0.15" className="text-base font-light leading-relaxed text-ivory/70 sm:text-lg">
          {intro}
        </p>
      )}
    </div>
  );
}
