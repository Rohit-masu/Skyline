# Walkthrough

Per file: what it does and why, in 2–4 lines. Used to prepare for the follow-up call.

## Landing — 3D story + GSAP

Listings, detail, form and API files are not written up here yet; AGENTS.md §7–§8.5 point to them ("As built").

**three/config.ts** — Every tunable of the 3D scene: scene ids (must match the data-scene attributes), scroll damping, frame-delta clamp, quality tiers, tower dimensions, showcase/gym floors, parallax strength. `pickTier()` returns `low` for touch devices or <= 4 CPU cores.

**three/keyframes.ts** — Camera keyframes as plain data, each tied to a scene and a local 0..1 position. `sampleCamera()` finds the two keyframes around the current progress and blends position and look-at target with smoothstep easing. `cameraPathPoints()` samples the path so the city can keep buildings out of the way.

**three/scroll.ts** — Measures each story section once (and on resize), never per frame. Per frame: raw progress from `scrollY`, damped with `MathUtils.damp`, then writes each scene's local progress to its section as `--scene-p`. Also converts keyframes from scene-local to global progress.

**three/engine.ts** — Renderer (DPR capped per tier, sRGB, ACES), camera, render loop via `setAnimationLoop`. Pauses when the story is off-screen (IntersectionObserver on the story root, because the canvas itself is fixed) or the tab is hidden; frame delta clamped to 1/30 s. Portrait screens get a wider lens. `dispose()` also forces context loss.

**three/boot.ts** — The only module the page imports (dynamically). Builds everything, then each frame turns progress into: night amount (dusk to night), floor spread/build-up, floor-18 lift/open, camera pose, labels, counters. Renders one frame before calling `onFirstFrame`, so the page fades the canvas in with real content. Returns one `dispose()`.

**three/tower.ts** — Podium, lobby glow, 28 floor groups (slab, glass with lit-window texture, instanced brass mullions, alternating balcony), roof and crown fins on the top floor. `setState(spread, build, lift, open, glow)`: floor i lands when build passes i/28; floors above 18 lift to reveal the plan; floor 18's four facade panels slide out and fade.

**three/interior.ts** — The 3 BHK plan on floor 18 as plain box data: zone floors, low walls (architectural-model style), furniture, plants, and four anchor points for the DOM labels.

**three/amenities.ts** — Pool with drifting caustics on the podium, gym terrace on floor 24, roof garden with fire glow and a blinking aviation beacon, instanced low-poly trees.

**three/city.ts** — Instanced city blocks with lit windows in a ring around the site (clear of the camera path), road-grid ground, contact shadow.

**three/sky.ts, lighting.ts, textures.ts** — Gradient sky shader + stars; RoomEnvironment reflections, hemisphere + sun (+ shadows on the high tier), dusk/night presets blended by one number; canvas-drawn textures (0 KB downloads).

**three/labels.ts, interaction.ts** — Projects 3D anchors to screen and moves DOM labels with `translate3d`. Pointer parallax (damped) and floor hover tooltip, raycasting only after the pointer moved; both off on touch devices.

**components/landing/SceneLoader.tsx** — Decides static vs 3D (reduced motion, Save-Data, no WebGL2 -> static), waits for idle, imports `@/three/boot`, fades the fixed canvas in after the first frame, falls back to static on context loss. Sets `html[data-scene-mode]`, which the CSS reads. Strict-Mode-safe via a `cancelled` flag.

**components/landing/StoryScene.tsx, ScrollStory.tsx** — Each chapter is a tall section with a sticky full-screen stage. The z-10 sits on the sticky stage (sticky creates a stacking context). Panel fades come from `--scene-p` in globals.css; in static mode a still render (`/posters/<scene>.webp`) shows instead of the canvas. Section heights live in `SCENE_HEIGHTS`.

**components/motion/MotionLayer.tsx, animations.ts, SplitWords.tsx** — GSAP loaded lazily after hydration (skipped for reduced motion). Elements opt in with data attributes: `data-reveal`, `data-split`, `data-scrub-words`, `data-parallax`, `data-magnetic`, `data-count`. SplitWords splits text into masked words on the server.

