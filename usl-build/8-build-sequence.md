# Build Sequence: Padi Check
## Stage 8 Output | USL Academy

**Product:** Padi Check (internal event check-in) and the guest Gate pass
**PRD:** `usl-build/7-prd.md` (v1.1)
**Build authority:** authorised
**Desirability rubric:** Push. First value is the green "Welcome in" with an arrival written to the sheet; the continuation is reuse at every gated event.
**Caps applied and status:** None.
**Technical level and execution mode:** Code; Claude Code sessions plus manual Google and Vercel steps.
**Existing project:** `C:\dev\camping-Nigeria-website`, Next.js 16.2 App Router, main branch clean as of 2026-10-17. Reuses `lib/mail.ts`, `lib/rate-limit.ts`, `lib/html.ts`, `lib/events/mad-settings*.ts`, `docs/mad-settings/apps-script.gs`.
**Stack:** Next.js 16.2, React 19.2, TypeScript 5.7, Tailwind v4, Vercel, Google Apps Script on the MAD Settings sheet, Resend, Upstash. New: `html5-qrcode`, `qrcode`.
**Builder and maintenance owner:** Founder (solo, with Claude Code).
**Preview or staging target:** Vercel preview deployments, pointed at a TEST Apps Script deployment.
**Production target:** campingnigeria.com on Vercel, pointed at the existing Apps Script deployment (moved to the new version at go-live).
**Date:** 2026-10-17

---

## 1. HOW TO USE THIS SEQUENCE

1. Do the sessions in order. Each one ends with a checklist; do not start the next session until every box is ticked.
2. CODING AGENT sessions: open Claude Code in the repo and paste the prompt exactly. MANUAL sessions: you do the steps yourself in Google or Vercel; Claude Code cannot click there for you.
3. If a checklist fails, stop. Go back to the last commit named in that session's checkpoint, fix, and re-check.
4. New ideas go in Section 9 (backlog), not into a session.
5. Never paste a secret, the Toyosi number or a guest's details into a prompt or a commit. Secrets live in `.env.local` and Vercel only.

**Every coding prompt starts with this preflight (it is included in each prompt below):**
> STATE PREFLIGHT: run `git status` and `git log -3 --oneline`; confirm you are on branch `feat/padi-check`; read `CLAUDE.md`; do not touch unrelated files or uncommitted changes you did not make; do not add dependencies or change architecture beyond what this prompt names; never print or commit secrets.

---

## 2. BUILD READINESS AUDIT

| Check | Evidence | Missing or conflicting IDs | Result |
|---|---|---|---|
| Build authority | PRD v1.1: Build authorised | None | pass |
| Contract and blockers | No contract-required or blocked rows; R-009 deferred to D-006 with trigger | None | pass |
| Requirement and AC completeness | R-001 to R-008, R-010 to R-013 each have ACs and traceability | None | pass |
| User, payer, approval, permissions | Volunteer, guest, Toyosi, founder admin defined; no external payer | None | pass |
| Test-in-v1 controls | None in scope; rehearsal go/no-go plus Lookup tab and printed list fallback | None | pass |
| AI evaluation | Not applicable (no AI) | None | pass |
| NFR verification | PRD Section 9 methods named | None | pass |
| Safe fixtures, environments, recovery | TEST deployment, attendance-only TEST rows, Apps Script version rollback, Vercel rollback | None | pass |
| Traceability and open decisions | Matrix complete; library versions verified in Session 0.1 | None | pass |

**Sequence status:** Authorised for execution.

---

## 3. REQUIREMENT COVERAGE

| Requirement / NFR / flow / risk | Sessions | Verification gates | Coverage status |
|---|---|---|---|
| R-001 Apps Script actions | 1.1, 1.2, 4.1 | AC-R001-01..05 | complete |
| R-002 Verification API | 1.3 | AC-R002-01..03 | complete |
| R-003 Sessions (volunteer, admin) | 1.3, 2.4 | AC-R003-01..03 | complete |
| R-004 Scanner (typed, camera) | 1.4, 2.2 | AC-R004-01..03 | complete |
| R-005 Result screens | 1.4 | AC-R005-01..03 | complete |
| R-006 Live count | 1.4 | AC-R006-01 | complete |
| R-007 Gate pass QR | 2.1 | AC-R007-01..02 | complete |
| R-008 Gate pass on page and email | 2.1, 2.3 | AC-R008-01 | complete |
| R-010 Gate card | 2.4 | AC-R010-01 | complete |
| R-011 Printed guest list | 2.4 | AC-R011-01 | complete |
| R-012 Hidden from search | 1.4, 3.1 | AC-R012-01 | complete |
| R-013 Measurement | 4.3 | PRD Section 3 S1 to S5 | complete |
| NFRs (security, privacy, a11y, performance, reliability, observability, analytics, cost) | 1.3, 3.1, 3.2 | PRD Section 9 | complete |
| Volunteer, Toyosi, founder flows | 3.2, 4.2, 4.3 | Rehearsal, event | complete |
| Risk: script change breaks sign-ups | 1.2, 4.1 | AC-R001-01 | complete |
| Risk: scanner unreliable on real phone | 1.5, 2.2, 3.2, 4.2 | AC-R004-01 | complete |

---

## 4. EXECUTION MAP

**Riskiest assumption or integration:** The Apps Script `checkin` action: correct, locked, fast enough (p95 3 s), and not breaking sign-ups.
**Walking-skeleton outcome:** On the volunteer's phone, typing a TEST code on a Vercel preview shows green and writes a time to the sheet (Session 1.5, target 20 Oct).
**Early preview milestone:** Session 1.5.
**Test-in-v1 exposure boundary:** Not applicable.
**First-value and continuation behavior:** Green "Welcome in" plus arrival time; repeat scan shows orange; reused at the next event (D-004).

