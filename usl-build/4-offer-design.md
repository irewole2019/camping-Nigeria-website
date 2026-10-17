# Offer Design Transfer Packet
## Stage 4 Output | USL Academy

**Business / Product Name:** Event QR Check-in (working title)
**Date:** 2026-10-17
**Prepared for:** Camping Nigeria
**Status:** complete
**Last completed phase:** Phase 5 (Deliver)

---

## 1. INPUTS CARRIED FORWARD FROM STAGES 1 TO 3

**Problem statement:** Camping Nigeria's gate operative cannot confirm that an arriving guest has actually paid, or record who arrived, because sign-up codes are checked only by glancing at their format, with no lookup against the paid list and no record of which codes have been admitted.
**Persona:** Gate operative. Revised this stage: the operative on the night is a volunteer, not a founder.
**UVP:** One-second verified yes or no for every guest by checking each scanned or typed code against live sign-up records and marking it arrived.
**MVP core features:** QR on page and email; back-fill send; password-protected scanner with typed fallback; server check with green/orange/red and arrival write; live count plus Scan log.
**Price hypothesis from Stage 3:** None (internal). Investment ceiling 5 founder days, NGN 0 cash.
**Revenue-model hypothesis from Stage 3:** Internal investment.
**Desirability rubric from Stage 1:** Push.
**Caps applied:** Regulatory gate checked, did not fire. No vantage cap.
**Cap status, affected dimension, and resolution condition:** None.

---

## 2. GROUNDING AND CONFIDENCE

**Track:** Hybrid. System facts observed; operative and guest behaviour reasoned.
**Confidence control:** No caps. Behaviour findings are [reasoned] until the rehearsal and first live use.
**Paid-traffic readiness:** Not applicable (internal tool; no acquisition).
**Source material ingested:** `docs/camp-night/debrief-2026-09-26.md`; `docs/mad-settings/apps-script.gs`; `lib/events/mad-settings.ts`; `app/api/mad-settings-signup/route.ts`; Stages 1 to 3.
**Notably absent:** Any operative feedback; any record of guest behaviour at a gate beyond "nothing went wrong".
**Marked reasoned (needs validation):** Operative worries and their order; guests will open the QR email.
**What would falsify the avatar:** The volunteer prefers the Lookup tab after the walkthrough; more than 10 percent of guests cannot produce a QR or code.

---

## 3. NICHE AND AVATAR

**Locked niche:** The volunteer gate operative at a Camping Nigeria paid, gated event, starting with MAD Settings on 31 Oct 2026. Secondary: arriving guests holding a QR.
**Demand state:** Founder-observed gap (format-only check); fix named by the founders in the Camp Night debrief. No observed harm.
**Desirability orientation:** Push. Relief from an uncheckable gate and from blame for mistakes or queues.
**Founder fit, recorded separately:** Founders control the gate, the sign-up system and the volunteer briefing.

**Rejected candidates (the expansion roadmap):**

| Candidate | Why rejected | Likely order as a future niche |
|---|---|---|
| Past Camp Night editions | Event closed | When the next Camp Night opens |
| Free community meetups | No paid entry to protect | Only if attendance data becomes the goal |
| School programs | Different flow (proposals, not tickets) | Not planned |

**Central tension (central motive), one sentence:**
> "Tell me quickly and clearly who to let in, so I am not the one blamed for a mistake or a long line." [reasoned]

**Emotional register:** Avoidance. Calm, plain on-screen wording; no hype.

**Language table:**

| What they say | What the business currently says |
|---|---|
| "Is this person on the list?" [reasoned] | "Sign-up code" |
| "Can't find my email" [reasoned] | "Your code" |

**Objections, in the order they surface:**
1. What if the camera will not work?
2. What if a real guest shows red?
3. What if the internet drops?

**Disqualifiers:** Founders doing ad hoc lookups (they can use the sheet); non-gated events.

---

## 4. OFFER MODEL, CONVERSATION, AND FUNNEL ARCHITECTURE

**Highest-value next conversation:** A 5-minute walkthrough with the volunteer before the rehearsal: the three colours, typed entry, and "red means call a founder". Commitment signal: the volunteer runs the rehearsal unaided.
**Signal ladder:** Curiosity: volunteer opens the scanner. Qualification: completes the walkthrough. Commitment: runs the rehearsal unaided. Purchase equivalent: uses it for 95 percent of guests on the night.
**Guest-side conversation offer:** The QR email: clear subject, one instruction ("Show this at the gate").
**Funnel:** Not applicable (internal). Capacity ceiling: one volunteer scanner.

**Offer theses considered:**

