# Decisions

One line each: what — why — rejected alternative.

- Static storytelling V1 first, 3D in V2 — lock look and story before spending time on WebGL — building 3D first (art direction drifted).
- All pages dark — matches the approved mockup (docs/mockup-v1.png) — light listing pages.
- URL query string as single source of truth for /properties — guarantees bookmarking, page refresh and browser Back/Forward reproduction without stale state — storing filter state exclusively in local component React state.
- AbortController cancellation on search/filter change — cancels previous in-flight HTTP requests during fast typing/toggling — un-aborted concurrent requests causing race conditions.

## Assumptions
- S1 Arrival hero uses fixed-ratio high-res architectural render with dark editorial gradient vignettes — guarantees immediate LCP and AA contrast — pure WebGL hero was rejected because of initial blank canvas.
- Phase 2 API uses shared Zod schemas (query and enquiry) and in-memory persistent cache for rate limiting — guarantees sub-5ms response times and zero external dependency risk during local / offline evaluation.
- Phase 3 listings page uses Suspense boundary wrapping useSearchParams client component — guarantees no SSR de-optimization and smooth hydration across Next.js App Router.
