# Problem Validation Transfer Packet
## Stage 1 Output | USL Academy

**Idea / Product Name:** Event QR Check-in (working name)
**Session Date:** 2026-10-14
**Schema version:** 3
**Status:** complete
**Prepared for:** Camping Nigeria

---

## 1. INTAKE SUMMARY

**Upstream:** none — started here
**Starting point:** Running business exploring a new direction (internal operations tool)
**What the user has today:** Event sign-ups (Camp Night, MAD Settings) issue a unique text code (SCN-XXXXXX, MAD-XXXXXX), write a row to a Google Sheet via Apps Script, and email a confirmation via Resend. At the Camp Night gate (26 Sept 2026), signees showed their codes to ticketing officials.
**URL or product reference:** campingnigeria.com/events; docs/camp-night/debrief-2026-09-26.md (follow-up: "Track sign-ups (barcode)")

---

## 2. TARGET PERSONA AND PAYER

**Who this is for:** The Camping Nigeria ticketing operative at the event gate.
**What makes them specific:** A single team member on the entrance of a private venue (Brooks Garden, Abuja) as guests arrive, mostly in the evening, checking each guest's sign-up code against the paid list (60 to 100+ sign-ups per event) and, for MAD Settings, distinguishing sleepover (tent) from attendance-only tickets.
**Persona confidence level:** High. The founders ran this gate themselves at Camp Night on 26 Sept 2026.
**Secondary user:** The signee, who carries the QR code. Their stake is fast, argument-free entry.

**Who pays:** Camping Nigeria (the three founders), internally.
**Payer persona:** The founders, who are also the builder. Short form because builder and payer are the same people.
**Why the payer pays:** Protect revenue (only paid sign-ups get in), protect the tent cap, and know who actually attended (no-shows, tent tracking, planning the next edition).
**Payer confidence level:** High. Internal decision by the people running the session.
**Does the deal fail without them:** Yes, but they are the payer; the real test is build time versus other priorities before 31 Oct.
**Two-sided dependency:** Not applicable.

---

## 3. CONFIRMED PROBLEM STATEMENT

**Problem statement:**
> Camping Nigeria's gate operative cannot confirm that an arriving guest has actually paid, or record who arrived, because sign-up codes are checked only by glancing at their format, with no lookup against the paid list and no record of which codes have been admitted.

**Notes on this problem statement:**
At Camp Night (26 Sept 2026) officials glanced at the code format only. Nothing went wrong, but under that process nothing could have been detected: a made-up or forwarded code in the right format would pass. The problem is a latent control gap plus missing attendance data, not an observed failure.

**Problem source:** Direct experience (founders ran the gate). Observed harm: none.
**Problem source, payer side:** Same as above.
**Problem confidence level:** Medium. The gap is certain; whether it costs anything is unobserved.

---

## 4. BALANCED BREAKTHROUGH MODEL (BBM) SCORECARD

**Desirability rubric used:** Push. The operative is escaping an uncheckable gate, not reaching for something.

| Dimension | Score | Confidence | Key Reasoning | What would resolve a `?` or a Low |
|---|---|---|---|---|
| Desirability | 3/5 | Medium | Direct experience shows a real control gap (format-only check, no admitted record) and the founders named the fix themselves in the Camp Night debrief. No observed harm yet, so it is a gap, not a felt pain. MAD Settings is a larger, public-facing party (Tbee Sounds), which raises exposure versus a 60-person camp. | Measure at MAD Settings: invalid, duplicate and unknown-code scans, and arrival rate. |
| Feasibility | 4/5 | High | Codes, Google Sheet, Resend emails and Upstash already exist in the repo. QR generation and a browser camera scanner are well-trodden. Not a 5: needs operative auth, a write-back for "arrived", iPhone Safari camera testing, and re-issuing QRs to people already signed up, inside 17 days. | |
| Viability (as ROI) | 3/5 | Medium | Internal tool, scored as return on investment. Protects ticket revenue (from ₦10,000 per head) and the 80-tent cap, yields attendance data, and is reusable for every future event. Cost is a few founder days. Value per event is modest while no gatecrashing has been observed. | Count of rejected scans at MAD Settings. |

