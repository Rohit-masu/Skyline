# AGENTS.md — Skyline (Frontend Assignment, Round 2)

This file is the single source of truth for building this project. Read it fully before writing code, and re-read the relevant section before each milestone.

> **Current phase: V2 (3D landing).** The landing is the scroll-driven three.js story in `three/` (§8.2), with GSAP only for DOM motion in its own lazy chunk. The hero paints a poster rendered from our own 3D scene (`npm run posters:capture` then `npm run posters`), so poster and live 3D look identical. `LANDING_V1_PLAN.md` is kept for its art direction only. The full assignment brief is in `docs/BRIEF.md`. Everything else here still applies.

---

## 0. Context and working rules

**What this is.** A 24-hour interview assignment for Rohit: "Skyline", a showcase site for a fictional luxury residential tower. Next.js App Router + TypeScript. Four routes: scroll-driven 3D landing, listings, detail, enquiry form + small API. The full brief is in `docs/BRIEF.md` (if it is missing, ask Rohit to paste it there).

**How it will be graded (100 pts, 70 to pass):** Stability & logic 25 · 3D & scroll 20 · Performance 20 · UI/UX 15 · Backend 10 · Code quality & docs 10. The graders will actively try to break the site.

**The most important constraint:** in the follow-up call Rohit must explain *any line* and make a live change **without AI**. Code he cannot explain costs points. Therefore:

- Simple, explicit, readable code beats clever code. No meta-abstractions, no generic factories, no one-letter names.
- Files stay under ~200 lines. Components do one thing.
- Comments explain *why*, not *what*.
- Tunable values (scroll timings, camera keyframes, debounce ms, page size, rate limit) live in clearly named constants in one place each, so a live change is a one-line edit.

**Rules for you (the agent):**

1. Work milestone by milestone (section 11). Do not start the next one until the current one's acceptance checks pass.
2. After every milestone run `npm run typecheck && npm run lint && npm run build`. All must pass. Then make a small, clearly named commit (e.g. `feat(api): validated GET /api/properties`). Never one giant commit.
3. Never add a dependency without stating its gzipped size and which bundle it lands in. Only the allowed stack in section 2.
4. No `any`, no `@ts-ignore`, no `eslint-disable` to silence real problems.
5. Do not copy code verbatim from tutorials, templates or other repos. References (section 14) are for ideas only. Plagiarism = disqualification.
6. Keep two running notes files:
   - `notes/DECISIONS.md` — every non-obvious decision: what, why, what alternative was rejected. Also an "Assumptions" list. These feed the README.
   - `notes/AI_LOG.md` — anything you got wrong and how it was caught (failed build, wrong API, budget overshoot, bug found in testing). Rohit uses this to write an honest `AI_USAGE.md`.
7. After each milestone, add a short "How it works" paragraph per new file to `notes/WALKTHROUGH.md` so Rohit can prepare for the call.
8. If a requirement is unclear, make a reasonable assumption, record it in `notes/DECISIONS.md` → Assumptions, and continue.
9. Verify, don't assume: test in the browser (or describe exactly what Rohit should click) before marking something done.

---

## 1. Step 0 — audit the existing setup

Rohit thinks the base setup is done. Verify each item, fix what is missing, and report a short list of what you changed.

- [ ] Next.js App Router + TypeScript; `tsconfig` has `"strict": true` and `"noUncheckedIndexedAccess": true`
- [ ] `package.json` scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `seed`, `analyze`, `test`
- [ ] Tailwind CSS configured (zero runtime JS). No JS-heavy UI library
- [ ] ESLint with `next/core-web-vitals`
- [ ] `.gitignore` covers `.env*` but not `.env.example`
- [ ] `.env.example` present with every variable from section 6
- [ ] Git initialised, remote set, first commit exists
- [ ] `three` + `@types/three` installed. Nothing outside `src/three/` imports `three`
- [ ] Default Next boilerplate removed (starter page, unused SVGs, default fonts)
- [ ] `next.config.ts`: `images.formats = ['image/avif', 'image/webp']`, `reactStrictMode: true`, bundle analyzer behind `ANALYZE=true`
- [ ] Bundle analysis works. If the installed Next version builds with Turbopack and `@next/bundle-analyzer` produces no report, use that version's built-in analyzer, or run `next build --webpack` only for the report. Record which in DECISIONS.md
- [ ] `docs/BRIEF.md` contains the assignment text