| Session | Outcome | IDs covered | Depends on | Parallel with | Milestone | Checkpoint |
|---|---|---|---|---|---|---|
| 0.1 | Branch, secrets, versions, phone confirmed | Readiness | None | None | Ready (18 Oct) | branch created |
| 1.1 | New Apps Script code in repo | R-001 | 0.1 | None | | commit |
| 1.2 | Script live on TEST deployment, timed | R-001 | 1.1 | 1.3 | | Apps Script version |
| 1.3 | Sessions and check API with tests | R-002, R-003 | 1.1 | 1.2 | | commit |
| 1.4 | Padi Check with typed entry, six states, count, noindex | R-004 (typed), R-005, R-006, R-012 | 1.2, 1.3 | None | | commit |
| 1.5 | Walking skeleton on the real phone | R-004, R-005 | 1.4 | None | Skeleton (20 Oct) | preview URL |
| 2.1 | Gate pass QR on confirmation page | R-007, R-008 (page) | 1.5 | 2.4 | | commit |
| 2.2 | Camera scanning | R-004 (camera) | 2.1 | 2.3, 2.4 | | commit |
| 2.3 | Gate pass in confirmation email | R-008 (email) | 2.1 | 2.2, 2.4 | | commit |
| 2.4 | Admin login, Gate card, printed list | R-003 (admin), R-010, R-011 | 1.3 | 2.1, 2.2, 2.3 | Feature complete (24 Oct) | commit |
| 3.1 | Security, privacy, a11y sweep | NFRs, R-012 | 2.1 to 2.4 | None | | commit |
| 3.2 | Full run-through on both phones | All ACs | 3.1 | None | Accepted (25 Oct) | preview URL |
| 4.1 | Go live | R-001, release gate | 3.2 | None | Live (26 Oct) | Vercel deployment, Apps Script version |
| 4.2 | Rehearsal and go/no-go | S1 | 4.1 | None | Decision (28 Oct) | recorded |
| 4.3 | Event night and review | S2 to S5, R-013 | 4.2 | None | Event (31 Oct) | recorded |

Parallel lanes are safe because the paired sessions touch different files, but a solo builder should simply run them in order. Slack: about a day and a half between 24 and 26 Oct.

---

## 5. SESSIONS

### Phase 0: Readiness

### Session 0.1 — Get ready
**Single job:** A branch, three secrets, two passwords and verified library versions exist, and the volunteer's phone is known.
**Requirements covered:** Readiness; PRD Section 12 pre-build checklist; Appendix A.
**Execution mode:** MIXED

