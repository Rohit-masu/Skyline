# Skyline

A showcase site for a fictional luxury residential tower on Noida Expressway. It has a scroll-driven 3D landing page, property listings, a property detail page and an enquiry form with a small API.

**Live:** https://skyline-rho-seven.vercel.app

## Run locally

```bash
npm install
cp .env.example .env.local   # set IP_HASH_SALT; DATABASE_URL is optional
npm run db:setup             # only if DATABASE_URL is set: creates the enquiries table
npm run dev                  # http://localhost:3000
```

Checks: `npm run typecheck` · `npm run lint` · `npm test` (34 tests) · `npm run build`.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 · three.js (vanilla) · GSAP + ScrollTrigger · Zod v4 · Neon Postgres · Vitest · Vercel.

## Architecture

```
app/                    routes: / , /properties , /properties/[slug] , /admin , /api/*
components/landing/     3D loader, story chapters, featured homes, visit section, intro
components/properties/  listings: filter bar, search, cards, pagination, URL/fetch hooks
components/property/    detail: gallery, facts, location, enquiry form
three/                  the 3D engine (only loaded with a dynamic import)
lib/properties.ts       the only code that reads the property data
lib/schema/             Zod schemas shared by client and server (query, enquiry)
lib/storage/            enquiries + rate limit (Postgres, memory fallback in dev)
proxy.ts                real 404 status for unknown property slugs
```

- **One data layer.** The API routes, the listings and detail pages, and the landing's featured homes all call `lib/properties.ts`. Featured homes therefore come from the same function as `GET /api/properties`, without an HTTP request to our own API at build time.
- **One property type.** `Property` is defined once in `types/property.ts`. One query schema and one enquiry schema are used on both client and server.
- **The URL is the state.** Search, filters, sort and page live in the query string. Filters use `pushState` and search uses `replaceState` after a 300 ms debounce. The first page is rendered on the server. Client fetches use AbortController plus a request id, so a late response never replaces a newer one. Results are cached per query, so Back is instant. Scroll position is restored when coming back from a detail page.

## 3D: how it loads and why

1. The hero paints a real `<h1>` and a WebP poster first. The poster is a render of our own 3D scene, so nothing jumps when the live scene appears.
2. three.js and the scene code (~146 KB gz, one chunk) are imported only after first paint, on `requestIdleCallback`. GSAP is a separate lazy chunk on the landing only.
3. No models or textures are downloaded. The tower, interior, amenities and city are procedural, textures are drawn on canvas, and reflections come from `RoomEnvironment`. So there is nothing to compress with Draco or Meshopt, and 0 bytes of 3D assets go over the wire.
4. Every visual is a pure function of one damped scroll progress. Scrolling fast or reversing never jumps, and text panels stay in sync through a CSS variable.
5. There are two quality tiers. Desktop: device pixel ratio up to 2, shadows and bloom. Touch or low-core devices: pixel ratio up to 1.5, no shadows, no bloom.
6. Rendering pauses when the story is off-screen or the tab is hidden.
7. Reduced motion, Save-Data, no WebGL2 or a lost WebGL context switch to a static story built from the same renders.
8. A short intro screen covers the load on the first visit. CSS removes it on the first 3D frame, or after 2.4 s at the latest. It does not show with reduced motion.

## Performance decisions

- Fonts: 2 families via `next/font`, `display: swap`.
- Images: `next/image` with `sizes` and fixed aspect ratios, WebP output. The source photos were recompressed (6.9 MB → 1.2 MB) because the first image encode was slow.
- Lucide icons are imported individually. The property card renders on the server. The map iframe on the detail page loads only after a click.

## Caching

- **`/properties/[slug]`:** every slug is prerendered at build time. The page uses `"use cache"` + `cacheLife("hours")`, which is the `cacheComponents` equivalent of `revalidate = 3600`.
- **`/properties`:** the static shell is prerendered and the results stream in, because they depend on `searchParams`. Client updates call `/api/properties`.
- **API caching:**
  - `GET /api/properties`: `s-maxage=60, stale-while-revalidate=300`.
  - `/api/properties/:slug` and `/similar`: `s-maxage=300, stale-while-revalidate=3600`.
  - On Vercel the CDN serves repeat requests (`X-Vercel-Cache: HIT`).
- **`/`:** static. Featured homes are read at build time.

## API

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/properties` | `q, minPrice, maxPrice, bhk, type, furnished, sort, page, limit (≤24)` → `{ items, total, page, hasMore }`; invalid values return 400 with a message per field |
| GET | `/api/properties/:slug` | 404 if unknown |
| GET | `/api/properties/:slug/similar` | up to 4: same locality first, then same BHK, then closest price |
| POST | `/api/enquiries` | Zod-validated body; honeypot gets a fake 201 and is not saved; 5 per IP per 10 min, then 429 with `Retry-After`; IPs stored only as a salted SHA-256 hash |

Seed data: `npm run seed` writes 56 properties with Indian localities, prices from ₹1.8 Cr to ₹13.3 Cr, BHK and area in sq ft.

## Assumptions

- The project, the developer and the contact details are fictional.
- Nearby landmarks are a fixed list per city, because the data has no per-home landmarks.
- Price filter steps run from ₹25 L to ₹10 Cr; "No max" covers ₹10 Cr+.

## Known issues

- **First-load JS is over budget.** It is roughly 150 KB gz on `/` and 180 KB on listings/detail (last measured locally), against budgets of 130 / 120 KB. The React and Next.js runtime alone is about 115 KB, and Zod adds ~29 KB on listings/detail.
- **Reports are missing.** The Lighthouse reports and the bundle analyzer screenshot are not yet in `/reports`.
- **3D not tested on real hardware.** It was tested only in desktop Chrome and with software rendering, not on a mid-range Android phone.

## With another day

- Switch the client-side schemas to `zod/mini` and trim the client components to meet the JS budget.
- Add the Lighthouse and bundle reports, and a Playwright end-to-end test (the browser checks exist as scripts).
- Add the day/night toggle for the 3D lighting (the lighting presets already exist).

## Credits

- **Fonts:** Fraunces and Manrope (Google Fonts, OFL).
- **Icons:** Lucide (ISC).
- **Animation:** GSAP (standard licence).
- **3D:** built procedurally in this project; the posters are renders of it.
- **Photos:** the property and landing photos in `public/images`.

AI tools were used; see [AI_USAGE.md](AI_USAGE.md).