---

## 2. Stack (decided — ask Rohit before changing)

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js App Router, TypeScript strict | Required by brief |
| Styling | Tailwind CSS | No runtime JS, keeps listing/detail under 120 KB |
| 3D | **Vanilla three.js** (no React Three Fiber, no drei) | three alone is roughly 150–170 KB gz; R3F + its reconciler would push the 3D chunk past the 200 KB budget. Vanilla is also easier to explain |
| Scroll animation | **Own damped-progress engine** (no GSAP, no Lenis) | Saves ~40 KB+, keeps native scroll (accessibility, INP), smooth both directions by construction. If GSAP is ever added, it goes only into the lazy 3D chunk |
| Overlay text animation | CSS driven by CSS custom properties written from the same progress value | Guarantees DOM overlays are in sync with 3D |
| Validation | Zod v4, one shared schema set for client + server | Brief requires shared types. If client-side zod pushes `/properties/[slug]` over budget, switch client imports to `zod/mini` |
| Database | Neon Postgres (free tier) via `@neondatabase/serverless`, plain parameterised SQL in a small repository layer, no ORM | Vercel's filesystem is read-only/ephemeral, so SQLite/JSON can't persist enquiries. Rohit already works with Postgres |
| Tests (bonus) | Vitest (filter↔URL, validation), Playwright (one e2e) | After core is done |
| Deploy | Vercel | Free, native Next support |

**Forbidden:** `@react-three/fiber`, `@react-three/drei`, Spline runtime, `framer-motion`/`motion` on listing or detail pages, lodash, moment/dayjs (use `Intl`), carousel/slider libraries, axios, any paid template.

---

## 3. Performance budgets (hard limits, measured on the deployed site, Lighthouse mobile)

| Metric | Budget |
|---|---|
| First-load JS `/properties`, `/properties/[slug]` | ≤ 120 KB gz |
| First-load JS `/` before 3D loads | ≤ 130 KB gz |
| 3D chunk (three + scene code), lazy | ≤ 200 KB gz |
| 3D models + textures on landing | ≤ 2 MB over the wire |
| LCP mobile | < 2.5 s |
| CLS | < 0.05 |
| TBT / INP | < 200 ms each |
| Lighthouse Performance (mobile, every route) | ≥ 90 |
| Lighthouse Accessibility, Best Practices | ≥ 95 |

**Check budgets at the end of every milestone** with the analyzer. If something grows unexpectedly, find out why before continuing.

Rules:
- `three` must never appear in the initial bundle of any route.
- The hero paints a real `<h1>` and a poster image before any WebGL code downloads.
- All images through `next/image` with `sizes`, fixed aspect ratio, lazy below the fold.
- Fonts via `next/font` (self-hosted), `display: 'swap'`, max 2 families.

---

## 4. Folder structure