**Caps applied:** Regulatory gate checked, did not fire. No licence or approval needed. QR will carry code, name and tent type; this is the holder's own data on their own ticket, already collected under the sign-up's privacy terms. Constraint carried forward: the scanner must verify against the server record, never trust QR contents, because anyone can generate a QR with any text.

**Biggest identified risk:** The 17-day deadline combined with modest, unobserved value. A half-working scanner at the gate is worse than the glance check. Action: keep v1 to scan, look up, mark arrived, with a manual code-entry fallback, and test on the real operative's phone before the night.

**Flag:** Caution

**Evidence base:**

**Founder-observed evidence:** yes, founders ran the Camp Night gate (format-only check, nothing went wrong).
**Live research completed:** yes, 2026-10-14 (see Market Evidence and Sources). No score changed: research confirms the category and the iOS path, not the gate's pain.
**Buyer conversations completed:** 0
**Conversation sample:** none
**Conversation status:** deferred by user on 2026-10-15 (internal tool; informal operative chat suggested instead)
**Evidence last revised:** 2026-10-14

---

## 5. SOLUTION DIRECTION

**What the user currently has or is proposing:**
Two parts. (1) A QR generator: each sign-up gets a personal QR encoding its code, name and tent type, shown on the confirmation page and in the confirmation email. (2) A scanner: a private web page the operative opens on their phone to scan the QR, check it against the live sign-up records, and mark the signee arrived.

**Solution-to-problem alignment:**
Yes, conditionally. The root cause is the absence of a lookup and an admitted record. The scanner addresses it only if it verifies every scan against the server record (paid, exists, not already admitted) and writes "arrived". The QR alone only speeds up reading; a QR that is merely glanced at reproduces the original problem.

**Recommended adjustments or reframes:**
- The scanner is the lead half; the QR is the helper. Scope accordingly.
- Back-fill: guests who signed up for MAD Settings since 13 Oct 2026 received emails with no QR and need one issued.
- Manual code entry must run through the same verification as a scan (fallback if the camera fails).
- The scanner must be behind operative-only access because it displays guest names.
- Never trust QR contents; name and tent in the QR are display convenience, not proof.

**Solution type (check one):**
- [x] Digital product (internal web tool inside the existing campingnigeria.com Next.js site)
- [ ] Physical product
- [ ] Service
- [ ] Process or system
- [ ] Hybrid (two or more of the above)
- [ ] Not yet determined

---

## 6. USER CONSTRAINTS AND CONTEXT

**Budget:** Not disclosed.
**Timeline:** Hard deadline: must be live for MAD Settings, 31 Oct 2026 (17 days from session date).
**Technical skill level:** Can build independently (founder builds with Claude Code in this Next.js repo).
**Team:** Small team (three founders plus event operatives). One operative scans on the night (reduced from two on 2026-10-14).
**Stage:** Established business exploring a new direction.
**Other constraints:** Scanner devices available: one Android, one iPhone; with one operative, which phone scans is not yet decided, so the scanner must work on both. Venue has reliable mobile data. Scope for v1: validate the code and mark the signee arrived; anything further is undecided.

---

## 7. UNIQUE VALUE PROPOSITION (UVP)

**Confirmed UVP:**
> For Camping Nigeria's gate operative, who cannot tell whether an arriving guest actually paid or keep track of who has come in, Event QR Check-in gives a one-second yes or no for every guest by checking each scanned or typed code against the live sign-up records and marking it arrived on the spot, so a fake code fails and a used code shows "already in".

**Payer proposition:**
> For the founders: every paid seat and every one of the 80 tents goes to the person who paid for it, plus a true arrival list after every event, built on the sign-up system already running at no per-ticket cost.

**What makes this genuinely unique:**
It runs on Camping Nigeria's own codes, sign-up flow and confirmation emails, so nothing moves platform mid-sale, there is no per-ticket fee, and it understands event-specific ticket rules (sleepover versus attendance-only).

**Alternatives the user is competing against:**
1. Doing nothing: glance at the code format (current practice).
2. Printed list ticked off by hand.
3. Google Sheets QR check-in add-on (paid outside student events, own codes, outside the email flow).
4. Moving ticketing to a platform with a scanner (GoDashTix, Ayatickets): switches platform mid-sale.

