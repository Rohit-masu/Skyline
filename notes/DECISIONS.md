# Decisions

One line each: what — why — rejected alternative.

- Static storytelling V1 first, 3D in V2 — lock look and story before spending time on WebGL — building 3D first (art direction drifted).
- All pages dark — matches the approved mockup (docs/mockup-v1.png) — light listing pages.
- URL query string as single source of truth for /properties — guarantees bookmarking, page refresh and browser Back/Forward reproduction without stale state — storing filter state exclusively in local component React state.
- AbortController cancellation on search/filter change — cancels previous in-flight HTTP requests during fast typing/toggling — un-aborted concurrent requests causing race conditions.
- V2 started: three.js landing story replaces the single 400-line TowerCanvas — Rohit asked for a fully animated 3D + GSAP landing — keeping the V1 monolith (setState on every scroll event, getBoundingClientRect per scroll, no damping, incomplete dispose).
- 3D engine split into three/ (config, keyframes, scroll, engine, boot, tower, interior, amenities, city, sky, lighting, labels, interaction, textures) — one job per file, each under 200 lines, all tunables in three/config.ts and three/keyframes.ts — one big component.
- Every 3D visual is a pure function of one damped progress value (MathUtils.damp, SCROLL_DAMPING = 6); only water shimmer, fire flicker, the aviation beacon and a tiny camera drift use time — fast scrolling and reversing are smooth by construction — GSAP timelines for the 3D.
- Camera keyframes are tied to scenes (scene id + local 0..1) and converted to global progress after measuring section offsets — changing a section height in ScrollStory.tsx never breaks the camera — hard-coded global ranges that drift whenever copy or heights change.
- Story text fades with CSS from the --scene-p variable that scroll.ts writes on each section — text and 3D cannot drift apart, zero React re-renders per frame — React state per frame.
- GSAP (core + ScrollTrigger, 44 KB gz) only for DOM motion (word reveals, manifesto word scrub, parallax, magnetic buttons, counters), in its own lazy chunk loaded by MotionLayer after hydration and skipped for reduced motion — AGENTS.md said GSAP may only live in the 3D chunk, but there it would depend on WebGL support and push that chunk towards 190 KB; neither chunk is in any initial bundle.
- Hero intro (wordmark letters, fades) is pure CSS — it must never wait for JavaScript, and the h1 is never hidden (LCP).
- Text split into words on the server (SplitWords) instead of GSAP SplitText — no DOM rewriting in the browser, text is complete without JS.
- Both quality tiers keep 28 floors (AGENTS.md suggested ~20 on low) — the camera keyframes and the floor-24 gym depend on the floor count; the low tier saves on shadows, pixel ratio (1.5), city blocks (110) and trees instead.
- All textures (lit windows, road-grid ground, contact shadow, glow sprites) drawn on canvas at runtime, environment from RoomEnvironment — 0 bytes of 3D assets downloaded — GLB models / HDR files.
- One brass highlight shell is moved to the hovered floor — per-floor materials just for hover.
- City blocks are kept out of a 24-unit bubble around the sampled camera path — the CTA camera was sitting inside a building.
- Old landing sections (blueprint, amenity cards, manifesto) folded into the story chapters — they repeated what the 3D had just shown.
- renderer.forceContextLoss() on dispose — browsers cap live WebGL contexts; repeated navigation away and back would eventually fail.

