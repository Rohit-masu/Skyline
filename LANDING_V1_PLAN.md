# LANDING_V1_PLAN.md — Skyline landing, V1 (static storytelling)

**Status:** this file replaces §8.1, §8.2 and milestones M5–M6 of AGENTS.md for now. Everything else in AGENTS.md (stack, API, listings, detail, form, budgets, stability rules) still applies.

**Visual reference:** `docs/mockup-v1.png` (ChatGPT mockup). Take from it: the palette, photoreal dusk/night renders, serif + sans pairing, dark listing/detail/form pages. **Do not copy its layout literally** — it is a plain grid. This plan adds the storytelling and the signature moments that make the site memorable.

**Goal of V1:** a finished, consistent, luxury landing built from images + CSS/light JS animation, in one day. V2 swaps the sticky images of S1, S3, S4, S5 for one three.js canvas. **So every story scene is a sticky "stage" with a progress value**, the same shape the 3D will need. No rework later.

---

## 1. The story: "The Ascent"

The page is a journey **from street level to the rooftop**. Every scroll takes you higher up the tower, and the time of day moves from golden hour to night.

A thin **altitude rail** is fixed on the right edge (desktop) / thin top progress bar (mobile): `G · L04 · L18 · L24 · L28 · ROOF`. The current level highlights in brass. It is the narrative device and survives into V2.

| # | Section | Level | Time of day | Priority |
|---|---|---|---|---|
| S1 | Arrival (hero) | G | golden hour | must |
| S2 | Manifesto | G | golden hour | must |
| S3 | The Making (build-up) | G → L28 | sunset | must |
| S4 | Inside a home | L18 | dusk | must |
| S5 | Amenities | L04 / L24 / ROOF | dusk → blue hour | must |
| S6 | **The View** (floor slider) ★ | L04 → L28 | blue hour | must (signature) |
| S7 | **Minutes away** (neighbourhood) ★ | — | night | if time |
| S8 | Featured homes | — | night | must |
| S9 | Call to action | ROOF | night | must |
| S10 | Footer | — | night | must |

The page background shifts slightly across the story (warm ink → deep ink) through a CSS variable set per section, so transitions feel continuous, never a hard cut.

---

## 2. Art direction

- **Palette:** AGENTS.md §9 tokens (ink, slate, brass, ivory, mist). The landing, listings and detail pages are **all dark** (as in the mockup) — this overrides the "light listing pages" line in AGENTS.md §9. Keep AA contrast on mist text.
- **Type:** Fraunces for display (large, light weight, tight leading, one italic or brass word per headline), Manrope for body and UI. Eyebrows: small caps, wide letter-spacing, numbered: `01 —— ARRIVAL`.
- **Imagery:** photoreal renders of the **same tower** (§6). Never mix illustration and photo styles.
- **Editorial details (cheap, high-impact):**
  - subtle film-grain overlay over the whole page (inline SVG noise, `pointer-events: none`, opacity ~0.05)
  - hairline 1 px dividers in brass at 20% opacity
  - small coordinate and time captions, e.g. `28.4595° N, 77.0266° E · 18:42 IST` (live IST clock, rendered client-side only to avoid hydration mismatch)
  - numbers in Fraunces with tabular figures
- **Grid:** 12 columns, max 1280 px. Mobile: text over image with a bottom gradient for contrast.
- **Rhythm:** at least 100 vh per section, one idea per screen.

---

## 3. Section specs

### S1 — Arrival (hero) · 100 vh
- **Signature ★ — depth-layered wordmark:** a giant "SKYLINE" wordmark spans the full width *behind* the tower; the tower (a transparent cutout image) sits in front of the letters, the sky render behind them. Three layers: sky → wordmark → tower cutout. This one move makes the hero feel designed rather than templated.
- Bottom-left: eyebrow `SKYLINE RESIDENCES · GOLF COURSE ROAD`, headline "Living *above* the city.", one-line subtext, "Explore homes →" (filled brass) and "Book a private visit" (text link).
- Bottom strip: 28 Floors · 112 Residences · 1.2 acres Sky gardens · from ₹48 L. Top-right: coordinate + live IST time caption. "Scroll" cue.
- **Motion (on load, ≤ 1.2 s, no preloader):** wordmark letters rise one by one from a mask, sky scales 1.06 → 1.0, tower rises 24 px into place, stats fade up staggered. On scroll: the three layers move at different speeds (parallax depth); wordmark fades and spreads apart slightly. Pointer parallax on desktop (±8 px, layers at different strengths).
- **Performance:** the sky render is the LCP image (`priority`). Headline is real text, visible before animations.
- **V2:** sky + tower layers become the poster under the canvas.

### S2 — Manifesto · 150 vh, sticky
- Near-empty dark screen. One large serif paragraph centred: "We built Skyline for people who measure a home in light, air and silence — not square feet alone."
- **Motion:** words fill from mist-grey to ivory as you scroll. A brass hairline draws underneath at the end.

