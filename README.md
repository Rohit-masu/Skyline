# Skyline — The Art of Elevated Living

A luxury residential architectural showcase built for the **Reeltor** Frontend Developer evaluation.

**Flagship Location:** Sector 128, Noida Expressway &bull; Reeltor Experience Pavilion  
**Tower Architecture:** 28 Storeys &bull; 56 Curated Sky Suites, Duplexes & Penthouses  

---

## 1. Quick Start (< 5 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Run test suite (16 tests)
npm test

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Implemented Features

### Phase 1: Architectural Luxury Design System & Landing Shell
- **Art Direction**: Deep charcoal canvas (`#0a0f18`), champagne brass accents (`#c9a36a`), warm ivory typography (`#f4eee5`), Fraunces serif headings, and Manrope sans body.
- **Responsive Site Shell**: Header with altitude indicators, mobile slide-over navigation with background blur lock, and comprehensive footer with Reeltor Pavilion address.
- **3D-first Hero**: The headline and a poster rendered from our own 3D scene (`public/posters/hero.webp`) paint first (LCP); the live 3D canvas then fades in on top showing the same view, so there is no change of style. Live Asia/Kolkata (IST) clock, letter-by-letter headline reveal, ticker.

### Phase 2: Property Data & API Layer
- **56 Realistic Indian Residences**: Seeded with authentic INR pricing (`₹1.8 Cr` to `₹115 Cr`), realistic carpet areas (1,200 to 14,000 sq.ft), floor elevations, and detailed technical specifications across Delhi-NCR (Noida Expressway, Golf Course Road), Mumbai, Bengaluru, and Goa.
- **Validated REST API**:
  - `GET /api/properties`: Full-text search (`q`), BHK (1–4), property type, price ranges (`minPrice`/`maxPrice`), furnishing status, sorting (`newest`, `price_asc`, `price_desc`), and pagination.
  - `GET /api/properties/[slug]`: Specific residence details or 404.
  - `GET /api/properties/[slug]/similar`: Up to 4 relevant residences scored by locality, city, BHK, and price proximity.
  - `POST /api/enquiries`: Lead capture with Zod validation, honeypot anti-spam, and rate-limiting.

### Phase 3: URL-Synced Listings Page (`/properties`)
- **URL as Single Source of Truth**: All search terms, BHK configurations, property types, price brackets, sorting, and page numbers sync directly with the browser URL. Refreshing or sharing the URL reproduces the exact filtered view.
- **Debounced Search & Stale Protection**: 350ms input debounce with `AbortController` cancellation to eliminate race conditions during rapid typing.
- **Luxury States**: 12 shimmer card skeletons during loading, empty state with "Reset All Filters" CTA, and error state with retry.
- **12 Items Per Page**: Pagination range indicator (`Showing 1–12 of 56 residences`) and accessible page buttons.

### Phase 4: Server-Rendered Property Detail (`/properties/[slug]`)
- **SSR & Static Generation**: All 56 residences pre-rendered via `generateStaticParams()` with per-property dynamic SEO OpenGraph metadata.
- **Accessible Photo Gallery**: Full-bleed viewport with thumbnail strip and **keyboard arrow navigation** (`ArrowLeft` / `ArrowRight`).
- **Private Viewing Enquiry Form**: 10-digit Indian mobile validation (`^[6-9]\d{9}$`), preferred date picker (next 90 days), duplicate submit protection, and **input retention on validation error**.
- **Real 404**: Invalid slugs invoke `notFound()` and render a custom luxury 404 page.

### Phase 5: Scroll-Driven 3D Story (Three.js + GSAP)
- **Scenes** (scroll position drives the camera and the model; nothing runs on a timer):
  1. *Arrival*: the tower at blue hour in a lit city, camera orbiting with scroll; the manifesto lights up word by word.
  2. *The making*: the floors pull apart, then drop back into place one by one; scrolling up reverses it. Floor and residence counters follow the same progress.
  3. *Inside a home*: the floors above level 18 lift away like a dollhouse, the facade slides out and the 3 BHK plan appears with Living / Bedroom / Kitchen / Balcony labels pinned to 3D points.
  4. *Amenities*: three camera stops: podium infinity pool (L04), open-air gym terrace (L24), roof garden; each stop has a story panel plus a card pinned to the 3D model.
  5. *Call to action*: wide night shot of the whole tower and an "Explore homes" button to `/properties`.
- **Look**: blue-hour to night lighting blended by scroll, RoomEnvironment reflections, soft shadows and bloom on the high tier, procedural city with lit windows, warm gold facade and a lit crown.
- **Interaction**: damped pointer parallax and floor hover highlight with a "Floor 18 · 4 BHK" tooltip (desktop).
- **DOM motion (GSAP + ScrollTrigger, lazy)**: word reveals, manifesto scrub, parallax, magnetic buttons, counters.
- **Fallbacks**: reduced motion, Save-Data, no WebGL2 or a lost WebGL context → static story with renders of the same scene (`public/posters/*.webp`). The canvas stops rendering when the story is off-screen or the tab is hidden.

