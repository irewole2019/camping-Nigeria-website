# Product Requirements Document: Padi Check
## Stage 7 Output | USL Academy

**Product Name:** Padi Check (internal event check-in tool) with the guest-facing Gate pass
**Version:** 1.1 (2026-10-17: R-009 back-fill deferred; R-001 actions reduced to checkin, stats, roster)
**Date:** 2026-10-17
**Prepared by:** Camping Nigeria
**Technical Level:** Code
**Builder:** Solo founder with Claude Code, in this repository
**Stage 2 Route:** value-first
**Build Decision:** Build authorised
**Evidence Posture:** System facts observed in the repo; iOS Safari camera support researched; volunteer and guest behaviour, Apps Script latency and fake-code frequency are user belief or unknown and are measured in v1 (Section 3).
**Desirability rubric:** Push. Value is relief at the gate: a definitive answer and a recorded arrival.
**Caps applied and status:** None. Regulatory gate checked at Stage 1 and did not fire.

---

## 1. PRODUCT OVERVIEW AND BUILD AUTHORITY

**What it is:** A private web scanner a volunteer uses at the gate of a Camping Nigeria event to check each guest's Gate pass against the live sign-up sheet and record their arrival, plus the QR Gate pass every guest receives.

**Problem it solves:** Camping Nigeria's gate operative cannot confirm that an arriving guest has actually paid, or record who arrived, because sign-up codes are checked only by glancing at their format, with no lookup against the paid list and no record of which codes have been admitted.

**Primary outcome:** For every guest, a one-to-three-second green, orange or red answer, and an arrival time written to the event sheet.

**Version scope:** v1 covers MAD Settings (31 Oct 2026) only. See Section 10.

### Build-Authority Reconciliation

| ID | Requirement or obligation | Source | Actor outcome | Evidence and confidence | Cap status | Authority | Resolution, measurement, or reason |
|---|---|---|---|---|---|---|---|
| R-001 | Apps Script: shared-secret guard, `checkin`, `stats`, `roster` actions, Scan log tab | Stage 2 C4, C5; Stage 4 Section 8 | Every surface can verify and record | Observed (existing script); latency unknown | None | confirmed-build | Build first; time it (NFR-PERF) |
| R-002 | Server verification API for scans and typed codes | Stage 2 C4 | Volunteer gets a trusted answer | Observed design | None | confirmed-build | |
| R-003 | Volunteer password session | Stage 2 C3; Stage 4 | Only the volunteer sees guest data | Observed need | None | confirmed-build | |
| R-004 | Scanner page: camera plus Type a code | Stage 2 C3; Stage 6 Surface 5 | Volunteer can check any guest | Researched (html5-qrcode iOS 15.1+) | None | confirmed-build | Rehearsal 28 Oct |
| R-005 | Result screens (six states), Call Toyosi, vibration, minimal data | Stages 4, 5, 6 | Volunteer acts without judgement calls | User belief (volunteer trust) | None | confirmed-build | Rehearsal 28 Oct |
| R-006 | Live count "[N] of [M] in" | Stage 2 C5 | Volunteer and founders see progress | Observed design | None | confirmed-build | |
| R-007 | Gate pass QR image (signed URL) and on-page QR | Stage 2 C1; Stage 6 Surfaces 1, 2 | Guest holds a scannable pass | Observed design | None | confirmed-build | |
| R-008 | Gate pass in confirmation page and confirmation email | Stage 2 C1; Stage 6 Surfaces 1, 2 | New sign-ups get the pass | Observed design | None | confirmed-build | |
| R-009 | Admin back-fill page (Stage 2 C2; Stage 6 Surface 3) | Stage 2 C2 | Earlier sign-ups get the pass | Observed: no real sign-ups yet; sales open 27 Oct, after go-live on 26 Oct | None | deferred (D-006) | Revised 2026-10-17. Trigger: any real sign-up exists before the Gate pass email ships |
| R-010 | Gate card print page | Stage 4; Stage 6 Surface 6 | Volunteer knows each colour | Observed design | None | confirmed-build | |
| R-011 | Printed guest list for the volunteer: name, code, ticket only | Stage 4 commitment; user 2026-10-17 | "Your name still gets you in" without exposing phone or email | User decision | None | confirmed-build | Replaces giving the volunteer the full sheet |
| R-012 | Padi Check hidden from search and public navigation | Stage 6 | No public exposure | Observed need | None | confirmed-build | |
| R-013 | Measurement: arrival rate, scanner share, rejected scans | Stage 1, 3 | Founders learn whether it earns its place | Unknown magnitude | None | confirmed-build | Section 3 thresholds; no feature flag needed |
| D-001 | Tent ID at check-in | Stage 2 | | | | deferred | One smooth event and tent mix-ups reported |
| D-002 | Multiple scanners | Stage 2 | | | | deferred | Over 150 guests or queue over 10 minutes |
| D-003 | Undo check-in | Stage 2 | | | | deferred | More than two mistaken check-ins at one event |
| D-004 | Other events (Camp Night and later) | Stage 2 | | | | deferred | Next event added to `lib/events/index.ts` |
| D-005 | Offline scanning | Stage 2 | | | | deferred | Venue without reliable data |
| D-006 | Admin back-fill (was R-009) | Stage 2 C2 | | | | deferred | A real sign-up exists before the Gate pass email ships |
| X-001 | Native app, ticketing platform, payment in scanner | Stage 2 | | | | excluded | Review time; mid-sale switch; payment stays offline |

