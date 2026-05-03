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

## `Organization + LocalBusiness` hybrid, one global entry with a stable `@id`

`lib/structured-data.ts#buildOrganizationJsonLd` emits `"@type": ["Organization", "LocalBusiness"]` with a stable `"@id": "{SITE_URL}/#organization"` and a real `PostalAddress` (198 Damboa Close, PW, Kubwa, Abuja). `WebSite` and every `Service` schema reference the org via `@id` instead of duplicating name/url/logo.

**Why:**
- Google accepts the array `@type` and applies both treatments — we keep the generic Organization signals while unlocking LocalBusiness features (address, priceRange, local-pack eligibility) for "camping Abuja"-type queries.
- Stable `@id` lets graph consumers (Google, Bing, LLMs) deduplicate entities. Without it, every page's structured data would assert a separate "Camping Nigeria" organisation.
- `priceRange: ₦₦₦` signals premium positioning without committing to a specific number; real prices appear only where they're fixed (the DoE page).

---

## Service schema: `AggregateOffer` when prices are public, `hasOfferCatalog` when they're quote-based

`buildServiceJsonLd(input)` inspects the `offers` array. When every offer has a numeric `price`, it emits `AggregateOffer` with `lowPrice`/`highPrice`/`offerCount` + individual `Offer` children. When none have prices, it falls back to `hasOfferCatalog` with named `Offer` → `Service` children and no price data.

**Why:**
- Google's price-range rich results require `AggregateOffer` with real numbers. Fabricating prices for quote-based programs would be misleading and risk a manual action.
- The three school programs (Nature Craft, Leadership Development, On-Campus Camps) are quote-based — their tiers describe what's included, not what it costs. `hasOfferCatalog` is the correct shape: it tells Google the tier structure without pretending there's a published price.
- DoE has real, public tier prices (₦3M / ₦5M / ₦8M), so it gets the full `AggregateOffer` treatment and is eligible for price-range snippets in search.

---

## Sitemap includes per-URL `<image:image>` entries

`app/sitemap.ts` attaches an `images: [primaryImageUrl]` field to 10 of 14 routes (every content-heavy page except the forms and legal pages).

**Why:** Google Image Search indexes from sitemaps more reliably than from in-page HTML alone, especially for marketing sites where images often carry the same keyword weight as copy. Zero runtime cost; one more signal path to Google Images for hero imagery that otherwise would only get discovered via crawl.

---

## `CONTACT.address` is the single source of truth for the company address

The registered address is declared once in [lib/constants.ts](../lib/constants.ts) as a structured object (`streetAddress`, `locality`, `region`, `country`, `formatted`). Every consumer — `PostalAddress` in the LocalBusiness schema, the `/contact` page, the privacy policy, any future footer reference — reads from this constant.

**Why:** The address was initially hardcoded as "Lagos, Nigeria" in three places and in the schema. When the real address turned out to be in Abuja (not Lagos), we had to hunt down three strings plus the schema. A single structured constant means the next move/rename is a one-line change that flows everywhere, and `PostalAddress` fields map cleanly from the same object.

---

## Post-hydration date initialisation in `QuoteForm`

`today` and `minEndDate` start as empty strings and are set to `todayISO()` inside a `useEffect`. The effect is marked with a single `eslint-disable-next-line react-hooks/set-state-in-effect` comment.

**Why:** SSR can't know the browser's local timezone, so rendering a `min="2026-04-22"` on the server and `min="2026-04-23"` on the client near midnight produces a hydration mismatch. Empty string on both sides, filled after hydration, is correct. The eslint rule is new in react-hooks 7 and doesn't have a recommended escape for legitimate post-hydration init — the disable comment is documented in-place.

---

## Gear-rental form POSTs direct to the quote tool, not proxied through `/api/`

`components/gear-rental/QuoteForm.tsx` does a direct browser `fetch()` to `https://quote.campingnigeria.com/api/submit-quote`. The previous `app/api/gear-quote/route.ts` was deleted — there is no website-side proxy.

**Why:**
- The quote tool owns the canonical record (Supabase row, reference number `CNQ-2026-XXXX`, pricing math, review queue, send-quote action). Proxying through the website would only relay the payload, while still leaving the quote tool as the source of truth and the place that needs anti-abuse + email infrastructure. Two layers of validation for one record is duplication, not defence-in-depth.
- The honeypot + Upstash rate-limit + Resend stack still lives on the 3 internal routes (contact, proposal, assessment-lead). The quote tool runs equivalents of those upstream — the website just routes the customer's payload there and shows the response.
- Direct POST keeps the network path one hop shorter and removes a class of website-deploy-causes-quote-failure regressions.