---

## 3. Tech Stack

- **Framework**: Next.js 16.4.3 (App Router with Turbopack)
- **Runtime & UI**: React 19.3.0, TypeScript 5
- **Styling**: Tailwind CSS v4, Vanilla CSS Custom Properties
- **3D Engine**: Three.js (`three` v0.186.1), vanilla, procedural geometry, postprocessing bloom (high tier)
- **DOM animation**: GSAP 3.13 + ScrollTrigger, loaded lazily on the landing only
- **Validation**: Zod v4 (`zod` v4.6.7)
- **Testing**: Vitest v5 (`vitest` v5.0.5)
- **Icons**: Lucide React (`lucide-react` v1.64.0)

---

## 4. 3D Loading & Performance Strategy

1. **Poster first**: the hero paints a real `<h1>` and a `next/image` poster (`priority`) before any WebGL code downloads. The poster is a still of our own 3D scene, captured by `scripts/capture-posters.mjs` and converted to WebP by `scripts/make-posters.ts`, so the live canvas fading in on top does not change the picture.
2. **Lazy 3D chunk**: `components/landing/SceneLoader.tsx` imports `@/three/boot` only after first paint, on `requestIdleCallback` (1.2 s timeout fallback). Measured: three + scene code is one lazy chunk of ~146 KB gzipped (budget 200 KB). GSAP is a separate lazy chunk (~44 KB gzipped). Neither is in any route's initial bundle.
3. **No downloaded 3D assets**: the tower, city, interior and amenities are procedural; every texture is drawn on a canvas at runtime and reflections come from `RoomEnvironment`. Nothing to compress with Draco/Meshopt or KTX2, and 0 bytes of models/textures over the wire. The only landing images are the WebP posters (~1 MB for all eight, served as AVIF/WebP at the right width by `next/image`).
4. **Quality tiers**: high (desktop): DPR ≤ 2, soft shadows, bloom, 220 city blocks. Low (touch device or ≤ 4 cores): DPR ≤ 1.5, no shadows, no bloom, 110 blocks.
5. **One smooth progress value**: scroll is damped (`MathUtils.damp`) into a single 0..1 progress; every visual and every text panel (`--scene-p` CSS variable) is a pure function of it, so fast scrolling and reversing never jump and overlays stay in sync.
6. **Known gap**: first-load JS is about 192 KB gzipped on `/` and 195 KB on `/properties`, above the 130/120 KB budgets. The shared React + Next.js runtime chunks are ~158 KB of that on their own; see `notes/AI_LOG.md`.

---

## 5. API Endpoints Reference

| Method | Endpoint | Query / Body Parameters | Response |
|---|---|---|---|
| `GET` | `/api/properties` | `q`, `minPrice`, `maxPrice`, `bhk`, `type`, `furnished`, `sort`, `page`, `limit` | `{ items: Property[], total: number, page: number, hasMore: boolean }` |
| `GET` | `/api/properties/:slug` | — | `Property` object or `404` |
| `GET` | `/api/properties/:slug/similar` | — | `Property[]` (up to 4 matching residences) |
| `POST` | `/api/enquiries` | `{ name, phone, email?, visitDate, message, propertySlug, company? }` | `201 Created` with confirmation ID |

---

## 6. Verification & Quality Assurance

- **Unit Tests**: `npm test` — **16 passing tests** across format utilities, query schemas, and enquiry validation.
- **Type Safety**: `npm run typecheck` — **0 TypeScript errors** with `strict: true` and `noUncheckedIndexedAccess: true`.
- **Production Build**: `NEXT_DIST_DIR=.next-prod npm run build` compiles with 0 errors.
- **Lint**: `npm run lint` still reports 3 known errors in the listings/enquiry components; tracked in `TASKS.md`.
- **Project status and pending work**: see `TASKS.md`.

---

## 7. Asset Credits & Attribution

- **Architectural Photography**: Unsplash License (high-resolution modern luxury residential architecture, interior living spaces, cantilevered infinity pools, and rooftop lounges).
- **Typography**: Google Fonts — Fraunces (Display Serif) & Manrope (Body Sans).
- **Icons**: Lucide React (ISC License).
- **3D renders**: `public/posters/*.webp` are renders of this project's own procedural three.js scene (no third-party models).
- **Animation**: GSAP (free standard licence).
- **Concept & Branding**: Designed specifically for the **Reeltor** Frontend Developer Evaluation.