```
src/
  app/
    layout.tsx               fonts, header/footer, metadata defaults
    page.tsx                 landing (server component)
    not-found.tsx            global 404
    error.tsx                global error boundary
    properties/
      page.tsx               listings (SSR first page)
      loading.tsx
      [slug]/
        page.tsx             detail (SSG + revalidate)
        not-found.tsx
    api/
      properties/route.ts
      properties/[slug]/route.ts
      properties/[slug]/similar/route.ts
      enquiries/route.ts
    admin/                   bonus, last
  components/
    landing/                 HeroPoster, ScrollStory, StoryPanel, SceneLoader, StaticStory, FeaturedHomes
    properties/              FilterBar, FilterDrawer, SearchInput, PropertyGrid, PropertyCard,
                             Pagination, GridSkeleton, EmptyState, ErrorState
    property/                Gallery, SpecList, Amenities, LocationBlock, SimilarList
    enquiry/                 EnquiryForm, FieldError
    ui/                      Button, Input, Select, Container, Skeleton
  lib/
    schema/                  property.ts, query.ts, enquiry.ts   (Zod — shared client + server)
    db/                      client.ts, properties.ts, enquiries.ts
    query/                   parse.ts, serialize.ts              (filter ↔ URL, pure functions)
    format.ts                ₹ lakh/crore, sq ft, dates (Intl)
    rate-limit.ts
    http.ts                  json helpers, error shape
  three/                     ONLY imported dynamically
    boot.ts                  entry: creates engine, wires everything, returns dispose()
    engine.ts                renderer, loop, resize, visibility, DPR cap, quality tier
    scroll.ts                section measurement, damped progress
    keyframes.ts             camera keyframes as plain data
    tower.ts                 procedural tower + build-up
    interior.ts              the "inside a home" floor plan
    amenities.ts             pool, gym, garden
    lighting.ts              env map, sun, shadows, day/night presets
    labels.ts                3D → screen projection for DOM labels
    interaction.ts           pointer parallax, floor hover
    capture.ts               dev-only poster capture
scripts/
  seed.ts
  schema.sql
  make-placeholders.ts       generates placeholder property images if real photos are missing
  make-posters.ts            converts captured PNGs to AVIF/WebP sizes
public/
  images/properties/
  posters/
reports/                     lighthouse-*.html, bundle-*.png/html
notes/                       DECISIONS.md, AI_LOG.md, WALKTHROUGH.md
docs/BRIEF.md
```

If the project does not use `src/`, keep the same structure at the root. Use the `@/` path alias.

---

## 5. Data model and seed

### Property (single definition in `lib/schema/property.ts`, `type Property = z.infer<...>`)

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `slug` | string | `kebab(title)-kebab(locality)`, unique |
| `title` | string | e.g. "Sky Residence 3BHK with Aravalli view" |
| `locality` | string | e.g. "Golf Course Road" |
| `city` | string | e.g. "Gurugram" |
| `priceInr` | integer | stored in **rupees**. Display as lakh/crore via `format.ts` |
| `bhk` | 1–4 | |
| `type` | `'apartment' \| 'penthouse' \| 'villa' \| 'studio' \| 'duplex'` | |
| `furnished` | boolean | |
| `areaSqft` | integer | realistic for BHK |
| `bathrooms` | integer | |
| `floor`, `totalFloors` | integer | |
| `facing` | `'north' \| 'east' \| 'south' \| 'west' \| ...` | |
| `amenities` | string[] | from a fixed pool |
| `images` | `{ src, alt, width, height }[]` | 4–6 each |
| `lat`, `lng` | number | roughly correct for the locality |
| `description` | string | 2–3 sentences |
| `createdAt` | ISO string | spread over the last ~120 days (for "newest" sort) |

### Seed (`npm run seed`)
- **56 properties**, deterministic (seeded PRNG) so results are stable between runs.
- Realistic Indian data across cities: Gurugram (Golf Course Road, Sector 65, DLF Phase 5), Noida (Sector 150, Sector 128), Delhi (Vasant Vihar, Greater Kailash), Mumbai (Bandra West, Powai, Lower Parel, Worli), Bengaluru (Whitefield, Koramangala, Indiranagar), Pune (Baner, Koregaon Park), Hyderabad (Gachibowli, Jubilee Hills).
- Prices consistent with city + BHK + type: roughly ₹45 L to ₹15 Cr.
- Idempotent: drops/truncates and re-inserts.

### Images
- Rohit will add 12–16 photos to `public/images/properties/` (exterior, living, bedroom, kitchen, balcony; free-licence sources, credited in README).
- Until then, `scripts/make-placeholders.ts` generates tasteful gradient placeholders with `sharp` so work is not blocked. Seed picks 4–6 images per property from the pool and records real width/height.

### DB schema (`scripts/schema.sql`)
- `properties` with indexes on `locality`, `city`, `bhk`, `price_inr`, `type`, `created_at`, plus a trigram or `ILIKE`-friendly approach for title/locality search (plain `ILIKE` is fine at this size; note it in DECISIONS).
- `enquiries (id, property_slug, name, phone, email, message, visit_date, ip_hash, created_at)` with an index on `(ip_hash, created_at)` for rate limiting.

---

## 6. Environment variables (`.env.example`)

