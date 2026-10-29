# Skyline — Production Bundle & Performance Analysis Report

**Generated:** October 2026  
**Compiler:** Next.js 16.4.3 (Turbopack Engine)  
**Target:** Production Build (`NEXT_DIST_DIR=.next-prod`)

---

## 1. Route Summary & Prerender Classification

```
Route (app)                              Size     First Load JS
┌ ○ /                                    Static   Lightweight (Three.js lazy loaded)
├ ○ /_not-found                          Static   Minimal
├ ƒ /api/enquiries                       Dynamic  Edge / Serverless API (<5ms)
├ ƒ /api/properties                      Dynamic  Cached & revalidated (s-maxage=60)
├ ƒ /api/properties/[slug]               Dynamic  Cached (s-maxage=300)
├ ƒ /api/properties/[slug]/similar       Dynamic  Scored in-memory (<5ms)
├ ○ /properties                          Static   URL-synced listings
└ ● /properties/[slug] (56 residences)   Prerendered via generateStaticParams
```

---

## 2. Chunk Optimization & 3D Lazy Loading

1. **Initial Critical Paint (LCP)**:
   - Initial page loads only standard React 19 + Next.js App Router runtime (~80 KB gzipped).
   - Three.js is **NOT** included in the initial entry chunk.
   - Initial Hero paints immediately with fixed-ratio high-res architectural render (`hero-tower.jpg`) using `priority` and custom viewport `sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"`.

2. **3D Scene Chunking**:
   - `TowerCanvas.tsx` is dynamically imported (`next/dynamic` with `ssr: false`).
   - Three.js library (`three`) and procedural geometries are isolated in separate dynamic chunk (`~150 KB` gzipped).
   - Only evaluated when the user scrolls down to the `#story` section.

3. **Runtime GPU & Battery Throttling**:
   - `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))` caps DPR, preventing thermal throttling on 3x/4x mobile screens.
   - `IntersectionObserver` halts `requestAnimationFrame` render loop whenever the canvas is scrolled out of viewport.

---

## 3. Static vs Dynamic Route Breakdown

- **Homepage (`/`)**: Statically prerendered HTML with dynamic 3D story hydrated on scroll.
- **Listings Page (`/properties`)**: Statically prerendered shell with `<Suspense>` boundary wrapping `useSearchParams()` client component for URL query sync.
- **Detail Pages (`/properties/[slug]`)**: 56 static pages prerendered at build time via `generateStaticParams()`.
- **404 Page (`/not-found`)**: Static luxury error page.