**Contract conflicts resolved:** Stage 4's guest commitment ("your name still gets you in") needs a by-name lookup the scanner does not provide. Resolved by R-011: the volunteer holds a printed list of name, code and ticket (no phone or email) and Toyosi holds the sheet. The user said "the volunteer would have the list"; giving the volunteer the full sheet would expose phone and email, so the printed minimal list is the specified form.
**Remaining build blockers:** None. Apps Script redeploy happens in the owner's Google account (confirmed by user; account recorded in `usl-build/check-in.private.md`), at the Stage 8 session that changes the script, not before.

---

## 2. ACTORS, USERS, PAYERS, AND PERMISSIONS

| Actor | Trigger | Allowed actions | Sensitive data visible | Success |
|---|---|---|---|---|
| Volunteer (user) | Guest arrives at the gate | Log in with the volunteer password; scan or type codes; tap Call Toyosi | Guest full name, ticket label, tent yes/no, check-in time. Never phone, email, Instagram, price | 95 percent of guests checked in through Padi Check |
| Guest (secondary user) | Signs up | View and screenshot own Gate pass | Own code, name, ticket | Gets in fast |
| Toyosi (escalation) | Volunteer calls on orange or red | Decide entry; search the sheet by name | Full sheet | Every red resolved on the spot |
| Founder admin (payer, owner) | Before and after the event | Log in with the admin password; print the Gate card and guest list; read the sheet and Scan log | Full sheet | Rehearsal passed; post-event review |

Payer, budget owner and approver are the founders. There is no external payer. Volunteer and admin are distinct roles with distinct passwords; the volunteer session cannot reach admin routes.

---

## 3. SUCCESS, LEARNING, AND MEASUREMENT

| # | Criterion | Baseline | Target | Source | Success | Failure | Decision |
|---|---|---|---|---|---|---|---|
| S1 | Rehearsal on the real phone, after dark, 28 Oct | None | All six states correct; scan to result within 3 s; typed entry works | Founder observation, stopwatch | All pass | Any miss | Pass: use on 31 Oct. Fail: Lookup tab and printed list on the night |
| S2 | Share of arriving guests checked in through Padi Check | 0 percent | 95 percent or more | `Checked In?` timestamps versus head count | At least 95 percent | Under 95 percent | Fix before the next event |
| S3 | Gate queue | Unmeasured | Never over about 10 minutes | Founder observation | Met | Exceeded | Consider D-002 |
| S5 | Rejected scans (orange and red) | Unknown | Recorded, not targeted | Scan log tab | Reviewed after three events | Not applicable | Catches present: keep investing. Zero: freeze features |

