# decisions.md

*Why* things are built the way they are. Write once, never delete. If a decision is reversed, add a new entry noting the reversal — don't rewrite history.

---

## Tailwind v4 with `@theme inline`, no `tailwind.config.js`

Brand tokens live as CSS custom properties in `app/globals.css`, exposed to Tailwind via `@theme inline { --color-brand-dark: var(--brand-dark); ... }`. This means `bg-brand-dark` and friends are generated classes — no JS config.

**Why:** Single source of truth in CSS, zero JS at token-lookup time, and the tokens are shared with email HTML (which can't import JS config) without duplication.

---

## Resend via direct `fetch()`, not the `resend` SDK

All 4 API routes (`contact`, `gear-quote`, `proposal`, `assessment-lead`) POST directly to `https://api.resend.com/emails` with a small shared `sendResendEmail()` helper per route.

**Why:** Started this way in the first route. Kept consistent across subsequent routes instead of half-adopting the SDK. Removes a dependency and one potential breaking-change vector. If we ever need SDK features (batch, idempotency keys, react-email rendering), migrate all 4 at once.

---

## Two emails per form submit (internal + customer confirmation)

Every successful submit fires a branded HTML notification to `hello@campingnigeria.com` AND a branded confirmation to the submitter's email.

**Why:** Submitters want immediate reassurance their enquiry landed. The internal email gets `reply_to` set to the submitter so hitting Reply goes straight to them — no manual copy-paste.

---

## Single-page forms — no multi-step wizards

Contact, gear-quote, proposal, and assessment all live on one page and submit in one go. A 3-step wizard mockup for gear-rental was proposed and declined.

**Why:** Consistency across forms. A wizard would be the only one on the site, so every user would learn a different pattern. Also: our conversion surface is small and fields are few — a wizard adds friction without payoff.

---

## `Full Name` single field, not `First Name` / `Last Name` split

Every form uses one `fullName` text input. A split was proposed for gear-rental and declined.

**Why:** Consistent with every other form; splits introduce localisation issues (many Nigerian names don't cleanly split); parsing `firstName = fullName.split(' ')[0]` in email greetings is good enough.

---

## Email required on all forms (even where phone is also required)

Gear-rental requires both email and phone. The proposal mockup suggested email-optional; we rejected that.

**Why:** The customer-confirmation email depends on having an email. Removing email would break one half of the two-email pattern and leave the submitter with no audit trail of what they requested.

---

## `escapeHtml()` + `safeUrl()` + CRLF-stripped headers in every email route

Lives in `lib/html.ts`. Every user-supplied field passes through `escapeHtml()` before interpolation into email HTML; every user-supplied URL passes through `safeUrl()` (http/https only, upgrades bare hostnames); every email subject runs through `safeHeader()` (`replace(/[\r\n]/g, ' ')`).

**Why:** Security review found raw interpolation of `fullName`, `email`, `message`, `website`, `recommendation` into HTML bodies and `href` attributes — classic XSS and header-injection surface. The helpers make the safe path the easy path.

---

## Hand-rolled `isValidPayload` type guards instead of zod

Each API route has a local shape-check that returns 400 on malformed input.

**Why:** Dependency light (no zod), payloads are tiny (4–8 fields), and the check is right next to the handler so it can't drift. If payload shapes grow, revisit.

---

## iOS Safari input zoom prevention: `text-base sm:text-sm`

All form inputs use `text-base` on mobile (16px) and `text-sm` on `sm:` and up.

**Why:** iOS Safari auto-zooms on any `<input>` with font-size under 16px on focus. The zoom doesn't reverse cleanly. 16px on mobile is the documented fix.

---

## Dynamic viewport units (`dvh`) instead of `vh` on hero sections

`PageHero` accepts `height: 'min-h-dvh' | 'h-[70dvh]' | 'h-[60dvh]'` only.

**Why:** iOS and Android browser URL bars show/hide on scroll, so `vh` causes layout shift as the URL bar disappears. `dvh` tracks the dynamic viewport and stays stable.

---

## `ScrollToTop` with `behavior: 'instant'` on route change

`components/ScrollToTop.tsx` uses `usePathname()` + `useEffect` to `window.scrollTo({ top: 0, behavior: 'instant' })` on every route change (unless there's a `#hash` in the URL).

**Why:** CSS `scroll-behavior: smooth` combined with Next router navigation caused landing mid-page on reveals. `'instant'` explicitly overrides the CSS smooth default. The `hash` check preserves anchor links.

---

## Outlook Bookings is link-out only

The DoE consultation CTA opens `CALENDAR_BOOKING_URL` in a new tab — it is never iframed.

**Why:** Microsoft sets `X-Frame-Options: DENY` on the Bookings page, and there is no JS embed SDK. The build sequence originally implied an inline embed; we confirmed this is impossible and shipped a link-out.

---

## Gear-rental `rentalDates` field stays a single string in the API

The UI uses two `<input type="date">` pickers, but the client combines them into `"14 March 2026 – 17 March 2026"` before POST. The API and email templates still receive `rentalDates: string`.

**Why:** Keeps the API contract and both email templates untouched. The combined string is already human-readable in the internal notification email.

---

## DoE pricing note is a flat add-on, not per-tier

All three tiers are priced "for up to 60 students"; the "+₦50,000 per additional student up to 100" note is shared under the grid, not duplicated on each card.

**Why:** Avoids repetition and stays consistent with the PDF offer sheet (`public/pdf/CampingNigeria_DoE_Offer_download.pdf`).

---

## DoE assessment — q4 drives the tier, q2/q3 tailor copy

`getRecommendedTier(q2, q3, q4)` builds the tier object from templates. q4 alone selects Base Camp vs. Trail Ready vs. Summit Partner; q2 adds a "Since your school already runs the Award…" prefix to the summary; q3 previously drove capacity copy but is now effectively unused (pricing is fixed).

**Why:** An earlier version ignored q1–q3 entirely, which a reviewer flagged as "overstating personalization". Lightweight tailoring is the minimum that honours the user's answers without over-engineering.

---

## Client-side "anti-spam hold" for the assessment: removed

An earlier `hasSubmitted` flag persisted across the reset flow and blocked legitimate resubmits after "Start again".

**Why:** It was a ghost submit lock with no server-side counterpart; real abuse protection belongs on the API, not in component state. Removing it is strictly better UX.

---

## On-campus-camps recommendation guard

`proposal-engine.ts` computes `campsEligible = answers.duration === '2-days'` and uses `-Infinity` when ineligible, so the on-campus-camps program can never win for half-day or full-day proposals.

**Why:** On-campus-camps is literally 2-day only. Without the guard the scoring math could produce a program recommendation the user's own answers rule out.

---

## Microsoft Forms link for "Book Your Spot" (individuals)

Individual trip bookings open `https://forms.office.com/r/bgsZ4shNxD` in a new tab.

**Why:** The ops team already runs this form in M365. Rebuilding it inline would duplicate the workflow and fork the response database.

---

## Honeypot returns fake success, not 400

When `website_confirm` is non-empty server-side, the route returns `{ success: true }` with status 200 (not a 400 or 429), even though nothing was sent.

**Why:** If bots got a distinct error they could retry or adapt. Returning the same shape as a real success makes the honeypot invisible to a naïve scraper — they move on thinking they succeeded, we don't burn Resend quota, and the team inbox stays clean.

---

## IP rate limiter: fail-closed in prod, fail-open in dev, fail-open on transient Upstash errors

`lib/rate-limit.ts#checkRateLimit` has three distinct failure modes:

- **Env vars missing in production (`NODE_ENV === 'production'`):** fail closed — return 429 with a loud one-shot error log. A misconfigured prod deploy shouldn't silently lose all bot protection.
- **Env vars missing in development:** fail open. Local dev shouldn't need an Upstash account to exercise the forms.
- **Upstash reachable but `limiter.limit()` throws** (transient network error, Upstash outage): fail open. Better a few unprotected requests than 500ing a legitimate submitter because Upstash had a bad minute.

**Why:** The earlier blanket fail-open behaviour made sense for dev but was wrong for prod — a reviewer pointed out that bot protection would silently drop to honeypot-only if env vars were ever missing. Separating by `NODE_ENV` gives us strict prod + forgiving dev + graceful-degradation on transient errors.

---

## Rate-limit budget is per-route, not global per-IP

Each form route keys the Upstash limiter with `"<routeKey>:<ip>"` — `contact`, `gear-quote`, `proposal`, `assessment-lead` each have independent 5/hour budgets.

**Why:** A family member sending a gear-quote enquiry shouldn't exhaust the household's contact-form budget. Abuse of one form doesn't need to punish access to the others. If we see a user genuinely sitting at the per-route cap, that's a signal worth a closer look — not noise from mixed traffic.

---

## Recommendation payloads are derived server-side, never trusted from the client

The proposal route takes `{ answers, contact }` and calls `scoreAnswers(answers)` itself. The assessment route takes `{ name, email, school, answers }` and calls `getRecommendedTier(answers.q2, answers.q3, answers.q4)` itself.

**Why:** An earlier security review flagged that the server was interpolating client-supplied `result.programTitle`, `tier.*`, and `recommended` directly into outbound emails — a caller could fabricate any recommendation regardless of their answers. The fix is the trust-boundary principle: client UI shows what it wants for UX, but the source of truth that reaches email has to be computed from inputs that are themselves validated.

---

## Hand-rolled validation, not zod

Proposal and assessment routes use hand-written `isValidPayload`/`isValidAnswers` type guards, with enum allowlists declared alongside their types in `lib/proposal-engine.ts` and `lib/expedition-recommendation.ts`.

**Why:** Kept from an earlier decision to stay dependency-light. With the newer enum allowlists, format checks (email regex, phone digit count), and `withinLengthCaps` in `lib/html.ts`, the guards are now close to zod-strength in coverage. If we add a 5th form we should re-evaluate — the incremental value of zod grows with the number of routes.

---

## Security headers in `next.config.mjs` — CSP in report-only mode

5 non-CSP headers are enforced at the framework edge: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security` (2-year HSTS with preload).

A starter CSP also ships, but as `Content-Security-Policy-Report-Only`, not enforcing. Browsers log violations to the DevTools console; nothing is blocked.

**Why report-only first:** A restrictive CSP without tuning would break the page on first load — Framer Motion inlines styles, Vercel Analytics loads from `va.vercel-scripts.com`, `next/image` and `next/font` each add specific script/connect/img sources. Report-only mode lets us collect real-traffic violations for a week or two, tighten the policy against what we actually see, then flip the header key to `Content-Security-Policy` to enforce. Tracked in state.md.

---

## `sendPairedMail` — one helper for internal + customer emails

Extracted to `lib/mail.ts`. Takes a `from`, an `internal` (with `replyTo`), and a `customer` payload. Sends both in parallel; success semantics: if the internal email lands, the submit is a success regardless of whether the customer confirmation succeeded.

**Why split-success:** The team having the lead is load-bearing; the customer getting a branded confirmation is nice-to-have. If the customer's mail provider rejects or the customer email template has a transient issue, we don't want to lose the lead AND lie to the user with a "mailto fallback" banner. Log the failure and move on.

---

## On-campus-camps tier selection driven by groupSize

`selectTier` for `on-campus-camps` uses groupSize to pick a tier: `under-40 → Spark`, `40-80` and `80-150 → Trail`, `150+ → Summit`.

**Why:** The `campsEligible` guard upstream forces `duration === '2-days'` for on-campus-camps to ever be selected, which meant the original duration-driven selection collapsed to always-Summit. We briefly shipped that flat behaviour, then restored differentiation using groupSize — it's the same signal nature-craft and leadership-development already use, so the three programs now tier on consistent logic. Covered by tests in `tests/proposal-engine.test.ts` so we don't silently regress to flat tiering again.

---

## `prefers-reduced-data` → skip hero video entirely

`BackgroundVideo` reads the MQL via `useSyncExternalStore` and renders only the poster (or nothing) when the user has data-saver on.

**Why:** 19.8 MB hero video is painful on metered connections; honouring the explicit user signal is the right default. `useSyncExternalStore` avoids both SSR/client hydration mismatches and the newer `react-hooks/set-state-in-effect` rule violation. Pair this with the tracked TODO to re-encode the video to 3–5 MB — poster + reduced-data detection is the software fix, size reduction is the asset fix.

---

## Tests: Vitest, pure-function coverage first

`npm test` / `npm run test:watch` run Vitest against files in `tests/`. Initial coverage targets the security-critical pure functions: `escapeHtml`, `safeUrl`, `isHoneypotTripped`, `withinLengthCaps`, `isValidAnswers`, `scoreAnswers` (program + tier selection), `isValidAnswerKey`, `getRecommendedTier`.

**Why pure functions first:** these are the highest-ROI targets — they're deterministic, they're load-bearing for security (anyone who slips past them gets their input into outbound emails), and they have no framework dependencies so tests are fast (<1s for 44 tests). Integration tests against the actual route handlers are the natural next step; deferring until we have a reason to pay their cost.

**Why Vitest:** it reads the TypeScript files directly without a separate transpile step, resolves the `@/` alias via `vitest.config.ts`, and shares ecosystem familiarity with Vite/modern tooling. Jest would also work; nothing about the choice is load-bearing.

---

## Post-hydration date initialisation in `QuoteForm`

`today` and `minEndDate` start as empty strings and are set to `todayISO()` inside a `useEffect`. The effect is marked with a single `eslint-disable-next-line react-hooks/set-state-in-effect` comment.

**Why:** SSR can't know the browser's local timezone, so rendering a `min="2026-04-22"` on the server and `min="2026-04-23"` on the client near midnight produces a hydration mismatch. Empty string on both sides, filled after hydration, is correct. The eslint rule is new in react-hooks 7 and doesn't have a recommended escape for legitimate post-hydration init — the disable comment is documented in-place.
