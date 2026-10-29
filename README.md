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
- **Cinematic Hero**: Immediate LCP paint with fixed-ratio high-res architectural render (`hero-tower.jpg`), live Asia/Kolkata (IST) clock, and real GPS coordinates.

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

### Phase 5: Scroll-Driven 3D Story (Three.js)
- **5 Distinct Scenes**:
  1. *The Arrival*: Tower silhouette + smooth camera orbit tied to scroll progress.
  2. *Vertical Assembly*: 28 post-tensioned floor slabs dynamically assemble with scroll and reverse smoothly on upward scroll.
  3. *Interior Reveal*: Camera zooms into Level 18 Sky Suite to reveal floor layout, 11-ft clear height, and marble specifications.
  4. *Vertical Club*: Level 04 cantilevered infinity pool, Level 24 sky gym, and Level 28 crown firepit.
  5. *The Invitation*: Wide twilight panorama settling on a clear CTA to `/properties`.
- **Interactive Parallax**: Mouse / touch tilt coordinates provide interactive depth beyond scrolling.
- **Fallbacks**: `prefers-reduced-motion` renders an accessible static editorial layout; `IntersectionObserver` halts Three.js rendering when off-screen.

---

## 3. Tech Stack

- **Framework**: Next.js 16.4.3 (App Router with Turbopack)
- **Runtime & UI**: React 19.3.0, TypeScript 5
- **Styling**: Tailwind CSS v4, Vanilla CSS Custom Properties
- **3D Engine**: Three.js (`three` v0.186.1) with procedural geometry
- **Validation**: Zod v4 (`zod` v4.6.7)
- **Testing**: Vitest v5 (`vitest` v5.0.5)
- **Icons**: Lucide React (`lucide-react` v1.64.0)

---

## 4. 3D Loading & Performance Strategy

1. **Zero LCP Impact**: The Hero section uses a native Next.js `<Image priority>` with high-contrast editorial gradients. Three.js is **NOT** loaded in the initial critical bundle.
2. **Dynamic Lazy-Loading**: `TowerCanvas.tsx` is loaded with `next/dynamic` (`ssr: false`), keeping the initial JS bundle under 85 KB gzipped.
3. **Procedural Geometry (< 2MB budget)**: Rather than requiring a heavy 15MB+ external GLTF download, the 28-storey tower is built procedurally using shared Three.js geometries and materials.
4. **Thermal Throttling Protection**: Pixel ratio is strictly capped at `Math.min(window.devicePixelRatio, 1.75)` to prevent smartphone overheating.

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

---

## 7. Asset Credits & Attribution

- **Architectural Photography**: Unsplash License (high-resolution modern luxury residential architecture, interior living spaces, cantilevered infinity pools, and rooftop lounges).
- **Typography**: Google Fonts — Fraunces (Display Serif) & Manrope (Body Sans).
- **Icons**: Lucide React (ISC License).
- **Concept & Branding**: Designed specifically for the **Reeltor** Frontend Developer Evaluation.
