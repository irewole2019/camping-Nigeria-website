# Solution and MVP Transfer Packet
## Stage 2 Output | USL Academy

**Schema version:** 2
**Status:** complete
**Idea / Product:** Event QR Check-in (working name): personal QR per sign-up plus a private web scanner that verifies against the live sign-up sheet and records arrival. First use: MAD Settings, 31 Oct 2026.
**Session date:** 2026-10-16
**Route:** value-first

---

## 1. UPSTREAM EVIDENCE SNAPSHOT

**Stage 1 schema read:** 3
**Latest upstream revision:** none (Validation Revisions empty). Conversation status set to deferred by user on 2026-10-15.
**Why Stage 2 required review:** not applicable

**User persona:** The single Camping Nigeria ticketing operative at the event gate of a private venue (Brooks Garden, Abuja), checking guests as they arrive, mostly in the evening, against a paid list of 60 to 100+ sign-ups, and for MAD Settings distinguishing sleepover (tent) from attendance-only tickets.
**Persona confidence:** High. Founders ran this gate at Camp Night, 26 Sept 2026.
**Secondary user:** The signee, who carries the QR; stake is fast, argument-free entry.
**Payer:** Camping Nigeria founders (internal), who are also the builder.
**Payer confidence and budget authority:** High; founders decide alone, no other approver.
**Payer proposition:** Every paid seat and every one of the 80 tents goes to the person who paid for it, plus a true arrival list after every event, built on the sign-up system already running at no per-ticket cost.

**Problem statement:** Camping Nigeria's gate operative cannot confirm that an arriving guest has actually paid, or record who arrived, because sign-up codes are checked only by glancing at their format, with no lookup against the paid list and no record of which codes have been admitted.
**Problem source, user side:** Direct experience; observed harm none. Problem confidence Medium.
**Problem source, payer side:** Same as user.

**Desirability rubric used:** Push. The operative is escaping an uncheckable gate.
**Caps applied:** Regulatory gate checked, did not fire. No vantage cap.
**Cap status and affected dimension:** None.
**Cap resolution evidence required:** Not applicable.

| BBM dimension | Score | Confidence | Evidence basis | What resolves `?` or Low confidence |
|---|---|---|---|---|
| Desirability | 3/5 | Medium | Direct experience of a format-only check; fix named in the Camp Night debrief; no observed harm | Invalid, duplicate and unknown-code scans plus arrival rate at MAD Settings |
| Feasibility | 4/5 | High | Codes, Sheet, Apps Script, Resend and Upstash exist; QR and browser scanning well-trodden (researched) | |
| Viability (as ROI) | 3/5 | Medium | Internal tool: protects ticket revenue and 80-tent cap, yields attendance data, reusable | Count of rejected scans at MAD Settings |

**Stage 1 flag and biggest risk:** Caution. The 17-day deadline combined with modest, unobserved value; a half-working scanner is worse than the glance check.
**Evidence base:** Founder-observed yes; live research yes (2026-10-14); buyer conversations 0; sample none; status deferred by user on 2026-10-15; last revised 2026-10-15.
**UVP and confidence:** For Camping Nigeria's gate operative, who cannot tell whether an arriving guest actually paid or keep track of who has come in, Event QR Check-in gives a one-second yes or no for every guest by checking each scanned or typed code against the live sign-up records and marking it arrived on the spot, so a fake code fails and a used code shows "already in". Confidence Medium.
**Alternatives:** Glance at code format (current); printed list ticked by hand; Google Sheets QR check-in add-on; moving ticketing to a platform (GoDashTix, Ayatickets).
**Constraints and dependencies:** Budget not disclosed (target near-zero external cost). Hard deadline 31 Oct 2026. Founder builds with Claude Code in this Next.js repo. One operative; phone (Android or iPhone) undecided, so both must work. Reliable mobile data at venue. Apps Script redeploy is a manual step in the owner's Google account. Privacy: scanner shows guest names, so access-controlled.
**Upstream open questions retained:** Back-fill QRs for sign-ups since 13 Oct; source of truth for lookup and arrival; operative access control; iOS Safari camera on the real device; unobserved value; future scope (tent ID, ticket types, other events).

---

## 2. SOLUTION TYPE AND ACTORS

