# state.md

What is built, what is in progress, what is next. Update every session.

Last updated: 2026-08-31

## Company

Camping Nigeria is based in **Abuja** — storefront at **Shop No. 17A, Arts and Craft Village, Sani Abacha Way, Wuse, Abuja 904101, FCT, Nigeria** (Plus code `3F8M+9RW`). Address flows from [`CONTACT.address` in lib/constants.ts](../lib/constants.ts) — never hardcoded; both the contact page, privacy policy, and `LocalBusiness` schema reference the same constant.

## Built

### Offers (published pricing)
- **`/offers`** — hub. Hero mirrors the homepage gateway (three pill buttons, one per market), then three parallax group cards, then the shared terms block.
- **`/offers/schools`** — Field Day (from ₦3,000,000) · The Campus Expedition (from ₦6,000,000) · The Outdoor Year (from ₦12,750,000)
- **`/offers/organizations`** — The Company Field Day (from ₦3,550,000) · The Leadership Expedition (from ₦5,450,000)
- **`/offers/individuals`** — Open Camp (₦95,000 per person) · Private Camp (from ₦1,550,000)
- Source of truth: [lib/offers-data.ts](../lib/offers-data.ts) — feeds the render, metadata, OG copy, `Service` + `AggregateOffer` JSON-LD and the sitemap. Shared page shell at [components/offers/OfferGroupPage.tsx](../components/offers/OfferGroupPage.tsx); each `page.tsx` is a four-line data lookup.
- Content transcribed verbatim from `Camping_Nigeria_Offers_1.html` (repo root). CTAs route per market: schools → `/schools/proposal`, organizations → `/contact`, Open Camp → `BOOKING_FORM_URL` (Microsoft Forms), Private Camp → `/contact`.
- **Navigation:** deliberately *not* in the main navbar — the header already carries five links plus the CTA. `/offers` is reachable from the footer **Quick Links** column (first item) and the homepage "See Offers & Pricing" grid link. Sitemap priority stays 0.9, so header placement does not affect search discoverability. Each group page also carries an `OfferGroupNav` strip so visitors can move sideways between markets without returning to the hub.
- **Coexists with, does not replace, the quote-based flows** — see [decisions.md](decisions.md). Two open items flagged there: the Leadership Expedition "From" price disagrees with its own formula at the stated minimum group size, and the schools taxonomy on `/offers/schools` differs from `/schools/programs/*`.

### Marketing pages
- **Home** (`/`) — hero video, scroll-to-top on route change. `<BackgroundVideo>` now:
  - Honours `prefers-reduced-motion` (pause) and `prefers-reduced-data` (skip video entirely, show poster only)
  - Accepts optional additional `<source>` variants (WebM first, MP4 fallback)
  - Uses `/images/schools/hero.webp` as the backup poster — shown until first frame paints, or permanently if the video is slow/failed/blocked
  - Wired in [app/page.tsx](../app/page.tsx) to read `/videos/hero-bg.webm` when the browser supports it, falling back to the MP4 in `VIDEO_URL`
- **Schools** (`/schools`) — hub page with Duke of Edinburgh split callout (image right, gold offset border)
- **Individuals** (`/individuals`) — light marketing page, "Book Your Spot" → Microsoft Forms
- **Organizations** (`/organizations`) — light marketing page
- **About** (`/about`), **Privacy** (`/privacy-policy`), **Terms** (`/terms`)

### School programs (full sub-pages)
- **Nature Craft** — `/schools/programs/nature-craft`
- **Leadership Development** — `/schools/programs/leadership-development` (uses "CLASS" label, not "Ages")
- **On-Campus Camps** — `/schools/programs/on-campus-camps` (1+ days, flexible)

### Events