---

## 4. FLOWS

### Guest, new sign-up
1. Submits the MAD Settings form. Existing route records the row and gets a code.
2. Redirect to `/events/mad-settings/registered?code&name&ticket` shows the Gate pass (QR plus code). Failure: code fails shape check, so no QR renders and the existing "check your email" notice shows.
3. Confirmation email carries the same Gate pass as a hosted image. Failure: image blocked by the client, so the code text remains below it.

### Guest, earlier sign-up
Not applicable in v1: sales open 27 Oct, after go-live. If go-live slips past the first real sign-up, that guest shows their code (typed entry) and D-006 triggers.

### Volunteer at the gate
1. Opens `/padi-check`, enters the volunteer password. Failure: wrong password shows "That password did not work. Ask Toyosi for today's password." Five wrong attempts in 15 minutes from one IP lock for 15 minutes.
2. Allows the camera. Failure: camera-off state with Type a code.
3. Scans or types. The client extracts the code (regex `MAD-[A-HJ-NP-Z2-9]{6}`) and posts it to `/api/padi-check/check`.
4. Server calls the Apps Script `checkin` action under the script lock and returns one of: welcome, already, not-found, not-paid. Network or script failure returns offline.
5. Volunteer acts per the result screen. Green: admit, hand a tent to Tent guests. Orange or red: Call Toyosi.
6. Next guest returns to the camera.

### Toyosi, escalation
Receives the call, searches the sheet by name, decides. Corrections (wrong check-in, unpaid marked paid) are made by hand in the sheet.

### Founder, after the event
Reviews `Checked In?`, the Scan log and the count. Rotates both passwords.

---

## 5. FUNCTIONAL REQUIREMENTS AND ACCEPTANCE CRITERIA

### R-001: Apps Script actions
**Authority:** confirmed-build
**Source and evidence:** Stage 2 C4, C5; existing `docs/mad-settings/apps-script.gs` (observed).
**Actor and required outcome:** Server can verify and record arrivals and produce the minimal roster safely.
**Inputs and validation:** `doPost` body with `action` in {`checkin`, `stats`, `roster`} plus `secret`. A body without `action` is the existing sign-up append, unchanged. `secret` must equal Script Property `PADI_CHECK_SECRET`; otherwise `{ ok:false, error:'unauthorised' }`.
**Output schema or state change:**
- `checkin {code}` under `LockService` returns `{ ok:true, status:'welcome'|'already'|'not-found'|'not-paid', name?, ticket?, usesTent?, checkedInAt?, checkedIn, total }`. On `welcome`, writes the current time (`Africa/Lagos`, ISO string) to `Checked In?`. On any other status, appends to `Scan log` tab: Timestamp, Code, Status, Name (if found).
- `stats {}` returns `{ checkedIn, total }`.
- `roster {}` returns every paid row as `{ name, code, ticketLabel, usesTent }[]` only (R-011).
- `checkedIn` counts rows whose `Checked In?` is not `No` or blank; `total` counts rows with `Paid? = Yes`.
**Business rules:** `already` when `Checked In?` holds a time. `not-paid` when `Paid?` is not `Yes`. Code match is case-insensitive and trimmed (existing `findRowByCode`). A new `setupPadiCheck()` function creates the `Scan log` tab; no columns are added to Sign-ups. Existing `doGet ?code=` stays as-is for the Lookup tab.
**Permissions and sensitive data:** Only callers holding the secret. The deployment remains "Execute as: Me, Access: Anyone"; the secret is the guard.
**Dependencies:** Owner redeploys as a new version of the existing deployment so the URL is unchanged; sets the script time zone to `Africa/Lagos`; adds Script Property `PADI_CHECK_SECRET`.
**Telemetry:** Scan log tab only.
**Rollback:** Redeploy the previous version from Manage deployments.
**Acceptance criteria:**
- [ ] AC-R001-01: A sign-up POST with no `action` still appends a row, enforces the 80-tent cap and the duplicate guard (manual test through the test deployment, using an attendance-only TEST row).
- [ ] AC-R001-02: `checkin` without the correct secret returns `unauthorised` and changes nothing.
- [ ] AC-R001-03: First `checkin` of a paid code returns `welcome` and writes a time; second returns `already` with that time and adds a Scan log row.
- [ ] AC-R001-04: Unknown code returns `not-found` and logs it; `Paid? = No` returns `not-paid` and logs it.
- [ ] AC-R001-05: `roster` returns only name, code, ticket label and tent for paid rows.
**Edge and abuse cases:** Two simultaneous check-ins of one code: the lock makes the second return `already`. Deleted row: `not-found`.

