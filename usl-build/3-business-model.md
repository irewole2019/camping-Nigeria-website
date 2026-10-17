# Business Model Transfer Packet
## Stage 3 Output | USL Academy

**Schema version:** 2
**Status:** complete
**Business / initiative:** Event QR Check-in (internal tool, Camping Nigeria)
**Date:** 2026-10-17
**Decision:** Proceed with caution

---

## 1. FOUNDATION AND READINESS

**Stage 1 schema and latest revision:** v3; no revisions; conversation status deferred by user 2026-10-15.
**Stage 2 schema, route, and experiment status:** v2; value-first; no experiment.
**User persona and confidence:** Single gate operative at a private evening venue checking 80 to 90 guests; High.
**Payer, budget owner, and confidence:** Founders, paying in build time; no other approver; High.
**Payer proposition:** Every paid seat and every one of the 80 tents goes to the person who paid for it, plus a true arrival list after every event, at no per-ticket cost.
**Problem and source, user side:** Codes checked only by format; no lookup, no admitted record. Direct experience, no observed harm. Medium.
**Problem and source, payer side:** Same as user.
**UVP and confidence:** One-second verified yes or no plus arrival record, by checking each scanned or typed code against live sign-up records. Medium.

**Desirability rubric used:** Push (escaping an uncheckable gate).
**Caps applied:** Regulatory gate checked, did not fire. No vantage cap.

| BBM dimension | Score | Confidence | Evidence basis | Resolution condition |
|---|---|---|---|---|
| Desirability | 3/5 | Medium | Direct experience; fix named in debrief; no harm observed | Rejected scans and arrival rate at MAD Settings |
| Feasibility | 4/5 | High | Existing codes, sheet, Apps Script, email | |
| Viability (ROI) | 3/5 | Medium | Internal ROI; NGN 0 cash; benefit magnitude unknown | Scan log across three events |

**Buyer evidence:** 0 conversations; deferred by user 2026-10-15.
**Solution scope and constraints:** Five components on the existing site and MAD Settings sheet; build done 26 Oct, back-fill 27 Oct, rehearsal 28 Oct, event 31 Oct; one operative, phone undecided.

---

## 2. EVIDENCE LEDGER

**Observed:** Ticket prices NGN 10,000 / 30,000 / 35,000 and 80-tent cap (MAD Settings); NGN 20,000 to 30,000 and 60 tents (Camp Night); NGN 0 incremental cash; sheet already has `Checked In?`.
**Researched:** Platform scanners bundle ticketing; Sheets add-on paid outside student events.
**User beliefs and estimates:** 12 gated events per year; 80 to 90 guests at MAD Settings; 3 to 5 build days; 1 to 2 hours setup per event; average ticket about NGN 20,000.
**Unknowns:** Fakes per event (Scan log over three events); Apps Script latency (time during build); founder day value (not supplied, left symbolic).

---

## 3. ECONOMIC ARCHITECTURE

**Primary archetype:** Internal investment or operating improvement
**Secondary streams:** None
**Economic unit:** One gated event
**Beneficiary:** Gate operative and founders
**Payer, funder, or investment owner:** Founders
**Money or authorization event:** Decision to spend build days; per-event rehearsal go/no-go
**Delivery unit:** Check-in at one event
**Governing constraint:** Founder build time before 26 Oct, and scanner reliability on the real phone
**Sales or approval motion:** Internal adoption only

---

## 4. UNIT ECONOMICS OR INTERNAL ROI

| Input | Base value or range | Unit and period | Evidence class | Source | Confidence |
|---|---|---|---|---|---|
| Gated events | 12 | per year | User estimate | User 2026-10-17 | Medium |
| Guests per event | 80 to 90 | per event | User estimate | User 2026-10-17 | Medium |
| Average ticket | about NGN 20,000 | per ticket | User estimate | Derived from repo prices | Medium |
| Build effort | 3 to 5 | founder days once | User estimate | Stage 2 | Medium |
| Per-event setup | 1 to 2 | hours | User estimate | Stage 3 | Low |
| Cash cost | about NGN 0 | per year | Observed | Existing services | High |
| Fakes caught | 0 / 1 / 3 | per event | Unknown | Scenario | Low |

**Formula set and calculations:** Revenue protected per year = fakes per event x 12 x NGN 20,000. Time cost after build = 12 x 1 to 2 hours = 12 to 24 hours per year. Founder time treated as an explicit founder subsidy.

| Output | Downside | Base | Upside |
|---:|---:|---:|---:|
| Contribution or annual net benefit (cash) | NGN 0 | about NGN 240,000 | about NGN 720,000 |
| Contribution margin or ROI | Non-cash only (arrival list, cap) | Positive if one catch per event outweighs founder time | Strongly positive |
| Break-even or payback | Never in cash; non-cash value immediate | Founder-time judgment, about one catch per event | Within the first few events |
| Cash before break-even | about NGN 0 | about NGN 0 | about NGN 0 |
| Governing scale or capacity requirement | 5 build days before 26 Oct | Same | Same |

**Most sensitive variable:** Fakes caught per event; threshold about one per event.
**Structural or testable weakness:** Testable. The downside costs time, not cash, and retains the arrival list.

---

## 5. PRICE OR INVESTMENT HYPOTHESIS

**Lever and recommendation:** Investment ceiling: 5 founder days for v1, no new paid services.
**Terms:** v1 scope fixed at Stage 2's five components; cut deferred extras before safety rules if the ceiling is approached.
**Economic floor:** NGN 0 cash; build complete by 26 Oct.
**Market reference:** Platform scanners need a ticketing switch; Sheets add-on paid outside student events (price unverified).
**Value or willingness ceiling:** Unknown until catches are observed; arrival-list value present regardless.
**Confidence:** Medium. Cost is well bounded; benefit magnitude is not.
**What would move it:** Scan log across three events.

