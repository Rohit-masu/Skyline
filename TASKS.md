# TASKS.md — status and pending work

Read this first, then `AGENTS.md` (rules, requirements, architecture). Last updated on branch
`feat/skyline-v2-3d-story` (based on `feat/skyline-v1`).

Commands: `npm run dev` · `npm run typecheck` · `npm run lint` · `npm test` · `npm run build` ·
`npm run analyze` (Turbopack bundle analyzer) · `npm run seed` (regenerates `data/properties.ts`) ·
`npm run posters:capture` + `npm run posters` (re-render hero poster and fallback stills, see below).

---

## Done

### Landing `/` (V2, scroll-driven 3D)
- [x] three.js engine in `three/` (lazy chunk ~150 KB gz, budget 200 KB). Every visual is a pure function of one damped scroll progress.
- [x] Scenes: hero → arrival (orbit, manifesto words light up) → build-up (floors spread and drop back, reversible, counters) → inside floor 18 (floors above lift, facade slides out, room labels pinned to 3D) → amenities pool L04 / gym L24 / roof garden (camera stops, story panel + card pinned to each 3D model) → CTA to `/properties`.
- [x] Look: blue hour → night, RoomEnvironment reflections, soft shadows + bloom on the high tier, procedural lit city. 0 bytes of downloaded models/textures.
- [x] Interaction: pointer parallax, floor hover highlight + tooltip (desktop).
- [x] Hero paints `<h1>` + poster before WebGL loads; the poster is a render of the 3D scene itself, so the live canvas fades in with no style change.
- [x] Fallbacks: reduced motion / Save-Data / no WebGL2 / context loss → static story with renders. Canvas pauses off-screen and on hidden tab; full dispose, one canvas after navigating away and back.
- [x] GSAP + ScrollTrigger (lazy chunk ~44 KB gz) for DOM motion only.
- [x] Verified in headless Chrome at 1440 px, 390 px and reduced motion: no console errors, no horizontal scroll. Not yet checked on real devices (see Pending).

### Listings, detail, form, API (from `feat/skyline-v1`)
- [x] `/properties`: URL query = state, debounced search with AbortController, filters, sort, 12 per page, skeleton / empty / error states.
- [x] `/properties/[slug]`: SSG for all 56 slugs, metadata + OG, keyboard gallery, similar homes, enquiry form, real 404.
- [x] API: `GET /api/properties` (Zod-validated, 400 on bad input), `/[slug]` (404), `/[slug]/similar`, `POST /api/enquiries` (shared Zod schema, honeypot, 5 per 10 min rate limit, 429 + Retry-After).
- [x] 16 Vitest tests (`tests/`), typecheck clean.

---

## Pending (highest grading impact first)

1. **Deploy to Vercel** and set `NEXT_PUBLIC_SITE_URL` and `IP_HASH_SALT`. Every budget is measured on the deployed site.
2. **First-load JS is over budget**: ~192 KB gz on `/`, ~195 KB on `/properties` (limits 130 / 120). React DOM + Next runtime alone are ~158 KB. Start with `npm run analyze`; check `cacheComponents` / `partialPrefetching` in `next.config.ts`, `lucide-react` imports, and client components that could be server components (e.g. `PropertyCard` is client only for an image `onError`).
3. **Reports in `/reports`** (brief deliverable): Lighthouse mobile for `/`, `/properties` and one detail page on the deployed site, plus a bundle analyzer screenshot/HTML. The old markdown reports were removed because their numbers were wrong.
4. **Lint fails** (`npm run lint`): 3 × `react-hooks/set-state-in-effect` in `components/properties/FilterBar.tsx:62`, `components/properties/PropertyListingsClient.tsx:171`, `components/property/EnquiryForm.tsx:56`, plus unused-import warnings. Typecheck, tests and build pass.
5. **Backend persistence**: enquiries and the rate limit live in memory (`lib/storage/enquiries.ts`). They reset on restart and are per serverless instance, so the rate limit is weak on Vercel. AGENTS.md §2/§7 plan Neon Postgres (`DATABASE_URL` is already in `.env.example`). Also remove the hard-coded `IP_HASH_SALT` fallback there.
6. **Featured homes "loaded from your API"** (brief): `components/landing/FeaturedHomes.tsx` imports `data/properties.ts` directly. Load them through the API or the same data function the API uses, and record the choice in `notes/DECISIONS.md`.
7. **Re-verify the stability checklist** (AGENTS.md §10) in a real browser for listings/detail/form: Back from detail restores the listing position, fast typing never shows stale results, 360 px layout, keyboard and focus, AA contrast. Not re-checked during the V2 landing work.
8. **3D on real hardware**: about 60 fps on a mid-range laptop and usable on a mid-range Android phone (low tier). Only tested with software rendering so far.
9. **`AI_USAGE.md`**: currently describes Gemini only; the V2 landing was built with Claude Code. Rohit writes the final text from `notes/AI_LOG.md`.
10. **2–3 minute screen recording**, including the reduced-motion fallback (Rohit).

### Bonus (only after 1–10)
Favourites in `localStorage` · day/night toggle (presets exist in `three/lighting.ts`) · Playwright e2e · `/admin` enquiries page (`ADMIN_PASSWORD`) · view transitions card → gallery.

---

## Things to know before changing code

- `docs/BRIEF.md` (the original assignment text) is gitignored on purpose and exists only locally. The requirements are restated in `AGENTS.md` §3, §7, §8, §10, §12.
- **After any change to the 3D look**, re-render the posters: run a production server, then `npm run posters:capture -- http://localhost:3000` and `npm run posters`. Otherwise the hero poster and fallback stills no longer match the live 3D.
- Section heights for the story are in `SCENE_HEIGHTS` (`components/landing/ScrollStory.tsx`). Camera keyframes are tied to scenes, so changing heights does not break the camera.
- `npm run seed` regenerates `data/properties.ts` deterministically (fixed base date).
- Notes: `notes/DECISIONS.md` (why), `notes/AI_LOG.md` (mistakes caught), `notes/WALKTHROUGH.md` (how each file works). Keep them updated with every change.