**Tradeoff acknowledged:** the website honeypot input is now rendered but never read at submit. We left it in place as cheap insurance; if a future change wants to remove it for cleanliness, that's fine. The substantive anti-abuse is upstream.

---

## Per-route `opengraph-image.tsx` + `twitter-image.tsx` files using a shared renderer

Each major page (`/`, `/schools`, `/schools/international-award`, the 3 program pages, `/individuals`, `/organizations`, `/gear-rental`, `/about`) has its own `opengraph-image.tsx` and `twitter-image.tsx` pair. Each one calls `renderHeroOgImage()` from [lib/og-image.tsx](../lib/og-image.tsx), which composites the page's hero photo behind a forest-green gradient overlay with the brand pill + share-optimised headline.

**Why per-route files instead of a single dynamic API route:**
- It's the App Router file convention. Next picks them up automatically and wires them into the page's metadata — no manual `openGraph.images` override needed.
- Each social platform fetches `/<route>/opengraph-image` directly, so the URL is stable and crawlable without the indirection of a query-paramed API route.
- Per-route copy (eyebrow + headline + subtitle) is co-located with the route file, which is where you'd look to change it.

**Why share a renderer instead of duplicating ImageResponse JSX 20 times:** the actual rendering is 100+ lines (gradient overlay, layout, typography). Duplicating that across 20 route files would mean every visual tweak is a 20-file change. The renderer is a single import; only the page-specific config (hero path + 3 strings) is per-file.

---

## Route-segment metadata exports must be **inline literals**, not imports or re-exports

In every `opengraph-image.tsx` and `twitter-image.tsx`, `runtime`, `size`, `contentType`, and `alt` are declared as inline literals:

```tsx
export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = '...'
```

We initially tried importing them from `lib/og-image.tsx` (`export const runtime = OG_RUNTIME`) and re-exporting them from a sibling file (`export { default, runtime, size, contentType, alt } from './opengraph-image'`). Both fail.

**Why:** Next.js parses route-segment config from the **source AST**, not the resolved module graph. Imported constants are unresolved at compile time (`Next.js can't recognize the exported \`runtime\` field in route. It needs to be a static string`), and re-exports also fail (`It mustn't be reexported`). Only literals work. The renderer function can still be shared by import — only the config exports have this constraint.

**The trap to avoid:** when adding a new OG/Twitter route, copy a working file as the template and only change the four config strings + the `renderHeroOgImage()` call. Don't try to DRY up the metadata block — it has to stay inline by file.

---

## Base Camp Kids: `lib/events/base-camp-kids.ts` is the single source of truth

Date, time, ISO timestamps, price, seat cap, schedule, FAQs, souvenirs, and image registry all live in one file. The event page (`app/events/base-camp-kids/page.tsx`), the registration API (`app/api/event-registration/route.ts`), the email templates, the confirmation page, the structured-data builder (`lib/structured-data.ts#buildEventJsonLd`), the homepage banner, the navbar link, the sitemap entry, and the Sheets row schema (`lib/event-records.ts`) all read from these constants.

**Why:** The event copy changes more than the rest of the site. Date and time can shift, price tiers can move, the schedule was edited three times before launch, the souvenir list grew. Without a single file every consumer reads from, an "update the time" task becomes "find every component that hardcoded `'10:00 AM – 4:00 PM'`". Today's bump from 10–4 to 9–5 was a 4-line edit because of this discipline; with hardcoded strings it would have been 8+ files and a guarantee of one being missed.

---

## Base Camp Kids schedule: bookend-expand, don't redesign, when the event window changes

When the event window grew from 6 hours to 8 hours (10–4 → 9–5), the existing 11 activity blocks stayed at their original timestamps. We added a `9:00 AM — Gates open / early drop-off` entry at the top and replaced `4:00 PM — Parent pickup begins` with `4:00 – 5:00 PM — Parent pickup window`.

**Why:** The schedule was carefully sequenced — rotation timings, meal service window, energy-management quiet zones. Stretching the activity blocks to fill 8 hours would have introduced gaps that drag for kids and add staff exposure without programming benefit. Treating the new bookends as *gate-open* and *pickup-window* communicates flexibility to parents without unsettling a programme that already works.

---

## Marketing imagery: AI-generated via inference.sh, not stock or human shoot

The six Base Camp Kids marketing assets (hero, positioning, homepage banner, three souvenir tiles) are generated via `openai/gpt-image-2@latest` on inference.sh. The re-runnable script with prompts lives in [scripts/generate-base-camp-kids-images.mjs](../scripts/generate-base-camp-kids-images.mjs).