```
DATABASE_URL=            # Neon Postgres connection string
IP_HASH_SALT=            # random string; IPs are stored only as salted SHA-256
ADMIN_PASSWORD=          # bonus /admin page
NEXT_PUBLIC_SITE_URL=    # e.g. https://skyline-xyz.vercel.app (for OG URLs)
```

No secrets in git, ever.

---

## 7. API specification

All responses JSON. Error shape everywhere: `{ error: string, issues?: { path: string, message: string }[] }`.

### `GET /api/properties`
- Query: `q` (≤ 80 chars, matches title or locality, case-insensitive), `minPrice`, `maxPrice` (integers, rupees, `min ≤ max`), `bhk` (comma list of 1–4, e.g. `2,3`), `type` (comma list of enum), `furnished` (`true|false`), `sort` (`price_asc|price_desc|newest`, default `newest`), `page` (≥ 1, default 1), `limit` (1–24, default 12).
- Unknown params: ignored. Invalid values: **400** with a clear message per field.
- Returns `{ items, total, page, hasMore }`.
- Headers: `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.
- Query parsing uses the **same** `lib/schema/query.ts` as the frontend.

### `GET /api/properties/:slug`
- 200 with the property, or **404** `{ error: 'Property not found' }`.
- `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600`.

### `GET /api/properties/:slug/similar`
- Up to 4, excluding itself. Same locality first, then same BHK, ordered by closeness in price. 404 if the slug doesn't exist.

### `POST /api/enquiries`
- Body validated with `lib/schema/enquiry.ts`:
  - `name` 2–80 chars, trimmed
  - `phone` 10-digit Indian mobile `^[6-9]\d{9}$` (normalise first: strip spaces, dashes, leading `+91`/`0`)
  - `email` optional, valid if present
  - `message` 10–1000 chars
  - `visitDate` `YYYY-MM-DD`, from today to today + 90 days, **"today" computed in Asia/Kolkata**
  - `propertySlug` must exist
  - `company` honeypot: must be empty
- Honeypot filled → respond **201** as if success but do not save (don't teach bots).
- Rate limit: max **5 per IP per 10 minutes**, counted in the `enquiries` table by `ip_hash` (works across serverless instances, unlike in-memory). Over limit → **429** with `Retry-After` header.
- IP from the first entry of `x-forwarded-for`; store only `sha256(ip + IP_HASH_SALT)`.
- Success → **201** `{ id }`. Validation error → **400** with `issues`. Malformed JSON → 400.

---

## 8. Route specs

### 8.1 Landing `/`

Server component. Order on the page:

1. **HeroPoster** — real `<h1>` + subtitle + poster via `next/image` (`priority`, `sizes="100vw"`, AVIF). This is the LCP element. No JS needed to paint it.
2. **SceneLoader** (small client component) decides the mode:
   - **static** if `prefers-reduced-motion: reduce`, no WebGL2, WebGL context creation throws, or `navigator.connection?.saveData`.
   - **3d** otherwise. Load `import('@/three/boot')` only after first paint: when the hero is visible **and** `requestIdleCallback` fires (fallback `setTimeout` ~1200 ms). The canvas sits `position: fixed` over the poster at `opacity: 0` and fades in **only after the first frame renders**. Never a blank canvas, never an error message.
   - Listen for `webglcontextlost` → switch to static mode.
3. **ScrollStory** — five `<section data-scene="...">` elements with fixed heights (in `vh`), each containing a sticky text panel. All text is real DOM (SEO, screen readers). The canvas is `aria-hidden`.
4. **FeaturedHomes** — server component, 6 properties from the DB, opaque background above the canvas. No client JS except CSS hover.

**Static mode:** each section shows its own poster still (captured from the real scene) with simple opacity fades via IntersectionObserver. No scrubbed camera.

#### Scenes (global progress `p` from 0 to 1 over the ScrollStory)

| # | Scene | Range | Camera / 3D | Overlay |
|---|---|---|---|---|
| 1 | Arrival | 0.00–0.18 | Wide shot, slow orbit (angle is a function of `p`, plus tiny idle drift), pointer parallax | "Skyline. Living above the city." fades in |
| 2 | Build-up | 0.18–0.38 | Camera eases to a three-quarter view; floors drop into place one by one from bottom to top. Scrolling up reverses smoothly | Counter: floors / residences, driven by the same progress |
| 3 | Inside a home | 0.38–0.62 | Camera dollies to floor 18; that floor's facade panels slide outward and fade; floor plan revealed; labels (Living, Bedroom, Kitchen, Balcony) pinned to 3D points | Text panel about the residence |
| 4 | Amenities | 0.62–0.86 | Three camera stops: pool → gym → garden, each held briefly | One text panel per stop, synced to the stop |
| 5 | CTA | 0.86–1.00 | Camera pulls back to a hero wide shot, scene settles | "Explore homes" → `/properties` |

Keep these ranges and all camera keyframes in `three/keyframes.ts` as plain data.

### 8.2 3D engine spec

**Golden rule: every visual is a pure function of the damped progress.** No timers, no stateful tweens. That's what makes fast scrolling and reversing smooth, and it's easy to explain.

- **engine.ts**
  - `WebGLRenderer({ antialias: dpr <= 1, powerPreference: 'high-performance', alpha: false })`
  - `setPixelRatio(Math.min(devicePixelRatio, tier === 'high' ? 2 : 1.5))`
  - sRGB output, ACES filmic tone mapping
  - Loop with `renderer.setAnimationLoop`. Pause when the ScrollStory is not intersecting (observe the story container, since the canvas is fixed) or `document.hidden`. Resume on return.
  - `ResizeObserver` for size; re-measure sections on resize.
  - Clamp frame delta to ≤ 1/30 s so returning from a background tab doesn't jump.
  - `dispose()` releases geometries, materials, textures, renderer, observers and listeners. Must survive React Strict Mode double-mount and route changes without leaks or duplicate canvases.
  - **Quality tiers:** `high` (desktop) and `low` (touch device or `hardwareConcurrency <= 4`): fewer floors, no real-time shadows, lower DPR.
- **scroll.ts** — cache section offsets (no `getBoundingClientRect` every frame). Per frame: target = raw progress from `scrollY`; `current = MathUtils.damp(current, target, 8, dt)`; expose global `p` and per-scene local progress `clamp((p - start) / (end - start), 0, 1)`. Write each scene's local progress to its section as CSS variable `--scene-p`.
- **keyframes.ts** — `{ at: number, position: [x,y,z], target: [x,y,z] }[]`. Interpolate position and look-at target between neighbouring keyframes with an ease-in-out curve (or a Catmull-Rom curve through the positions for smoother paths).
- **tower.ts** — procedural. Desktop ~28 floors, low tier ~20. Each floor is a group (slab + glass band + balcony rail) so build-up can offset y and opacity per floor: floor `i` lands when build progress passes `i / N`, with an eased drop. Repeated details (mullions, balcony rails) use `InstancedMesh`. Glass: `MeshStandardMaterial` with low roughness, slight metalness, env reflections, and an emissive window strip for night.
- **interior.ts** — floor 18 contains a simple floor plan: thin wall boxes, coloured zone floors (living, bedroom, kitchen, balcony), a few furniture blocks. Visible only around scene 3.
- **labels.ts** — anchors are `Vector3`s. Every frame: `vector.clone().project(camera)` → screen coords → set `transform: translate3d()` on the DOM label. Hide when behind the camera or outside scene 3. Labels are real DOM text.
- **amenities.ts** — pool on the podium (plane with reflective water material, subtle animated normal offset), gym (simple procedural equipment), garden (instanced low-poly trees). Optional CC0 GLB from Kenney/Poly Pizza, compressed (below).
- **lighting.ts** — `PMREMGenerator` + `RoomEnvironment` (no HDR download), hemisphere light, directional "sun". `high` tier: soft shadows (shadow map 1024, PCF soft) on tower and ground. `low` tier: no shadows; a radial-gradient contact shadow texture generated with a canvas (0 KB download). Day/night presets as plain objects (bonus toggle): sky colour, sun colour/intensity, env intensity, window emissive.
- **interaction.ts** — pointer parallax (damped camera offset, small amplitude, disabled on touch). Raycast hover on floors in scenes 1, 2 and 5: highlight floor emissive and show a DOM tooltip like "Floor 18 · 3 BHK". Throttle raycasts to pointer movement, not every frame.
- **capture.ts** (dev only, never shipped in production code paths) — with `?capture=1`, jump to fixed progress values, render, and download PNGs of the hero and each scene. `scripts/make-posters.ts` converts them to AVIF + WebP at 640/1024/1600 widths in `public/posters/`. These are the hero poster, reduced-motion stills and no-WebGL fallback.
- **Assets ≤ 2 MB.** If any GLB is used: `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp`. Prefer **Meshopt** over Draco (smaller decoder, no extra wasm/decoder files to host). Record the choice and sizes in DECISIONS.md.
- Zero console warnings: use only non-deprecated APIs for the installed three version.

### 8.3 Listings `/properties`

- `page.tsx` (server) parses `searchParams` **leniently** with the shared schema (invalid values are dropped, not errored), queries the DB directly (not via HTTP to its own API), renders `<PropertiesView initialQuery initialData />`. `generateMetadata` reflects the query (e.g. "3 BHK homes in Powai · Skyline").
- **URL is the source of truth.** `lib/query/parse.ts` and `lib/query/serialize.ts` are pure functions: `URLSearchParams → Query` and `Query → string` with canonical param order and defaults omitted. Unit-test these.
- Client components read from `useSearchParams()`. The only local state is the search box's in-progress text.
- Updating the URL:
  - filter / sort / page change → `window.history.pushState` (Back works). Any filter change resets `page` to 1.
  - search typing → debounce 300 ms → `window.history.replaceState`.
  - Next.js syncs `useSearchParams` with the native History API, so no router navigation and no double fetch.
- Fetching on URL change:
  - If the query equals the server-rendered one, use `initialData` (no fetch on first load).
  - Otherwise `AbortController`: abort the previous request, start a new one. Also keep a request-id guard so only the latest response is applied. Ignore `AbortError`.
  - Loading: 12 skeleton cards with the same aspect ratio as real cards (zero layout shift).
  - Empty: "No homes match — clear filters" with a button that clears the URL params.
  - Error: message + Retry button.
- **Pagination:** numbered, 12 per page. Render real `<a href>` links (crawlable, work without JS); intercept the click → `pushState` → scroll to the top of the grid.
- **Back from detail** must return to the same listing position. Verify manually; if Next's restoration isn't reliable, store `scrollY` in `sessionStorage` keyed by the full listing URL on card click and restore after data renders.
- **Filters UI** (native elements, keyboard-friendly): search input; price min/max selects with ₹ steps (25 L, 50 L, 75 L, 1 Cr, 1.5 Cr, 2 Cr, 3 Cr, 5 Cr, 10 Cr+); BHK toggle buttons with `aria-pressed` (multi-select); type select; furnished radio (Any / Yes / No); sort select. On mobile, filters open in a `<dialog>` drawer.
- **Card:** `next/image` with `sizes`, fixed aspect ratio; above-the-fold images not lazy, rest lazy. CSS hover (image scale + lift). Price formatted as lakh/crore.

### 8.4 Detail `/properties/[slug]`

- `generateStaticParams` for all seeded slugs + `export const revalidate = 3600`. Unknown slug → `notFound()` → a designed 404 with a link back to listings.
- `generateMetadata`: title, description, canonical URL, Open Graph image (first property image).
- **Gallery** (small client component, no library): main image + thumbnails, arrow-key navigation, buttons with `aria-label`, crossfade. Fixed aspect ratio.
- Price, spec list, amenities.
- **Location block:** locality, city, a few nearby landmarks, "Open in Maps" link. Optional OpenStreetMap iframe loaded only after clicking "Show map" (protects performance and Best Practices).
- **Similar properties:** server-rendered, up to 4.
- **Enquiry form** (8.5).

### 8.5 Enquiry form

- Client component. Fields: name, phone, email (optional), message, preferred visit date (`min` today IST, `max` +90 days), hidden honeypot `company` (visually hidden, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden`).
- Validate with the **same Zod schema** as the server: on blur per field and on submit. Inline errors with `aria-invalid` and `aria-describedby`. On submit, focus the first invalid field.
- State machine: `idle | submitting | success | error`.
  - Button disabled with "Sending…" while submitting; an in-flight ref also blocks double submit (Enter key spam).
  - 201 → success panel with a "Send another enquiry" button.
  - 400 → map server `issues` onto fields.
  - 429 → friendly "Too many enquiries, try again in N minutes".
  - Network error / 5xx → error banner with retry. **User input is kept** in every failure case.