**Execution procedure:**
1. MANUAL: decide which phone the volunteer will use on the night (the Android or the iPhone) and keep it available for testing.
2. MANUAL: choose two passwords (volunteer and admin). Different, at least 12 characters, easy to say aloud.
3. CODING AGENT, paste:
> STATE PREFLIGHT (see Section 1). Branch `feat/padi-check` already exists (it holds the planning files); switch to it.
> TASK: Prepare for the Padi Check build described in `usl-build/7-prd.md` v1.1. Do not write feature code.
> 1. Check npm for the current stable versions and last publish dates of `html5-qrcode` and `qrcode` (and `@types/qrcode`). Report them and whether each looks maintained. Do not install yet.
> 2. Add these names, with empty values and one-line comments, to `.env.example` under a "Padi Check" heading: `PADI_CHECK_SCRIPT_SECRET`, `PADI_CHECK_PASSWORD`, `PADI_CHECK_ADMIN_PASSWORD`, `PADI_CHECK_SESSION_SECRET`, `GATE_PASS_SECRET`, `PADI_CHECK_CALL_PHONE`.
> 3. Print the command I should run myself to generate three random secrets: `node -e "for(let i=0;i<3;i++)console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Do not run it and do not print secrets.
> OUTPUT: versions found, the `.env.example` diff, and nothing else.
4. MANUAL: run the secret command yourself. Put the three values into `.env.local` as `PADI_CHECK_SCRIPT_SECRET`, `PADI_CHECK_SESSION_SECRET`, `GATE_PASS_SECRET`; add both passwords; add `PADI_CHECK_CALL_PHONE` from `usl-build/check-in.private.md` in international form (+234...). Keep a copy of the script secret for Session 1.2.

**Definition of done:**
- [ ] On branch `feat/padi-check`; `.env.example` lists the six names with no values.
- [ ] `.env.local` holds all six values (never committed; `git status` does not show it).
- [ ] Library versions recorded in Section 10 of this file.
- [ ] Volunteer phone chosen.
- [ ] Commit: `chore(padi-check): env names for Padi Check`.

**Depends on:** None. **Can run in parallel with:** None.
**Checkpoint and recovery:** The commit above; delete the branch to start again.

---

### Phase 1: Risk spike and walking skeleton

### Session 1.1 — New Apps Script actions (code only)
**Single job:** `docs/mad-settings/apps-script.gs` gains guarded `checkin`, `stats` and `roster` actions and a Scan log, with the sign-up path unchanged.
**Requirements covered:** R-001, AC-R001-01..05 (by design), risk "script change breaks sign-ups".
**Execution mode:** CODING AGENT

**Execution procedure:**
> STATE PREFLIGHT (see Section 1).
> TASK: Extend `docs/mad-settings/apps-script.gs` per `usl-build/7-prd.md` R-001. Read R-001 in full and the whole current script first.
> REQUIREMENTS:
> 1. At the top of `doPost`, after parsing the body and before any sign-up logic: if `body.action` is present, require `body.secret === PropertiesService.getScriptProperties().getProperty('PADI_CHECK_SECRET')` (and that property must be non-empty), else return `{ ok:false, error:'unauthorised' }`. Route `checkin`, `stats`, `roster`; unknown action returns `{ ok:false, error:'unknown-action' }`. A body without `action` must run the existing sign-up code exactly as today (do not reorder or alter it).
> 2. `checkin {code}` runs inside the existing script lock: find the row with `findRowByCode`; none: status `not-found`; `Paid?` not `Yes`: `not-paid`; `Checked In?` not blank and not `No`: `already` with `checkedInAt`; otherwise write `Utilities.formatDate(new Date(), 'Africa/Lagos', "yyyy-MM-dd'T'HH:mm:ss")` to `Checked In?` and return `welcome`. Return `name`, `ticket` (the Ticket column), `usesTent` (Tent? = Yes) when a row exists, plus `checkedIn` and `total` (paid rows). For every status other than `welcome`, append Timestamp, Code, Status, Name to a `Scan log` sheet.
> 3. `stats` returns `{ ok:true, checkedIn, total }`. `roster` returns paid rows as `{ name, code, ticketLabel, usesTent }` only, never email, phone, Instagram or price.
> 4. Add `setupPadiCheck()` that creates the `Scan log` tab with headers if missing. Do not change `setup()`, `HEADERS`, `TENT_CAP`, `doGet` or the Lookup tab.
> 5. Update the file's header comment and `docs/mad-settings/SETUP.md` with a short "Padi Check" section: Script Property `PADI_CHECK_SECRET`, project time zone `Africa/Lagos`, run `setupPadiCheck()` once, and deploy as a NEW separate deployment for testing, leaving the existing deployment on its current version until go-live.
> DO NOT: change sign-up behaviour, the tent cap, the duplicate guard, `doGet`, or any website code.
> STOP AND ASK if the existing `doPost` structure makes it impossible to route actions without touching sign-up code.
> TESTS OR CHECKS: Apps Script cannot run locally; produce a short manual test checklist in your output matching AC-R001-01..05.
> OUTPUT: the diff and the manual checklist.

**Definition of done:**
- [ ] Diff shows sign-up code byte-for-byte unchanged apart from the action router placed before it.
- [ ] `roster` and `checkin` responses contain no email, phone, Instagram or price.
- [ ] SETUP.md has the Padi Check section.
- [ ] Commit: `feat(padi-check): Apps Script check-in, stats and roster actions`.

**Depends on:** 0.1. **Can run in parallel with:** None.
**Checkpoint and recovery:** The commit; `git revert` if needed (nothing is deployed yet).

### Session 1.2 — Put the script on a TEST deployment and time it
**Single job:** The new script runs on a separate TEST deployment of the live sheet, passes AC-R001-01..05, and its check-in time is measured.
**Requirements covered:** R-001, AC-R001-01..05, NFR performance.
**Execution mode:** MANUAL (in the owner's Google account, see `usl-build/check-in.private.md`)

**Execution procedure:**
1. Open the MAD Settings sheet, Extensions, Apps Script. Before pasting, File or the version history: note the current deployment's version number (Deploy, Manage deployments). Write it down: it is your rollback.
2. Replace the script with the new `docs/mad-settings/apps-script.gs`. Save. Project Settings: time zone `(GMT+01:00) Lagos`. Project Settings, Script Properties: add `PADI_CHECK_SECRET` = your script secret.
3. Run `setupPadiCheck` once from the editor and accept permissions. Confirm a `Scan log` tab appears.
4. Deploy, New deployment, Web app, Execute as Me, Access Anyone, description "TEST Padi Check". Copy the TEST URL. Do NOT edit the existing deployment.
5. In `.env.local`, set `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` to the TEST URL (keep the production URL written down for Session 4.1).
6. Add test rows by signing up on `npm run dev` at `/events/mad-settings` with your own email, names starting "TEST", ticket Attendance only: create four (TEST One to TEST Four). Then in the sheet set TEST Four's `Paid?` to `No`.
7. Run the checks with curl in Git Bash (replace values; do not save this in a file):
   - Wrong secret: `curl -sL -X POST -H "Content-Type: application/json" -d '{"action":"stats","secret":"wrong"}' "$TEST_URL"` returns `unauthorised`.
   - Check in TEST One twice with the right secret and its code: first `welcome`, second `already` with a time; Scan log gains a row.
   - Unknown code `MAD-ZZZZZZ`: `not-found`, logged. TEST Four: `not-paid`, logged.
   - `roster`: four TEST rows minus TEST Four; no emails.
   - Timing: run the `checkin` curl 20 times with `-w "%{time_total}\n" -o /dev/null` on TEST Two (after the first, they return `already`). Record the slowest and the typical time.
8. In the sheet, set `Checked In?` back to `No` for TEST rows and clear the Scan log rows, ready for later sessions.

**Definition of done:**
- [ ] AC-R001-01 (sign-up via the form still works through the new code), 02, 03, 04, 05 all pass.
- [ ] Typical check-in under 3 s; slowest recorded. If typical is over 3 s, stop and record it in Section 9 before continuing.
- [ ] Production deployment still on its original version (Manage deployments shows it unchanged).
- [ ] Rollback version number written down.

**Depends on:** 1.1. **Can run in parallel with:** 1.3.
**Checkpoint and recovery:** Apps Script version history. If sign-ups break, archive the TEST deployment; production is unaffected because it is pinned to the old version.

### Session 1.3 — Sessions and the check API
**Single job:** Volunteer and admin sessions and `/api/padi-check/check` and `/stats` work and are unit-tested.
**Requirements covered:** R-002, R-003, AC-R002-01..03, AC-R003-01..03, NFR security and privacy.
**Execution mode:** CODING AGENT

**Execution procedure:**
> STATE PREFLIGHT (see Section 1).
> TASK: Build the Padi Check session and verification layer per `usl-build/7-prd.md` R-002 and R-003, Section 8 and Section 9. Read those sections, `lib/rate-limit.ts`, `lib/events/mad-settings-records.ts` and an existing API route such as `app/api/mad-settings-signup/route.ts` first, and follow their conventions.
> BUILD:
> 1. `lib/padi-check/session.ts`: sign and verify `role.expiry.hmac` (HMAC-SHA256 with `PADI_CHECK_SESSION_SECRET`, 12 h), constant-time password compare (`crypto.timingSafeEqual` on equal-length digests), cookie `padi_session` httpOnly, Secure in production, SameSite=Strict, path `/`.
> 2. `lib/rate-limit.ts`: allow a caller to pass its own window, limit and prefix without changing the behaviour of existing callers. Login: 5 per 15 min per IP (prefix `camping-ng:padi-login`). Check: 120 per 10 min per session (prefix `camping-ng:padi`). Keep the existing fail-closed-in-production behaviour.
> 3. `lib/padi-check/sheet.ts`: server-only calls to the Apps Script actions using `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` and `PADI_CHECK_SCRIPT_SECRET`, 8 s `AbortController` timeout, and a mapping function that returns only `status, name, ticket, usesTent, checkedInAt, checkedIn, total`.
> 4. Routes: `POST /api/padi-check/login {password, role}`, `POST /api/padi-check/logout`, `POST /api/padi-check/check {code}` (volunteer or admin), `GET /api/padi-check/stats` (volunteer or admin). Invalid code shape returns `not-found` without calling the script; timeout or script error returns `{status:'offline'}`. Logs carry status and code only.
> TESTS OR CHECKS: Vitest unit tests for session sign/verify (valid, expired, tampered, wrong role), the mapping function (never returns email or phone even if present in input), and code-shape handling. Run `npm test`, `npm run lint`, `npx tsc --noEmit`.
> SAFETY AND DATA: no secrets in code, tests or logs; tests use fake data only.
> DO NOT: build any page or UI; touch the sign-up route; add dependencies.
> STOP AND ASK if `lib/rate-limit.ts` cannot be extended without changing existing callers.
> OUTPUT: files changed, test results, and a curl example (without real secrets) showing 401 without a cookie.

**Definition of done:**
- [ ] AC-R003-02 and AC-R002-02 covered by passing unit tests; `npm test`, lint and type check pass.
- [ ] With `npm run dev`: check without a cookie returns 401 (AC-R002-01); volunteer cookie gets a real status from TEST One.
- [ ] Sixth wrong login in 15 min refused (AC-R003-03).
- [ ] Commit: `feat(padi-check): sessions and check API`.

**Depends on:** 1.1 (response shape). **Can run in parallel with:** 1.2.
**Checkpoint and recovery:** The commit.

### Session 1.4 — Padi Check with typed entry and the six screens
**Single job:** `/padi-check` lets the volunteer log in, type a code and see the correct full-screen result, with the live count, hidden from search.
**Requirements covered:** R-004 (typed), R-005, R-006, R-012, AC-R004-02 (typed path), AC-R005-01..03, AC-R006-01, AC-R012-01.
**Execution mode:** CODING AGENT

**Execution procedure:**
> STATE PREFLIGHT (see Section 1).
> TASK: Build the Padi Check page per `usl-build/7-prd.md` R-004 (typed entry only; no camera yet), R-005, R-006, R-012 and Section 7, using the copy in `usl-build/6-landing-page-copy.md` Surfaces 4 and 5 VERBATIM and the presentation rules in `usl-build/6-landing-page-build-sequence.md` Sections 2, 4 and 6 (prompt P1).
> BUILD: `app/padi-check/page.tsx` (server: reads session; renders login or scanner; passes `PADI_CHECK_CALL_PHONE` into the page as a `tel:` href), `components/padi-check/` for `PadiCheckShell` (forest-green top bar, "Padi Check", "[N] of [M] in"), login form, `TypeACode` (MAD- prefix, uppercase, Check button), and data-driven `ResultScreen` with states welcome, already, not-found, not-paid, offline, camera-off. Colours: welcome #15803d, already #c2410c, red #b91c1c, offline #4b5563, camera-off #0e3e2e; white text; result word in font-serif at least 44px; name at least 24px; buttons full width 56px. Call Toyosi on already, not-found and not-paid. In the top bar beside the count, a small text badge from the `fast` field of `GET /api/padi-check/stats` (added 2026-10-23): "Fast" when true, "Slow" when false, so a gate running on the sheet alone is visible at a glance; poll stats about every 15 s. `navigator.vibrate(200)` once per result when available. `aria-live="assertive"` on the result word; focus the primary button on each result. Add `robots: { index:false, follow:false }` metadata to all `/padi-check` routes, add `/padi-check` to the disallow list in `app/robots.ts`, and confirm `app/sitemap.ts` excludes it. Vercel Analytics is mounted in `app/layout.tsx`; it records page views only (no guest data), so leave it unless excluding `/padi-check` is a one-line change; if it is not, leave it and note it in your output.
> DO NOT: add the camera, QR generation, admin pages, icons, cards, gradients, animation or sound; show email or phone; use contractions in copy.
> TESTS OR CHECKS: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`. Manually, with `npm run dev`: TEST One shows green then orange; MAD-ZZZZZZ red not-found; TEST Four red not-paid; stop the network (or point the URL at a bad host) for offline.
> OUTPUT: files changed, check results, and screenshots or descriptions of the six states.