**components/hero/Hero.tsx** — 3D-first hero. The poster `/posters/hero.webp` (a render of our own scene) at z-0 is the LCP image; SceneLoader's canvas (z-[1]) fades in above it after its first frame, showing the same view. Shade z-[2], text z-10. Headline letters rise via `RisingLine` (CSS); "above" rises as one word so its `.text-shimmer` works. Ticker: two identical lists moved by -50%. The IST clock renders only after mount.

**components/landing/FeaturedHomes.tsx, VisitInvitation.tsx** — Opaque z-10 sections that slide over the canvas after the story; reveals, parallax photo and magnetic CTA via GSAP data attributes.

### How to verify
- Desktop: scroll the whole story down and back up. Floors spread and drop back one by one, floor 18 opens with Living/Bedroom/Kitchen/Balcony labels, the camera stops at pool -> gym -> roof, the sky goes from dusk to night. Hover the tower in the hero: floor highlight + "Floor 18 · 4 BHK" tooltip.
- DevTools -> Rendering -> prefers-reduced-motion: reduce -> reload: no canvas, a still photo per chapter, no GSAP.
- Navigate to /properties and press Back: exactly one `<canvas>` in the DOM.

**components/hero/HeroSpotlight.tsx** — Brass radial light that follows the pointer over the hero. Writes `--spot-x/--spot-y` once per frame (no React re-render); off on touch and reduced motion.

**scripts/capture-posters.mjs / make-posters.ts** — Capture drives Chrome over the DevTools protocol: waits for the 3D, hides all HTML except the canvas, scrolls to each scene (waits for `--scene-p`), saves PNGs to `.posters-raw/`. `npm run posters` converts them to 1920 px WebP in `public/posters/`. Re-run both after changing the 3D look.

**components/landing/SceneLabels.tsx + three/labels.ts** — One label layer for room labels and amenity cards. `labels.update(camera, { living: x, pool: y, ... })` sets each label's opacity and projects its 3D anchor to screen. Amenity anchors live in `three/amenities.ts` (children of the gym floor / roof so they move with them).

**three/engine.ts bloom** — High tier renders through EffectComposer: RenderPass → UnrealBloomPass (`BLOOM` in config.ts) → OutputPass (tone mapping + sRGB). Low tier renders directly.

## Data and API
- `lib/properties.ts` — the only code that reads `data/properties.ts`. `searchProperties(query, limit)` filters, sorts (ties broken by id so pages never overlap) and paginates; `getSimilarProperties` scores same locality (2) + same BHK (1), then closest price. Used by every API route, both pages and FeaturedHomes.
- `lib/schema/query.ts` — `fieldSchemas` validates each URL param alone. `propertyQuerySchema` (API, strict → 400), `parseQueryLenient` (pages/client, drops bad values), `serializeQuery` (canonical URL), `toPropertyQuery` (fills defaults). Tunables: `PAGE_SIZE`, `MAX_LIMIT`, `MAX_SEARCH_LENGTH`.
- `app/api/*` — thin: parse, call `lib/properties.ts`, set Cache-Control.

## Listings `/properties`
- `app/properties/page.tsx` — server. Static shell (breadcrumb, title); `Listings` awaits searchParams inside Suspense, parses leniently, renders the first page on the server and passes it as `initialData`. `generateMetadata` builds titles like "3 BHK homes".
- `PropertyListingsClient.tsx` — reads the URL (`useSearchParams` → `parseQueryLenient`) and writes it with `history.pushState` (filters, page) or `replaceState` (search). `currentQuery()` reads `window.location` at click time so a late debounced search keeps newer filters.
- `useListingResults.ts` — results cached per canonical query key. Fetch only when the key has no result; AbortController + request id; loading/error derived, no setState in the effect body.
- `useListingScrollRestore.ts` — saves scrollY per listing URL on card click, restores it once results are visible.
- `FilterBar.tsx` (layout, sort, mobile `<dialog>`), `FilterControls.tsx` (BHK/type toggles with aria-pressed, price min/max, furnished radios; rendered twice with different `idPrefix`), `SearchBox.tsx` (300 ms debounce, syncs from URL only on outside changes), `ActiveFilterChips.tsx`, `Pagination.tsx` (real links, click intercepted).
- Try: type "gurg" and immediately click "Apartment" → both stay in the URL. Open a card from row 3, press Back → same position.