---

## 9. Design system

**Theme: "Skyline at Dusk".** All pages dark, matching the approved mockup (`docs/mockup-v1.png`); see `LANDING_V1_PLAN.md` §2 and §5.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0E1420` | landing background, 3D sky, text on light pages |
| `--slate` | `#1C2533` | dark panels |
| `--brass` | `#C9A36A` | accent on dark: CTA, active states |
| `--brass-strong` | `#8A6A35` | accent **text** on light backgrounds (contrast AA) |
| `--ivory` | `#F3EEE6` | text on dark, background on light pages |
| `--mist` | `#5E6878` on light, `#9AA3B2` on dark | secondary text (verify AA) |

- **Fonts (2 families, `next/font/google`, `display: 'swap'`):** Fraunces (display/headings) + Manrope (body/UI). Load only the weights used.
- **Type scale** with `clamp()`: display, h1, h2, h3, body, small. Generous line-height on body.
- **Spacing** on a 4 px base; section padding consistent across pages.
- **Container** max-width ~1280 px with responsive gutters (16 px on phones). No horizontal scroll from 360 px to 1920 px.
- **Radius** small and consistent (cards 12–16 px). Subtle borders over heavy shadows.
- **Focus** visible everywhere: 2 px brass outline with offset.
- **Motion** consistent with the landing: ease-out curves, 150–300 ms. Card hover lift, results crossfade on filter change, gallery crossfade. Everything respects `prefers-reduced-motion`.
- Bonus: shared-element view transition from card image to detail gallery (`view-transition-name: property-<slug>`), only if it doesn't break anything.