**Type:** Digital product (internal web tool inside campingnigeria.com)
**Lead component:** Not applicable
**Supporting components:** Not applicable
**Who experiences value:** The gate operative (primary); the signee (fast entry).
**Who decides or pays:** The founders.
**Type-specific consequence for scope:** Responsive web, not a native app. Access control, privacy of guest names, failure recovery (no data, camera refused) and an audit trail of rejected scans are in scope because the use case requires them, even though they are not visible in a demo.

**Existing system facts (observed in the repo, 2026-10-15):**
- `docs/mad-settings/apps-script.gs` already has a `Checked In?` column (currently "No", set by hand), a `Tent ID` column, a `Lookup` tab, `doGet ?code=` returning the full row as JSON, and a `LockService` pattern on writes.
- The Apps Script deployment is "Access: Anyone", so the webhook URL must stay server-side; the scanner talks to the site, the site talks to the script.
- `/events/mad-settings/registered` shows the code from the URL and validates its shape with `isValidSignupCode`.
- The customer confirmation email (`app/api/mad-settings-signup/route.ts`) shows the code as text; no QR yet.

---

## 3. ASSUMPTION MAP

| # | Category | Assumption | Evidence class and source | Confidence | Impact if wrong | Cheapest credible learning action |
|---|---|---|---|---|---|---|
| 1 | Feasibility / usability | The web scanner reads QRs quickly on the operative's real phone, outdoors, after dark | Researched (html5-qrcode supports iOS Safari 15.1+, HTTPS) | Medium | High: queue at the gate | Rehearsal: 10 test codes on the real phone, outside, after dark |
| 2 | Feasibility | Apps Script lookup plus check-in write returns in about 1 to 3 seconds | User belief / unknown | Medium | Medium: slow line | Time 20 test check-ins during the build and rehearsal |
| 3 | Usability | Guests will open their email or confirmation page and show the QR | User belief | Medium | Low: typed entry covers it | Covered by typed-code fallback |
| 4 | Demand / viability | Fake, forwarded or reused codes actually appear | Unknown | Low | Low: arrival list still has value | Scan log at MAD Settings |
| 5 | Feasibility | The founder can build it in 3 to 5 days before 26 Oct | User belief, supported by existing infrastructure | High | High: miss the event | Keep scope to the five components |