### R-002: Verification API
**Authority:** confirmed-build
**Actor and required outcome:** Volunteer's scan or typed code returns a trusted status.
**Inputs and validation:** `POST /api/padi-check/check` with JSON `{ code }`. Requires a valid volunteer session cookie (401 otherwise). Code trimmed, uppercased, validated with `isValidSignupCode`; invalid shape returns `not-found` without calling the script.
**Output schema:** `{ status, name?, ticket?, usesTent?, checkedInAt?, checkedIn, total }`. Never returns email, phone, Instagram or price.
**Business rules:** 8-second timeout on the script call; timeout or non-OK returns `{ status:'offline' }`. Per-session rate limit 120 requests per 10 minutes via Upstash (prefix `camping-ng:padi`), separate from the form limiter (5 per hour, unsuitable here).
**Permissions:** Volunteer or admin session.
**Dependencies:** R-001, R-003; env `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL`, `PADI_CHECK_SCRIPT_SECRET`.
**Telemetry:** None beyond the Scan log; server logs status and code only, never names.
**Rollback:** Volunteer uses the Lookup tab and printed list.
**Acceptance criteria:**
- [ ] AC-R002-01: Without a session, 401.
- [ ] AC-R002-02: Response never contains email or phone (unit test on the mapping function).
- [ ] AC-R002-03: Script timeout yields `offline` within 9 seconds.
**Edge and abuse cases:** Malformed JSON: 400. QR containing extra text: client extracts the code; server only ever receives a code.

### R-003: Sessions
**Authority:** confirmed-build
**Inputs:** `POST /api/padi-check/login {password, role:'volunteer'|'admin'}` compared in constant time against `PADI_CHECK_PASSWORD` or `PADI_CHECK_ADMIN_PASSWORD`.
**Output:** httpOnly, Secure, SameSite=Strict cookie `padi_session` holding `role.expiry.hmac` signed with `PADI_CHECK_SESSION_SECRET`; 12-hour expiry. `POST /api/padi-check/logout` clears it.
**Business rules:** Five failed logins per IP per 15 minutes locks for 15 minutes. Admin pages (card, list) require role `admin`. Rotating a password does not invalidate live sessions; rotating the session secret does (documented in the runbook).
**Acceptance criteria:**
- [ ] AC-R003-01: Volunteer cookie gets 403 from admin APIs.
- [ ] AC-R003-02: Tampered cookie gets 401 (unit test on sign and verify).
- [ ] AC-R003-03: Sixth failed login inside 15 minutes is refused.

### R-004: Scanner page
**Authority:** confirmed-build
**Route:** `/padi-check` (client component). Login form when no session; otherwise the scanner.
**Behaviour:** `html5-qrcode` (version to verify, Appendix A) with the rear camera (`facingMode: 'environment'`). Type a code is always visible below the camera with a `MAD-` prefix and a Check button. After a decode, the camera pauses until Next guest or Try again, so one QR is never submitted twice by accident. On iPhone, guidance to use Safari appears only if `getUserMedia` is unavailable.
**Acceptance criteria:**
- [ ] AC-R004-01: Decodes a Gate pass from another phone's screen at arm's length outdoors at night on the volunteer's actual phone (rehearsal).
- [ ] AC-R004-02: Camera denied shows the camera-off state; typed entry still works.
- [ ] AC-R004-03: A held-up QR produces exactly one request.