**Definition of done:**
- [ ] All six states render with the exact copy; each is readable in greyscale (AC-R005-01).
- [ ] Count updates after a green and after reload (AC-R006-01).
- [ ] Badge reads "Fast" with Upstash working and "Slow" with the Upstash URL pointed at a bad host.
- [ ] Page source shows noindex; sitemap has no padi-check (AC-R012-01).
- [ ] No guest email or phone anywhere on the page (AC-R005-03).
- [ ] Build passes. Commit: `feat(padi-check): typed check-in and result screens`.

**Depends on:** 1.2, 1.3. **Can run in parallel with:** None.
**Checkpoint and recovery:** The commit.

### Session 1.5 — Walking skeleton on the real phone
**Single job:** On a Vercel preview, the volunteer's phone logs in, types a TEST code and gets green with the time in the sheet.
**Requirements covered:** R-004, R-005 on device; NFR performance.
**Execution mode:** MANUAL

**Execution procedure:**
1. Vercel, Project, Settings, Environment Variables: add all six Padi Check variables for **Preview** only, and set Preview's `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` to the TEST URL. Leave Production unchanged. The gate memory needs `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Preview too; if the existing ones already apply to Preview, leave them (memory keys are separated by environment, so Preview never touches Production's).
2. Push the branch: `git push -u origin feat/padi-check`. Open the preview URL Vercel creates.
3. On the volunteer's phone (Safari if iPhone): open `/padi-check`, log in, type TEST Two's code. Time from tap to colour.
4. Check the sheet shows TEST Two's time. Tap Call Toyosi on a red and confirm the dialler opens with the right number (hang up).
5. Reset TEST rows' `Checked In?` to `No`. The gate memory follows a reset made by hand, but only for arrivals more than 10 minutes old, at its next refresh (every 5 minutes): allow up to about 15 minutes before rescanning a reset code, or it will still say Already checked in.
6. While on the phone, open `/padi-check/preview` and look at all six screens outdoors after dark.

