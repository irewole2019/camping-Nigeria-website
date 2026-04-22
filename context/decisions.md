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