| Thesis | What is paid for | Payer | Unit | Why it won or lost |
|---|---|---|---|---|
| Conventional control: build on own site and sheet | Founder time | Founders | One build, reused per event | Won: own codes and emails, NGN 0, no mid-sale switch |
| Sheets QR add-on | Ticket bundles | Founders | Per ticket | Lost: paid outside student events, own codes, outside email flow |
| Ticketing platform scanner | Platform fees | Founders or guests | Per ticket | Lost: moves sales mid-event |
| Printed list ticked by hand | Nothing | None | Per event | Lost: no reuse detection, slow in the dark |

**Selected primary thesis:** Build on own site and sheet.
**Credible runner-up:** Lookup tab on the night (fallback).

---

## 5. VALUE EQUATION AUDIT

| Term | Available? | Notes |
|---|---|---|
| Dream outcome | Yes | Every guest gets a clear, verified answer; arrivals recorded |
| Perceived likelihood | Partly | Volunteer trust depends on the rehearsal; substitution: "red means a founder decides", never an automatic refusal |
| Time delay | Yes | Scan about 1 second; lookup 1 to 3 seconds (unverified) |
| Effort and sacrifice | Yes | One password, then point and read the colour |

**Capped terms and why:** Perceived likelihood, until the rehearsal proves the colours on the real phone.
**Substitutions used:** Certainty of process (a founder handles every red) instead of certainty that every scan succeeds.
**The bottleneck:** The guest finding the QR in their phone, not the scan. Addressed by "Screenshot this QR now" on the email and confirmation page, plus typed entry.

---

## 6. THE OFFER

**Working title:** Event QR Check-in (provisional; Stage 5 names it, including the guest-facing pass name).
**Dream outcome:** "Tell me quickly and clearly who to let in." [reasoned]
**What the customer is really paying for:** Certainty at the gate (internal adoption, not a purchase).
**Beneficiary:** Volunteer operative and guests.
**Payer:** Founders (build time).
**Unit of sale and payment trigger:** Not applicable; adoption trigger is the rehearsal pass on 28 Oct.
**Core:** The scanner with green, orange and red answers.
**Included components:** Personal QR (page and email); back-fill QR email; password-protected scanner with typed entry; verified result screens with arrival write; live count and Scan log; full-screen colours; Call founder button on red; vibration on result (Android only); minimal data on screen (name, ticket, tent only, no phone or email); printed volunteer card; 5-minute volunteer walkthrough.
**Genuine additional bonuses:** None.
**Risk reversal / guarantee:** Guest-facing commitment: "If your QR will not scan, your name still gets you in. No paid guest is turned away because of the tech." Honoured because every red goes to a founder.
**Scarcity:** None beyond the existing 80-tent cap.
**Urgency:** None manufactured; the event date only.
**Price:** None (internal; 5-day investment ceiling, NGN 0 cash).

---

## 7. VALUE STACK AND ANCHORS

Internal tool: no monetary anchors. Values are qualitative.

| # | Component | Value | Anchored to | Source URL | Verified / Estimate | Status |
|---|---|---|---|---|---|---|
| 1 | Personal QR on page and email | Fast, typo-free reading | Not applicable | | | GAP |
| 2 | Back-fill QR email | Every guest holds a QR | Not applicable | | | GAP |
| 3 | Scanner with typed entry | Lead capability | Alternatives exist (Sheets add-on, platform scanners) | Stage 1 sources | Verified (existence only) | GAP |
| 4 | Verified result screens plus arrival write | Fakes fail, reuse shows | Not applicable | | | GAP |
| 5 | Live count plus Scan log | Evidence of value | Not applicable | | | PARTIAL (Checked In? column exists) |
| 6 | Volunteer card and walkthrough | Adoption | Not applicable | | | WILL BUILD (no code) |
| 7 | Sheet Lookup tab fallback | Safety net | Not applicable | | | BUILT |

**Total:** Not applicable | **Price:** Not applicable | **Ratio:** Not applicable

---

## 8. SOLUTION STATUS AND BUILD IMPLICATIONS

**Counts:** BUILT 1, PARTIAL 1, GAP 4 (plus 1 no-code WILL BUILD).
**The repeat-appearing bottleneck or attraction driver:** Server verification of a code, used by scan, typed entry, count and log. Build it first.
**BUILT but unmarketed (free value, claim immediately):** The confirmation page already shows the code and can be bookmarked; tell guests.
**GAPs that the offer depends on:** QR generation; back-fill send; scanner; check-in write and Scan log in Apps Script; password gate.

---

## 9. LAUNCH SEQUENCE