**Why AI over stock:** Stock photos either depict generic outdoor camps that read American/European, or they cost more than a custom shoot for usage rights at marketing scale. Stock also can't match the brand palette (forest-green tents with gold pennants on Abuja savanna grass) without obvious post-production.

**Why AI over a human shoot:** The event hasn't run yet — there's nothing real to photograph until 30 May 2026. Pre-event shoots with a hired crew, child models, and a permitted location would cost more than a dozen events' worth of website rendering. The plan is to swap these AI assets for real event photography after the inaugural run.

**Composition rule — "no synthetic kid faces":** AI-generated faces of identifiable children read uncanny and risk audience distrust on a kid-facing marketing surface. The prompts compose around children — backs turned, motion blur, hands-only close-ups, distant figures — so the scenes read as "joyful camp" without any identifiable AI-generated child face front-and-centre. Souvenir tiles are still-life only.

---

## On-Campus Camps program rename: "2-Day" → "Multi-day"

`lib/program-data.ts#ON_CAMPUS_CAMPS.title` is now "Multi-day On-Campus Camps" (was "2-Day On-Campus Camps"). The Duration stat is "1+ days" (was "2 Days"). Tier durations changed from "2 days · {format}" to "1+ days · {format}". User-facing copy on the home page, the on-campus-camps marketing page, the proposal form, and the Base Camp Kids page were updated to match.

**Why:** The "2-Day" framing was restrictive. Schools booking through the proposal flow can pick any window from 1 day to 3+ days, the team can deliver against any of those, and the engine already supports it via `getCampDurationOverride`. The marketing should match the product capability instead of constraining it to a single duration.

**What didn't change:**
- The `getCampDurationOverride` logic still fires for 1-day windows (overrides the displayed title to "1-Day On-Campus Camp" for specificity) and 3+ day windows (overrides the tier duration to the actual count). The 2-day no-override case still works — it shows "Multi-day On-Campus Camps · 1+ days · {format}" as the default, which is technically correct (2 is in 1+) and stays consistent with the flexible branding.
- The `Sample Overnight Schedule` content still illustrates a 2-day flow as an example — illustrative, not constraining. Renamed from "Sample 2-Day Overnight Schedule" so the label doesn't lock readers into a specific length.
- The previous decision below ("On-Campus Camps display title swaps based on date range — 1-Day / 2-Day / Multi-day") is still load-bearing. The 1-day specific override is still useful for naming clarity even now that "Multi-day" is the default. The 3+ day branch's title override now coincides with the default.

**Why "1+ days" not a hard upper bound:** open-ended is honest. We don't have a contractual upper limit on what we'd run; the team prices longer windows during the quote conversation. "1+ days" signals the floor; everything above is conversation.

---

## On-Campus Camps display title swaps based on date range — 1-Day / 2-Day / Multi-day

`lib/proposal-engine.ts#getCampDurationOverride(result, scheduling)` returns an override that swaps the displayed programme title and tier duration when the customer's date range produces a non-standard day count:

- **1 day** → "1-Day On-Campus Camp", tier duration "1 day · {format}", tier tag "Custom"
- **2 days** → no override (the standard productised tier fits)
- **3+ days** → "Multi-day On-Campus Camps", tier duration "{N} days · {format}", tier tag "Custom"

Day count uses the same noon-to-noon rule as gear-rental: `max(1, ceil(elapsed_hours / 24))`. The format suffix (`day camp` / `hybrid` / `overnight`) is preserved from the engine's standard tier choice (Spark / Trail / Summit) so the team still has the closest format match as a starting point.

**Why this is a display layer, not an engine layer:**
- The proposal engine is qualitative-only by design (separate decision below). Adding date-aware scoring would re-introduce the bugs we left behind.
- Tier scoring should reflect *what kind of programme fits*, not *how long the customer wants*. Day count shapes how the team prices and schedules, not which programme is right.
- The override applies on both client (result card) and server (email templates + subject), so the customer sees the same framing the team sees.

**Why standardise to "1-Day" / "2-Day" / "Multi-day":**
- "1-Day" matches the existing "2-Day" marketing convention. "Multi-day" honestly signals bespoke without committing to a specific length.
- The override doesn't pretend a single tier exists for non-standard durations — it just stops the standard 2-day title from misrepresenting the offer.
- The team designs the actual schedule for non-standard requests during the quote conversation. The override lets the customer-facing card reflect what they actually asked for.

---

## Proposal engine is qualitative-only — duration is informational, not a scoring signal

