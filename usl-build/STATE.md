# USL Build Loop — Project State

**Project:** Padi Check (internal event check-in tool; formerly "Event QR Check-in")
**Mode:** student
**Terminal stage:** 8 (default)
**Last updated:** 2026-10-23

**North star (one paragraph):**
Camping Nigeria's single gate operative currently "checks" event sign-up codes (SCN-, MAD-XXXXXX) by glancing
at their format, so a fake or forwarded code would pass and nobody records who arrived. Event QR Check-in
gives each signee a personal QR (code, name, tent type) in their confirmation email and page, and gives the
operative a private web scanner, on Android or iPhone, that checks every scanned or typed code against the
live sign-up records and marks it arrived, so fakes fail and reused codes show "already in". Internal tool,
paid for by the founders in build time; judged on protected revenue, an enforced 80-tent cap and a true
arrival list. Must work at MAD Settings on 31 Oct 2026.

## Stage status

| # | Stage | Packet file | Status |
|---|---|---|---|
| 1 | problem-validation | 1-problem-validation.md | done |
| 2 | solution-mvp | 2-solution-mvp.md | done |
| 3 | business-model | 3-business-model.md | done |
| 4 | offer-design | 4-offer-design.md | done |
| 5 | brand-strategy | 5-brand-strategy.md | done |
| 6 | landing-page | 6-landing-page-copy.md | done |
| 7 | prd-generation | 7-prd.md | done |
| 8 | build-sequence | 8-build-sequence.md | done |

## Optional workstreams

| Workstream | Status | Next action |
|---|---|---|
| expertise-map | n/a | Idea already stated |
| buyer-conversations | deferred | Deferred by user 2026-10-15; informal operative chat suggested |

**Next action:** Sessions 0.1, 1.1, 1.2 (checks pass, timing failed) and 1.3 done 2026-10-23. Gate now answers from a fast Upstash copy of the list (decision 2026-10-23, build sequence Section 9). Blocked on the owner: (1) create a new Upstash database, its URL and token into .env.local (and later Vercel); (2) update the TEST Apps Script deployment to the new script version. Then re-time, re-test the login lockout, and go on to Session 1.4.

**Stage 8 decisions:** 15 sessions in 5 phases. No sheet copy: build against a separate TEST Apps Script deployment of the live sheet (only founder test rows until sales open 27 Oct); production deployment untouched until go-live 26 Oct. Back-fill email deferred (PRD v1.1, D-006) because sales open after go-live. Walking skeleton on the real phone by 20 Oct; feature complete 24 Oct; run-through 25 Oct; go live 26 Oct (attendance-only smoke test, then delete all TEST rows); rehearsal 28 Oct; event 31 Oct; rotate passwords after.

**Stage 7 decisions:** Build authorised (R-001 to R-013, no blockers). Apps Script gets a shared secret and checkin/stats/list/roster/markSent actions plus a Scan log tab; redeploy as a new version of the existing deployment in the owner account at the Stage 8 session that changes it, not before. Two roles: volunteer and admin passwords. Back-fill via /padi-check/admin in batches of 20 after a test send. Volunteer holds a printed name/code/ticket list (no phone or email) to honour "your name still gets you in". New deps html5-qrcode and qrcode (versions to verify). Seven new env vars listed in 7-prd.md Section 8.

**Stage 6 decisions:** Six surfaces: confirmation page (QR in the existing gold box), confirmation email, back-fill gate-pass email, Padi Check login, scanner with six full-screen states (welcome, already + Call Toyosi, not found, not paid, offline grey, camera off), printed Gate card. No contractions in copy (house voice). Padi Check noindex, no analytics. Final copy in 6-landing-page-copy.md; nothing built yet.

**Stage 5 decisions:** Tool name Padi Check (user-chosen). Guest QR is the "Gate pass". Brand Idea "You are in." Screens: Welcome in / Already checked in / We cannot find this code + Call Toyosi / Not marked as paid + Call Toyosi / Cannot reach the list. Never say fraud-proof, secure, INVALID, DENIED. Names unscreened, internal use only.

**Stage 4 decisions:** Internal adoption case, no external offer. Operative is a VOLUNTEER: full-screen colours,
Call founder button on red, name/ticket/tent only (no phone or email), password rotated after every event,
printed volunteer card, 5-minute walkthrough, vibration on Android. Guest commitment: "No paid guest is turned
away because of the tech." Bottleneck is the guest finding the QR, so "Screenshot this QR now". Build server
verification and check-in write first. Red-screen button reads "Call Toyosi" (number kept in usl-build/check-in.private.md (gitignored), to be an env var). Toyosi is not one of the three founders named in CLAUDE.md.

**Stage 3 decisions:** Internal investment. Proceed with caution. 12 gated events per year, 80 to 90 guests at
MAD Settings (user estimates). NGN 0 cash; 3 to 5 founder days once plus 1 to 2 hours per event. Revenue
protected per year: NGN 0 / about 240,000 / about 720,000 at 0 / 1 / 3 catches per event (unobserved).
Investment ceiling: 5 build days. Adoption test: rehearsal 28 Oct (all four outcomes within 3 s), then at
least 95 percent of guests scanned and no queue over 10 minutes. Review the Scan log after three events.
Stage 2 reflection (user): "The scanning of the QR code, the indication of Green, orange and red must work well."

**Stage 2 decisions:** Route value-first. Five components: (1) QR on confirmation page and email, (2) one-press
back-fill QR email for existing sign-ups, (3) password-protected scanner with typed fallback, (4) server check
with green/orange/red and arrival time written to Checked In?, (5) live count plus Scan log tab. Built on the
existing site and MAD Settings sheet, about 3 to 5 founder days, about NGN 0 external cost. Dates: build done
26 Oct, back-fill 27 Oct, after-dark rehearsal and use/do-not-use 28 Oct, event 31 Oct. Terminal stage stays 8.

**Open risks carried from Stages 1 and 2:**
- High: 17-day hard deadline; scanner failure on the night is worse than the glance check (needs manual entry fallback and a real-device rehearsal).
- High: back-fill QRs for MAD Settings sign-ups made since 13 Oct.
- Resolved in Stage 2: source of truth is the existing MAD Settings Google Sheet (Checked In? plus a new Scan log tab); Apps Script URL stays server-side.
- Medium: Apps Script latency and manual redeploy in the owner's Google account; email embedded-image blocking unverified.
- Medium: operative access control; iOS Safari camera unverified; which phone scans undecided.
- Medium: value unobserved (no gatecrashing seen); measure rejected scans and arrival rate at MAD Settings.
- BBM: D 3 (Medium), F 4 (High), V 3 as ROI (Medium). Flag: Caution.

**Decisions and notes:**
- 2026-10-14: Loop started. Camping Nigeria's own product, so student mode.
- 2026-10-14: One operative scans (reduced from two). Venue has reliable data.
- 2026-10-14: QR carries code, name and tent type; scanner must verify against server, never trust QR contents.
- Internal tool: Stages 3 to 6 will likely resolve as an internal ROI and adoption case rather than an external offer. With a 17-day deadline, consider whether a lighter pass through 3 to 6 is appropriate.
- User asked for plain, "explain like I'm 10" language; keep explanations simple.