**Offer conversation test:** Volunteer walkthrough, then after-dark rehearsal on 28 Oct (10 test codes, all four outcomes within 3 seconds, typed entry works, volunteer unaided). Pass: use on 31 Oct. Fail: Lookup tab.
**Paid-traffic readiness:** Not applicable (internal tool).
**Readiness evidence:** Not applicable.
**Resolution action before readiness can increase:** Not applicable.
**1. Ships now, zero build:** Volunteer card; walkthrough; Lookup tab fallback; "Screenshot this QR" wording.
**2. Cheap builds, high value:** Full-screen colours; Call founder button; vibration; minimal-data display.
**3. Real builds:** Server verification and check-in write (first), scanner page, QR on page and email, back-fill send, count and Scan log.
**4. Blocked on an unknown:** Apps Script redeploy access (owner's Google account). Call button number resolved (private file, env var).

---

## 10. BRAND INPUTS (FOR Stage 5)

**Who we are for:** The volunteer at the gate, and the guests walking through it.
**The problem we solve:** "Is this person on the list?"
**What makes us different:** Built on Camping Nigeria's own codes and emails; a founder always handles red.
**The feeling we want customers to have:** Calm and sure. Guests feel welcomed, not checked.
**Register constraint:** Avoidance-motivated volunteer: plain, calm words; no hype, no alarming language on red.
**Brands or businesses the user admires:** Not captured.
**Tone direction:** Existing Camping Nigeria site voice and brand tokens.

**Naming inputs:**

| Component | Input from this stage |
|---|---|
| Goal (the dream outcome) | "Get in fast, no fuss" (guest); "Know who to let in" (volunteer) |
| Avatar (the identity axis) | Event guest and volunteer at Camping Nigeria events |
| Interval | None reliable yet, do not name one |
| Container and register | Calm, plain; avoid hype and alarm |
| Forbidden claims | "Fraud-proof" or any claim of fraud prevented (unobserved) |

**Working labels to sweep:** Personal QR; QR email; scanner; green / orange / red result screens; Scan log; volunteer card.
**Working title used in this packet:** Event QR Check-in. Stage 5 replaces it.

---

## 11. LANDING PAGE INPUTS (FOR Stage 6)

**Headline direction:** No public landing page. Guest-facing surfaces are the confirmation page and email; the internal surface is the scanner.
**Primary CTA goal:** Guest: screenshot or keep the QR. Volunteer: scan.
**Objections in the order copy must answer them:** Camera fails; real guest shows red; internet drops.
**Language table:** Section 3.
**Offer to feature:** Not applicable.
**Social proof available:** None.
**Claims that cannot be made:** Fraud-proof; any figure for money saved.

---

## 12. PRD INPUTS (FOR Stage 7)

**Must exist for the offer to be deliverable:** All GAPs in Section 8, plus the password gate and minimal-data display.
**The correct next build:** Server verification and check-in write in Apps Script, because every surface depends on it.
**Cheap builds worth scoping now:** Full-screen colours; Call founder button; vibration (Android); "Screenshot this QR" wording.
**Explicitly out of scope for v1:** Sounds, animations, stats screens; plus the Stage 2 deferrals (tent ID, multiple scanners, undo, other events, offline).

---

## 13. OPEN QUESTIONS AND RISKS

| # | Item | Priority | Needs professional review? |
|---|---|---|---|
| 1 | Apps Script redeploy access before 26 Oct | High | No |
| 2 | Volunteer trust in the colours; rehearsal on the real phone | High | No |
| 3 | Shared password with a volunteer; rotate after every event | Medium | No |
| 4 | Call button number: provided 2026-10-17, held in usl-build/check-in.private.md (gitignored); goes in an env var | Resolved | No |

---

## 14. MARKET EVIDENCE AND SOURCES

No live research run this session. Stage 1 sources reused (see `1-problem-validation.md` Section 9).

**Still unverified (worth a live check later):** iPhone browser vibration support (assumed absent); Apps Script latency.

---

## 15. RECOMMENDED NEXT STEP

**Next module:** Stage 5: Brand Strategy (brief: naming the tool and its guest-facing and volunteer-facing labels in the existing Camping Nigeria voice).
**Before paid traffic or a full launch:** Not applicable; the rehearsal is the test.
**What to bring into that session:** Sections 3 and 10.
**One thing to think about before that session:** What should a guest call the QR when they tell a friend: a ticket, a pass, or something else?

---

## 16. CHANGE LOG

| Date | What changed | Why |
|---|---|---|
| 2026-10-17 | Operative is a volunteer, not a founder | User confirmed; drives simpler screen, Call founder button, minimal data, password rotation |
| 2026-10-17 | Added volunteer card, walkthrough, full-screen colours, vibration | Cheap, high value for a volunteer |
| 2026-10-17 | Cut sounds, animations, stats screens | Low value |
| 2026-10-17 | Guest commitment: no paid guest turned away because of the tech | Honest; every red goes to a founder |
