# AI usage

I used AI tools throughout this project. Below is how I used them, what went wrong and how I fixed it.

## How the project was built, step by step

1. **Research (no AI).** I studied real-estate and 3D scroll sites on Awwwards, Framer and Dribbble, plus the Reeltor site, to decide on the look: dark, minimal and luxurious, with brass accents.
2. **ChatGPT: theme and planning.** I gave ChatGPT the brief and my references. It helped me fix the theme (colours, two fonts, tone) and write the planning markdown files: requirements, folder structure and a task plan. From that I built a first prototype layout.
3. **Gemini (Antigravity IDE): first static website.** Gemini built the first working version: design system, data seed, API routes, listings, detail page and enquiry form.
4. **Claude Code: the 3D story.** Claude built the scroll-driven three.js tower (arrival, build-up, inside a home, amenities, call to action), the poster-first loading and the static fallbacks.
5. **New session: art direction change.** A later session moved the 3D to a blue-hour/night look. The brief did not ask for it. I kept it because it matched the brass palette, and changing it again would have meant re-rendering all the posters.
6. **Stability and backend pass (Claude Code).** Claude compared the listings, detail page and form against the brief and fixed the gaps it found. It also moved enquiries and the rate limit into Neon Postgres.
7. **Transitions, polish and final brush (Gemini and Claude).** We added the section transitions, the editorial featured grid, the minimal navbar and footer, the intro screen and lighter images. I reviewed every change in the browser from screenshots.

## Prompts that worked well

These are paraphrased; the original prompts were a mix of Hindi and English.

1. *"Read the docs first and understand the scope, then finish the pending tasks. Ask me if anything is unclear."* Starting from the written plan stopped the AI from rebuilding things that already worked. It also asked me the real decisions: deploy, database, git flow and scope.
2. *"Compare the listings page, detail page and enquiry form against the brief's stability checklist and fix what fails."* This found that the listings page did not render results on the server and had no guard against stale responses. It also found that invalid API parameters returned 200 instead of 400, and that the form had no accessible errors or double-submit guard.
3. *"Use reeltor.com and my earlier project vantooptics.vercel.app as references. Keep it minimal and luxurious, and go section by section, easiest first."* Giving concrete references and a fixed order produced small, reviewable changes instead of one big redesign.

## Where the AI was wrong, and how I caught it

- **Build broken by a casing bug.** During the UI pass Gemini compared `property.type === "penthouse"`, but the type is `"Penthouse"`. The penthouse tag could never show, and `next build` failed type-checking. I caught it by running `npm run typecheck` before merging to `main`, and fixed the casing.
- **A "real 404" that returned 200.** Unknown property URLs showed the 404 page but with status 200. With Next.js 16 `cacheComponents`, the page shell is streamed before `notFound()` runs. I checked the status with `curl`. The first two AI fixes failed: `dynamicParams` is not allowed with `cacheComponents`, and `"use cache"` alone did not help. The final fix rewrites unknown slugs in `proxy.ts` so Next renders the 404 page with a 404 status.
- **Footer animations that never ran.** `overflow: hidden` turns an element into a scroll container, so the CSS scroll timeline tracked the footer instead of the page. I found it by reading the computed transform at different scroll positions; it never changed. The fix was `overflow: clip`.
- **A tooltip stuck over the page.** The 3D floor-hover tooltip stayed on screen over the featured homes after the 3D loop paused. I spotted it in a screenshot. Hover now only counts over the story, and the tooltip hides from the pointer event itself.

## Limitations I worked within

- **Time:** 24 hours for a project of this size.
- **New stack:** Next.js 16 (App Router, `cacheComponents`), GSAP and three.js were new to me. That is why I kept the architecture simple and explicit, so I can explain every file.
- **3D models:** detailed GLB models would not fit the 2 MB asset budget, and I could not produce them in the time. The tower, interior, amenities and city are built procedurally in code instead, with 0 bytes of models downloaded.
- **Resources:** I used free tiers only (Vercel, Neon), with no paid templates or assets.

## What I checked myself

- Every change was checked with `npm run typecheck`, `npm run lint`, `npm test` and `npm run build`.
- The listings and detail behaviour was checked with scripted browser runs: filters, fast typing, the Back button, scroll restore, the form, the 429 response and the 404 status.
- The deployed site was checked with `curl` for status codes, CDN caching and a real enquiry saved to the database.