### R-005: Result screens
**Authority:** confirmed-build
**Behaviour:** Six states with the copy in `6-landing-page-copy.md` Surface 5, verbatim. Full-viewport colour, one large word, then detail, then 56px full-width buttons. Call Toyosi is a `tel:` link built from `PADI_CHECK_CALL_PHONE` (server-rendered into the page; never committed). Vibrate once on result where `navigator.vibrate` exists. Shows name, ticket, Tent or No tent, time; nothing else.
**Acceptance criteria:**
- [ ] AC-R005-01: Each state is identifiable by its word alone (screenshot in greyscale).
- [ ] AC-R005-02: Call Toyosi opens the dialler with the configured number on Android and iPhone.
- [ ] AC-R005-03: No email or phone of a guest is ever rendered.

### R-006: Live count
Top bar shows "[checkedIn] of [total] in" from each check response, and from `GET /api/padi-check/stats` on page load (volunteer session), which calls the R-001 `stats` action. AC-R006-01: Count increments after a green and is correct after a page reload.

### R-007: Gate pass QR
**Behaviour:** QR content is `MAD-XXXXXX|Full Name|Ticket label` (user requirement; display convenience only, never trusted). Server library `qrcode` (version to verify). `GET /api/gate-pass/qr?c=&n=&t=&s=` returns a 480px PNG with a white quiet zone, cached `public, max-age=31536000, immutable`; `s` is an HMAC of `c|n|t` with `GATE_PASS_SECRET`; a bad signature returns 404. The confirmation page renders the QR server-side as inline SVG (no URL needed).
**Acceptance criteria:**
- [ ] AC-R007-01: Unsigned or altered URLs return 404 (unit test).
- [ ] AC-R007-02: The PNG scans in Padi Check and in a stock phone camera app.
**Edge and abuse cases:** Names are length-capped at 80 characters before encoding. The PNG URL contains the guest name; accepted for v1 and recorded in Section 11.

### R-008: Gate pass on confirmation page and email
Per `6-landing-page-copy.md` Surfaces 1 and 2. The page shows the QR only when `isValidSignupCode` passes. The email uses the signed PNG URL with explicit width and height and `alt="Your gate pass, code MAD-XXXXXX"`, values through `escapeHtml`.
- [ ] AC-R008-01: A new test sign-up shows the QR on the page and in Gmail web and app, and both scan green once.

### R-009: Admin back-fill (deferred, D-006)
Not built in v1. Revised 2026-10-17: no real sign-ups exist and sales open 27 Oct, after go-live on 26 Oct, so every guest receives the Gate pass in the confirmation email. Trigger to build: a real sign-up exists before R-008's email ships. Design retained from the original R-009: admin-only page, test send first, batches of 20, mark each row sent.

### R-010: Gate card
`/padi-check/card` (admin session), print stylesheet A5, copy from Surface 6 with the Toyosi number from `PADI_CHECK_CALL_PHONE`. AC-R010-01: Prints legibly on A5 in the three colours.

### R-011: Printed guest list
`/padi-check/list` (admin session): print table of Name, Code, Ticket, Tent, sorted by name, from the R-001 `roster` action. AC-R011-01: No email or phone appears.

### R-012: Hidden from search
All `/padi-check/*` routes export `robots: { index:false, follow:false }`, are absent from `app/sitemap.ts`, and `/padi-check` is added to `robots.ts` disallow. AC-R012-01: `curl` shows the noindex meta; sitemap has no `padi-check` entry.

### R-013: Measurement
No new instrumentation beyond R-001's `Checked In?` times and Scan log. Post-event review per Section 3.

