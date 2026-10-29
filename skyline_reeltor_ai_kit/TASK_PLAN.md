# Skyline — Phase Plan and Acceptance Checklist

Use this as a queue. Tick an item only after verifying it in the running app.

## Phase 0 — Audit existing work
- [ ] Inspect git status/diff; do not discard user work.
- [ ] Confirm Next.js App Router + TypeScript.
- [ ] Map existing routes, components, API handlers, data source, validation and deployment config.
- [ ] Run install only if needed, then dev server and production build.
- [ ] Record what is complete, broken, missing, and risky.
- [ ] Check whether the repo already contains a useful project plan or design tokens.

**Exit condition:** a verified repository status report and a prioritized plan, with no code changed.

## Phase 1 — Design system + landing shell
- [ ] Define tokens for colour, type, spacing, container width, radius, shadow, focus and motion.
- [ ] Implement responsive header/navigation and footer.
- [ ] Build hero with real headline, CTA and optimized poster image.
- [ ] Add clear static hero fallback before any 3D code loads.
- [ ] Establish section rhythm, accessible buttons and mobile navigation.

**Exit condition:** visually coherent responsive shell; no blank hero; no WebGL required yet.

## Phase 2 — Property data + API correctness
- [ ] One shared typed `Property` definition.
- [ ] At least 50 realistic fictional Indian properties.
- [ ] `GET /api/properties`: q, minPrice, maxPrice, bhk, type, furnished, sort, page/cursor, limit (max 24).
- [ ] Invalid query values return 400 with useful error text.
- [ ] `GET /api/properties/:slug`: correct item or 404.
- [ ] `GET /api/properties/:slug/similar`: up to 4 similar items.
- [ ] `POST /api/enquiries`: schema validation, persistence, 201, honeypot, simple rate limit and 429.
- [ ] Safe `.env.example`, no secrets.
- [ ] Sensible read caching/revalidation and documented trade-offs.

**Exit condition:** test API manually with valid, invalid, empty and missing-slug requests.

## Phase 3 — Listings page
- [ ] 12 items per page.
- [ ] Search title/locality; debounce and prevent stale results.
- [ ] Price range, BHK 1–4, type, furnished, sort price asc/desc/newest.
- [ ] Query string is source of truth for all filters and page.
- [ ] Refresh and copy/paste URL reproduce exact results.
- [ ] Browser Back/Forward restores previous filters/results.
- [ ] Loading skeletons, empty state with clear-filters action, error state with retry.
- [ ] Accessible filter labels and keyboard navigation.
- [ ] Preserve listing scroll position when navigating to detail and back.

**Exit condition:** run through filter combinations quickly, refresh, Back and Forward; no stale results.

## Phase 4 — Property detail + enquiry
- [ ] Dynamic slug route, server-rendered meaningful content and metadata.
- [ ] Gallery controls accessible by keyboard; images have meaningful alt text.
- [ ] Price, BHK, area, property type, locality, amenities and location block.
- [ ] Similar properties based on locality or BHK, maximum 4.
- [ ] Form fields: name, 10-digit Indian mobile, optional email, message, preferred visit date.
- [ ] Client/server validation rules match; inline errors.
- [ ] Disable submit while sending; no double submit.
- [ ] Keep typed values on failure; clear/show success only after 201.
- [ ] Unknown slug is a real 404.

**Exit condition:** submit valid and invalid forms; simulate server error; confirm input retention.

## Phase 5 — Scroll-driven 3D story
Implement and review one scene at a time. Keep 3D lazy-loaded.

1. Arrival: tower + surroundings, gentle camera orbit tied to scroll, headline.
2. Build-up: floors assemble with scroll; reverse scroll must reverse smoothly.
3. Inside a home: reveal rooms/floor layout and pin living/bedroom/balcony labels.
4. Amenities: pool, gym and garden points with synchronized DOM panels.
5. CTA: scene settles and Explore Homes links to `/properties`.

Additional checks:
- [ ] Scroll progress drives the camera/model; no timer-driven scene progression.
- [ ] One interaction beyond scrolling (e.g. floor hover/focus or pointer parallax).
- [ ] DOM overlays remain synchronized at fast and reverse scrolling.
- [ ] `prefers-reduced-motion` shows a designed static/simplified version.
- [ ] No WebGL/weak-device failure produces a designed image fallback.
- [ ] Stop rendering when canvas is off-screen or tab is hidden.
- [ ] Cap DPR around 1.5–2; test phone performance.
- [ ] Model + textures total ≤2MB; 3D chunk ≤200KB gzipped if feasible and measured.
- [ ] Initial route JS and other budgets measured, not assumed.

**Time-saving strategy:** use a restrained procedural tower built from repeated floor geometry and simple amenity props if a licensed optimized model is not immediately available. Do not spend hours creating bespoke high-poly assets.

## Phase 6 — Polish and hardening
- [ ] Test at 360px, 390px, tablet, 1440px and wide desktop.
- [ ] Keyboard focus, AA contrast, labels, alt text and reduced motion.
- [ ] Check all routes on refresh and direct URL entry.
- [ ] Check no horizontal overflow, hydration mismatch or production console errors.
- [ ] Run production build.
- [ ] Run Lighthouse mobile on `/`, `/properties`, and one detail route.
- [ ] Generate bundle analyzer evidence.
- [ ] Save reports under `/reports`; report real numbers and any missed budget honestly.

## Phase 7 — Submission
- [ ] Public GitHub repo with meaningful commits.
- [ ] Deploy; test live URL and seeded properties.
- [ ] README with setup (<5 commands), architecture, 3D lazy loading, performance, cache strategy, known issues, next-day improvements and asset credits.
- [ ] Honest `AI_USAGE.md`.
- [ ] `/reports` contains three Lighthouse reports and bundle analyzer screenshot/report.
- [ ] Record 2–3 minute demo, including reduced-motion fallback.
- [ ] Final pass: repo link, live URL, no secrets, clean status.
- [ ] Send submission before Friday 30 Oct 2026, 7:00 PM IST.

## Time guardrail
Do not sacrifice a working deployed app to chase bonus features. Shortlist, day/night toggle, admin and transitions come only after every required deliverable is stable.