---

## 10. Stability checklist (graders will test every item)

- [ ] Refresh, share link or Back on `/properties?...` restores identical results
- [ ] Typing fast in search never shows stale results; rapid filter changes never show an older response
- [ ] Loading (skeleton, no CLS), empty, error (+ retry) and real 404 states all designed
- [ ] Invalid query params in the page URL don't crash; API returns 400 with a message
- [ ] Form: same rules client and server, inline errors, no double submit, button disabled while sending, input kept on failure, 429 handled
- [ ] Back from detail returns to the same listing position
- [ ] Listings and detail render meaningful HTML on the server with title, description and OG tags
- [ ] Keyboard: filters, pagination, gallery, form, CTA. Visible focus. Labels on all inputs. Alt text. AA contrast
- [ ] 360 px → 1920 px, no horizontal scroll
- [ ] No console errors or warnings in production; no hydration mismatches (watch dates/IST, `Math.random`, `window` during render)
- [ ] Landing: reduced motion → static; no WebGL → designed fallback; canvas pauses off-screen and on hidden tab; no leaks on navigating away and back
- [ ] Slow 3G (DevTools throttling): hero still paints fast; no broken states

---

## 11. Milestones (in order) with acceptance checks

**M0 — Audit & foundations.** Section 1 checklist done. Design tokens, fonts, layout, header/footer, Container, Button, Input. ✅ Build passes, empty pages render with the theme.