**Highest-ranked assumption:** The scanner works fast and reliably on the real phone in real gate conditions (#1), which is a does-it-work question answered by rehearsal, not a should-it-exist question.

---

## 4. ORIENTATION DECISION

**Route:** value-first
**Reason:** No assumption can make the solution pointless: even with zero fakes the arrival list has value. The top risks (#1, #2) are operational and are resolved by a pre-event rehearsal with a safe fallback (the existing Lookup tab), not by a separate experiment. The deadline reduced scope; it was not used as evidence.
**What would change the route:** A failed rehearsal on 28 Oct means the scanner is not used at MAD Settings (fallback to the Lookup tab) and the release is re-tested before the next event.
**Desirability orientation consequence:** Push. Value moment is observable relief at the gate: a definitive green, orange or red in seconds, and an arrival time written to the sheet. Evidence: the scan log and arrival count after the event.
**Active-cap routing consequence:** None.

---

## 5A. VALIDATION EXPERIMENT

Not applicable: value-first route.

---

## 5B. VALUE-FIRST RELEASE SCOPE

| # | Required user outcome | Component or capability | Why required | Acceptance signal | Dependencies | Evidence for inclusion |
|---|---|---|---|---|---|---|
| 1 | Every new signee holds a personal QR | QR on the confirmation page and in the confirmation email, encoding code, name and ticket type | No QR, nothing to scan | A test sign-up's QR scans from both the email and the page | QR image served from the site (email clients block embedded images) | Confirmed by user; Stage 1 solution direction |
| 2 | Signees from before the feature also hold a QR | One-press send of a QR email to every existing sheet row, marking each row as sent | Everyone signed up since 13 Oct would arrive without one | Every existing row is marked sent; spot-check inboxes | Component 1; founder presses once, after checking a test email | Confirmed by user; Stage 1 open question |
| 3 | Only the operative can see guest details | Password-protected scanner page; camera scan plus typed code entry | Lead capability; names are personal data | Wrong password gets nothing; correct one opens the camera | Server-side secret; HTTPS | Confirmed by user; Stage 1 privacy constraint |
| 4 | A definitive answer and a recorded arrival per guest | Server verifies the code against the sheet and shows: green (name, ticket, tent yes/no), orange (already checked in at time), red (not found), red (not marked paid); green writes the arrival time to `Checked In?` under a lock | Without it, the QR reproduces the glance check | All four outcomes appear correctly on the real phone at rehearsal | New Apps Script check-in action, redeployed by the owner | Root cause in Stage 1 |
| 5 | Evidence of whether the tool earns its place | Live "N of M checked in" count; every orange and red scan appended to a `Scan log` tab | Stage 1 named this as what resolves Desirability and ROI | After the event, the log shows every rejected scan with time and code | Component 4 | Stage 1 resolution conditions |

**Enabling requirements:**
- Typed entry runs through exactly the same server check as a scan.
- The scanner extracts only the code from the QR and never trusts the name or ticket inside it.
- The Apps Script URL stays server-side; the scanner calls the site's API, which checks the password session.
- Rate limiting and input validation on the new API route, consistent with the site's existing defensive stack.
- Red means "a founder steps in", never automatic refusal.
- The existing Lookup tab stays untouched as the fallback.
- No undo button; a wrong check-in is corrected by hand in the sheet.

---

## 6. USER, PAYER, OR DELIVERY FLOW

| Step | Actor | Action | Input | Output or state change | Friction or failure | Recovery |
|---|---|---|---|---|---|---|
| 1 | Signee | Pays offline, signs up | Form | Sheet row; code plus QR on confirmation page and in email | Email lands in spam | QR also on the confirmation page; operative can type the code |
| 2 | Founder | Sends QR email to pre-existing sign-ups, once, after checking a test email | One press | Each row marked sent | Mistyped email address | Guest gives their name at the gate; operative uses the Lookup tab |
| 3 | Operative | Opens scanner, enters password, allows camera | Password | Camera live | Permission refused, wrong iPhone browser | Use Safari, or type codes |
| 4 | Signee | Shows QR or code | Phone screen or printout | | Dim or cracked screen | Typed entry |
| 5 | Operative | Scans or types | Code | Green, orange or red within about 1 to 3 seconds | Mobile data drops | "Cannot reach the list, try again"; persistent failure falls back to the Lookup tab |
| 6 | Operative | **Green: admits guest, hands sleepover guests their tent** | | **Arrival time written to `Checked In?`** | Paying guest shows red (data error) | Founder decides on the spot |
| 7 | Founder | Handles orange or red | | Entry in `Scan log` | | |
| 8 | Founder | After the event, reviews the sheet | | Arrival list, no-shows, rejected scans | | |

**Core value moment:** Step 6. Evidence: arrival time in the sheet and the live count.
**Payer decision moment:** Rehearsal on 28 Oct (use / do not use at MAD Settings); post-event review of the scan log (keep investing / value is the arrival list only).
**Honest ending:** Repeat. Reused at every future event with that event's sheet.

---

## 7. SCOPE BOUNDARIES

**In this release or test:** Components 1 to 5 and the enabling requirements above.

**Later, with a trigger:**

| Item | Why deferred | Trigger that makes it relevant |
|---|---|---|
| Tent ID entry at check-in (Camp Night debrief) | Adds a step at the gate | Check-in runs smoothly at one event and tent damage or mix-ups are reported |
| Multiple simultaneous scanners | One operative this event | An event exceeds about 150 guests or the gate queue exceeds 10 minutes |
| Undo check-in | Rare; sheet fixes it | More than two mistaken check-ins at one event |
| Scanner support for other events (Camp Night and future) | MAD Settings is the only upcoming event | Next event is added to the registry in `lib/events/index.ts` |
| Offline scanning | Venue has reliable data | A venue without reliable signal is booked |

**Explicitly excluded:** Native app-store app (review time; web suffices). Moving ticketing to a platform (mid-sale switch). Taking payment in the scanner (payment stays offline before sign-up).
**Still deliberately unresolved:** Which phone the operative uses (resolved by the rehearsal on the chosen device). Exact QR payload format and the back-fill mechanism (Stage 7 decides).

---

## 8. APPROACH AND MILESTONE

**Recommended approach:** Extend the existing site and MAD Settings Google Sheet rather than adding a new database: a new Apps Script check-in action with a lock and a Scan log tab; a password-protected scanner page and API route in the Next.js app using a browser QR library; QR images served from the site for the email and confirmation page; a one-press back-fill send through the existing mail helper.
**Estimate range:** Elapsed 10 days (16 to 26 Oct) for build and self-test. Founder effort 3 to 5 days with Claude Code. External cost about ₦0 (existing Vercel, Resend, Google). Outside waiting: Apps Script redeploy by the owner; rehearsal requires darkness and the real phone.
**Estimate assumptions:** Apps Script change and redeploy go smoothly; the founder can redeploy in their Google account; iPhone Safari camera behaves; scope stays at five components.
**Dates:** 26 Oct build complete and self-tested; 27 Oct back-fill send; 28 Oct after-dark rehearsal and use / do-not-use decision; 31 Oct MAD Settings.
**First milestone:** A test sign-up's emailed QR, scanned on the operative's phone, shows green and the sheet records the arrival time.
**Definition of MVP complete:** At rehearsal on the real phone, all four outcomes appear correctly within 3 seconds, typed entry works, and the Scan log records every orange and red.

---

## 9. EVIDENCE AND SOURCES

| # | Finding | Evidence class | Source or origin | Inherited or new | Date checked | Decision affected | Limitation |
|---|---|---|---|---|---|---|---|
| 1 | Check-in by QR is a standard category, bundled with platform ticket sales | Researched | Stage 1 sources 1 to 3 (GoDashTix, Ayatickets, Ticketscene, Ticketscloud) | Inherited | 2026-10-14 | Platform switch excluded | Current listings only |
| 2 | Sheets QR add-on exists, paid outside student events, own codes | Researched | Stage 1 source 4 | Inherited | 2026-10-14 | Build over borrow | Pricing may change |
| 3 | html5-qrcode supports iOS Safari 15.1+, needs HTTPS, has photo fallback | Researched | Stage 1 source 6 | Inherited | 2026-10-14 | Web scanner, Safari on iPhone | No current iOS bug reports found |
| 4 | Sheet already has `Checked In?`, `Tent ID`, Lookup tab, code lookup and write lock | Observed | `docs/mad-settings/apps-script.gs` | New | 2026-10-15 | Extend the sheet rather than add a database | Repo state on that date |
| 5 | Apps Script deployment is "Access: Anyone" | Observed | `docs/mad-settings/apps-script.gs` header | New | 2026-10-15 | Script URL stays server-side | |
| 6 | Email clients commonly block embedded images | User belief / model knowledge | Not verified this session | New | | QR image served by URL | Unverified |

**Still unverified:** Apps Script round-trip latency (time it during build); iPhone camera on the actual device (rehearsal); embedded-image blocking in Gmail and Outlook (check with a test email).

---

## 10. OPEN RISKS

| # | Risk or unknown | Priority | Consequence | Resolution action |
|---|---|---|---|---|
| 1 | Scanner unreliable on the real phone in gate conditions | High | Queue at the gate | 28 Oct after-dark rehearsal; fallback to the Lookup tab |
| 2 | Build slips past 26 Oct | High | No time to back-fill or rehearse | Hold scope at five components; defer anything else |
| 3 | Apps Script slow or redeploy issue | Medium | Slow line, or check-in cannot write | Time it during build; redeploy early |
| 4 | Back-fill email reaches wrong or dead addresses | Medium | Guest arrives without a QR | Name lookup in the Lookup tab at the gate |
| 5 | Value never observed (zero rejected scans) | Low | ROI rests on the arrival list alone | Review the scan log after two events |

---

## 11. STAGE 2 REVISIONS

Revision entries are appended at the end of this file (first: 2026-10-17, back-fill deferred).

---

## 12. NEXT ACTION

**Immediate action:** Proceed to Stage 3 (`/business-model`).
**Stage 3 readiness:** Ready. Internal tool: Stage 3 should model return on investment (founder days versus protected revenue, tent-cap enforcement and attendance data), not external pricing.
**One decision Stage 3 must preserve:** Scope is the five components only, on the existing site and sheet, at near-zero external cost, to be live and rehearsed before 31 Oct 2026.

**Date:** 2026-10-17 | **Evidence:** User: no real sign-ups yet (one founder test row); sales open 27 Oct, after the 26 Oct go-live. | **Original value:** Component 2, back-fill QR email for sign-ups since 13 Oct, in this release. | **Revised value:** Component 2 deferred; trigger: a real sign-up exists before the Gate pass email ships. Testing uses a separate TEST deployment on the live sheet instead of a sheet copy.
**Scope of revision:** Section 5B row 2, Section 7, Section 8 dates (27 Oct becomes "sales open"). | **Downstream packets requiring review:** 7-prd.md (revised to v1.1 the same day).
