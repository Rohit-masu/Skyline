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
