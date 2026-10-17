# Business Plan Summary
## Business Model and Economics Decision Brief | USL Academy

**Schema version:** 2
**Status:** complete
**Business / initiative:** Event QR Check-in (internal tool, Camping Nigeria)
**Date:** 2026-10-17

---

## EXECUTIVE DECISION

**Decision:** Proceed with caution
**Why:** The tool costs no new money (existing Vercel, Resend and Google) and a bounded amount of founder time: 3 to 5 days once, plus about 1 to 2 hours per event. Even in the downside case of zero fakes ever caught, it yields a true arrival list and enforces the tent cap at the gate, so the cash downside is nil. The upside, revenue protected from fake or reused codes, is entirely unobserved. The caution is operational: it must work on the night, which the 28 Oct rehearsal tests.
**Most sensitive variable:** Fakes or reused codes caught per event. Break-even is roughly one catch per event against the founder-time cost.
**Immediate action:** Proceed to build within a 5-day ceiling; rehearse after dark on 28 Oct.

---

## EVIDENCE BASIS

**User, payer, and budget owner:** User is the gate operative; payer and budget owner are the founders (time, not cash); no other approver.
**Stage 1 evidence:** D 3/5 (Medium), F 4/5 (High), V 3/5 as ROI (Medium). Flag Caution. Buyer conversations 0, deferred by user 2026-10-15. No revisions.
**Stage 2 readiness:** Value-first; five-component release on the existing site and sheet.
**Observed evidence:** Ticket prices and tent caps (repo); format-only gate check at Camp Night with no observed harm; existing sheet has `Checked In?` column and lookup.
**Researched evidence:** Check-in is a standard category bundled with ticketing platforms; Sheets QR add-on paid outside student events (Stage 1 sources).
**User estimates:** 12 paid gated events per year; 80 to 90 guests at MAD Settings; 3 to 5 build days; 1 to 2 hours per new event.
**Critical unknowns:** Fakes per event (resolved by the Scan log over three events); Apps Script latency (timed during build).

---

## PROBLEM, VALUE, AND SOLUTION

**Problem or desired gain:** Gate codes are checked only by format, so fakes or reused codes would pass and no arrival record exists.
**UVP and confidence:** One-second yes or no for every guest by checking each scanned or typed code against the live sign-up records and marking it arrived. Medium.
**Alternatives:** Glance check; printed list; Sheets QR add-on; switching ticketing platform.
**Solution type and release scope:** Internal web tool; five components (QR on page and email, back-fill send, password-protected scanner with typed fallback, server check with green/orange/red and arrival write, live count plus Scan log).
**Why now:** MAD Settings on 31 Oct 2026 is larger and more public than Camp Night (user belief), and 12 events per year are planned (user estimate).

---

## ECONOMIC ARCHITECTURE

**Primary archetype:** Internal investment or operating improvement
**Economic unit:** One gated event
**Beneficiary:** Gate operative (certainty), founders (revenue, cap, data)
**Payer, funder, or investment owner:** The founders
**Money or authorization event:** Founder decision to spend build days; per-event go/no-go at rehearsal
**Delivery unit and governing constraint:** Founder build time before 26 Oct; scanner reliability on the real phone
**Sales or approval motion:** None external; internal adoption at the gate

---

## ADAPTED LEAN CANVAS

| Box | Content | Evidence class |
|---|---|---|
| Problem or desired gain | No real check at the gate; no arrival record | Observed |
| Affected users and adoption owner | Gate operative; founders own adoption | Observed |
| UVP | One-second verified yes or no plus arrival record | User belief (Medium) |
| Solution | Five-component release on existing site and sheet | Confirmed in Stage 2 |
| Adoption path | Rehearsal 28 Oct, then live use at MAD Settings and each later event | Plan |
| Benefit mechanism | Revenue protected per fake caught; tent cap enforced; arrival list | Mechanism observed; magnitude unknown |
| Cost, cash, and capacity | 3 to 5 founder days once; 1 to 2 hours per event; about NGN 0 cash | User estimate; cash observed |
| Key metrics | Share of guests checked in via scanner; queue wait; rejected scans in Scan log | Plan |
| Defensibility | Not applicable (internal); fit with own codes and emails | Observed |

---

## INPUT LEDGER

| Input | Base value or range | Unit and period | Evidence class | Source | Confidence | What would verify it |
|---|---|---|---|---|---|---|
| Ticket prices | NGN 10,000 / 30,000 / 35,000 | per ticket, MAD Settings | Observed | `lib/events/mad-settings.ts` | High | |
| Average ticket used in model | about NGN 20,000 | per ticket | User estimate (blend across events) | Derived from MAD and Camp Night prices | Medium | Actual ticket mix after events |
| Gated events | 12 | per year | User estimate | User, 2026-10-17 | Medium | Event calendar |
| Guests per event | 80 to 90 | per event | User estimate | User, 2026-10-17 | Medium | Sheet row count |
| Build effort | 3 to 5 | founder days, once | User estimate | Stage 2 | Medium | Actual build time |
| Per-event setup | 1 to 2 | hours per event | User estimate | Stage 3 | Low | Time the second event's setup |
| Cash cost | about NGN 0 | per year | Observed | Existing services | High | Hosting and email invoices |
| Fakes caught | 0 / 1 / 3 | per event | Unknown | Scenario only | Low | Scan log over three events |