- **Events hub** — `/events` — lists upcoming then past editions from the registry in [lib/events/index.ts](../lib/events/index.ts). The registry holds only summary/card data; deep detail (schedule, FAQs, pricing, image registry) stays in each event's own module. Adding an event is a module plus one registry entry — the hub, the homepage banner, and the nav need no edits. `FEATURED_UPCOMING_EVENT` drives the homepage `EventBanner`, which is content-agnostic and only rendered when something is actually taking registrations.
- **Base Camp Kids** — `/events/base-camp-kids` — one-day Children's Day camp activation, **Saturday 30 May 2026, 9:00 AM – 5:00 PM**, Abuja, ages 4–12, 30-seat hard cap. **Status: past.** `EVENT_STATUS = 'past'` in the source-of-truth module closes registration everywhere (form not rendered, API returns 403, `Offer` dropped from the Event JSON-LD, Hero/Pricing/metadata switch to recap copy). Flip that one line to reopen. It is an explicit flag, not `Date.now() > EVENT_END_ISO`, because these pages are statically rendered and a runtime date check would bake in at build time.
  - Pricing: ₦100,000 early-bird (online) / ₦150,000 walk-in. 10% sibling discount on every additional child (per-sibling ₦90,000), computed server-side via `computeRegistrationTotal` in [lib/events/base-camp-kids.ts](../lib/events/base-camp-kids.ts).
  - Flow (as it ran, and as it will run again if reopened): registration form → Resend paired email (internal + customer confirmation) → Sheets append → **manual invoice → payment locks the seat**. Paystack was never wired in — plan parked at [docs/base-camp-kids/paystack-integration-plan.md](../docs/base-camp-kids/paystack-integration-plan.md).
  - API: `app/api/event-registration/route.ts` runs the same defensive stack as the other 4 Resend routes (honeypot → IP rate limit `event-registration` 5/hr/route → type-guard → email regex → phone digit count → length caps → server-derived total → paired send → Sheets append). Children array capped at 6 per registration; ages strictly 4–12.
  - Sheets recording: `GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL` points at an Apps Script Web App ([docs/base-camp-kids/apps-script.gs](../docs/base-camp-kids/apps-script.gs)) that appends a row per registration. Sheet schema lives in [lib/event-records.ts](../lib/event-records.ts). When unset, registration still sends emails — the Sheet step is skipped and logged.
  - Confirmation page: `/events/base-camp-kids/registered` reads `?name&email&kids&total` from `searchParams` (server component), shows a 3-step "what happens next" list.
  - Source-of-truth file [lib/events/base-camp-kids.ts](../lib/events/base-camp-kids.ts) feeds the page render, the schema, the email templates, the confirmation page, and the Sheet row — single point of edit for date/time/price/seat-cap/schedule/FAQs/souvenirs/image registry.
  - Schema: `Event` with `audience` 4–12, `maximumAttendeeCapacity: 30`, plus `BreadcrumbList` and `FAQPage`. `buildEventJsonLd` helper in [lib/structured-data.ts](../lib/structured-data.ts). The embedded `Offer` (NGN 100,000, `LimitedAvailability`) is **omitted while the event is past** — `buildEventJsonLd`'s `offer` input is optional. The Event itself stays, with its real past dates: schema.org handles past events fine, Google simply stops showing the rich result.
  - **Image registry:** AI-generated marketing imagery in [public/images/events/base-camp-kids/](../public/images/events/base-camp-kids/) — hero (2048×1152), positioning (1280×960), homepage banner (2048×1152), and three souvenir tiles (1024² each). Generated via `openai/gpt-image-2@latest` on inference.sh; prompts and re-run script live in [scripts/generate-base-camp-kids-images.mjs](../scripts/generate-base-camp-kids-images.mjs). OG/Twitter cards now use the event hero (was schools/hero.webp), and `/events` reuses it for its own cards. **Open task: these are still AI placeholders on what is now a recap page.** Swapping in real photography from the day is the highest-value remaining edit — the recap is the sales asset for the next edition and for school bookings.

### Duke of Edinburgh (international award)
- `/schools/international-award` with 7 sections: hero, award, expedition tiers, our role, what we provide, assessment, FAQ
- **Pricing (current):** Base Camp ₦3M / Trail Ready ₦5M / Summit Partner ₦8M — all **"for up to 60 students"**, with a shared note "Additional students from ₦50,000 each — max group of 100"
- "See the full offer breakdown" → downloads `public/pdf/CampingNigeria_DoE_Offer_download.pdf`
- **4-question assessment** — the tier-recommendation logic lives in [lib/expedition-recommendation.ts](../lib/expedition-recommendation.ts) and is shared between the client (instant preview) and the API (trusted derivation for outbound email). Q2 tunes summary prefix, **Q3 weaves group size into the tier summary copy**, Q4 selects the tier.

### Lead-capture forms

| Route | Form file | Endpoint | Recipient |
|---|---|---|---|
| `/contact` | `components/contact/ContactForm.tsx` | `app/api/contact/route.ts` (Resend) | `hello@campingnigeria.com` |
| `/schools/proposal` | `components/proposal/ProposalForm.tsx` | `app/api/proposal/route.ts` (Resend) | `hello@campingnigeria.com` |
| `/schools/international-award` | `components/schools/international-award/ExpeditionAssessment.tsx` | `app/api/assessment-lead/route.ts` (Resend) | `hello@campingnigeria.com` |
| `/schools/international-award/proposal` | `components/schools/international-award/AwardProposalForm.tsx` | `app/api/award-proposal/route.ts` (Resend) | `hello@campingnigeria.com` |
| `/gear-rental` | `components/gear-rental/QuoteForm.tsx` | **External** — POST to `https://quote.campingnigeria.com/api/submit-quote` | Quote tool handles persistence + email |
| `/events/base-camp-kids` | `components/events/base-camp-kids/RegistrationForm.tsx` — **not rendered while `EVENT_STATUS = 'past'`** | `app/api/event-registration/route.ts` (Resend) — **returns 403 while closed** | `hello@campingnigeria.com` |

The 5 Resend-backed routes send **two** emails (internal + customer confirmation) via `sendPairedMail` from `lib/mail.ts`. Each runs the full defensive stack: honeypot → IP rate limit → payload type guard → trim check → format check (email regex, phone digit count) → length caps. Recommendation payloads (proposal program/tier, assessment tier) are **derived server-side** — the API never trusts a client-supplied recommendation.

The gear-rental form is different (Phase 2 quote tool integration) — see the dedicated section below.

### Security + anti-abuse
- **Honeypot field** (`website_confirm`) on all 4 forms. Server returns fake success (`{ success: true }` with 200) when tripped so bots don't learn they were caught.
- **Per-IP rate limiting** via `@upstash/ratelimit` + `@upstash/redis` in `lib/rate-limit.ts`. 5 submissions / IP / hour per route, independent budgets.
  - **Prod (`NODE_ENV=production`) with env vars missing → fail closed** (429 + loud one-shot error log). Previously failed open, which risked silently dropping protection on a misconfigured deploy.
  - **Dev → fail open**, no Upstash account needed for local work.
  - **Upstash transient error → fail open**, logged — better a few unprotected requests than 500ing a legit user.
  - **Upstash Redis is provisioned and env vars are set in Vercel prod.** Rate limiting is live.
