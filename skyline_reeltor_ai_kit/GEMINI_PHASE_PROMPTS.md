# Copy-paste prompts for Gemini Agent

Use one prompt at a time. After each response, inspect the diff and browser before proceeding.

## Prompt 0 — Repository audit (no edits)
Read `GEMINI_RULES.md`, `TASK_PLAN.md` and `DESIGN_BRIEF.md`. Inspect the existing repository and current git diff. Do not modify any files. Report:
1. current stack and scripts;
2. implemented routes/components/API/data/storage;
3. what currently runs and commands you verified;
4. missing brief requirements;
5. any high-risk existing code or likely regressions;
6. a prioritized next-three-tasks plan.
Do not assume anything is complete without checking it. Stop after the report.

## Prompt 1 — Design system and shell
Implement only Phase 1 from `TASK_PLAN.md`, adapting to the existing project rather than rebuilding it. Before editing, list exact files and approach. Create a coherent responsive design system and site shell in the Architectural Luxury + Cinematic 3D direction. Build the initial hero using real HTML text, CTA and a fixed-ratio optimized poster image. Do not import Three.js/R3F/GSAP into the initial page bundle yet. Preserve existing API and routes. Run relevant checks, report exact outcomes, then stop.

## Prompt 2 — API/data audit or completion
Audit the existing data and API against Phase 2. Do not rewrite working handlers. Fix only the highest-priority gaps. Ensure query validation and status codes are clear; at least 50 realistic fictional Indian listings exist; similar endpoint returns up to 4; enquiry validation, persistence, honeypot and rate limiting work. Use shared types/schema. Run manual requests or tests and show the exact commands/results. Stop after this phase.

## Prompt 3 — Listings URL state
Implement only the missing Phase 3 behaviour. URL query params must be the source of truth for search, filters, sort and page. Ensure refresh/back/forward restores the same state, stale requests are cancelled or ignored, and 12 results per page. Add loading/empty/error states. Avoid a full rewrite. Test rapid filter changes and document what was tested. Stop.

## Prompt 4 — Detail and enquiry
Implement only missing Phase 4 requirements. Ensure server-rendered property details and per-property metadata, real 404 for unknown slug, gallery keyboard support, similar properties, and client/server form validation parity. Prevent duplicate submits and retain input after failure. Run tests or exact manual checks and stop.

## Prompt 5 — Arrival scene only
First inspect current 3D implementation and performance. Implement or refine ONLY the Arrival scene. The 3D must be dynamically loaded, with poster and headline rendered first. Scroll position, not a timer, controls motion. Add reduced-motion and WebGL fallback. Cap DPR and pause off-screen/hidden rendering where feasible. Keep assets lightweight. Explain how to test the scene and what bundle impact was actually measured. Stop before building the next scene.

## Prompt 6 — Build-up scene only
Implement the floor assembly scene in the existing 3D architecture. Scrolling down assembles floors and scrolling up reverses the exact same progress smoothly. Do not add a separate animation timeline that drifts out of sync with scroll. Preserve Arrival and fallbacks. Run build and test fast/reverse scrolling. Stop.

## Prompt 7 — Interior reveal only
Add a simplified floor/interior reveal with DOM labels for living, bedroom and balcony. Ensure labels remain in sync with the scene and are readable on mobile. A clean procedural representation is acceptable if a model would exceed the time/bundle budget. Preserve prior scenes. Stop.

## Prompt 8 — Amenities + CTA only
Add pool, gym and garden points with synced text panels, then settle the scene at a clear CTA to `/properties`. Keep scroll progress reversible. Do not add unneeded 3D detail. Test scrolling both directions and reduced-motion fallback. Stop.

## Prompt 9 — Hardening
Run through the acceptance checklist. Focus on direct URL entry, refresh, browser Back/Forward, rapid filters, invalid query values, unknown slug, form invalid/valid/server-error states, 360px layout, reduced motion, console/hydration warnings and production build. Fix only reproducible issues. Do not claim Lighthouse/performance budgets without running measurements. Stop with a bug list sorted by severity.

## Prompt 10 — Reports and docs
Update README and AI_USAGE using actual implementation facts only. Add `.env.example`, asset credits and cache/performance notes. Run Lighthouse mobile for `/`, `/properties`, and a detail route; save reports under `/reports`. Generate bundle analyzer evidence. If a report cannot be generated, state the exact blocker—never fabricate it. Create a concise 2–3 minute recording checklist. Stop.

## If Gemini starts changing too much
Stop it and send:
"You are exceeding the requested scope. Revert only your uncommitted changes that are unrelated to this task; do not touch pre-existing user changes. Show `git diff --stat` and `git diff`, then propose the smallest targeted fix. Do not run destructive git commands."