**UVP confidence level:** Medium. The mechanism is clear and genuinely different from the alternatives; the value it captures is unproven until MAD Settings.

---

## 8. OPEN QUESTIONS AND UNRESOLVED RISKS

| # | Open Question or Risk | Priority (High / Medium / Low) |
|---|---|---|
| 1 | Hard deadline: must work at the MAD Settings gate on 31 Oct 2026 (17 days). A failing scanner is worse than the glance check. Needs manual entry fallback and a real-device rehearsal. | High |
| 2 | Back-fill: MAD Settings sign-ups since 13 Oct 2026 have no QR. How are they issued one (re-send email, confirmation page lookup)? | High |
| 3 | Where is "arrived" recorded and read? Sign-ups live in a Google Sheet via Apps Script; the scanner needs a fast, authoritative lookup and write. Source of truth not yet decided. | High |
| 4 | Operative access control for a page showing guest names (login method not decided). | Medium |
| 5 | iOS Safari camera behaviour on the operative's actual iPhone is unverified; which phone scans is undecided. | Medium |
| 6 | Value unobserved: no gatecrashing seen at Camp Night. Measure invalid, duplicate and unknown scans plus arrival rate at MAD Settings to confirm Desirability and ROI. | Medium |
| 7 | Future scope (tent ID assignment from the Camp Night debrief, ticket-type display, other events) is undecided and out of v1. | Low |

---

## 9. MARKET EVIDENCE AND SOURCES

| # | Finding (one line) | Source URL | Date checked |
|---|---|---|---|
| 1 | Nigerian ticketing platform GoDashTix sells tickets and checks attendees in by QR; check-in is bundled with its own ticket sales. | https://www.producthunt.com/p/godashtix/godashtix | 2026-10-14 |
| 2 | Ayatickets Check-Ins (Ghana) is free, works offline, supports multiple scanner accounts and blocks reused tickets, but only for Ayatickets-sold tickets. | https://apps.apple.com/app/id1579356327 | 2026-10-14 |
| 3 | Ticketscene and Ticketscloud scanners follow the same pattern: organizer logs in, picks event, scans; platform must sell the ticket. | https://apps.apple.com/us/app/id1249901072 ; https://apps.apple.com/us/app/id1585780067 | 2026-10-14 |
| 4 | Google Sheets add-on "QR Code Ticket Per Row For Event Check-In" generates a QR per row and checks in from a phone; free only for student-run events, otherwise paid ticket bundles; generates its own codes. | https://workspace.google.com/marketplace/app/qr_code_ticket_per_attendee/9398047938?pann=b | 2026-10-14 |
| 5 | QRStuff offers a Sheets check-in flow on a paid subscriber account. | https://qrstuff.com/blog/?p=2963 | 2026-10-14 |
| 6 | html5-qrcode supports iOS Safari from 15.1; older non-Safari iOS browsers lacked camera access; camera requires HTTPS; file/photo capture fallback exists. | https://classic.yarnpkg.com/en/package/html5-qrcode | 2026-10-14 |

**Still unverified (worth a live check later):** Tix.africa check-in capability (not found). Current iOS 17/18 bug reports for html5-qrcode (not found; test on the operative's iPhone). Current pricing of the Sheets add-on.

---

## VALIDATION REVISIONS

No revisions yet.

---

## 10. RECOMMENDED NEXT STEP

**Next module:** Stage 2: Solution and MVP Fleshing (`/solution-mvp`)

**What to bring into that session:**
This Transfer Packet. Stage 2 reads it from `usl-build/` automatically.

**What Stage 2 will build on top of this:**
- MVP scope and feature definition based on the solution direction above
- User flow mapped to the gate operative and the signee
- Identification of the minimum thing to build, test, or deliver first, inside the 31 Oct deadline

**One thing to think about before that session:**
On the night, if the scanner says "not found" for someone holding what looks like a real code, what should the operative do? That answer decides the fallback design.

---

## 11. SESSION NOTES (OPTIONAL)

- Session explained in plain language at the user's request; keep later stages simple and concrete.
- Operative count reduced from two to one mid-session, which removes multi-scanner sync conflicts.
- The Camp Night debrief also proposes tent ID tags filled in at check-in; a natural v2 once scan-in exists.