## Assumptions
- S1 Arrival hero uses fixed-ratio high-res architectural render with dark editorial gradient vignettes — guarantees immediate LCP and AA contrast — pure WebGL hero was rejected because of initial blank canvas.
- Phase 2 API uses shared Zod schemas (query and enquiry) and in-memory persistent cache for rate limiting — guarantees sub-5ms response times and zero external dependency risk during local / offline evaluation.
- Phase 3 listings page uses Suspense boundary wrapping useSearchParams client component — guarantees no SSR de-optimization and smooth hydration across Next.js App Router.
- Server-rendered /properties/[slug] with generateStaticParams for all 56 residences — instant TTFB, full per-property OpenGraph SEO metadata, and real 404 for unknown slugs — purely client-side fetching.
- EnquiryForm client-side validation parity with Zod schema and input retention on error — ensures zero user data loss on failed validation or network drops — wiping form state on failed submits.
- Location customized to Sector 128, Noida Expressway & Reeltor Experience Pavilion — directly aligns the application with Reeltor brand and assignment context while preserving the luxury architectural identity.
- Procedural Three.js geometry for 28-storey tower with dynamic lazy loading — avoids heavy multi-megabyte GLTF model downloads, keeps initial route bundle minimal, and guarantees smooth 60fps scroll-driven floor assembly.
- Reduced motion, Save-Data, no WebGL2, or a failed/lost context all fall back to the static story (one still photo per chapter); fades there use CSS scroll-driven animations where supported, otherwise the text simply shows.
- Room labels and the floor-hover tooltip are aria-hidden: the story panel already describes the rooms in real text.
- Build-up camera pulled back and aimed higher, and the floor spread reduced (TOWER.spreadPerFloor = 0.2) — Rohit's screenshot showed the spread tower's top hidden behind the fixed header.
- Hero card data picked in the server page and passed as a minimal prop — Hero is a client component; importing PROPERTIES_DATA there would ship all 56 properties to the browser.
- Hero rebuilt photo-first: the real tower photo is the hero and the 3D canvas only crossfades in as the hero scrolls away (--hero-exit) — the low-poly 3D over the photo made the first impression look like a toy (Rohit: hero felt flat) — 3D in the hero.
- Hero photo sits in a .hero-stage box with the photo aspect ratio, so hotspot % positions stay pinned to the building at every screen size — object-cover, where pinned points drift with the aspect ratio.
- Hero is a pinned, scroll-played sequence (closed shutter -> slats tilt -> shutter lifts -> photo pulls back -> text, buttons, hotspots, ticker -> hero lifts off the 3D), idea from reeltor.com, built independently with one damped CSS variable (--hero-p) instead of GSAP pinning — same pure-function-of-progress model as the 3D, readable in CSS, works without GSAP — GSAP ScrollTrigger pin (extra layout work, harder to explain).
- Hero defaults: --hero-p is 0 (closed) when JS runs; a <noscript> style and the reduced-motion media query force 1 (open) and un-pin it — nobody can get stuck behind a closed shutter.
- renderer.debug.checkShaderErrors off in production — it costs time and logged a harmless D3D compiler note (X4122) about a three.js built-in shader on Windows.
- Hero back to 3D-first; photo hero and scroll shutter removed — Rohit: the photoreal poster followed by the procedural 3D looked like two different art styles (a 'game' break) — keeping the photo hero.
- Poster and static stills are renders of our own 3D scene (scripts/capture-posters.mjs + scripts/make-posters.ts, WebP, ~1 MB total) — the brief requires a poster before WebGL loads; rendering it from the scene means poster, fallback and live 3D are the same picture — photography posters (style mismatch).
- Art direction for the 3D matches the brand imagery: blue hour to night, warm gold facade, lit crown, finer dim city windows, darker trees, faint roads, soft bloom (high tier, threshold 0.9 so only light sources glow) — the first pass (orange sky, big bright window squares, bright green trees, orange road grid) read as a video game.
- Amenity cards pinned to the 3D pool / gym / garden (same labels.ts as the room labels, per-label opacity) — Rohit wanted each 3D model described on scroll; the story copy was also rewritten to say plainly what each stop is.

