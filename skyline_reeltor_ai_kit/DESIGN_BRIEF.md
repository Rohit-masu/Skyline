# Skyline — Visual Design Brief

## Brand idea
**SKYLINE — The Art of Elevated Living**

A fictional premium residential tower. The brand should communicate architectural confidence, calm, privacy, natural light and thoughtful living—not a generic property aggregator.

## Art direction
Architectural Luxury + Cinematic 3D:
- Hero: deep charcoal / forest-black canvas, warm ivory type, muted champagne accent.
- Content pages: warm stone/off-white backgrounds, near-black text and restrained accent use.
- Photography: modern Indian luxury residential architecture, believable interiors, landscape/pool/gym imagery. Prefer consistent grading and crop ratios.
- Composition: editorial, intentional asymmetry, large image moments, generous whitespace and a clear grid.
- Motion: smooth, slow enough to understand, directly tied to scroll; no gratuitous bouncing or constant background motion.
- Copy: concise and believable. Do not invent factual claims such as awards, exact occupancy or certifications.

## Suggested design tokens (adapt to existing code)
- `--color-ink`: #171A18
- `--color-forest`: #0B1D17
- `--color-paper`: #F4F1EA
- `--color-surface`: #FFFEFA
- `--color-muted`: #777A73
- `--color-accent`: #C5A46D
- `--color-border`: #DEDAD1
- Body text should meet WCAG AA contrast; do not use muted text for essential data.
- Container max width around 1280px; mobile gutters 20px, desktop 48–72px depending on viewport.
- One editorial serif for display headings + one readable sans-serif for UI/body, no more than two families.
- Use a consistent spacing scale rather than ad hoc margins.

## Routes
### `/`
1. Slim header: wordmark, navigation, clear Explore Homes CTA.
2. Hero: overline, headline, short subheading, CTA and poster image; initial content paints without 3D.
3. Scroll story with Arrival, Build-up, Interior reveal, Amenities and CTA scenes.
4. Featured homes strip with 6 API-backed properties.
5. Compact lifestyle/location or design philosophy section only if time and content support it.
6. Footer with route links and contact/enquiry CTA.

### `/properties`
- Editorial title and result count.
- Search + filter controls that work on mobile (collapsible drawer/sheet if needed).
- Strong image-led listing cards with price, title, locality, BHK, area and type.
- Clear sorting and 12-per-page pagination.
- Designed skeleton, empty and error states.

### `/properties/[slug]`
- Image gallery with accessible controls.
- Clear hierarchy: title/locality, price, specs, key amenities.
- Small map/location block; a stylized locality block is acceptable if it does not imply a precise map pin that is not real.
- Similar homes and enquiry form.
- Metadata should be unique to the property.

## Avoid
- Generic dashboard aesthetic on a real-estate marketing site.
- Overloaded hero with many buttons and floating UI.
- Gold text on light backgrounds with weak contrast.
- Large video/3D download before the first paint.
- Arbitrary fake metrics, fake user reviews or unsupported property claims.
- Using remote assets without checking reliability, dimensions and licence.