### S3 — The Making (build-up) · 300 vh, sticky stage
- Left: eyebrow `02 —— THE MAKING`, headline "A landmark, *taking shape*.", big counter `00 → 28 FLOORS`, milestones Foundation · Rise · Crown that light up in turn. A thin vertical floor ruler with tick marks fills upward with progress.
- Right: stage with four renders of the same tower (podium/foundation, half-built with crane, crown being placed, complete at sunset).
- **Motion:** progress crossfades the renders with an upward clip-path wipe; counter and ruler track progress. Pure function of progress, so fully reversible.
- **V2:** stage becomes the 3D floors stacking.

### S4 — Inside a home · 300 vh, sticky stage
- Right: top-down cutaway floor plan render. Left: eyebrow `03 —— LEVEL 18`, headline "Step *inside*.", short text, tabs `2 BHK · 3 BHK · 4 BHK` (swap plan image + area figure, with crossfade).
- **Motion:** scroll "zooms" into the plan (scale 1 → 1.25 while transform-origin travels across rooms); **hotspot labels** appear one by one, pinned to positions on the image: Living · Master bedroom · Kitchen · Balcony. Label = brass dot with pulse ring + pill. Hover/focus a label → that room brightens (overlay mask), others dim. This is the "interactive touch beyond scroll".
- **V2:** plan image becomes the 3D floor with the facade peeling away; labels move to 3D anchors.

### S5 — Amenities · 400 vh, pinned horizontal track
- Eyebrow `04 —— AMENITIES`, headline "Everything, *one lift away*."
- Horizontal track of 4 tall cards: Infinity pool (L04), Sky gym (L24), Garden terraces (L04), Rooftop lounge (ROOF). Each card: render, level tag, name, one line, two small facts.
- **Motion:** vertical scroll moves the track horizontally; the active card is full opacity and slightly larger, others dim; the altitude rail jumps to that card's level; images parallax inside cards. Big outlined index number (`01`–`04`) behind each card.
- **Mobile:** no pin; cards stack vertically with reveals.

### S6 — The View ★ (signature, interactive) · 100 vh
- Headline "Every floor, *a different city*." A full-bleed window-frame view of the skyline.
- **Interaction:** a vertical **floor slider** on the right (native `<input type="range">`, styled, keyboard accessible) from L04 to L28. Moving it crossfades between three view renders (low / mid / high floor), and updates live text: `Level 18 · 3 BHK · from ₹2.8 Cr · 72 m above ground`. Scroll also nudges the slider while the section is in view, but the user can always take over.
- Why it matters: it's the most memorable interaction on the page, it sells the product (higher = better view), and it maps directly to a camera height in V2.

### S7 — Minutes away (if time)
- A list of 5 large rows: `Cyber Hub · 8 min`, `Golf Course · 2 min`, `Airport · 25 min`, `Metro · 4 min`, `Schools · 6 min`. Fraunces numbers, hairline dividers.
- **Motion:** on hover (desktop), a small image follows the cursor and reveals behind the row (clip-path); rows slide in from the left on enter. On touch, the image shows inline in each row.

### S8 — Featured homes · normal scroll
- Header row: "Featured residences" + "View all 56 →". A slow marquee of localities above the grid.
- 6 cards from the API (3×2 desktop, horizontal snap-scroll on mobile). Card: image 4:5, price in Fraunces, title, locality, chips `3 BHK · 1,850 sq ft · Furnished`, heart (favourites bonus later). Hover: image scale 1.04, brass underline grows under the title, arrow nudges.
- **Motion:** staggered reveal on enter. Same card component as `/properties` (one component, no copy-paste).

### S9 — Call to action · 100 vh
- Full-bleed rooftop-at-night render. Eyebrow `05 —— YOUR FLOOR AWAITS`, headline "Find the home that *fits your view*.", subtext, "Explore homes →".
- **Motion:** image opens from a narrow vertical slit (clip-path) to full width as the section enters; headline line reveal; magnetic button (desktop only).

### S10 — Footer
- Giant faint "SKYLINE" wordmark across the bottom (echoes the hero), three link columns, small print, credits link.

### Site-wide
- **Page transitions:** View Transitions API (zero JS library) — a short crossfade between routes, plus shared element card image → detail gallery (bonus item).
- **Header:** transparent over the hero, becomes a blurred ink bar after 80 px of scroll; current route underlined in brass.

---

## 4. Animation system (build once, reuse everywhere)

No GSAP, no Motion library (budget). Build these primitives first.