- **Security headers** in `next.config.mjs`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`.
- **`Content-Security-Policy-Report-Only`** shipped — browsers log violations to the DevTools console without blocking. Flip key to `Content-Security-Policy` to enforce once the report-only stream is clean against real traffic.
- **HTML escaping** on all user fields in email templates (`escapeHtml`, `safeUrl`, CRLF-stripped subjects).
- **Strict answer allowlists** — proposal answers validated against enum lists; assessment answers restricted to `'A' | 'B' | 'C' | 'D'`.
- **Length caps** on every free-text field via `MAX_LENGTHS` + `withinLengthCaps` in `lib/html.ts`.

### Tests
- **Vitest** (`npm test` / `npm run test:watch`) — 83 tests across 4 files covering the security-critical pure functions:
  - `tests/html.test.ts` — `escapeHtml`, `safeUrl`, `isHoneypotTripped`, `withinLengthCaps`
  - `tests/proposal-engine.test.ts` — `isValidAnswers` (incl. integer-range validation on `groupSize: number`), `bucketGroupSize`, program selection, off-campus-disallows-camps guard, tier selection (on-campus-camps driven by `overnightPreference`), `computeProgramDays` + `getCampDurationOverride` (1-day and multi-day overrides)
  - `tests/expedition-recommendation.test.ts` — `isValidAnswerKey`, `isValidGroupSize`, `bucketGroupSizeToAnswerKey` (number → A/B/C/D), `getRecommendedTier`
  - `tests/award-proposal.test.ts` — `isValidPayload` for the dedicated DoE proposal flow (school + parent branches, tierInterest enum, scheduling both-or-neither, malformed dates/times)

### Gear rental — Phase 2 quote-tool integration

The `/gear-rental` form is the customer-facing entry point for a separate quote tool deployed at `quote.campingnigeria.com`. The website project handles the form UI; the quote tool handles persistence, pricing, review queue, and customer emails.

**Form behaviour:**
- **Equipment selector** is structured, not free-text — a collapsible category list backed by a published Google Sheets CSV (`NEXT_PUBLIC_SHEETS_ITEMS_URL`, items tab, `gid=0`).
  - Live config: 17 items across 9 categories (`tents`, `blankets`, `mats`, `pads`, `pillows`, `bicycles`, `hammocks`, `mattress`, `furniture`).
  - Tents lead (primary product), then mattresses, then the rest of the sleep accessories (`pads`, `mats`, `pillows`, `blankets`), then everything else alphabetical.
  - Tents start expanded; other categories start collapsed. A "{N} selected" pill on collapsed headers shows what's inside.
  - The customer never sees prices — `lib/quote-config.ts#loadQuoteItems` reads only `id`, `name`, `category`, `available_qty`, and `image_url` from the CSV (the `base_price_naira` column is intentionally ignored).
- **Item thumbnails + lightbox** — every row renders a 48–56px product photo next to the item name. Click → centered lightbox over a dim backdrop (closes on backdrop click, X button, or `Escape`; body scroll locked while open). Built on the existing Framer Motion stack — `ItemThumb` + `Lightbox` co-located in [`EquipmentTable.tsx`](../components/gear-rental/EquipmentTable.tsx).
  - **Image source:** sheet `image_url` column. Drive share links (`drive.google.com/file/d/<ID>/…`) are auto-rewritten to `https://lh3.googleusercontent.com/d/<ID>` by `normaliseImageUrl()` in `lib/quote-config.ts`, so editors paste whatever Google's Share dialog gives them and it just works. Each file must be **"Anyone with the link → Viewer"** in Drive or `lh3` returns 403.
  - **Three-tier fallback** per item: sheet `image_url` → `/images/gear-rental/items/<id>.webp` static convention → neutral `lucide-react` Package icon. The static folder is empty today (all photos live in Drive), but the path is honoured if anyone drops a WebP in.
  - **CSP** — `img-src` allows `'self' data: blob: https://lh3.googleusercontent.com`. Add new hosts here if a future image source isn't Drive.
  - **`next/image`** runs `unoptimized` on any `http*` src — keeps Drive thumbnails working without maintaining a `remotePatterns` allowlist.
- **Required fields:** name, email, phone (WhatsApp-preferred), pickup date + time, dropoff date + time, delivery zone (Abuja/Lagos/Other), and at least one item with quantity > 0 (skipped if the CSV failed to load — message field carries the request instead).
- **Pickup / dropoff times:** rentals run **noon-to-noon by default** (`12:00`). Customers can adjust either time for same-day or off-noon hires. Same-day rentals are allowed; the form requires `dropoff_time > pickup_time` when both dates match. The form shows an inline duration preview (e.g. `1 day (30 Apr 2pm → 31 Apr 10am)`) using the same `max(1, ceil(elapsed_hours / 24))` rule the quote tool runs server-side. Time picker rendering is left native — 24h on Android, 12h on iOS, etc. — only the inline preview is forced to 12h for consistency.
- **Optional fields:** organisation/school, message.
- **Submit** does a direct browser POST to `https://quote.campingnigeria.com/api/submit-quote` with `{ customer, delivery_zone, rental_start, rental_end, pickup_time, dropoff_time, items, message }`. Both times sent as zero-padded `"HH:MM"` strings; the quote tool's `^\d{2}:\d{2}$` regex accepts them and falls back to the legacy date-only calc if either is null/missing.
- **On success** (`{ success: true, reference: 'CNQ-2026-XXXX' }`): redirect to `/gear-rental/submitted?ref=...&email=...&name=...`. The confirmation page is a server component reading `searchParams`.
- **On failure or network error:** amber banner with retry copy. No mailto fallback.
- **Equipment list unavailable** (CSV unreachable / env var missing): the equipment section is hidden and an amber notice tells the user to describe their needs in the message field.