**M1 — Data & API.** Schemas, DB client, `schema.sql`, seed (56 properties), placeholder images, all four endpoints, rate limit, caching headers. ✅ curl examples for each status code (200/201/400/404/429) documented in `notes/WALKTHROUGH.md` and verified.

**M2 — Listings.** Filter↔URL logic (+ unit tests), SSR first page, filters UI, abortable fetching, all states, pagination, scroll restoration. ✅ Every listings item in section 10 manually verified; budget ≤ 120 KB.

**M3 — Detail + enquiry.** SSG + revalidate, metadata/OG, gallery, specs, location, similar, form with all states. ✅ 404 works; form failure cases verified; budget ≤ 120 KB.

**M4 — Landing shell (no 3D yet).** Hero poster (temporary image), ScrollStory sections with text panels, static-mode behaviour, FeaturedHomes. ✅ Lighthouse mobile ≥ 90 on `/`; LCP is the hero.

**M5 — 3D core.** SceneLoader lazy load, engine (DPR cap, pause, dispose, tiers), scroll progress, keyframes, tower + build-up, lighting. Scenes 1–2. ✅ 3D chunk ≤ 200 KB gz; smooth both directions; no console warnings.

**M6 — 3D story complete.** Scenes 3–5, labels, amenities, hover + parallax, CSS-variable-driven overlays, context-loss fallback. Capture posters → replace temporary hero poster and static stills. ✅ Overlays in sync on every scene; ~60 fps on a laptop; usable on a mid-range phone (low tier).