Stage 4 may validate or revise an external offer price against the actual package and anchored value. It must preserve the floor and evidence limitations recorded here.

---

## 6. FIRST CHANNEL OR ADOPTION TEST

**Target, payer, and decision maker:** Gate operative; founders decide.
**Channel or adoption path:** After-dark rehearsal 28 Oct on the real phone, then live use 31 Oct.
**Access advantage:** Internal; the founders control the gate.
**Proposition:** A verified green, orange or red in seconds for every guest.
**Sequence and expected ranges:** Rehearsal with 10 test codes covering all four outcomes; live use with 80 to 90 guests.
**Time and cash cap:** 5 build days; NGN 0.
**Primary signal:** Share of arriving guests checked in through the scanner.
**Success threshold:** Rehearsal: all four outcomes correct within 3 seconds and typed entry works. Live: at least 95 percent of arriving guests checked in through the scanner, no queue over about 10 minutes.
**Failure threshold:** Rehearsal miss on any outcome or over 3 seconds (use the Lookup tab on the night); live below 95 percent or queue over 10 minutes (fix before the next event).
**Inconclusive condition:** Rehearsal passes but live use is partial because of an external outage; repeat at the next event.
**Evidence capture:** `Checked In?` column, Scan log tab, live count.
**Decision table:** After three events, catches present: keep investing. Zero catches: keep for the arrival list, freeze features. Live failure: fix before the next event.

---

## 7. OFFER OR ADOPTION INPUTS

**What the payer currently spends or authorizes:** Founder time only; NGN 0 cash (observed).
**Cost or consequence of the status quo:** No verification and no arrival record; revenue loss unquantified because unobserved.
**Urgency and why now:** MAD Settings on 31 Oct 2026; 12 events per year planned (user estimate).
**Observed objections in order:** Unavailable (no buyer conversations; internal tool).
**Known delivery and capacity constraints:** One operative; phone undecided; Apps Script redeploy is manual; 26 Oct build cutoff.
**Available source material:** Camp Night debrief; repo code; MAD Settings sheet.
**Regulated or high-consequence category:** No (guest personal data handled behind a password).
**Claims this evidence permits:** It verifies codes against the live list and records arrivals; it costs no new money.
**Claims this evidence does not permit:** That it stops fraud that is known to occur; any figure for money saved.

This is an internal adoption case. No external offer exists.

---

## 8. ADAPTED CANVAS SUMMARY

| Box | Content | Evidence class |
|---|---|---|
| Problem | No real gate check; no arrival record | Observed |
| Users and adoption owner | Gate operative; founders | Observed |
| UVP | Verified yes or no in seconds plus arrival record | User belief (Medium) |
| Solution | Five components on existing site and sheet | Confirmed (Stage 2) |
| Adoption path | Rehearsal then live use at each event | Plan |
| Benefit mechanism | Revenue protected; cap enforced; arrival list | Mechanism observed; magnitude unknown |
| Cost structure | 3 to 5 days once; 1 to 2 hours per event; NGN 0 cash | Estimate; cash observed |
| Key metrics | Scanner check-in share; queue wait; rejected scans | Plan |

---

## 9. RISKS AND DECISION

| Priority | Risk or unknown | Consequence | Leading indicator and threshold | Mitigation or test |
|---|---|---|---|---|
| 1 | Scanner fails on the night | Gate queue | Rehearsal miss or over 3 seconds | Rehearsal; Lookup tab fallback |
| 2 | Build slips past 26 Oct | No back-fill or rehearsal | Day 5 incomplete | 5-day ceiling |
| 3 | Apps Script slow | Slow line | Over 3 seconds per check | Time during build |
| 4 | Operative does not adopt | No protection, no data | Under 95 percent scanned | Brief operative; typed fallback |
| 5 | Zero catches | Hard ROI nil | Zero across three events | Keep for arrival list; freeze features |

**Decision reasoning:** No cash at risk and a bounded time cost, with a guaranteed non-cash return. The hard benefit is unproven and the tool must work on the night, so proceed within the 5-day ceiling and let the rehearsal decide its use at MAD Settings.

---

## 10. MARKET EVIDENCE AND SOURCES

| # | Finding | Source URL or origin | Date checked | Model input affected | Limitation |
|---|---|---|---|---|---|
| 1 | Platform scanners bundle ticketing | Stage 1 sources 1 to 3 | 2026-10-14 | Alternative excluded | Current listings |
| 2 | Sheets QR add-on paid outside student events | Stage 1 source 4 | 2026-10-14 | Build over borrow | Price unverified |
| 3 | Ticket prices and tent caps | `lib/events/mad-settings.ts`, `lib/events/camp-night.ts` | 2026-10-17 | Revenue protected per catch | Early-bird prices only |

**Still unverified:** Founder day value (not supplied); Sheets add-on price; Apps Script latency.

---

## 11. STAGE 3 REVISIONS

No revisions yet.

---

## 12. NEXT MODULE OR ACTION

**Immediate action:** Continue the loop to Stage 4 as a brief internal pass, then Stage 7 and Stage 8, and start the build within the 5-day ceiling.
**External offer status:** Not applicable to internal model. This packet is an investment and adoption case.
**What Stage 4 must preserve:** No external payer; NGN 0 cash floor; 5-day ceiling; claims limited to verification and arrival recording, not fraud prevented.
**One number or assumption to verify first:** Apps Script lookup-plus-write round trip under 3 seconds.
