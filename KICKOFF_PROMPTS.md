# Kickoff prompts — paste one at a time

Put this whole folder's files in the repo root first (AGENTS.md, CLAUDE.md, LANDING_V1_PLAN.md, docs/, notes/). Paste the next prompt only after the previous one is committed and you've checked it in the browser.

---

**P0 — Audit**
> Read AGENTS.md, LANDING_V1_PLAN.md and docs/BRIEF.md. Do the Step 0 audit (AGENTS.md §1), fix what's missing, and reply with a short list of what you changed. Don't build any features yet.

**P1 — Foundations + data**
> Do milestones M0 and M1 from AGENTS.md. Use placeholder images. Commit after each milestone. Reply with the curl examples you verified.

**P2 — Listings**
> Do milestone M2 (listings) using the dark styling from docs/mockup-v1.png and LANDING_V1_PLAN.md §5. Verify every listings item in AGENTS.md §10 and tell me exactly what you tested.

**P3 — Detail + enquiry**
> Do milestone M3 (detail + enquiry form) using LANDING_V1_PLAN.md §5. Verify the 404 and every form failure case.

**P4 — Landing primitives**
> Do LANDING_V1_PLAN.md §7 step 1 only: the animation primitives, page skeleton, altitude rail, header and grain overlay. Report the landing first-load JS size.

**P5…P12 — One section each**
> Build LANDING_V1_PLAN.md section S__ only, reusing the §4 primitives. Check it at 360 / 768 / 1440 px and with reduced motion, then commit.

(S1 → S2 → S3 → S4 → S5 → S6 → S8 → S9+S10, then S7 if time.)

**P13 — Verify + reports**
> Do milestone M7: deploy to Vercel, run Lighthouse mobile on /, /properties and one detail page, bundle analyzer, save everything to /reports, and list any budget that's missed.

**P14 — Docs**
> Do milestone M8: write README.md and draft AI_USAGE.md from notes/AI_LOG.md for me to rewrite in my own words.

---

## Tips
- If the agent starts redesigning: "Stop. Follow LANDING_V1_PLAN.md exactly. Only change the files for this section."
- If a fix loops twice: stop, ask for the root cause in 3 lines before any more code.
- Generate images in parallel while the agent builds P1–P3.