**M7 — Polish & verification.** Responsive pass, accessibility pass, micro-interactions, Lighthouse on the **deployed** site for `/`, `/properties`, one detail page, bundle analyzer report. Save all to `/reports`. ✅ All budgets met or gaps documented honestly.

**M8 — Docs.** README, help Rohit draft `AI_USAGE.md` from `notes/AI_LOG.md` (he writes the final version in his own words). ✅ Every deliverable in section 12 present.

**M9 — Bonus (only if core is solid).** Favourites in `localStorage` with optimistic UI → day/night toggle → Playwright e2e → `/admin` → view transitions.

---

## 12. Deliverables

- Public GitHub repo with sensible commit history
- Live Vercel URL with seeded data visible
- `README.md`: run locally in ≤ 5 commands; architecture overview; how the 3D is loaded and why; performance decisions (vanilla three, no GSAP, Meshopt/WebP/AVIF, poster-first, DPR cap, tiers); caching/revalidation strategy; assumptions; asset credits; known issues; "with another day"
- `AI_USAGE.md` (Rohit writes the final text)
- `/reports`: Lighthouse mobile for `/`, `/properties`, one detail page + bundle analyzer screenshot/HTML
- 2–3 min screen recording incl. reduced-motion fallback (Rohit records)

### Caching explanation to put in README
- `/properties/[slug]`: statically generated at build, ISR `revalidate = 3600`.
- `/properties`: dynamic (depends on search params), server-renders the first page; client updates fetch `/api/properties`, which is CDN-cached with `s-maxage=60, stale-while-revalidate=300`.
- `/`: static shell; FeaturedHomes revalidated hourly.

---

## 13. Things that commonly go wrong (check these yourself)

- `three` sneaking into the main bundle through a shared import or a type import that isn't `import type`
- Canvas appearing before first frame → black flash
- Strict Mode double-mount creating two renderers
- Hydration mismatch from dates (server UTC vs browser IST) — compute "today" in Asia/Kolkata explicitly
- Search debounce firing after a filter change and overwriting it
- Skeleton heights differing from real cards → CLS
- Fixed canvas covering FeaturedHomes or the footer
- `getBoundingClientRect` in the render loop → jank
- Rate limiter in memory → useless on serverless
- Lighthouse run on localhost instead of the deployed site

---

## 14. References (inspiration only — do not copy code)

- Codrops — "Crafting Scroll Based Animations in Three.js" (three.js as background of an HTML page, camera follows scroll): https://tympanus.net/codrops/2022/01/05/crafting-scroll-based-animations-in-three-js/
- Codrops — "Building a Scroll-Reactive 3D Gallery with Three.js…" (clean Engine / Scroll / Gallery split, scroll smoothing + clamping): https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/
- Codrops — "How to Build Cinematic 3D Scroll Experiences with GSAP" (camera paths + text beats synced to scroll; ideas only, we don't use GSAP): https://tympanus.net/codrops/?p=103299
- Videinfra — Likova (Awwwards SOTD, commercial real estate, interactive WebGL building model, stepped panels reshaping on scroll): https://videinfra.com/work/likova
- Awwwards — "Real Estate Threejs Demo" element (interior with reflections): https://www.awwwards.com/inspiration/thumbnail-real-estate-threejs-demo
- Real estate 3D website case study (how scroll-guided walkthroughs are structured): https://www.hontran.dev/blog/real-estate-3d-website-case-study
- three.js docs and examples: https://threejs.org/docs/ · https://threejs.org/examples/
