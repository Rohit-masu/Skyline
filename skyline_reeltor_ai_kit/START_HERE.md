# Skyline Reeltor — AI Build Kit

## Goal
Ship a polished, stable, deployed Next.js App Router + TypeScript real-estate showcase by **Friday, 30 October 2026, 7:00 PM IST**.

This kit is a working process and prompt set, not a substitute for inspecting the repository. The existing project is already in progress. **Do not recreate it or overwrite working code.**

## First 10 minutes
1. Open the existing project in Gemini's coding agent.
2. Paste `GEMINI_RULES.md` first.
3. Ask it to inspect the repository and return a concise status report: current stack, routes, API, data/storage, working features, broken features, and risks. It must not edit files during this audit.
4. Compare that report with the actual code and terminal. Confirm what already works.
5. Use `TASK_PLAN.md` to choose the next task. Do not start a fresh scaffold unless the existing repo is genuinely unusable.

## Recommended design direction
**Architectural Luxury + Cinematic 3D**:
- Hero: dark forest/charcoal architectural stage, warm ivory text, restrained champagne accent.
- Listings/detail: warm off-white or very light stone surfaces so property photography and data remain readable.
- Editorial serif headline + clean sans-serif body. Maximum two font families.
- Large architectural imagery, asymmetric but disciplined layout, generous whitespace, consistent grid.
- Avoid generic SaaS dashboards, excessive glassmorphism, glowing gradients, random floating cards, too many pill badges, and animation for animation's sake.
- Design the tower and scroll story around one fictional property identity: **SKYLINE — The Art of Elevated Living**. Use this as a placeholder brand, not a claim about a real property.

## Priority order
1. Existing project audit and app booting reliably.
2. Required routes and core API/data behaviour.
3. Listings URL-state correctness and detail/enquiry flows.
4. Visual system and responsive UI.
5. Scroll-controlled tower scenes and graceful fallback.
6. Production build, deployment, reports, recording, docs.
7. Bonus features only if every required deliverable is safe.

## Checkpoints
After every phase:
- run the app and inspect the actual browser at desktop and mobile widths;
- check terminal output and browser console;
- test the specific acceptance criteria;
- commit a small, meaningful change;
- do not proceed if the phase breaks existing functionality.

## Important
The brief explicitly asks for a public GitHub repo, deployed URL, README, honest `AI_USAGE.md`, Lighthouse mobile reports for `/`, `/properties`, and a detail page, bundle analyzer evidence, and a 2–3 minute walkthrough showing reduced-motion fallback. Do not leave these to the final minutes.