**Definition of done:**
- [ ] Green on the real phone within 3 s; sheet updated.
- [ ] Badge reads "Fast".
- [ ] Call Toyosi opens the correct number (AC-R005-02).
- [ ] Production env vars untouched.

**Depends on:** 1.4. **Can run in parallel with:** None.
**Checkpoint and recovery:** Preview URL recorded. If slow or broken here, stop and fix before Phase 2: this is the cheapest moment to learn it.

---

### Phase 2: Vertical slices

### Session 2.1 — Gate pass QR on the confirmation page
**Single job:** The confirmation page shows a scannable Gate pass, and a signed QR image route exists for email.
**Requirements covered:** R-007, R-008 (page), AC-R007-01..02, AC-R008-01 (page part).
**Execution mode:** CODING AGENT

**Execution procedure:**
> STATE PREFLIGHT (see Section 1).
> TASK: Implement the Gate pass per `usl-build/7-prd.md` R-007 and R-008 and `usl-build/6-landing-page-copy.md` Surface 1, using prompt P2 in `usl-build/6-landing-page-build-sequence.md`.
> BUILD: install `qrcode` and `@types/qrcode` at the versions recorded in Session 0.1 (only these). `lib/gate-pass/qr.ts`: build QR text `CODE|Full Name|Ticket label` (name capped at 80 chars), sign `c|n|t` with HMAC-SHA256 using `GATE_PASS_SECRET` (base64url), verify, render SVG and PNG (480px, white quiet zone). `app/api/gate-pass/qr/route.ts`: GET `?c&n&t&s`, 404 on bad signature or invalid code shape, PNG with `Cache-Control: public, max-age=31536000, immutable`. On `app/events/mad-settings/registered/page.tsx`, inside the existing gold box only: "Your gate pass" label, inline SVG QR (at least 220px, fixed size) above the code, then "Screenshot this now. Show it at the gate." and "If your gate pass will not scan, your name still gets you in." Render the QR only when `isValidSignupCode` passes; leave the rest of the page unchanged.
> TESTS OR CHECKS: Vitest for sign/verify (valid, altered, unsigned) and QR text building. `npm test`, lint, `npx tsc --noEmit`, `npm run build`.
> DO NOT: change the sign-up route or email yet; add other dependencies.
> OUTPUT: files changed, test results.

**Definition of done:**
- [ ] AC-R007-01 unit-tested; altered URL returns 404.
- [ ] A fresh TEST sign-up on dev shows the QR on the confirmation page; Padi Check (typed) still works; a stock phone camera reads the QR text (AC-R007-02 part).
- [ ] Commit: `feat(gate-pass): QR on the MAD Settings confirmation page`.

**Depends on:** 1.5. **Can run in parallel with:** 2.4.
**Checkpoint and recovery:** The commit.

### Session 2.2 — Camera scanning
**Single job:** Padi Check reads a Gate pass with the phone camera and sends exactly one check per QR.
**Requirements covered:** R-004, AC-R004-01..03.
**Execution mode:** CODING AGENT

**Execution procedure:**
> STATE PREFLIGHT (see Section 1).
> TASK: Add camera scanning to Padi Check per `usl-build/7-prd.md` R-004.
> BUILD: install `html5-qrcode` at the version recorded in Session 0.1. A client `Scanner` component above the existing Type a code box: rear camera (`facingMode: 'environment'`), "Point at the gate pass". `lib/padi-check/extract-code.ts`: find `MAD-[A-HJ-NP-Z2-9]{6}` in decoded text (uppercase), else treat as not-found locally. Pause decoding after a hit until Next guest or Try again. Camera permission denied or `getUserMedia` missing: show the camera-off state with typed entry still working; on iPhone without `getUserMedia`, add "Open this page in Safari" under the camera-off detail. Stop the camera when the page is hidden.
> TESTS OR CHECKS: Vitest for `extractCode` (plain code, full QR text, junk, lowercase). `npm test`, lint, `npx tsc --noEmit`, `npm run build`.
> DO NOT: change result screens or API; add dependencies beyond `html5-qrcode`.
> OUTPUT: files changed, test results.

**Definition of done:**
- [ ] On the preview, the volunteer's phone scans a Gate pass shown on another phone at arm's length (indoors now; outdoors at night in 3.2) (AC-R004-01 part).
- [ ] Denying the camera shows camera-off and typing still works (AC-R004-02).
- [ ] Holding a QR in view produces one request (check Vercel logs or the Scan log) (AC-R004-03).
- [ ] Commit: `feat(padi-check): camera scanning`.

