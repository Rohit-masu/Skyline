# AI Usage Disclosure

This document provides transparent disclosure regarding AI assistance utilized during the development of **Skyline** for the Reeltor Frontend Developer assignment.

---

## 1. Tools & Roles

- **Gemini (via Google Antigravity IDE)**:
  - Acted as an autonomous pair-programmer for iterative phase implementation (Phases 1 through 7).
  - Drafted TypeScript interfaces, Zod schemas, React components, and Vitest test suites.
  - Executed builds, type-checks, and automated tests directly in WSL/PowerShell.

---

## 2. Prompts Used During Development

1. **API & Data Layer (Phase 2)**:
   > "Audit the existing data and API against Phase 2. Ensure query validation, status codes, at least 50 realistic Indian listings with authentic INR pricing, similar properties endpoint, and rate-limited enquiries with honeypot spam protection."
2. **Listings URL State (Phase 3)**:
   > "Implement the /properties listings page where URL query params are the single source of truth for search, filters, sort, and pagination. Ensure 12 items per page, race-condition cancellation via AbortController, and loading/empty/error states."
3. **Detail & Lead Capture (Phase 4)**:
   > "Implement server-rendered property details with per-property metadata, real 404 for unknown slugs, accessible keyboard gallery, and enquiry form with Indian mobile validation and input retention on failure."
4. **Scroll-Driven 3D Story & Reeltor Customization (Phase 5)**:
   > "Implement the 5-scene 3D tower story using procedural Three.js geometry, lazy-loading, and pointer parallax. Customize location and experience pavilion to Sector 128, Noida Expressway for Reeltor."

---

## 3. Real AI Mistakes Caught & Corrected

### Mistake 1: Client Component `new Date()` in Static Prerender
- **What happened**: In `components/property/EnquiryForm.tsx`, `getKolkataDateString(0)` was called during component initialization at module evaluation time.
- **How it was caught**: Next.js 16 (Turbopack) build failed with: `Next.js encountered the unstable value new Date() in a Client Component during prerender`.
- **Correction**: Deferred dynamic live date evaluation to `useEffect` after client hydration, using static constant fallback limits during static prerender.
- **Lesson**: Next.js 16 enforces strict purity during static prerendering; dynamic time reads in Client Components must always be hydrated via effects.

### Mistake 2: Raw Unicode Rupee Symbol in PowerShell / Bash Here-String
- **What happened**: Passing raw `₹` character through shell string concatenation created UTF-8 replacement byte errors.
- **How it was caught**: `npm run typecheck` threw `Invalid character TS1127`.
- **Correction**: Replaced raw string literal with standardized Unicode escape `\u20B9` in `lib/format.ts`.
- **Lesson**: Shell-agnostic Unicode escapes prevent encoding corruption across Windows / WSL boundaries.

### Mistake 3: Vitest Path Alias Resolution
- **What happened**: Vitest could not resolve `@/*` path aliases defined in `tsconfig.json`.
- **How it was caught**: Running `npm test` produced `Cannot find package '@/lib/format'`.
- **Correction**: Configured `vitest.config.ts` with explicit `resolve.alias` mapping `@` to the project root.
- **Lesson**: Test runners with independent Vite resolution require explicit alias alignment with `tsconfig.json`.

---

## 4. Human Verification & Oversight

- **Code Review**: Every component, schema, and API route was inspected for type safety, security (IP salting, rate limiting, honeypot), and accessibility (`aria-` attributes, keyboard navigation).
- **Commands Verified**:
  - `npm run typecheck` (`tsc --noEmit`) — 0 errors.
  - `npm test` (`vitest run`) — 16/16 tests passing.
  - `NEXT_DIST_DIR=.next-prod npm run build` — 100% successful compile of all 63 static & dynamic routes.
  - `curl / Invoke-RestMethod` tests on valid and invalid API requests.
- **Brand Alignment**: Verified that Noida Expressway (Sector 128) and Reeltor Experience Pavilion branding are accurately presented across the site.
