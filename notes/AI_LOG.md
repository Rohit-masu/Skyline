# AI log

One line each: what the AI got wrong — how it was caught — fix.

## From the first attempt (scrapped, rebuilt from scratch on 2026-10-29)

- Counted the noModule polyfill chunk in first-load JS (173 KB instead of 135 KB) — listing each chunk and its script attributes — measure only scripts modern browsers load.
- Installed @next/bundle-analyzer, which does nothing with Turbopack — read the version-matched docs in node_modules/next/dist/docs — use built-in `next analyze`.
- Used `reset` in error.tsx — bundled Next 16 docs say `retry()` re-fetches the segment — switched to `retry`.
- Neon connection "timed out" (ETIMEDOUT on every IP) while curl worked — Node gives each address 250 ms, too short from India to US East — `.npmrc` node-options raises it to 2000 ms.
- Zod v4 `z.coerce.number()` inside `.pipe()` failed typecheck (coerce input is `unknown`) — `npm run typecheck` — `z.string().regex(/^[1-4]$/).transform(Number)`.
- Shuffled with `sort(() => random() - 0.5)` (biased) — code review before running — Fisher–Yates.
- Clamped seed prices to the ₹15 Cr cap, three penthouses at exactly ₹15 Cr — reading API test output — spread capped prices over the top 20%.
- Hero poster blurry on phones (`sizes="100vw"` on a `fill` + `object-cover` image) — 360 px screenshot — `sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"`.
- Ran `next build` into the same `.next` folder as a running `next dev` — the dev page reloaded in a loop — build into a separate folder (`NEXT_DIST_DIR=.next-prod`).
- Two apostrophes in two separate CSS comments made the CSS pipeline silently drop every rule between them — compiled CSS was missing the rules although the file had them — keep apostrophes out of CSS comments.
- Started 3D before the story and art direction were fixed; the look drifted — Rohit reviewed screenshots — restarted with a static storytelling V1 (LANDING_V1_PLAN.md).
- LayoutProps<"/"> in app/layout.tsx caused TS2304 type error — caught via npm run typecheck — replaced with standard React.ReactNode type.
- new Date() in Footer.tsx triggered Next.js 16 blocking prerender warning during next build — caught via npm run build — replaced with static 2026 constant.
- Hero image sizes updated to (max-aspect-ratio: 16/9) 178vh, 100vw to ensure phone sharpness per team notes.
- Indexed array accesses in scripts/generate_properties.ts triggered TS18048 under noUncheckedIndexedAccess — caught via npm run typecheck — resolved with non-null assertions.
- PowerShell Set-Content with [slug] path failed due to wildcard character interpretation — caught via command error — resolved using -LiteralPath parameter.
- Raw Rupee symbol literal in echo bash command created UTF-8 replacement chars — caught via npm run typecheck — used standard \u20B9 Unicode escape in lib/format.ts.
- Vitest missing path alias @ configuration — caught via vitest run — configured vitest.config.ts with path alias.
- Unstable new Date() during static prerender of Client Component EnquiryForm triggered Next.js 16 blocking prerender error — caught via NEXT_DIST_DIR=.next-prod npm run build — deferred live date calculation to useEffect with static fallback limits.
- Capped Three.js WebGL renderer pixel ratio to min(window.devicePixelRatio, 1.75) — prevents mobile GPU thermal throttling on 3x-density smartphone displays.
- Story text invisible in 3D mode: z-10 on the panel was trapped inside the sticky stage (position: sticky always creates a stacking context), under the fixed canvas — headless screenshots of each scene — z-10 moved onto the sticky stage.
- Split headings rendered without spaces ("Findthehome...") — the space was inside the inline-block word mask, where trailing whitespace collapses — screenshot — space moved outside the mask.
- CTA camera ended up inside a city block; pool camera sat inside the tree ring — screenshots — city keeps clear of the sampled camera path, pool camera raised.
- PCFSoftShadowMap is removed in three r186 (console warning) — headless console log — PCFShadowMap.
- `"requestIdleCallback" in window` narrowed window to never in the else branch — npm run typecheck — typeof check.
- The test harness first reported wrong scene progress: html scroll-behavior: smooth animated window.scrollTo, and SwiftShader renders at ~2 fps so the damped value needed far longer to settle — fixed the harness (instant scroll, wait for the target value), not the app.
- Missing favicon.ico 404 in the console (pre-existing) — headless console log — app/icon.svg.
- Budget gap (still open): initial JS on / is ~192 KB gz and on /properties ~195 KB gz, over the 130/120 KB budgets. The shared React DOM + Next runtime chunks alone are ~158 KB gz; the landing page chunk is 4 KB. three + scene code is a lazy 146 KB gz chunk, GSAP a lazy 44 KB gz chunk; neither is in any initial bundle.
- Shimmer word disappeared after splitting the headline into letters: background-clip: text on the parent does not reach separately transformed inline-block children — screenshot — the word rises as one block with the shimmer on an inner span.
- First hero card covered the building in the photo, and the 3D tower hid the photo entirely — screenshots and Rohit feedback — photo-first hero with hotspots on the tower.
- Hand-off fade made the lifting hero a translucent double exposure over the 3D — screenshot — removed the fade; the hero now simply scrolls away.
- D3D shader compiler warning X4122 from three.js built-in shaders appeared in the console on the Windows GPU backend — headless run — renderer.debug.checkShaderErrors = false in production.
- First bloom pass blew out the white podium, the crown and the interior walls — poster captures — darker stone, off-white interior, threshold 0.82 -> 0.9, calmer lobby/crown emissive.
- tsx ran scripts/make-posters.ts as CommonJS, so top-level await failed (ERR_REQUIRE_ASYNC_MODULE) — running the script — wrapped in main().
- Amenity copy 'Train above the treeline' was unclear to Rohit — feedback — rewritten to say what each stop is.