**Depends on:** 2.1. **Can run in parallel with:** 2.3, 2.4.
**Checkpoint and recovery:** The commit.

### Session 2.3 — Gate pass in the confirmation email
**Single job:** Every new sign-up's confirmation email carries a Gate pass image that scans green.
**Requirements covered:** R-008 (email), AC-R008-01.
**Execution mode:** CODING AGENT

**Execution procedure:**
> STATE PREFLIGHT (see Section 1).
> TASK: Add the Gate pass to `buildCustomerEmail` in `app/api/mad-settings-signup/route.ts` per `usl-build/7-prd.md` R-008 and `usl-build/6-landing-page-copy.md` Surface 2, using prompt P3 (email part only) in `usl-build/6-landing-page-build-sequence.md`.
> BUILD: inside the existing code block, "Your gate pass", a 240x240 `<img>` whose src is the absolute signed URL from `lib/gate-pass/qr.ts` (base URL `SITE_URL` from `lib/seo.ts`), `alt="Your gate pass, code MAD-XXXXXX"`, then the code text, then "Screenshot this now. Show it at the gate." Every user value through `escapeHtml`. Keep the existing inline-style table layout and everything else in the email unchanged.
> DO NOT: change recording, the cap, the internal email, or any other route.
> TESTS OR CHECKS: `npm test`, lint, `npx tsc --noEmit`, `npm run build`.
> OUTPUT: the diff.

**Definition of done:**
- [ ] A TEST sign-up on the preview delivers an email (to your inbox) showing the QR in Gmail web and the Gmail app; it scans green in Padi Check (AC-R008-01).
- [ ] With images blocked, the code text is still visible.
- [ ] Commit: `feat(gate-pass): QR in the MAD Settings confirmation email`.

**Depends on:** 2.1. **Can run in parallel with:** 2.2, 2.4.
**Checkpoint and recovery:** The commit.

### Session 2.4 — Admin login, Gate card and printed guest list
**Single job:** An admin can log in and print the Gate card and the minimal guest list; the volunteer cannot.
**Requirements covered:** R-003 (admin), R-010, R-011, AC-R003-01, AC-R010-01, AC-R011-01.
**Execution mode:** CODING AGENT

**Execution procedure:**
> STATE PREFLIGHT (see Section 1).
> TASK: Build the admin-only print pages per `usl-build/7-prd.md` R-010 and R-011, with copy from `usl-build/6-landing-page-copy.md` Surface 6 VERBATIM.
> BUILD: admin login on `/padi-check/card` and `/padi-check/list` using role `admin` (reuse the session and login route; the volunteer role gets 403). `/padi-check/card`: A5 print stylesheet, three colour bands, the Toyosi number from `PADI_CHECK_CALL_PHONE`. `GET /api/padi-check/roster` (admin) calling the `roster` action; `/padi-check/list`: print table Name, Code, Ticket, Tent sorted by name, with a printed timestamp. Both noindex.
> DO NOT: show email or phone on the list; build the back-fill (deferred D-006).
> TESTS OR CHECKS: unit test that the roster mapping drops email and phone. `npm test`, lint, `npx tsc --noEmit`, `npm run build`.
> OUTPUT: files changed, test results.

**Definition of done:**
- [ ] Volunteer session gets 403 on card, list and roster (AC-R003-01).
- [ ] Card prints legibly on A5 (AC-R010-01); list shows TEST rows with no email or phone (AC-R011-01).
- [ ] Commit: `feat(padi-check): gate card and printed guest list`.

**Depends on:** 1.3. **Can run in parallel with:** 2.1, 2.2, 2.3.
**Checkpoint and recovery:** The commit.

---

### Phase 3: Hardening and acceptance

### Session 3.1 — Security, privacy and accessibility sweep
**Single job:** Every PRD Section 9 check that can be verified in code passes.
**Requirements covered:** NFR security, privacy, accessibility, analytics, observability; R-012.
**Execution mode:** CODING AGENT

**Execution procedure:**
> STATE PREFLIGHT (see Section 1).
> TASK: Audit the Padi Check and Gate pass changes on this branch against `usl-build/7-prd.md` Section 9. Report first, then fix only real failures, each tied to a Section 9 row.
> CHECK: no secret names or values in client bundles (`npm run build` then search `.next/static` for `PADI_CHECK_`, `GATE_PASS_SECRET`, the script URL); `git grep` for the Toyosi number and for any personal email returns nothing; API responses and logs never carry email or phone; contrast of each result colour with white text meets WCAG AA for the detail text size (report ratios); login and typed entry operable by keyboard with visible focus; Vercel Analytics on `/padi-check` sends page views only (no names, codes in query strings, or guest data); noindex on every `/padi-check` route; rate limits applied to login and check.
> DO NOT: add features or refactor beyond fixes.
> OUTPUT: a table of each check, result, and fix commit if any. Run `npm test`, lint, `npx tsc --noEmit`, `npm run build`.

**Definition of done:**
- [ ] Every check passes or has a fix committed.
- [ ] Commit(s): `fix(padi-check): ...` as needed.

**Depends on:** 2.1, 2.2, 2.3, 2.4. **Can run in parallel with:** None.
**Checkpoint and recovery:** Last commit.

### Session 3.2 — Full run-through on both phones
**Single job:** Every acceptance criterion passes on the preview on the volunteer's phone, ideally outdoors after dark.
**Requirements covered:** All ACs; S1 dress test.
**Execution mode:** MANUAL

**Execution procedure:**
1. Push the branch; use the new preview URL.
2. Fresh TEST sign-up (attendance only, your email): check the page and email QR.
3. On the volunteer's phone, outdoors after dark if possible: green, orange (repeat scan), red not-found (`MAD-ZZZZZZ` typed), red not-paid (TEST Four), offline (aeroplane mode briefly), camera-off (deny permission). Time each scan.
4. Run AC-R003-01 (volunteer blocked from card and list), print the card and list.
5. Tick every AC in the PRD traceability matrix; note anything failing in Section 9 and fix before 4.1.
6. Reset TEST rows' `Checked In?` to `No` and clear the Scan log.

