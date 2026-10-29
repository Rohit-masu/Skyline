# Skyline — 2–3 Minute Demo Recording Checklist

Follow this sequence for recording the walkthrough video:

## 1. Homepage & 3D Tower Story (0:00 – 1:00)
- [ ] **Arrival Hero**: Show dark luxury architectural layout, live IST clock in header, and Sector 128 Noida Expressway location tag.
- [ ] **Scroll Down to 3D Story**:
  - Show Scene 1: Arrival with smooth camera orbit.
  - Move mouse to show pointer parallax perspective tilt.
  - Show Scene 2: 28 post-tensioned floor slabs assembling smoothly as you scroll down.
  - Scroll back up briefly to show the floor assembly reverses perfectly.
  - Show Scene 3: Camera flies into Level 18 Sky Suite, revealing marble floor, ceiling height, and balcony notes.
  - Show Scene 4: Level 04 pool, Level 24 sky gym, and Level 28 crown firepit.
  - Show Scene 5: Wide panorama and click "Browse All Residences".

## 2. Listings Page & URL State (1:00 – 1:50)
- [ ] **URL Source of Truth**:
  - Type "Golf" or "Noida" in search input (observe smooth 350ms debouncing and active search chip).
  - Click "3 BHK" and "4 BHK" pills (observe URL updating to `?bhk=3,4`).
  - Change sort to "Price: High to Low" (`?sort=price_desc`).
  - Refresh the browser (confirm exact search and filter state remains identical).
  - Press browser Back button (confirm previous filter state restores).
  - Clear all filters with "Reset All".
  - Show pagination with 12 residences per page.

## 3. Property Detail & Lead Capture (1:50 – 2:40)
- [ ] **Detail Page**:
  - Click on a signature residence card (e.g. "The Horizon at Skyline").
  - Use Left / Right arrow keys on keyboard to cycle gallery views.
  - Show architectural specs, 11-ft clear ceiling height, materials, and similar residences.
- [ ] **Enquiry Form**:
  - Enter name and an invalid 4-digit phone (click Submit to show instant client validation without form wiping).
  - Enter valid 10-digit Indian phone (e.g. 9812345678), select visit date, and submit.
  - Observe submit lock with spinner and subsequent luxury 201 reservation confirmation dossier.