**What the website does NOT do for gear-rental:**
- No internal-notification or customer-confirmation email from the website project itself. The **quote tool** fires the internal notification to `hello@campingnigeria.com` immediately on submission (so the team sees there's something to review), and later fires the priced customer confirmation when an operator clicks "Send Quote" in the Review Panel.
- No honeypot enforcement, no per-IP rate limiting — the quote-tool runs its own anti-abuse stack. The honeypot input is still rendered (cheap insurance, ignored at submit time).
- No `/api/gear-quote` route — deleted in Phase 2.

**Operational dependency:** the website is only useful if the quote tool is live AND its CORS allows `https://www.campingnigeria.com`. Apex `campingnigeria.com` 307-redirects to www at the Vercel edge, so www is the only origin browsers actually use.

### SEO
- **Per-page metadata** via `lib/seo.ts#buildPageMetadata` — canonical, keywords, Open Graph (1200×630, `en_NG`), Twitter (`summary_large_image`). Used on all 22 page routes.
- **Per-route dynamic OG + Twitter cards** — every major page has its own `opengraph-image.tsx` + `twitter-image.tsx` pair (16 pages × 2 = 32 route files). Each calls a shared renderer at [lib/og-image.tsx](../lib/og-image.tsx) that composites the page's hero photo behind a forest-green gradient overlay with a gold-pill eyebrow + share-optimised headline. Homepage card reads "Adventure Made Simple". WebP heroes render fine through Satori — no JPG fallbacks needed.
- **Structured data** (`lib/structured-data.ts`, rendered via `components/seo/JsonLd.tsx`):
  - `Organization` + `LocalBusiness` hybrid (global) with `PostalAddress` (Shop No. 17A, Arts and Craft Village, Sani Abacha Way, Wuse, Abuja 904101, FCT, NG), `priceRange`, `areaServed: Nigeria`, `sameAs` (IG/FB), `contactPoint`
  - `WebSite` with publisher reference to the org `@id`
  - `BreadcrumbList` on every page
  - `FAQPage` on `/schools/international-award` driven by `AWARD_FAQS`
  - `Service` on each of the 3 program pages (Nature Craft, Leadership Development, On-Campus Camps) with `hasOfferCatalog` describing each tier
  - `Service` + `AggregateOffer` on `/schools/international-award` with real NGN prices (₦3M / ₦5M / ₦8M) — eligible for price-range rich results
- **Sitemap** (`app/sitemap.ts`) — 20 URLs with priorities, changefreq, env-driven `lastModified`, **and per-URL `<image:image>` entries** for the key pages (home, schools hub, DoE, each program, audience pages, gear rental, about).
- **Robots** (`app/robots.ts`) — allow all, disallow `/api/`.
- **Manifest** (`app/manifest.ts`) — PWA manifest with theme/background colors, all icon sizes.
- **Favicons** — light/dark variants with `prefers-color-scheme`, apple-icon, SVG.
- **Google Search Console verification** wired via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var (optional).

### Cross-cutting
- Favicons (light + dark variants) = Camping Nigeria logo
- Sitemap includes all DoE pages, 3 program pages, and `/schools/proposal`
- Mobile pass: iOS input zoom fixed (`text-base sm:text-sm`), dynamic viewport units (`dvh`) on heroes, scroll-padding for anchor offsets
- `ScrollToTop` component forces `behavior: 'instant'` on every route change
- `npm run lint` works — `eslint@9` + `eslint-config-next@16.2.4` with flat config in `eslint.config.mjs`
- **Dependencies current: Next 16.2.4, `npm audit` clean.** Upgrade from 16.1.6 resolved 6 HIGH CVEs (HTTP request smuggling, CSRF bypass, DoS variants).
- **Images are WebP-only.** All 37 orphan `.jpg` files under `public/images/**` were deleted once the media registry was fully webp-native. Repo `public/images/` went from 129 MB to 17 MB. Don't reintroduce JPGs — export WebP from the design tool directly.

## In progress

- **Paystack payment integration** — handoff plan at [docs/base-camp-kids/paystack-integration-plan.md](../docs/base-camp-kids/paystack-integration-plan.md). **Parked**: the 30 May 2026 edition has run and its registration is closed, so this is no longer blocking anything. Pick it back up when the next event is scheduled — the plan is still sound, and the decisions it leaves open (inline-vs-redirect, when to fire the confirmation email, sheet status field shape) are unchanged.

## Next (tracked TODOs)

### Code TODOs (tracked)

- **Flip CSP from report-only to enforce** — currently `Content-Security-Policy-Report-Only`. Collect violations from real traffic for a week or two via browser DevTools (or wire up a report-uri endpoint), then rename the header key in `next.config.mjs` to `Content-Security-Policy`.
- **Re-encode hero WebM smaller** — current `/videos/hero-bg.webm` is 7.97 MB, larger than the MP4 fallback (4.8 MB). A VP9 re-encode at `-crf 34`–`36` should get it under the MP4 size while preserving WebM's codec efficiency. Until then Chrome/Firefox/Edge users download ~8 MB instead of ~5 MB.
- **Real Base Camp Kids photography** — the recap page and its `/events` card still run on AI-generated placeholders, captioned "Illustrative imagery. Photography from the day is being added." Swap the paths in the image registry in [lib/events/base-camp-kids.ts](../lib/events/base-camp-kids.ts); no component changes needed.
- **Expand test coverage** — 83 pure-function tests in place. Next candidates: `lib/rate-limit.ts#getClientIp` (header parsing), route-handler integration tests hitting real payloads end-to-end. `lib/offers-data.ts` is worth a shape test: every package's `priceFromValue` should match the digits in its final `facts` entry, which is the invariant `buildServiceJsonLd` depends on.
- **Upgrade Next.js off 16.2.4** — `npm audit` is no longer clean (see below). Next 16.2.4 now carries ~18 advisories including middleware/proxy bypass, RSC cache poisoning, and XSS via CSP nonces. Needs its own session: check the changelog for breaking changes, upgrade, re-run build + all 22 routes.

### Dependency health (as of 31/08/2026)

`npm audit` reports **10 vulnerabilities — 1 critical, 7 high**, against a fresh install. This contradicts the older "audit clean" note that was true at the time Next 16.2.4 was pinned; these are new disclosures, not a regression from any change in this repo. Breakdown: Next 16.2.4 itself (production-relevant), plus dev-only transitive deps `@babel/core`, `esbuild`, `js-yaml`, `brace-expansion`, `nanoid`.

Also note npm 11+ blocks postinstall scripts by default — `esbuild`, `sharp` and `unrs-resolver` show as pending after `npm install`. Nothing has broken; `npm approve-scripts --allow-scripts-pending` if `next/image` optimisation or vitest starts misbehaving.

### Open content questions (offers)

- **Leadership Expedition "From" price.** Listed as ₦5,450,000 with a group size of 15–45, but its own formula (₦3,200,000 + ₦75,000/head) gives ₦4,325,000 at 15 people — ₦5,450,000 is the figure at 30. Every other package's "From" matches its formula at the stated minimum. Carried through verbatim from the source document; needs a pricing decision from Taiye and Kehinde, then a one-line edit in `lib/offers-data.ts`.
- **Two schools taxonomies now coexist.** `/offers/schools` sells Field Day / Campus Expedition / Outdoor Year; `/schools/programs/*` sells Nature & Craft / Leadership Development / On-Campus Camps with Spark/Trail/Summit tiers. Both are reachable and both emit `Service` schema for school programmes. This is the strategy question already open in [TODO.md](../TODO.md) — `/offers` was built additively so the team can test published pricing against real enquiries before deciding whether to retire the recommendation engine.

## Recently completed (this session)

Worked through the full code-review punch list plus a follow-up review:

1. ✅ Honeypot field on all 4 forms — shared `<Honeypot />` component + `isHoneypotTripped()` helper; server returns fake success
2. ✅ Dead-code sweep — unused `SITE_URL` export, `ALL_PROGRAMS`, stale font, Unsplash preconnect, hardcoded 2026, unreachable proposal-engine branches
3. ✅ ESLint + config-next installed, flat config, `npm run lint` passes
4. ✅ Hero video poster + reduced-data handling + WebM source slot — wired to `/images/schools/hero.webp` as the backup poster
5. ✅ Server-side recommendation derivation — `scoreAnswers`/`getRecommendedTier` are now the source of truth for outbound emails; shared `lib/expedition-recommendation.ts` between client and server
6. ✅ IP rate limiting — `lib/rate-limit.ts` with Upstash, 5/hr/route/IP
7. ✅ Security headers — 5 non-CSP headers at framework edge
8. ✅ `lib/mail.ts` extracted — single `sendPairedMail` helper replaces duplicated Resend plumbing in 4 routes
9. ✅ Hydration-safe date init in `QuoteForm`
10. ✅ Q3 (group size) weaved into assessment summary copy via the shared lib
11. ✅ Length caps + email regex + phone digit-count enforced on every route
12. ✅ Upgraded Next 16.1.6 → 16.2.4 — `npm audit` clean
13. ✅ Upstash Redis provisioned, prod env vars set in Vercel — rate limiting is live
14. ✅ **Hero video asset cleanup** — swapped the 19.8 MB MP4 for a 4.8 MB re-encode; `hero-bg.webm` (7.97 MB) is live as the primary source via `<BackgroundVideo sources={...}>`
15. ✅ **Rate-limit fail-closed in production** when env vars missing (was fail-open). Dev still fails open; transient Upstash errors still fail open.
16. ✅ **CSP shipped in report-only mode** — browsers log violations without blocking. Flip the header key when ready to enforce.
17. ✅ **On-campus-camps tier differentiation restored** — uses `groupSize` (under-40 → Spark, 40-150 → Trail, 150+ → Summit), matching nature-craft / leadership-development patterns.
18. ✅ **Test suite added** — Vitest with 44 tests across html/proposal-engine/expedition-recommendation. `npm test` runs in <1s.
19. ✅ **WebP migration completed** — deleted 37 orphan `.jpg` files; `public/images/` shrunk from 129 MB to 17 MB. Site was already serving webp; the jpgs were dead weight.
20. ✅ **SEO audit and upgrade** — audit found a strong technical foundation (~87/100) with gaps in structured-data depth. Shipped all four recommended fixes:
    - `Organization` upgraded to `Organization + LocalBusiness` hybrid with real `PostalAddress`, `priceRange`, and stable `@id`
    - `Service` + `hasOfferCatalog` on all three program pages (quote-based pricing)
    - `Service` + `AggregateOffer` on `/schools/international-award` with real NGN prices (₦3M / ₦5M / ₦8M) — eligible for price-range rich results
    - `<image:image>` entries added to 10 of 14 sitemap URLs
    - Estimated new score: ~95/100; remaining gap is content-strategy (no blog) not technical.
21. ✅ **Address corrected sitewide** — "Lagos, Nigeria" was wrong; company is based at 198 Damboa Close, PW, Kubwa, Abuja. Added `CONTACT.address` constant as the single source of truth. Fixed contact page, privacy policy, LocalBusiness schema, and CLAUDE.md.
22. ✅ **Phase 2 quote-tool integration** (gear-rental) — replaced free-text equipment textarea with a structured selector backed by a published Google Sheets CSV; collapsible categories with tents leading; new required Delivery Zone select and rental-duration display; direct browser POST to `quote.campingnigeria.com/api/submit-quote`; new `/gear-rental/submitted` confirmation page reading URL params; deleted `app/api/gear-quote/` route entirely (anti-abuse and email now upstream in the quote tool). Required setting `NEXT_PUBLIC_SHEETS_ITEMS_URL` in Vercel — without it the form falls back to a message-only flow.
23. ✅ **Dynamic per-route OG/Twitter cards** — extended the existing `next/og` setup to 10 pages, each with its own hero photo behind the brand frame. Shared renderer at `lib/og-image.tsx` keeps the visual language consistent (forest-green overlay + gold eyebrow pill + white serif headline). Homepage now reads "Adventure Made Simple" instead of the schools-leaning copy. Route-segment metadata (`runtime`, `size`, `contentType`, `alt`) is inlined in every file because Next parses those statically and rejects imports/re-exports.
24. ✅ **Base Camp Kids end-to-end** — event page, registration form with sibling pricing engine, paired-email API with the full defensive stack, Sheets append via Apps Script Web App, confirmation page, structured data (`Event` + `Offer`), navbar link, homepage banner block, sitemap entry. Single source of truth in [lib/events/base-camp-kids.ts](../lib/events/base-camp-kids.ts). v1 is invoice-on-payment (no processor); Paystack is the next session.
25. ✅ **AI image generation pipeline for Base Camp Kids** — six marketing assets (hero, positioning, homepage banner, three souvenir tiles) generated via `openai/gpt-image-2@latest` on inference.sh. Re-runnable script at [scripts/generate-base-camp-kids-images.mjs](../scripts/generate-base-camp-kids-images.mjs) uses async submit + polling (the `wait: true` param times out at the proxy for high-quality 2K renders). All outputs land in [public/images/events/base-camp-kids/](../public/images/events/base-camp-kids/) and are referenced by the source-of-truth file. Brand palette (forest green, gold, cream) and Abuja savanna setting baked into prompts; composition rule is "no synthetic kid faces" — kids appear from behind, in motion blur, or hands-only close-ups.
26. ✅ **Event time bumped to 9:00 AM – 5:00 PM** — was 10:00 AM – 4:00 PM. Bookend-only change: schedule blocks stayed put, added a "9:00 AM gates open" entry and a "4:00 – 5:00 PM parent pickup window" entry. All consumers (page hero, JSON-LD `Event.startDate`/`endDate`, confirmation email) read from `EVENT_TIME_LABEL` / `EVENT_START_ISO` / `EVENT_END_ISO`, so the change was a one-file edit.
27. ✅ **Gear-rental pickup + dropoff times** — added `pickup_time` and `dropoff_time` inputs to `QuoteForm.tsx` (one alongside each date), both defaulting to `12:00`. Renamed the date labels from "Rental Start/End Date" to "Pickup/Dropoff" so the date+time pair reads as one concept. Replaced the `"3 days (2 nights)"` duration preview with `"3 days (26 Apr 12pm → 29 Apr 12pm)"`, computed via `max(1, ceil(elapsed_h / 24))` to mirror the quote tool's server-side rule. Same-day rentals now allowed (with a `dropoff_time > pickup_time` guard). The two new fields are additive in the API contract — quote tool accepts the payload with or without times, falling back to the legacy date-only calc when either is missing.
28. ✅ **Quote-tool now sends an internal notification on submission** (separate session on the quote-tool side, but called out here so this doc stays accurate). Previously only the operator-triggered "Send Quote" action sent any email; now `hello@campingnigeria.com` gets a "new gear-rental request landed" message the moment a customer submits, so the team knows when to open the Review Queue without polling.
29. ✅ **Proposal flow pivoted to a qualitative-only engine.** The free-text duration enum (`half-day` / `full-day` / `2-days`) and its DeliveryFormat successor have been retired. The engine no longer scores against duration at all — it picks a program purely from school type, class level, group size (now a free integer), goal, participants, venue, and activities. Timing is captured via an optional date+time picker at Step 6 ("rough dates fine") and travels in its own `Scheduling` payload to the team — never as a scoring signal. A new Step 9 question, "If we recommend a camping experience, are you open to an overnight stay?", drives the On-Campus Camps tier (Spark = day-only, Trail = day+evening, Summit = open to overnight). Closed two real bugs: (a) "Influence — 6 hours" being recommended against a 3+ day request is now structurally impossible because the engine never makes a duration claim; (b) `proposals@campingnigeria.com` was the from-address but isn't a verified Resend sender — switched to `hello@campingnigeria.com`. Also dropped the silent `mailto:` fallback (the form now shows an amber error banner pointing at hello@). Internal scoring guard renamed: instead of `campsEligible = duration === '2-days'`, camps is disqualified only when `venue === 'off-campus'` (camps is on-campus by program definition). Spark/Trail/Summit content rewritten in `lib/program-data.ts` so the marketing tier cards mirror the day-camp / hybrid / overnight framing. All dates throughout the site are now displayed as Nigerian DD/MM/YYYY (proposal email, gear-rental inline preview).
30. ✅ **DoE assessment: phone field + free-number Q3 + conditional CTAs.** Phone is now required on the capture phase (digit count ≥ 7, validated client + server). Q3 ("How many students?") replaced the four bucket buttons with a free integer input — server buckets to A/B/C/D via `bucketGroupSizeToAnswerKey` so `getRecommendedTier(q2, q3, q4)` continues to work unchanged. Email shows the actual student count instead of the bucket label. Results-screen CTAs are now conditional on Q4 (management-level desired): equipment-only takers see **Rent Camping Gear** → `/gear-rental`; everyone with facilitation needs (or unsure) sees **Submit a Proposal** → `/schools/international-award/proposal?tier={recommendedTier.key}`. Booking-call link stays as a secondary option for any path. From-address standardised on `hello@campingnigeria.com` (was `assessment@`).
31. ✅ **Camp duration override.** `getCampDurationOverride(result, scheduling)` in `lib/proposal-engine.ts` swaps the displayed programme title and tier duration when the customer's date range produces a non-standard day count — 1 day → "1-Day On-Campus Camp", 3+ days → "Multi-day On-Campus Camps", 2 days → no override. Day count uses the same `max(1, ceil(elapsed_h / 24))` rule as gear-rental. Format suffix (day camp / hybrid / overnight) is preserved from the engine's tier choice. Override applies in the result card UI, the customer email subject, and both email templates. Engine still scores qualitatively — this is a **display layer** only. Closed the "4-day request → 2-Day On-Campus Camps · 6 hours" misrepresentation.
32. ✅ **Dedicated DoE proposal route.** `/schools/international-award/proposal` is the new home for Duke of Edinburgh proposal requests, separate from the school-programmes proposal at `/schools/proposal`. Single-page form, no engine — the customer picks their tier directly (Base Camp / Trail Ready / Summit Partner / Not sure). Branches on requesterType: school staff/coordinator (school name, role, student count, multi-select Award levels) or parent/guardian (student's school, class, single Award level incl. "unsure"). Tier auto-fills from `?tier=` URL param when arriving from the assessment. Optional date+time picker for preferred timing. New API at `app/api/award-proposal/route.ts` runs the full defensive stack (honeypot, IP rate limit `award-proposal` 5/hr/route, validation via `lib/award-proposal.ts#isValidPayload`, length caps, fail-closed-when-Resend-missing, branded paired-mail). Customer email shows the picked tier card OR all three when "Not sure" was chosen. OG + Twitter cards mirror the DoE hero. Sitemap entry at priority 0.7. The DoE assessment "Submit a Proposal" CTA now deep-links here with the recommended tier pre-filled.
33. ✅ **Storefront address + phone update + map embed.** `CONTACT.address` in `lib/constants.ts` now points at the Arts and Craft Village storefront (Shop No. 17A, Sani Abacha Way, Wuse, Abuja 904101, Plus code `3F8M+9RW`) — was the registered office at 198 Damboa Close, Kubwa. Added a `postalCode` field to `CONTACT.address` and surfaced it in the `PostalAddress` JSON-LD. New phone `+234 814 607 5937` / WhatsApp `2348146075937` propagated *(both superseded 31/08/2026 — see entry 40)* through constants, all five API email templates, three form placeholders, and the context docs (`CLAUDE.md`, `people.md`, `conventions.md`). `/contact` got a "Visit Us" section with a keyless Google Maps iframe (`maps.google.com/maps?q=…&output=embed`) and an "Open in Google Maps" link below it. CSP gained `frame-src https://www.google.com https://maps.google.com` so the map survives when CSP gets flipped from report-only to enforce. Fixed a stale `Lagos, Nigeria` line in `app/terms/page.tsx` (now reads `CONTACT.address.formatted`, mirroring the privacy page).
35. ✅ **Removed the "Available Equipment / Rental Options" section from `/gear-rental`.** Deleted the `EquipmentAndOptions` component (static two-column grid of equipment icons + rental-option chips) and its render in `app/gear-rental/page.tsx`. The page now goes hero → quote form directly; the live CSV-backed equipment selector in `QuoteForm` already covers what's actually rentable, so the static list was redundant.
34. ✅ **About + Organizations CTAs routed to `/contact`.** Four headline nav CTAs — `AboutHero` "Get in Touch", `AboutCta` "Get in Touch", `OrganizationsHero` "Plan Your Retreat", `OrganizationsCta` "Plan Your Organization's Retreat" — used to pop the user's mail client via `mailto:hello@campingnigeria.com`. They now route to `/contact`, which funnels the lead through the contact form (Resend + defensive stack) and surfaces the new storefront map. `mailto:` is kept only where the label literally reads "Email" (the Email card on `/contact`, footer email link, privacy/terms contact lines) — clicking those should open a mail client; that's the user's mental model.
36. ✅ **Base Camp Kids retired to a past edition + `/events` hub built.** The 30 May 2026 camp ran three months before this change and the site was still selling it: a "Now Booking · 30 Seats" homepage banner, a gold highlighted navbar CTA, a live registration form, and an `Event` JSON-LD advertising ₦100,000 at `LimitedAvailability` — a parent could have registered and been invoiced for an event that had already happened. Introduced `EVENT_STATUS` (`'upcoming' | 'past'`) in [lib/events/base-camp-kids.ts](../lib/events/base-camp-kids.ts) with `REGISTRATION_OPEN` derived from it via `isRegistrationOpen(status)` — routed through a parameter because TypeScript narrows a `const` to its literal, so comparing `EVENT_STATUS === 'upcoming'` directly is a compile error once it reads `'past'`. Explicit flag rather than `Date.now() > EVENT_END_ISO` because the pages are statically rendered and a runtime date check bakes in at build time. `'past'` now: hides the registration Section (so the form's client bundle never ships), returns 403 from `/api/event-registration` independently for stale caches and bots, omits the `Offer` from the Event JSON-LD (`buildEventJsonLd`'s `offer` is now optional), and switches Hero, Pricing and page metadata to recap copy. Sitemap demoted 0.85 → 0.4 and weekly → yearly, and repointed at the event hero instead of a schools photo. New registry at [lib/events/index.ts](../lib/events/index.ts) exposes `EVENTS` / `UPCOMING_EVENTS` / `PAST_EVENTS` / `FEATURED_UPCOMING_EVENT`; new `/events` hub renders upcoming then past cards from it, with an empty-upcoming state pointing at `/contact` and `/schools/proposal`. This also fixed a live bug: the Base Camp Kids breadcrumb JSON-LD had always pointed at `/events`, which 404'd. `EventBanner` is now content-agnostic (takes an `EventBannerContent`, icons passed as string keys so the registry stays JSX-free) and the homepage renders it only when something is actually taking registrations. Navbar's `Base Camp Kids` item became `Events`; `NAV_LINKS` got an explicit `NavLink` type so the `highlight` pill survives for the next campaign. **Still to do: swap the AI-generated placeholder imagery for real photography from the day** — the recap is the sales asset for the next edition and for schools, and it only works with real photos.
37. ✅ **`/offers` — published-pricing hub with a route per market.** Four new routes: `/offers` (hub) plus `/offers/{schools,organizations,individuals}`. Content transcribed from `Camping_Nigeria_Offers_1.html` into [lib/offers-data.ts](../lib/offers-data.ts), which feeds the render, metadata, OG copy, JSON-LD and sitemap. The source document's visual language (gold chip, four-column facts strip, gold square bullets in two columns, "Everything in X, plus:" bar, notes block) was reimplemented in brand tokens rather than importing its CSS. Shared shell `OfferGroupPage.tsx` keeps each `page.tsx` to four lines. Because every package carries a numeric `priceFromValue`, all three group pages emit `Service` + `AggregateOffer` — previously only the DoE page was eligible for price-range rich results. Also added: 8 OG/Twitter route files, 4 sitemap entries, a footer Quick Links entry, a homepage grid link, and an `OfferGroupNav` strip for lateral movement between markets. Built additively — the quote-based flows (`/schools/proposal` engine, DoE tiers, gear-rental quote tool) are untouched.
38. ✅ **`BOOKING_FORM_URL` extracted to `lib/constants.ts`.** The Microsoft Forms link was hardcoded in `IndividualsHero.tsx` and `IndividualsCta.tsx`; the offers build would have made a third copy. Both existing call sites now import the constant.
39. ✅ **Node.js installed on the Windows dev machine** (24.19.0 LTS via winget) — it was absent entirely, so `npm` could not run. `.env.local` created from `.env.example` with all secrets blank; the site renders fully without them, but forms do not send and the gear-rental equipment selector stays hidden until `RESEND_API_KEY` and `NEXT_PUBLIC_SHEETS_ITEMS_URL` are filled in.
40. ✅ **Primary typeface switched to DM Sans; Agrandir confirmed as secondary.** `font-sans` now resolves to DM Sans via `next/font/google` (self-hosted at build time, so `font-src 'self'` in the CSP still covers it and no CSP edit was needed); `font-serif` is unchanged Agrandir. Fallback stacks added to both `@theme inline` entries in `app/globals.css` so a missing variable degrades to a system font instead of nothing. The `next/font/local` loader for Helvetica was removed from `app/layout.tsx`. **Note:** Tailwind v4 caches the compiled `@theme` block — the dev server had to be restarted with `.next` cleared before `font-sans` picked up the new variable; a plain hot reload kept serving `var(--font-helvetica-now)`, which by then was undefined. Email templates keep their web-safe `Helvetica,Arial,sans-serif` stacks on purpose. `public/fonts/Helvetica.ttf` is now unreferenced and can be deleted.
41. ✅ **Contact details updated and de-duplicated.** Phone `+234 814 607 5937` → **`+234 903 404 2503`** (given as local `09034042503`; rendered international to match the existing convention and keep `tel:` links and the `LocalBusiness` schema dialable from abroad). WhatsApp moved from the number-derived `wa.me/2348146075937` to the business click-to-chat short link **`https://wa.me/message/4NX4VTGXCP4UE1?src=qr`** — the two are now independent values, see [decisions.md](decisions.md). Instagram `@camping_ng` → **`@campingnigeria`**. Beyond the value swap, all five email routes were changed to interpolate `CONTACT` instead of hardcoding — they had been carrying stale details that the previous contact update (entry 33) missed. Three form placeholders showing the old number as an example were also updated. Verified rendered: contact page, footer, `tel:` links, and the `telephone` / `sameAs` fields in the JSON-LD.
