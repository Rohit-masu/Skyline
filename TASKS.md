# TASKS.md — status and pending work

Read this first, then `AGENTS.md` (rules, requirements, architecture). Work happens on `main`;
`feat/skyline-v2-3d-story` is kept as a backup of the V2 handover.

Commands: `npm run dev` · `npm run typecheck` · `npm run lint` · `npm test` · `npm run build` ·
`npm run analyze` · `npm run seed` · `npm run db:setup` (creates the enquiries table in Neon) ·
`npm run posters:capture` + `npm run posters` (re-render hero poster and fallback stills).

---

## Done

### Landing `/` (V2, scroll-driven 3D) — unchanged
- [x] three.js story engine (lazy ~150 KB gz), hero poster before WebGL, static fallbacks, GSAP DOM motion. See WALKTHROUGH.

### Listings, detail, form, API, backend (main)
- [x] One data module (`lib/properties.ts`) for API, pages and FeaturedHomes (featured homes come from the same function as the API).
- [x] API: strict query validation → 400 per field; 404s; Cache-Control as spec.
- [x] `/properties`: first page server-rendered (no fetch on first load), URL = state via History API, debounced search that never overwrites newer filters, AbortController + request id, results cached per query (instant Back), real pagination links, mobile `<dialog>` filters, Back from detail restores position.
- [x] `/properties/[slug]`: canonical + OG, crossfade gallery with scoped arrow keys, location block with Open in Maps and click-to-load map, real 404 status for unknown slugs (proxy.ts), `cacheLife("hours")`.
- [x] Form: shared Zod rules on blur and submit, aria-invalid/describedby, focus first error, no double submit, 429 with minutes, input kept.
- [x] Enquiries + rate limit in Neon Postgres (memory fallback without DATABASE_URL); no default salt.
- [x] Lint clean; 34 Vitest tests; scripted browser checks (listings 16, detail 15) pass on a local production build.
- [x] Bonus: favourites (localStorage), `/admin` enquiry list.

---

## Pending

1. ~~Deploy~~ Done: https://skyline-rho-seven.vercel.app (auto-deploys from main). Verified on production: all routes, 404 status, API 400s, CDN cache HIT, enquiry saved to Neon (201).
2. **First-load JS over budget** (~190 KB gz vs 130/120); React DOM + Next runtime are most of it. Measure with `npm run analyze`.
3. **Reports in `/reports`**: Lighthouse mobile on the deployed site + bundle analyzer.
4. **UI polish (Rohit review)**: 1 navbar ✅ · 2 footer ✅ · 3 story→06 transition (ambient glow, no hard cut) · 4 hero minimal + loading state.
5. **3D on real hardware** (mid-range laptop / Android).
6. **AI_USAGE.md** (Rohit, from `notes/AI_LOG.md`) and the **screen recording**.

---

## Things to know before changing code

- `docs/BRIEF.md` is gitignored and exists only locally; requirements are restated in AGENTS.md.
- After any change to the 3D look, re-render the posters (`npm run posters:capture -- http://localhost:3000`, then `npm run posters`).
- Story section heights: `SCENE_HEIGHTS` in `components/landing/ScrollStory.tsx`.
- `.env.local` holds DATABASE_URL / IP_HASH_SALT / ADMIN_PASSWORD locally; never commit it.
- Notes: `notes/DECISIONS.md` (why), `notes/AI_LOG.md` (mistakes caught), `notes/WALKTHROUGH.md` (how each file works).
