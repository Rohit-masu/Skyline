# Skyline — Acceptance & Verification Report

**Date:** October 2026  
**Branch:** `feat/skyline-v1`  
**Test Suite:** 16 Passing Vitest Tests  
**TypeScript:** 0 Errors (`tsc --noEmit`)  
**Production Build:** Clean Next.js 16 (Turbopack) build  

---

## 1. Feature Verification Matrix

| Category | Requirement | Result | Evidence / Notes |
|---|---|---|---|
| **Design System** | Architectural Luxury Dark Palette |  Pass | `--color-ink` (#0a0f18), `--color-brass` (#c9a36a), Fraunces serif + Manrope sans |
| **Design System** | Responsive Header & Footer |  Pass | Mobile drawer with backdrop blur, sticky altitude header |
| **Hero** | High-res static fallback + IST Clock |  Pass | Immediate LCP with `priority` image, live Asia/Kolkata clock, Noida Sector 128 coords |
| **Data & API** | 56 Realistic Indian Residences |  Pass | Seeded with realistic INR pricing (₹1.8 Cr to ₹115 Cr), localities in NCR, Mumbai, Bengaluru, Goa |
| **Data & API** | Validated Query Parameters |  Pass | Zod schema checks positive integers, minPrice <= maxPrice, returns 400 on invalid input |
| **Data & API** | Rate-Limited Enquiries |  Pass | Max 5 per 10 mins per IP, salted SHA-256 hash, returns 429 on abuse |
| **Data & API** | Spam Honeypot |  Pass | Hidden `company` field silently absorbs bot submissions with fake 201 |
| **Listings (`/properties`)** | 12 Items Per Page |  Pass | Default limit: 12, pagination range indicator (`Showing 1–12 of 56`) |
| **Listings (`/properties`)** | URL State as Single Source of Truth |  Pass | `?q=...&bhk=...&sort=...&page=...` completely restores state on refresh and Back/Forward |
| **Listings (`/properties`)** | Debounced Search & Stale Cancellation |  Pass | 350ms debounce with `AbortController` aborting previous in-flight HTTP requests |
| **Listings (`/properties`)** | Loading / Empty / Error States |  Pass | 12 shimmer card skeletons, empty state with "Clear All Filters", error retry button |
| **Detail (`/properties/[slug]`)** | Server-Rendered Content & SEO Metadata |  Pass | `generateStaticParams()` prebuilds all 56 routes with dynamic per-property OpenGraph tags |
| **Detail (`/properties/[slug]`)** | Accessible Keyboard Gallery |  Pass | Left/Right arrow keys (`ArrowLeft`, `ArrowRight`) cycle through images; full thumbnail strip |
| **Detail (`/properties/[slug]`)** | Enquiry Lead Capture Form |  Pass | 10-digit Indian phone regex (`^[6-9]\d{9}$`), visit date picker, duplicate submit lock |
| **Detail (`/properties/[slug]`)** | Input Retention on Failure |  Pass | Network or server failure retains user's typed name, phone, date, and message |
| **Detail (`/properties/[slug]`)** | Unknown Slug 404 |  Pass | Calls `notFound()` returning real HTTP 404 with custom luxury not-found template |
| **Detail (`/properties/[slug]`)** | Similar Residences |  Pass | Locality/City/BHK relevance algorithm renders up to 4 similar property cards |
| **3D Scroll Story** | 5 Scroll-Driven Scenes |  Pass | Arrival, 28-floor assembly, Level 18 interior reveal, amenities, and CTA |
| **3D Scroll Story** | Reversible Assembly |  Pass | Scrolling up smoothly reverses the exact floor slab positions |
| **3D Scroll Story** | Interactive Pointer Parallax |  Pass | Mouse/touch coordinates tilt camera perspective for depth beyond scroll |
| **3D Scroll Story** | Reduced-Motion Fallback |  Pass | `prefers-reduced-motion` renders accessible static editorial presentation |
| **3D Scroll Story** | Offscreen Pause |  Pass | `IntersectionObserver` halts Three.js render loop when canvas is out of view |
| **Branding** | Reeltor Noida Customization |  Pass | Sector 128 Noida Expressway, Reeltor Experience Pavilion prominently featured |

---

## 2. Tested Edge Cases

1. **Direct URL Entry & Bookmarking**:
   - `http://localhost:3000/properties?q=Penthouse&bhk=4&sort=price_desc` -> directly loads filtered 4 BHK penthouses sorted by price.
2. **Invalid Price Filter**:
   - `GET /api/properties?minPrice=50000000&maxPrice=10000000` -> returns 400 Bad Request with `"minPrice cannot be greater than maxPrice"`.
3. **Invalid Slug**:
   - `http://localhost:3000/properties/non-existent-residence` -> returns 404 with custom luxury page.
4. **Form Honeypot**:
   - Submitting `company="Spam Corp"` returns 201 without storing in lead registry.
5. **Form Error Input Retention**:
   - Submitting with invalid phone "123" highlights inline error while keeping user's name and message intact.