---

## UNIT ECONOMICS OR INTERNAL ROI

**Formula set used:** Internal investment.
**Calculations:**
- Annual guest checks: `12 events x 85 guests = about 1,020 per year`.
- Annual revenue protected: `fakes per event x 12 events x NGN 20,000`.
- Annual time cost after build: `12 events x 1 to 2 hours = 12 to 24 hours per year`.
- Cash before break-even: about NGN 0. Founder time is treated as an explicit founder subsidy, not cash.

| Output | Downside | Base | Upside | Interpretation |
|---|---:|---:|---:|---|
| Fakes caught per event | 0 | 1 | 3 | Scenario, unobserved |
| Revenue protected per year | NGN 0 | about NGN 240,000 | about NGN 720,000 | Hard benefit only if fakes exist |
| Non-cash benefit | Arrival list, cap enforced | Same | Same | Present in every case |
| Cash cost per year | about NGN 0 | about NGN 0 | about NGN 0 | Observed |
| Founder time | 3 to 5 days once plus 12 to 24 hours per year | Same | Same | User estimate |

**Break-even:** Worth it if one catch per event (about NGN 240,000 per year) exceeds the value the founders place on 3 to 5 days once plus about 2 hours per event. Founder day value not supplied; left symbolic.
**Structural or testable:** The downside is testable, not structural: zero catches leaves a positive non-cash benefit at no cash cost.

---

## PRICE, FUNDING, TAKE RATE, OR INVESTMENT HYPOTHESIS

**Recommendation and terms:** Investment ceiling of 5 founder days for v1 and no new paid services. If the build exceeds 5 days, cut deferred extras, never the safety rules.
**Economic floor:** NGN 0 cash; time bounded by the 26 Oct build-complete date.
**Market reference:** Platform scanners require moving ticketing; the Sheets add-on is paid per ticket bundle outside student events (price unverified).
**Value or willingness ceiling:** Unknown until the Scan log shows catches; non-cash value present regardless.
**What would move it:** Catches across three events (invest more if present; freeze features if zero).
**Status:** Hypothesis until internal adoption at MAD Settings.

---

## FIRST CHANNEL OR ADOPTION TEST

**Target and decision maker:** Gate operative; founders decide.
**Channel or path:** After-dark rehearsal 28 Oct on the real phone, then live use 31 Oct.
**Proposition:** Every guest gets a verified green, orange or red in seconds.
**Sequence and expected ranges:** Rehearsal (10 test codes, all four outcomes) then live use (80 to 90 guests).
**Time and cash cap:** 5 build days; NGN 0.
**Success / failure / inconclusive:** Rehearsal pass = all four outcomes correct within 3 seconds and typed entry works, so it is used on the 31st; fail = Lookup tab on the night. Live success = at least 95 percent of arriving guests checked in through the scanner and no queue over about 10 minutes; below that is a failure to fix before the next event.
**Evidence captured:** `Checked In?` column, Scan log tab, live count.
**Decision after result:** After three events: catches present, keep investing; zero catches, keep for the arrival list and stop adding features.

---

## RISKS

| Priority | Risk | Consequence | Leading indicator and threshold | Mitigation or test |
|---|---|---|---|---|
| 1 | Scanner fails on the night | Queue at the gate | Rehearsal miss on any outcome or over 3 seconds | Rehearsal 28 Oct; Lookup tab fallback |
| 2 | Build slips past 26 Oct | No time for back-fill or rehearsal | Day 5 of build not complete | 5-day ceiling; cut deferred items |
| 3 | Apps Script slow | Slow line | Over 3 seconds per check | Time during build |
| 4 | Operative does not use it | No data, no protection | Under 95 percent of guests scanned | Brief the operative; typed fallback |
| 5 | Zero catches ever | Hard ROI nil | Zero across three events | Accept arrival-list value; freeze features |

---

## NEXT 30 DAYS

1. Complete Stages 4 to 8 quickly (internal; brief passes) and start the build. Done when the build sequence exists.
2. Build within 5 days; done 26 Oct with a test sign-up scanned green.
3. Back-fill QR email sent 27 Oct; done when every existing row is marked sent.
4. After-dark rehearsal 28 Oct; done with a use / do-not-use decision recorded.
5. Use at MAD Settings 31 Oct; review the Scan log and arrival rate by 3 Nov.

---

## SCOPE NOTE

This is an evidence-labeled business-model decision brief, not an audited forecast or a complete investor business plan. Unknowns and estimates remain visible by design.