## Detail `/properties/[slug]`
- `page.tsx` — `"use cache"` + `cacheLife("hours")`; all slugs prerendered. `PropertyFacts`, `LocationBlock` (+ `MapEmbed`, iframe only after "Show map"), `PropertyGallery` (stacked images, opacity crossfade, arrow keys inside the gallery).
- `proxy.ts` — unknown slug → rewrite to an unmatched path → `not-found.tsx` with status 404.

## Enquiry form + backend
- `EnquiryForm.tsx` — `validateField` runs the field's schema from `enquirySchema.shape` (same as the server) on blur and on submit; first invalid field gets focus; `inFlight` ref blocks double submit; 400 issues mapped onto fields; 429 → minutes from Retry-After; input kept on every failure. `FormField.tsx` wires label, aria-invalid and aria-describedby.
- `lib/storage/enquiries.ts` — Neon when DATABASE_URL is set, memory otherwise. `checkRateLimit` counts rows per ip_hash in the last 10 min (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MINUTES`). `scripts/db-setup.sql` + `npm run db:setup` create the table.
- `app/api/enquiries/route.ts` — JSON → honeypot → validate → property exists → rate limit → insert → 201 `{ id }`.

## Bonus
- `lib/favourites.ts` + `components/properties/FavouriteButton.tsx` — saved homes in localStorage via useSyncExternalStore.
- `app/admin` + `lib/admin-auth.ts` — password login (server action), HMAC cookie, table of enquiries.

## Sections after the story + footer
- `components/landing/SectionHeading.tsx` — numbered eyebrow, `SplitWords` heading (`data-split`), intro (`data-reveal`); the lazy GSAP layer animates those attributes.
- `FeaturedHomes.tsx` (06) and `VisitInvitation.tsx` (07) — both use `.section-shell` + `.section-inner` from globals.css. Visit has a parallax photo and the pavilion card (`lib/site.ts`).
- `components/layout/Footer.tsx` — real links only, contact from `lib/site.ts`; columns rise with `.footer-reveal` (CSS `animation-timeline: view()`, stagger via `--i`), watermark opens with `.footer-watermark`, links use `.link-underline`.
- `components/ui/AltitudeRail.tsx` — second IntersectionObserver on `[data-story-root]` hides the rail after the story.
- `FeaturedCard.tsx` — full-bleed card: `data-clip-reveal` (GSAP wipe), `data-spotlight` (pointer → `--spot-x/--spot-y`, glow drawn by `.spotlight` in CSS), outlined number (`.text-outline`), specs slide up on hover (`.featured-specs`, always visible on touch).
- `FeaturedHomes.tsx` — stats band (`data-count`, numbers from `getPortfolioStats()`), bento grid via `TILE_CLASSES` (first tile 2×2).
- `VisitBadge.tsx` (SVG textPath ring, `.spin-slow`), `VisitSteps.tsx` (`data-draw-line` scrubbed line), `OpenStatus.tsx` (IST hours from `lib/site.ts`, checked every minute).
- Footer marquee: two copies of the city list (`getCities()`), `.marquee` moves by one list width; pauses on hover.
- `components/properties/PriceRange.tsx` — min/max price selects and the rule that clears the other side when a range becomes impossible. `compact` = desktop search row (screen-reader labels), otherwise the drawer.
- `components/landing/SiteIntro.tsx` — intro veil; `.site-intro` rules in globals.css do the hiding (data-scene-mode or 2.4 s cap). sessionStorage key `skyline:intro-seen`.
