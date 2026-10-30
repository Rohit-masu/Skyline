interface CurvedTransitionProps {
  /** Invert the curve orientation (e.g. concave vs convex) */
  inverted?: boolean;
  /** Ambient glow intensity */
  glow?: boolean;
  className?: string;
}

export function CurvedTransition({ inverted = false, glow = true, className = "" }: CurvedTransitionProps) {
  return (
    <div className={`relative w-full overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
      {/* Ambient dusk/gold atmospheric glow */}
      {glow && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-4xl h-44 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(201,163,106,0.18)_0%,_rgba(20,29,43,0.12)_45%,_transparent_75%)] blur-3xl opacity-80" />
      )}

      {/* Vertical dissolving fade from preceding section */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-ink/50 to-ink" />

      {/* Organic Curved Architectural Hairline */}
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        preserveAspectRatio="none"
        className={`relative block w-full h-16 sm:h-20 lg:h-24 ${inverted ? "rotate-180" : ""}`}
      >
        <path
          d="M0,35 C320,80 720,10 1120,65 C1280,82 1380,55 1440,42 L1440,90 L0,90 Z"
          fill="#0a0f18"
        />
        <path
          d="M0,35 C320,80 720,10 1120,65 C1280,82 1380,55 1440,42"
          stroke="url(#curveBrassGlow)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id="curveBrassGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c9a36a" stopOpacity="0" />
            <stop offset="20%" stopColor="#c9a36a" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#dfba82" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#c9a36a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c9a36a" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
