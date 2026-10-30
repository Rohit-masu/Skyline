const STEPS = [
  { title: "Pick a home", body: "Shortlist homes online with the heart button, or tell us what you need." },
  { title: "Choose a day", body: "Send the visit form on any home. We call back within one working day." },
  { title: "Walk through", body: "Tour the show apartments and the floor plans with an architect, about an hour." },
];

// Three steps joined by a brass line that draws itself with the scroll (data-draw-line, scrubbed
// by the GSAP layer). Without GSAP the line is simply fully drawn.
export function VisitSteps() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute left-0 right-0 top-5 hidden h-px bg-white/10 md:block">
        <div data-draw-line className="h-full origin-left bg-gradient-to-r from-brass via-brass-light to-brass/20" />
      </div>
      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, index) => (
          <li key={step.title} data-reveal data-reveal-delay={index * 0.15} className="relative space-y-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-brass bg-ink font-display text-sm text-brass">
              {index + 1}
            </span>
            <h4 className="font-display text-2xl font-light text-ivory">{step.title}</h4>
            <p className="max-w-xs text-sm leading-relaxed text-ivory/70">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