## Listings, detail, form, backend (main, 2026-10-30)
- One data module `lib/properties.ts` used by the API routes, the listings/detail pages and FeaturedHomes — "featured homes loaded from your API" is met by calling the same function the API calls, at build time, instead of an HTTP request to our own API (no network hop, no localhost URL during build) — fetch('/api/properties') from a server component.
- `lib/schema/query.ts` validates each URL param with its own small schema: the API combines them strictly (400 with a per-field message), the page and client parse leniently (a shared link with one bad value still shows results), and `serializeQuery` writes one canonical URL (fixed order, defaults left out) — two separate parsers that could drift apart.
- Listings: URL is the only state; filters `pushState`, search `replaceState` after 300 ms, Next syncs useSearchParams with the History API. The debounced commit reads the live URL, so a filter clicked while typing is never overwritten. Results are cached per canonical query, so Back/Forward is instant — router.push (server round trip per keystroke).
- Loading/error state is derived from "no result for this query key" rather than set at the start of the effect — fixes the `react-hooks/set-state-in-effect` lint errors without disabling the rule.
- Back from detail: scrollY saved in sessionStorage per listing URL on card click and restored after results render — the listing re-renders on Back, so the browser's own restoration can run before the cards exist.
- Pagination is real `<a href>` links (work without JS, crawlable); a plain left click is intercepted and turned into pushState.
- Unknown detail slugs: `proxy.ts` rewrites them to an unmatched path so `not-found.tsx` renders with a real 404 status — with cacheComponents the route streams a prerendered shell (status 200 already sent) before `notFound()` runs, and `dynamicParams = false` is rejected by cacheComponents.
- Detail page uses `"use cache"` + `cacheLife("hours")`, the cacheComponents equivalent of `revalidate = 3600` (`revalidate` is not allowed with cacheComponents).
- Enquiries in Neon Postgres (`@neondatabase/serverless`, HTTP driver, already a dependency, server-only so 0 KB client JS). Rate limit = count of rows per `ip_hash` in the last 10 minutes (index on `ip_hash, created_at`), so it works across serverless instances. Without DATABASE_URL the same functions use memory, so local dev and tests need no database — a separate rate-limit store (Redis).
- No default `IP_HASH_SALT` any more: a missing salt is a configuration error (500), not a silently weak hash.
- Order in POST /api/enquiries: JSON → honeypot (fake 201) → validation → property exists → rate limit → insert. Only stored enquiries count toward the limit.
- "Today" for the visit date is read on the client with useSyncExternalStore (server snapshot: no min/max). The page is prerendered at build time, so a server-side "today" would be stale and cause a hydration mismatch — setting it in useEffect (lint error, extra render).
- Gallery: all photos stacked, opacity crossfade; arrow keys only while focus is inside the gallery — the old window-level listener stole arrow-key scrolling from the whole page.
- Favourites (bonus) in localStorage through useSyncExternalStore: same list in every heart button, other tabs update via the storage event, empty list on the server (no hydration mismatch).
- /admin (bonus): password from ADMIN_PASSWORD checked with a timing-safe compare; the cookie holds an HMAC of the password (httpOnly, sameSite strict, path /admin, 8 h), never the password. Page is noindex.
- Shared-element view transition (bonus) skipped: it needs Next's experimental viewTransition flag; not worth the risk to stability.

### Assumptions (listings/detail)
- Nearby landmarks are a fixed list per city (the seed data has no per-home landmarks).
- Price filter steps 25 L … 10 Cr as AGENTS.md §8.3; "No max" covers 10 Cr+ (seeded prices are 1.8–13.3 Cr).
- Sections after the story (06 Featured, 07 Visit) share `SectionHeading` (numbered eyebrow + hairline, split heading, intro) and the `.section-shell` / `.section-inner` box, which is the same box as the header and listing pages, so every left edge lines up with the logo — per-section padding classes that had drifted apart (80 px vs 128 px).
- Footer motion is CSS scroll-driven (`.footer-reveal`, `--i` stagger, watermark) instead of GSAP: the footer is on every page and GSAP is only loaded on the landing; unsupported browsers and reduced motion simply show it.
- Visit section now has the pavilion address/hours card, so the header's "Location" link (was `/#location`, a dead anchor) points to `/#visit`. Contact details live once in `lib/site.ts`.
- Altitude rail fades out (and is `inert`) when the story root leaves the middle of the viewport — it overlapped the featured cards and the footer.
- Featured/Visit/footer "trendy" pass (bento grid, spotlight cards, clip-path image reveals, count-up stats, rotating text badge, scroll-drawn steps line, live open/closed chip, outlined city marquee) built with our own CSS and the existing lazy GSAP layer — patterns seen on Awwwards/Framer/React Bits, but no component library code copied (plagiarism rule, Rohit must explain every line) and 0 KB added to any initial bundle except OpenStatus (a few hundred bytes).
- Featured cards are one link each (title ::after covers the card) — the old card had two links to the same page, an extra tab stop per home.
- Bento rows have fixed heights (auto-rows) so the grid never shifts while images load (CLS).
- "Open now" uses the visitor's clock in IST, read with useSyncExternalStore on the client only (prerendered page → no hydration mismatch).
- Minimal pass after Rohit's review ("navbar, footer look crowded"; references: reeltor.com, vantooptics.vercel.app): header = wordmark + 4 links + one outline CTA, fixed 72 px height (no resize on scroll), no tagline; footer = one CTA line + 3 columns + legal line, marquee and the BHK link column removed (the listings filters already do that), watermark lighter.
- Section numbers ("01 —" … "07 —") removed from every eyebrow (landing story, 06/07, detail page): the minimal pass keeps only the words; numbers added noise without helping navigation. The 404 label keeps its status code.
- Story → Featured: no brass hairline at the seam (it read as a hard cut); a taller ink veil (24rem) fades the fixed 3D canvas out instead. Featured heading capped at text-5xl with the GSAP word reveal (data-split).
