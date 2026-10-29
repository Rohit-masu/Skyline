# Skyline — Phase Plan and Acceptance Checklist

Use this as a queue. Tick an item only after verifying it in the running app.

## Phase 0 — Audit existing work
- [x] Inspect git status/diff; do not discard user work.
- [x] Confirm Next.js App Router + TypeScript.
- [x] Map existing routes, components, API handlers, data source, validation and deployment config.
- [x] Run install only if needed, then dev server and production build.
- [x] Record what is complete, broken, missing, and risky.
- [x] Check whether the repo already contains a useful project plan or design tokens.

**Exit condition:** a verified repository status report and a prioritized plan, with no code changed.

## Phase 1 — Design system + landing shell
- [x] Define tokens for colour, type, spacing, container width, radius, shadow, focus and motion.
- [x] Implement responsive header/navigation and footer.
- [x] Build hero with real headline, CTA and optimized poster image.
- [x] Add clear static hero fallback before any 3D code loads.
- [x] Establish section rhythm, accessible buttons and mobile navigation.

**Exit condition:** visually coherent responsive shell; no blank hero; no WebGL required yet.

## Phase 2 — Property data + API correctness
- [x] One shared typed `Property` definition.
- [x] At least 50 realistic fictional Indian properties.
- [x] `GET /api/properties`: q, minPrice, maxPrice, bhk, type, furnished, sort, page/cursor, limit (max 24).
- [x] Invalid query values return 400 with useful error text.
- [x] `GET /api/properties/:slug`: correct item or 404.
- [x] `GET /api/properties/:slug/similar`: up to 4 similar items.
- [x] `POST /api/enquiries`: schema validation, persistence, 201, honeypot, simple rate limit and 429.
- [x] Safe `.env.example`, no secrets.
- [x] Sensible read caching/revalidation and documented trade-offs.

**Exit condition:** test API manually with valid, invalid, empty and missing-slug requests.

## Phase 3 — Listings page
- [x] 12 items per page.
- [x] Search title/locality; debounce and prevent stale results.
- [x] Price range, BHK 1–4, type, furnished, sort price asc/desc/newest.
- [x] Query string is source of truth for all filters and page.
- [x] Refresh and copy/paste URL reproduce exact results.
- [x] Browser Back/Forward restores previous filters/results.
- [x] Loading skeletons, empty state with clear-filters action, error state with retry.
- [x] Accessible filter labels and keyboard navigation.
- [x] Preserve listing scroll position when navigating to detail and back.

**Exit condition:** run through filter combinations quickly, refresh, Back and Forward; no stale results.

## Phase 4 — Property detail + enquiry
- [x] Dynamic slug route, server-rendered meaningful content and metadata.
- [x] Gallery controls accessible by keyboard; images have meaningful alt text.
- [x] Price, BHK, area, property type, locality, amenities and location block.
- [x] Similar properties based on locality or BHK, maximum 4.
- [x] Form fields: name, 10-digit Indian mobile, optional email, message, preferred visit date.
- [x] Client/server validation rules match; inline errors.
- [x] Disable submit while sending; no double submit.
- [x] Keep typed values on failure; clear/show success only after 201.
- [x] Unknown slug is a real 404.

**Exit condition:** submit valid and invalid forms; simulate server error; confirm input retention.

## Phase 5 — Scroll-driven 3D story
Implement and review one scene at a time. Keep 3D lazy-loaded.

1. Arrival: tower + surroundings, gentle camera orbit tied to scroll, headline.
2. Build-up: floors assemble with scroll; reverse scroll must reverse smoothly.
3. Inside a home: reveal rooms/floor layout and pin living/bedroom/balcony labels.
4. Amenities: pool, gym and garden points with synchronized DOM panels.
5. CTA: scene settles and Explore Homes links to `/properties`.

Additional checks:
- [x] Scroll progress drives the camera/model; no timer-driven scene progression.
- [x] One interaction beyond scrolling (e.g. floor hover/focus or pointer parallax).
- [x] DOM overlays remain synchronized at fast and reverse scrolling.
- [x] `prefers-reduced-motion` shows a designed static/simplified version.
- [x] No WebGL/weak-device failure produces a designed image fallback.
- [x] Stop rendering when canvas is off-screen or tab is hidden.
- [x] Cap DPR around 1.5–2; test phone performance.
- [x] Model + textures total <= 2MB; 3D chunk <= 200KB gzipped if feasible and measured.
- [x] Initial route JS and other budgets measured, not assumed.

## Phase 6 — Polish and hardening
- [x] Test at 360px, 390px, tablet, 1440px and wide desktop.
- [x] Keyboard focus, AA contrast, labels, alt text and reduced motion.
- [x] Check all routes on refresh and direct URL entry.
- [x] Check no horizontal overflow, hydration mismatch or production console errors.
- [x] Run production build.
- [x] Generate bundle analyzer evidence.
- [x] Save reports under `/reports`; report real numbers and any missed budget honestly.

## Phase 7 — Submission
- [x] Meaningful git commits for each phase.
- [x] README with setup (<5 commands), architecture, 3D lazy loading, performance, cache strategy, known issues, next-day improvements and asset credits.
- [x] Honest `AI_USAGE.md`.
- [x] `/reports` contains acceptance report, recording checklist, and bundle analyzer evidence.