---

## 6. AI BEHAVIOR AND EVALUATION

Not applicable. Padi Check uses no AI.

---

## 7. BRAND, CONTENT, AND INTERACTION SPECIFICATIONS

**Colours:** `--brand-dark #0e3e2e` (Padi Check top bar, login, buttons on light), `--brand-accent #e6b325` and `--brand-accent-tint #fdf6e3` (Gate pass box), `--brand-light #f3efe6` (page background). Result fields: welcome `#15803d`, already `#c2410c`, red states `#b91c1c`, offline `#4b5563`, camera-off `#0e3e2e`; white text on all, verified to WCAG AA.
**Typography:** Agrandir (`font-serif`) for the result word, at least 44px; DM Sans (`font-sans`) for everything else; name at least 24px.
**Logo:** Text wordmark "Padi Check" in Agrandir on the forest-green top bar; no new logo.
**Components:** No cards, icons, gradients, pills or animation on Padi Check. Buttons full width, 56px tall, 8px radius (site standard).
**Imagery:** None.
**Copy:** `6-landing-page-copy.md` verbatim. No contractions. Never: invalid, denied, secure, fraud.
**Display-name mapping:** Personal QR = Gate pass; Scanner = Padi Check; Volunteer card = Gate card. Code uses working labels (`gatePass`, `scanner`, `resultScreen`).
**Accessibility:** Result word announced via `aria-live="assertive"`; typed field labelled; focus moves to the primary button on each result; reduced motion respected (there is no motion).

---

## 8. TECHNICAL ARCHITECTURE AND DATA