The old engine scored programs against a `Duration` enum (`half-day` / `full-day` / `2-days`) and used it to disqualify on-campus-camps when the customer asked for less than 2 days. Mid-2026 we briefly replaced that with a richer 6-option `DeliveryFormat` enum (incl. a `multi-day` bucket). Both have now been removed. The engine scores purely on qualitative answers: school type, class level, group size, goal, participants, venue, activities, and a single overnight preference.

Timing is captured via an optional date+time picker at Step 6 ("rough dates fine") and travels in its own `Scheduling` payload directly to the team. The engine never reads it.

**Why:** A real bug surfaced — a 3+ day request landed on a "Leadership Development → Influence (6 hours)" recommendation. The engine had to pick *some* tier, and the duration enum was forcing a misleading match. Once we accepted that schools at this stage of inquiry don't always have firm dates anyway, removing duration from scoring removed the whole class of mismatches. The team designs the actual schedule against whatever window the school picks during the quote conversation. The engine's job is to point at the right *programme*; the *length* is a logistics question that follows.

**What this replaces:** the earlier "On-campus-camps tier selection driven by groupSize" decision below. groupSize still drives tier selection for nature-craft and leadership-development; on-campus-camps tiers are now driven by `overnightPreference` instead (see next decision).

---

## On-Campus Camps tier driven by `overnightPreference`, not group size or duration

`selectTier` for on-campus-camps maps:
- `'open-to-overnight'` → Summit
- `'day-evening'` → Trail
- `'day-only'` → Spark

The form asks "If we recommend a camping experience, are you open to an overnight stay?" once, unconditionally, at Step 9. Non-camps recommendations ignore the answer.

**Why:**
- Spark / Trail / Summit are inherently format-differentiated (day camp / hybrid / overnight) — that's what the marketing tier cards on `/schools/programs/on-campus-camps` describe. Tiering on overnight preference matches the marketing.
- Group-size-based tiering was the previous-previous decision, restored after duration broke. It worked but didn't reflect what actually distinguishes the camps offerings — overnight liability is the real decision a school makes.
- One always-asked question is cheaper than conditional logic that runs the engine mid-form to decide whether to ask. Costs every customer one click; saves us a state machine.

**Tradeoff:** non-camps recommendations carry an answered question that doesn't influence anything. Acceptable — the question is fast and the data still goes in the email for the team to see.

---

## Date display: Nigerian DD/MM/YYYY format

Every server-rendered date uses `DD/MM/YYYY`. Two helpers in `app/api/proposal/route.ts`:

- `formatDate(isoDate)` returns `"DD/MM/YYYY"`
- `formatDateTime(isoDate, time)` returns `"DD/MM/YYYY · HH:MM"`

The gear-rental inline duration preview in `QuoteForm.tsx` uses the same `DD/MM/YYYY` format via a parallel `formatDateShort` helper.

**Why:**
- Camping Nigeria is Nigerian. The British/Nigerian numeric convention is day-first.
- The previous `'en-GB'` `toLocaleDateString({ day: 'numeric', month: 'short' })` produced `"29 May"` — readable but mixed-format and ambiguous when copy-pasted into a calendar.
- Numeric-only is unambiguous, copy-pastes into Google Calendar correctly, and matches what schools see on their own paperwork.

Native HTML5 `<input type="date">` rendering still follows the browser's own locale — we can't override that. But every place we *display* a date, we own the format, and we use this one.

---

## Proposal route fails closed when Resend is unavailable — no `mailto:` fallback

`/api/proposal` returns proper HTTP errors (503 if `RESEND_API_KEY` missing, 502 if Resend rejects) and the form shows an amber banner pointing at `hello@campingnigeria.com`. There is no client-side `mailto:` fallback that opens the user's mail client mid-flow.

**Why we removed the fallback:**
- It was a placeholder shipped before Resend was wired. The form has been fully Resend-backed for months; the fallback was just dead code that fired on misconfiguration.
- A `mailto:` fallback hides infrastructure failures from operators. If Resend is broken on a Tuesday and 12 schools submit, the only signal would be 12 prefilled draft emails opening in 12 different mail clients on 12 different schools' machines — most of which never get sent. We'd see nothing.
- Hard-failing with an explicit "email us at hello@campingnigeria.com" banner is more honest. The school knows the website is having a moment; they have a path to reach us; we get the signal that something's wrong.

**Why this is route-specific:** the contact and assessment routes still have a similar branch on `RESEND_API_KEY` missing — left in place for now since they predate this decision. If we hit an incident there, fold them in too.

