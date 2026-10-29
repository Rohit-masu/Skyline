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