**Stack:** Existing Next.js 16.2 App Router, React 19.2, TypeScript 5.7, Tailwind v4, Vercel. New dependencies: `html5-qrcode` (client scanner) and `qrcode` (server QR generation), versions to verify (Appendix A).
**Boundaries:** Browser (scanner UI, code extraction) to Next.js route handlers (session, rate limit, mapping, minimal data) to Apps Script (source of truth, lock, writes). The browser never sees the script URL or secret.
**New files (indicative):** `lib/padi-check/session.ts`, `lib/padi-check/sheet.ts`, `lib/padi-check/extract-code.ts`, `lib/gate-pass/qr.ts`, `app/padi-check/page.tsx`, `app/padi-check/card/page.tsx`, `app/padi-check/list/page.tsx`, `app/api/padi-check/{login,logout,check,stats,roster}/route.ts`, `app/api/gate-pass/qr/route.ts`, `components/padi-check/*`; edits to `docs/mad-settings/apps-script.gs`, `app/events/mad-settings/registered/page.tsx`, `app/api/mad-settings-signup/route.ts`, `lib/rate-limit.ts` (configurable limiter), `app/robots.ts`, `.env.example`, `docs/mad-settings/SETUP.md`.
**Data:** Google Sheet "Sign-ups" unchanged in shape; `Checked In?` changes from `No` to a time on arrival; new `Scan log` tab. No new database.
**Environment variables:** `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` (existing), `PADI_CHECK_SCRIPT_SECRET` (equals Script Property `PADI_CHECK_SECRET`), `PADI_CHECK_PASSWORD`, `PADI_CHECK_ADMIN_PASSWORD`, `PADI_CHECK_SESSION_SECRET`, `GATE_PASS_SECRET`, `PADI_CHECK_CALL_PHONE`, plus existing `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Set in `.env.local` and Vercel; names only in `.env.example`.
**Environments:** One sheet (the live MAD Settings sheet, which holds only founder test rows until sales open on 27 Oct). Local dev and Vercel preview point `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` at a separate TEST web-app deployment running the new script version; production keeps the existing deployment until go-live, when it is moved to the new version. Test rows are named TEST, attendance-only, use the founder's email, and are deleted at go-live. Revised 2026-10-17: user declined a sheet copy; acceptable because no real sign-ups exist yet.
**Recovery:** Sheet version history; Apps Script previous deployment version; Vercel instant rollback.

---

## 9. NON-FUNCTIONAL AND OPERATING REQUIREMENTS

| Category | Requirement | Verification |
|---|---|---|
| Security | Two roles, signed httpOnly cookies, constant-time password compare, login lockout, script secret, signed QR URLs, no secrets in client bundle or git | Unit tests (session, signature); grep the client bundle for secret names; `git grep` for the Toyosi number |
| Privacy | Volunteer surfaces show name, ticket, tent, time only; logs carry code and status only; passwords rotated after each event | AC-R002-02, AC-R005-03, AC-R011-01; runbook |
| Accessibility | WCAG 2.2 AA contrast; result readable without colour; keyboard-operable login and typed entry | Contrast check; greyscale screenshot; keyboard pass |
| Performance | Scan to result p95 3 s or less on venue data | Stopwatch 20 checks in preview and at rehearsal |
| Reliability | 8 s timeout to offline state; idempotent check-in via script lock | AC-R001-03, AC-R002-03 |
| Observability | Scan log tab; Vercel function logs with status only | Inspect after rehearsal |
| Analytics | None on Padi Check; Vercel Analytics not loaded on `/padi-check/*` | Network tab |
| Cost | NGN 0 new spend; normal confirmation volume plus a few tests within the existing Resend plan (unverified) | Resend dashboard |
| Compliance | Personal data used only for the purpose collected; no new processing; noindex | R-012 |
| Portability | Sheet remains the system of record; exportable as CSV | Not applicable beyond the sheet |

---

## 10. SCOPE BOUNDARY AND RELEASE CONTROL

**Confirmed build:** R-001 to R-013.
**Deferred this revision:** R-009 (D-006).
**Test in v1:** None as separate scope. Uncertainty (scanner reliability, volunteer trust, latency) is contained by the 28 Oct rehearsal go/no-go and the Lookup tab plus printed list fallback.
**V2, with triggers:** D-001 to D-005 (Section 1).
**Explicitly excluded:** X-001.
**Contract revisions:** R-009 deferred to D-006 on 2026-10-17 (sales open after go-live). R-011 added (printed minimal guest list) to honour the Stage 4 commitment without exposing phone or email.
**MCP fast-follow:** Not now. Revisit at Stage 9 only if operating events from Claude becomes useful.

---

## 11. RISKS, ASSUMPTIONS, AND OPEN DECISIONS

| Risk | Confidence | Consequence | Mitigation | Owner | Trigger | IDs |
|---|---|---|---|---|---|---|
| Scanner unreliable on the real phone | Medium | Queue at the gate | Rehearsal 28 Oct; typed entry; fallback | Founder | Any rehearsal miss | R-004, R-005 |
| Build slips past 26 Oct | Medium | Early sign-ups without a Gate pass (D-006 triggers); no rehearsal | Risk-first order; 5-day ceiling | Founder | Day 5 incomplete | All |
| Apps Script slow or quota-limited | Medium | Slow line | Time early; 8 s offline state | Founder | p95 over 3 s | R-001, R-002 |
| Script change breaks sign-ups mid-sale | Low | Lost sign-ups | Build against a separate TEST deployment while production stays on the old version; no-action path unchanged; redeploy previous version | Founder | AC-R001-01 fails | R-001 |
| Guest name in QR image URL | High (by design) | Name visible in URL logs | Signed URL; accept for v1; revisit if events grow | Founder | Any complaint | R-007 |
| Shared volunteer password leaks | Low | Someone reads names | Rotate after every event; 12 h sessions | Founder | After each event | R-003 |

**Open decisions:** None blocking. Library versions verified at the start of Stage 8 (Appendix A).

---

## 12. IMPLEMENTATION, TRACEABILITY, AND HANDOFF

### Recommended Build Order (risk-first)
1. R-001 Apps Script actions; owner saves them in the live script and creates a separate TEST deployment (production deployment untouched); time `checkin`.
2. R-003 sessions and R-002 verification API with unit tests.
3. R-004 and R-005 scanner and result screens; test on the volunteer's phone early (outdoors, at night if possible).
4. R-006 count; R-012 noindex.
5. R-007 and R-008 Gate pass on page and email.
6. R-003 admin role; R-010 card; R-011 list.
7. Production: redeploy the live script as a new version; set env vars in Vercel; test sign-up end to end.
8. 27 Oct sales open; 28 Oct rehearsal; 31 Oct event.

### Pre-Build Checklist
- A separate TEST web-app deployment of the MAD Settings script (no sheet copy), plus attendance-only TEST rows using the founder's email.
- Generate `PADI_CHECK_SCRIPT_SECRET`, `PADI_CHECK_SESSION_SECRET`, `GATE_PASS_SECRET` (32+ random bytes each); choose both passwords.
- `PADI_CHECK_CALL_PHONE` from `usl-build/check-in.private.md` into `.env.local` and Vercel only.
- Confirm which phone the volunteer will use and have it for testing.

### Testing Approach
Vitest unit tests: `extractCode`, session sign and verify, QR URL signature, check-response mapping (no email or phone). Manual: AC lists above through the TEST deployment, then the rehearsal. Quality commands: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.

### Environment and Release Approach
Feature branch; Vercel preview against the TEST deployment; merge to main after AC pass; production script redeploy last.

### Version Control
Commit per build step; never commit `.env.local` or `*.private.md`.

### Traceability Matrix

| ID | Source | Actor outcome | Acceptance criteria | Risk | Verification | Phase |
|---|---|---|---|---|---|---|
| R-001 | Stage 2 C4, C5 | Verify and record | AC-R001-01..05 | Script change, latency | Manual via TEST deployment | 1 |
| R-002 | Stage 2 C4 | Trusted answer | AC-R002-01..03 | Latency | Unit plus manual | 2 |
| R-003 | Stage 2 C3 | Private access | AC-R003-01..03 | Password leak | Unit plus manual | 2 |
| R-004 | Stage 2 C3 | Check any guest | AC-R004-01..03 | Scanner reliability | Rehearsal | 3 |
| R-005 | Stages 4 to 6 | Clear action | AC-R005-01..03 | Volunteer trust | Rehearsal | 3 |
| R-006 | Stage 2 C5 | Progress | AC-R006-01 | | Manual | 4 |
| R-007 | Stage 2 C1 | Scannable pass | AC-R007-01..02 | Name in URL | Unit plus manual | 5 |
| R-008 | Stage 6 S1, S2 | New sign-ups get pass | AC-R008-01 | | Manual | 5 |
| R-009 | Stage 2 C2 | Deferred (D-006) | Not applicable | | | Not built |
| R-010 | Stage 6 S6 | Volunteer guidance | AC-R010-01 | | Print | 6 |
| R-011 | Stage 4; user | Name fallback | AC-R011-01 | | Print | 6 |
| R-012 | Stage 6 | Not public | AC-R012-01 | | curl | 4 |
| R-013 | Stages 1, 3 | Learning | Section 3 | Zero catches | Post-event review | 8 |
| NFRs | Section 9 | | Section 9 | | Section 9 | 2 to 7 |

### Handoff Readiness
A developer reading this cold needs: this PRD, `6-landing-page-copy.md` for copy, `docs/mad-settings/apps-script.gs` for the current script, and access to the env vars and the TEST deployment URL.

---

## APPENDIX A. TOOLING CURRENCY AND SOURCES

No live research run this session for this PRD. Carried from Stage 1: html5-qrcode supports iOS Safari 15.1+ over HTTPS (https://classic.yarnpkg.com/en/package/html5-qrcode, checked 2026-10-14).
**To verify before Stage 8 session 1:** current versions and maintenance status of `html5-qrcode` and `qrcode` on npm; Apps Script execution quotas for a personal Google account; Resend plan sending limits.