**Definition of done:**
- [ ] Every AC in PRD Sections 5 and 9 ticked.
- [ ] Scan to result within 3 s on the real phone.

**Depends on:** 3.1. **Can run in parallel with:** None.
**Checkpoint and recovery:** If anything fails, fix in a coding session and repeat this run-through.

---

### Phase 4: Production release and operation

### Session 4.1 — Go live (26 Oct)
**Single job:** campingnigeria.com runs Padi Check and Gate passes against the live sheet, with test rows removed, before sales open on 27 Oct.
**Requirements covered:** Release gate (Section 6); R-001 in production.
**Execution mode:** MANUAL with a final CODING AGENT merge check

**Execution procedure:**
1. Apps Script: Deploy, Manage deployments, select the EXISTING production deployment, Edit, Version: New version, Deploy. The URL stays the same. Archive the TEST deployment.
2. Vercel: add the six Padi Check variables for **Production**. `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` in Production stays the existing production URL. Also: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` must be the new database (made under the shared business login, not a personal one), and `CRON_SECRET` set to a long random string for the daily Upstash check.
3. Merge `feat/padi-check` into `main` (after `npm test`, lint, type check and build pass) and let Vercel deploy production.
4. Smoke test on production: sign up once as "TEST Live", **Attendance only**, your email. Confirm the page QR and the email QR. Scan on the volunteer's phone: green. Scan again: orange.
5. Delete every TEST row from the Sign-ups sheet (including your original test row and TEST Live) and clear the Scan log. Confirm the doGet heartbeat shows the expected sign-up and tent counts (0). The gate's memory drops deleted rows at its next refresh, within 5 minutes.
6. Vercel, Settings, Cron Jobs: the `upstash-heartbeat` job is listed. Click Run once; it should succeed and send no alert email.

**Definition of done:**
- [ ] Production smoke test green then orange, with the badge on "Fast".
- [ ] No TEST rows remain; tent count 0.
- [ ] Upstash heartbeat ran once in production without an alert.
- [ ] Rollback noted: previous Apps Script version number and previous Vercel deployment.

**Depends on:** 3.2. **Can run in parallel with:** None.
**Checkpoint and recovery:** Vercel instant rollback to the previous production deployment; Apps Script Manage deployments, set the production deployment back to the noted version.

### Session 4.2 — Rehearsal and go/no-go (28 Oct, after dark)
**Single job:** A recorded decision to use Padi Check on 31 Oct, or to fall back.
**Requirements covered:** S1.
**Execution mode:** MANUAL

**Execution procedure:**
1. Give the volunteer the 5-minute walkthrough (colours, typed entry, Call Toyosi, the printed list).
2. Add three attendance-only TEST rows on the live site with your email; set one to `Paid? = No`.
3. Outdoors after dark, the volunteer, unaided, runs 10 checks across all four outcomes plus a typed code. Time each.
4. Delete the TEST rows and their Scan log entries immediately afterwards (real sign-ups now exist; do not touch them).
5. Record the decision in `usl-build/STATE.md`: pass, use on 31 Oct; fail, Lookup tab plus printed list on the night.

**Definition of done:**
- [ ] Decision recorded with times.
- [ ] TEST rows deleted; real rows untouched.

**Depends on:** 4.1. **Can run in parallel with:** None.
**Checkpoint and recovery:** Not applicable; the fallback is the decision.

### Session 4.3 — Event night and review (31 Oct onward)
**Single job:** The gate runs on Padi Check and the results are recorded.
**Requirements covered:** S2 to S5, R-013.
**Execution mode:** MANUAL

**Execution procedure:**
1. Morning of 31 Oct: print the Gate card and a fresh guest list (admin login). Charge the phone; confirm data.
2. On the night: volunteer uses Padi Check; Toyosi has the sheet open and takes the calls.
3. Within three days: count guests checked in versus head count (S2), note queue time (S3), read the Scan log (S5). Rotate both passwords and the session secret in Vercel; redeploy.
4. Record results in `usl-build/STATE.md` and the PRD's Section 3 decisions.

**Definition of done:**
- [ ] S2, S3 and S5 recorded.
- [ ] Passwords and session secret rotated.

**Depends on:** 4.2. **Can run in parallel with:** None.
**Checkpoint and recovery:** Not applicable.

---

## 6. PRODUCTION RELEASE GATE

- [ ] Sessions 0.1 to 3.2 pass
- [ ] Preview build matches the merge candidate
- [ ] Production secrets present in Vercel and absent from git and client bundles
- [ ] `npm test`, lint, type check and build pass
- [ ] Production smoke path green then orange (Session 4.1)
- [ ] No TEST rows remain in the live sheet
- [ ] Rollback versions recorded (Apps Script and Vercel)
- [ ] Known limitations recorded: guest name in QR image URL; no undo; one scanner

---

## 7. RECOVERY PROTOCOL

When a session fails: stop dependent sessions, keep notes without guest data, compare with the last commit or Apps Script version, choose repair or restore, record the decision in Section 9, and re-run the failed checklist. Never weaken a checklist item to pass it. If sign-ups break at any point, restore the production Apps Script deployment to the noted version first, then diagnose.

---

## 8. TEST-IN-V1 DECISION LOG

| Requirement | Exposure | Metric and thresholds | Result | Decision | PRD or offer revision needed |
|---|---|---|---|---|---|
| None in scope | | Rehearsal S1 is the go/no-go | | | |

---

## 9. BACKLOG AND DECISION LOG

| Item | Type | Source | Reason outside current session | Decision owner | Affected IDs |
|---|---|---|---|---|---|
| Admin back-fill email | deferred | PRD D-006 | Sales open 27 Oct, after go-live | Founder | R-009 |
| Tent ID, multiple scanners, undo, other events, offline | deferred | PRD D-001 to D-005 | Triggers not met | Founder | D-001 to D-005 |
| No sheet copy; build on a TEST deployment of the live sheet | deviation | User, 2026-10-17 | Only founder test rows exist before 27 Oct | Founder | R-001 |
| Apps Script too slow for the 3 s target. Session 1.2, 2026-10-23, dev PC to TEST deployment: AC-R001-01..05 all pass, but 20 `checkin` calls gave median 4.8 s, fastest 2.5 s, 5 of 20 under 3 s, 6 of 20 no answer within 15 s. A plain GET heartbeat (no lock, no write) took 2.9 to 4.7 s with one over 20 s; spikes of 18 to 19 s occurred on both the script hop and the answer-fetch hop, while the PC reached Google in 90 to 560 ms. So the delay is Google's Apps Script service, not the script or the connection. One unknown-code call came back as the doGet heartbeat (a Google redirect glitch, not reproduced); the website must treat any reply without `status` as offline. | risk (stop rule) | Session 1.2 timing | Typical over 3 s: build paused for a founder decision on the check path | Founder | R-001, R-002, NFR performance |
| Gate fast memory in Upstash. Decided by the founder 2026-10-23 after the timing above. Deviates from PRD Section 8 ("No new database"): the paid list is copied from the sheet into the existing Upstash Redis (`lib/padi-check/gate.ts`), known guests are answered from it (HSETNX makes the first scan the only welcome), and each arrival is written to the sheet afterwards with the gate's time, retried until confirmed. Unknown codes still ask the sheet live; without Upstash every check asks the sheet. The sheet stays the system of record. The script gained an optional `at` on `checkin` and `checkedInAt` on `roster` entries; both are backward compatible. | deviation | Founder, 2026-10-23 | Changes R-002's check path and adds a dependency on Upstash being up | Founder | R-001, R-002, NFR performance and reliability |
| The Upstash database in `.env.local` no longer exists (DNS: non-existent domain, 2026-10-23), so local rate limiting has been failing open, and the fast memory cannot run until a new database is made. If Vercel holds the same URL, the live forms' rate limiting is failing open too. The Redis client now times out each request at 1.5 s with no retries, instead of five retries with no timeout. | risk | Session 1.3 live test | Needs the owner's Upstash account | Founder | R-002, R-003, NFR security |
| Upstash safeguards, agreed 2026-10-23: (1) the new database lives under the shared business login; (2) a daily Vercel Cron, `/api/cron/upstash-heartbeat` (built 2026-10-23), writes to Upstash so the free database is never archived for disuse, and emails hello@ if it does not answer; (3) the scanner shows "Fast" or "Slow" (Session 1.4). Free plan: 1 database, 500K commands a month, 256 MB; one event night uses about 10K commands. | decision | Founder, 2026-10-23 | Silent failure of Upstash went unnoticed for a month | Founder | R-002, NFR reliability and observability |
| Production does not use the dead database: the founder confirmed on 2026-10-23 that Vercel's `UPSTASH_REDIS_REST_URL` does not contain `mature-lab-104674`. Which Upstash account owns the production database is not known (the new local one is under a founder's personal account). Production logs show 1 rate-limit message in 3 days, on `/api/mad-settings-signup`, which could not be opened (the log search timed out), so production's Upstash is probably alive but not proven. Session 4.1 step 6 (run the heartbeat once) is the proof; move both databases under the shared business login after the event. | risk | Founder, 2026-10-23 | Needs the Vercel owner | Founder | NFR security and reliability |
| `font-mono` in `app/globals.css` points at Geist Mono, which is never loaded, so the codes on the Camp Night and MAD Settings confirmation pages render in the browser's fallback serif. Padi Check uses `font-sans` instead. Fix when Session 2.1 edits the MAD Settings confirmation page (load a mono face via `next/font/local`, or switch to `font-sans`). | defect | Session 1.4 screenshots, 2026-10-23 | Outside 1.4's files | Founder | R-007 |
| Vercel Analytics stays mounted on `/padi-check`: it records page views only, never guest data, and excluding one route needs a client wrapper, not a one-line change (Session 1.4's stated condition). | decision | Session 1.4, 2026-10-23 | Not a one-line change | Founder | R-012 |
| The site-wide `Permissions-Policy` header in `next.config.mjs` (line 55) sends `camera=()`, which forbids the camera on every page, so the Session 2.2 scanner cannot work as things stand (seen on the preview, 2026-10-25). Session 2.2 must give `/padi-check` its own header with `camera=(self)`, keeping `camera=()` everywhere else. | blocker for 2.2 | Preview headers, 2026-10-25 | Belongs to the camera session | Founder | R-004 |
| Longer term: a lasting record of attendees across events (repeat guests, history, follow-ups) would want a real database, probably the quote tool's Supabase. Not before 31 Oct. | deferred | Founder, 2026-10-23 | Out of scope for this build | Founder | None |

---

## 10. TOOLING CURRENCY AND SOURCES

Recorded in Session 0.1 (npm registry, checked 2026-10-17):
- `html5-qrcode` 2.3.8, published 2023-04-15; no release since. README says the project is "in maintenance mode until further notice": no bug fixes, PRs not merged. Repo not archived, 448 open issues.
- `qrcode` 1.5.4, published 2024-08-05. Mature and widely used; slow release cadence.
- `@types/qrcode` 1.5.6, published 2025-10-24 (DefinitelyTyped).

Carried from Stage 1: html5-qrcode supports iOS Safari 15.1+ over HTTPS (https://classic.yarnpkg.com/en/package/html5-qrcode, checked 2026-10-14). Still to confirm in practice: Apps Script quotas on a personal account (watch during Session 1.2 timing), Resend plan limits for normal sign-up volume.
