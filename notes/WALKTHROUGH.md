# Walkthrough

Per file: what it does and why, in 2–4 lines. Used to prepare for the follow-up call.

## Landing V2 — 3D story + GSAP

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

**components/landing/StoryScene.tsx, ScrollStory.tsx** — Each chapter is a tall section with a sticky full-screen stage. The z-10 sits on the sticky stage (sticky creates a stacking context). Panel fades come from `--scene-p` in globals.css; in static mode a still photo shows instead of the canvas. Section heights live in `SCENE_HEIGHTS`.

**components/motion/MotionLayer.tsx, animations.ts, SplitWords.tsx** — GSAP loaded lazily after hydration (skipped for reduced motion). Elements opt in with data attributes: `data-reveal`, `data-split`, `data-scrub-words`, `data-parallax`, `data-magnetic`, `data-count`. SplitWords splits text into masked words on the server.

**components/hero/Hero.tsx** — Poster image (LCP) at z-0, fixed canvas at z-[1] fades in above it, shade at z-[2], text at z-10. Wordmark letters and fades are CSS animations; the IST clock renders only after mount.

**components/landing/FeaturedHomes.tsx, VisitInvitation.tsx** — Opaque z-10 sections that slide over the canvas after the story; reveals, parallax photo and magnetic CTA via GSAP data attributes.

### How to verify
- Desktop: scroll the whole story down and back up. Floors spread and drop back one by one, floor 18 opens with Living/Bedroom/Kitchen/Balcony labels, the camera stops at pool -> gym -> roof, the sky goes from dusk to night. Hover the tower in the hero: floor highlight + "Floor 18 · 4 BHK" tooltip.
- DevTools -> Rendering -> prefers-reduced-motion: reduce -> reload: no canvas, a still photo per chapter, no GSAP.
- Navigate to /properties and press Back: exactly one `<canvas>` in the DOM.

**components/hero/HeroSpotlight.tsx** — Brass radial light that follows the pointer over the hero. Writes `--spot-x/--spot-y` once per frame (no React re-render); off on touch and reduced motion.

**components/hero/HeroResidenceCard.tsx** — Glass "Now showing" card with one real featured home. `app/page.tsx` picks it on the server (`pickHeroResidence`) and passes only the fields the card needs, so the client hero never ships the full data set. Floats via CSS; hidden below xl.

**Hero exit (animations.ts, `data-hero-exit`)** — On scroll the wordmark, text, card and stats drift up and fade at different speeds (GSAP scrub), so the hero hands over to the 3D story like a film cut. The "above" shimmer is the CSS class `.text-shimmer`.

**Hero v3 (Hero.tsx, HeroHotspots.tsx)** — Photo-first. `.hero-stage` (globals.css) keeps the photo at its own aspect ratio while covering the screen, and centres the tower on narrow screens; the hotspots use the same box, so `left: 64%; top: 10%` is always the crown. Headline letters rise via `RisingLine` (CSS); "above" rises as one word so its shimmer works. Ticker: two identical lists moved by -50%. `three/scroll.ts` writes `--hero-exit` and `.scene-layer` turns it into the canvas opacity, so the 3D crossfades in only as the hero leaves. Floor hover is disabled until then. HeroResidenceCard was removed.

**Hero v4 — pinned shutter (Hero.tsx, HeroShutter.tsx, useHeroProgress.ts)** — The section is `HERO_PIN_VH` (320vh) tall with a sticky full-screen frame. `useHeroProgress` turns scroll into a damped 0..1 `--hero-p` on the section (rAF only while catching up). globals.css reads it: `.shutter-slat` tilt (0-0.08), `.hero-shutter` lift (0.06-0.36), `.hero-photo` zoom 1.25->1 and `.hero-dim` (0-0.45), and every `.p-reveal` / `.p-rise` element fades or slides between its own `--from`/`--to` (set with `revealBetween(from, to)`). Timings are in Hero.tsx next to each element. The frame is z-[2], above the fixed 3D canvas, so when the pin ends the hero scrolls up and reveals the 3D. Reduced motion / no JS: fully open, not pinned.

**Hero v5 — 3D-first (Hero.tsx)** — Poster (`/posters/hero.webp`, a render of our own scene) at z-0 is the LCP image; SceneLoader's canvas (z-[1]) fades in above it after its first frame, showing the same view. Shutter/photo/hotspot files were removed.

**scripts/capture-posters.mjs / make-posters.ts** — Capture drives Chrome over the DevTools protocol: waits for the 3D, hides all HTML except the canvas, scrolls to each scene (waits for `--scene-p`), saves PNGs to `.posters-raw/`. `npm run posters` converts them to 1920 px WebP in `public/posters/`. Re-run both after changing the 3D look.

**components/landing/SceneLabels.tsx + three/labels.ts** — One label layer for room labels and amenity cards. `labels.update(camera, { living: x, pool: y, ... })` sets each label's opacity and projects its 3D anchor to screen. Amenity anchors live in `three/amenities.ts` (children of the gym floor / roof so they move with them).

**three/engine.ts bloom** — High tier renders through EffectComposer: RenderPass → UnrealBloomPass (`BLOOM` in config.ts) → OutputPass (tone mapping + sRGB). Low tier renders directly.