| Primitive | What it does | How |
|---|---|---|
| `useSectionProgress(ref)` | 0→1 progress through a tall section | one shared scroll listener + rAF, cached offsets, damped value; writes `--p` on the section |
| `<StickyStage>` | tall wrapper + sticky inner viewport | CSS `position: sticky`; exposes progress |
| `<RevealText>` | line/word/letter mask reveal on enter | split into spans server-side, IntersectionObserver adds `data-in` |
| `<ScrollFillText>` | words fill grey → ivory with progress | CSS reads `--p`, per-word thresholds |
| `<Reveal>` | fade/rise for any block, with stagger | IntersectionObserver + CSS |
| `<Counter>` | number tied to progress | text updated in rAF, real final value in HTML |
| `<Hotspot>` | pinned label on an image | absolute % position, a `<button>` for keyboard focus |
| `<AltitudeRail>` | fixed level indicator | IntersectionObserver on sections |
| `<Parallax>` | layer moves at a speed factor | reads section progress, `translate3d` only |
| `useMagnetic()` | element follows pointer slightly | pointer events, disabled on touch |
| `<Marquee>` | infinite locality ticker | pure CSS keyframes, paused on hover and reduced motion |

Rules:
- Animate only `transform`, `opacity`, `clip-path`, `filter`.
- `prefers-reduced-motion`: no scrubbing, parallax, pin or marquee; content visible with short fades; sticky stages show their final frame; the floor slider still works (user-driven).
- Everything readable without JS: all text in HTML, images visible.
- Optional: Lenis (~4 KB gz), desktop only, off for reduced motion. Decide after measuring.

---

## 5. Pages beyond the landing (from the mockup, upgraded)

- **/properties:** mockup layout (search + filter row + BHK chips + 3-column cards + pagination) plus: sticky filter bar on scroll, results count that animates on change, grid crossfade on filter change, skeletons matching cards exactly. A short dark page header with a skyline strip (as in the mockup).
- **/properties/[slug]:** mockup layout (thumbnail rail + large image left, price/specs/amenities right, about + map, similar, enquiry form) plus: sticky right column with price + "Enquire" on desktop, gallery with keyboard + swipe, mobile sticky bottom bar "₹4.2 Cr · Enquire".
- **Enquiry form:** mockup styling; behaviour per AGENTS.md §8.5.

---

## 6. Assets

Generate the **master tower image first**, then use it as the reference image for every other render so it's the same building every time.

Style suffix for every prompt:
> photoreal architectural visualisation, slender 28-storey residential tower with vertical glass fins and brass-toned balcony edges, Indian metro city skyline, warm cinematic grading, deep navy and amber palette, 35mm, no people, no text, no logos

| File (in `public/images/landing/`) | Section | Prompt core | Aspect |
|---|---|---|---|
| `hero-sky.avif` | S1 | golden-hour sky over a low Indian city skyline, **no tall tower in the centre** | 16:9 + 4:5 |
| `hero-tower.avif` (transparent) | S1 | the tower alone, front three-quarter view, isolated (remove background, export AVIF/WebP with alpha) | 2:3 |
| `making-1..4.avif` | S3 | foundation → half built with crane → crown placed → complete at sunset | 4:5 |
| `plan-2bhk/3bhk/4bhk.avif` | S4 | top-down 3D cutaway floor plan, warm wood and stone, furnished | 1:1 |
| `amenity-pool/gym/garden/rooftop.avif` | S5 | as named, dusk/blue hour | 3:4 |
| `view-low/mid/high.avif` | S6 | view through floor-to-ceiling glass at blue hour from low / middle / very high floor | 16:9 |
| `cta-rooftop-night.avif` | S9 | rooftop terrace at night, city lights below | 16:9 |
| `properties/*.avif` (12–16) | listings | exteriors + interiors (living, bedroom, kitchen, balcony) in the same grading | 4:3 |

Budget: each image ≤ 180 KB at its largest served size; landing images over the wire ≤ 1.5 MB (S6+ images lazy). Disclose AI generation in README credits and AI_USAGE.md.

---

## 7. Build order (one section per prompt, each committed)

1. Primitives (§4) + page skeleton (all sections as tall placeholder blocks) + altitude rail + header + grain. Commit.
2. S1 Arrival. Commit + screenshot review.
3. S2 Manifesto. 4. S3 The Making. 5. S4 Inside a home. 6. S5 Amenities. 7. **S6 The View**. 8. S8 Featured homes. 9. S9 CTA + S10 footer. Commit after each.
10. S7 Minutes away (only if ahead of schedule).
11. Reduced-motion pass, 360 px pass, Lighthouse on the deployed URL.

**Acceptance per section:** right at 360 / 768 / 1440 px; fast scroll down/up shows no jumps; reduced motion works; no console warnings; `npm run build` passes; landing first-load JS ≤ 130 KB gz.

## 8. Working rules for the agent (token discipline)

- This plan is frozen. Don't redesign or invent sections. If something seems wrong, say so in one line and continue.
- Touch only the files the current section needs. Output changed files/diffs only.
- Reuse §4 primitives; new behaviour goes into a primitive, not one-off scroll code.
- Placeholder images (gradient + filename text) until real assets exist. Never block on assets.
- One line each in `notes/DECISIONS.md` and `notes/AI_LOG.md`.

## 9. V2 (after V1 ships)

One fixed three.js canvas replaces the sticky images of S1, S3, S4, S5 and the S6 view, driven by the same progress values. Spec: AGENTS.md §8.2. Text, layout, rail and timings stay.