---

## DoE proposals get their own route, separate from `/schools/proposal`

`/schools/international-award/proposal` is a dedicated form with its own API route (`app/api/award-proposal/route.ts`), its own validation (`lib/award-proposal.ts`), and its own email templates. The school-programmes proposal at `/schools/proposal` stays as-is and only handles camps/nature/leadership.

**Why two routes instead of one consolidated form:**
- DoE has a **different audience** — parents enquiring on behalf of their children, plus schools — while the school programmes form is school-only. Parents need different fields (their child's school, class, Award level interest) and different framing.
- DoE has **published prices** (₦3M / ₦5M / ₦8M); the customer picks the tier directly. The school programmes are quote-based and need a recommendation engine to pick a tier from answers. Different mechanics.
- Conflating them in one form would force conditional logic to swap fields, copy, validation, and email templates based on programme — more code than two focused forms.
- The DoE assessment can deep-link to the proposal form with the recommended tier pre-filled via `?tier=base-camp|trail-ready|summit-partner`, which wouldn't work cleanly in a unified form.

**Tier display when "Not sure" is chosen:** the customer email shows all three tier cards with prices and includes, plus a note that the team will recommend the right one on their call. Confirmed editorial decision — informative beats minimal here because customers reading the email may use it to start a budget conversation internally.

**Award levels for schools are multi-select** (Bronze / Silver / Gold can run in parallel); for parents, single-select with an "unsure" option.

---

## `loadQuoteItems` reads only `id`, `name`, `category`, `available_qty` from the items CSV

The published Google Sheets CSV at `NEXT_PUBLIC_SHEETS_ITEMS_URL` has columns `id, name, category, base_price_naira, available_qty`. The parser in `lib/quote-config.ts` uses `headers.indexOf('available_qty')` etc. to pick columns by header name, and **deliberately ignores `base_price_naira`**.

**Why:** Pricing is the quote tool's job, not the customer's. The whole point of the quote-tool architecture is that a human reviews each request and adjusts quantities before pricing is computed and sent. If we surfaced prices in the form, customers would price-anchor against listed values that don't include delivery, group discounts, or rental-duration breaks — and the quote-tool team would spend time correcting expectations instead of operating. Reading only what the form needs is the minimum-disclosure path that keeps the contract clean.

---

## Camping rentals are noon-to-noon: `rental_days = max(1, ceil(elapsed_hours / 24))`

The gear-rental form takes a pickup date+time and a dropoff date+time, both defaulting to `12:00`. Day count is computed as `max(1, ceil(elapsed_hours / 24))` on both sides — server (the quote tool's source of truth) and client (the inline preview in the form). Three canonical cases:

- **Noon-to-noon:** 30 Apr 12pm → 1 May 12pm = 24h elapsed = **1 day**
- **Slightly less than 24h:** 30 Apr 2pm → 1 May 10am = 20h elapsed → ceil(20/24) = **1 day**
- **Same-day rental:** 30 Apr 9am → 30 Apr 5pm = 8h → ceil(8/24) = **1 day** (the `max(1, …)` floor keeps zero-hour edge cases sane)

**Why this rule and not the obvious "nights stayed + 1":**
- The old "nights + 1" formula gave `3 days (2 nights)` for any 26→28 trip regardless of whether you came home before noon or after — fine for hotels, wrong for camping where the gear physically goes back at noon.
- A simple `ceil(elapsed_hours / 24)` is the least surprising rule for the three real-world cases the team handles: the canonical overnight rental, the day-late return, and the daytime activation. Each gets exactly 1 day. The "rounded up to noon" part is implicit in customers picking 12:00 by default; if they pick 2pm, they're already thinking about times, and the math just works.
- `max(1, …)` is there for the degenerate case where elapsed_hours = 0 (same date, same time, browser glitch, whatever). A "0 day rental" is incoherent — clamp to 1.

**Why the time fields are additive in the API contract:** the quote tool validates them with `^\d{2}:\d{2}$` and treats null/missing as "use the legacy date-only calc". This means the website can ship the time inputs without lockstep with the quote tool, and historical quotes (saved before times existed) keep their already-computed `rental_days` instead of silently recalculating. Backwards compatibility is what made this a no-brainer to roll out incrementally.

**Why the client also computes the duration (when the server is the source of truth):** customer trust. The form's inline "3 days (26 Apr 12pm → 29 Apr 12pm)" preview lets the user verify the pricing premise before they submit. If the team sees a different `rental_days` server-side, that's a bug to find — but the same rule on both sides means the customer is never surprised by the priced quote a few hours later.
