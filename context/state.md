# state.md

What is built, what is in progress, what is next. Update every session.

Last updated: 2026-04-27

## Company

Camping Nigeria is based in **Abuja** — registered address **198 Damboa Close, PW, Kubwa, Abuja, FCT, Nigeria**. Address flows from [`CONTACT.address` in lib/constants.ts](../lib/constants.ts) — never hardcoded; both the contact page, privacy policy, and `LocalBusiness` schema reference the same constant.

## Built

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
- **On-Campus Camps** — `/schools/programs/on-campus-camps` (2-day only)

### Events
- **Base Camp Kids** — `/events/base-camp-kids` — one-day Children's Day camp activation, Saturday 30 May 2026, Abuja, ages 4–12, 30-seat hard cap.
  - Pricing: ₦100,000 early-bird (online) / ₦150,000 walk-in. 10% sibling discount on every additional child (per-sibling ₦90,000), computed server-side via `computeRegistrationTotal` in [lib/events/base-camp-kids.ts](../lib/events/base-camp-kids.ts).
  - Flow: registration form → Resend paired email (internal + customer confirmation) → manual invoice → payment locks the seat. **No payment processor** — deliberate v1 choice; Paystack/Stripe to be added once volume justifies the integration cost.
  - API: `app/api/event-registration/route.ts` runs the same defensive stack as the other 3 Resend routes (honeypot → IP rate limit `event-registration` 5/hr/route → type-guard → email regex → phone digit count → length caps → server-derived total → paired send). Children array capped at 6 per registration; ages strictly 4–12.
  - Confirmation page: `/events/base-camp-kids/registered` reads `?name&email&kids&total` from `searchParams` (server component), shows a 3-step "what happens next" list.
  - Source-of-truth file [lib/events/base-camp-kids.ts](../lib/events/base-camp-kids.ts) feeds the page render, the schema, the email templates, and the confirmation page — single point of edit for date/price/seat-cap/schedule/FAQs/souvenirs.
  - Schema: `Event` with embedded `Offer` (NGN 100,000, `LimitedAvailability`), `audience` 4–12, `maximumAttendeeCapacity: 30`, plus `BreadcrumbList` and `FAQPage`. New `buildEventJsonLd` helper in [lib/structured-data.ts](../lib/structured-data.ts).
  - OG/Twitter cards reuse `/images/schools/hero.webp` (no event-specific photo until after the event runs).

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
| `/gear-rental` | `components/gear-rental/QuoteForm.tsx` | **External** — POST to `https://quote.campingnigeria.com/api/submit-quote` | Quote tool handles persistence + email |
| `/events/base-camp-kids` | `components/events/base-camp-kids/RegistrationForm.tsx` | `app/api/event-registration/route.ts` (Resend) | `hello@campingnigeria.com` |

The 3 Resend-backed routes send **two** emails (internal + customer confirmation) via `sendPairedMail` from `lib/mail.ts`. Each runs the full defensive stack: honeypot → IP rate limit → payload type guard → trim check → format check (email regex, phone digit count) → length caps. Recommendation payloads (proposal program/tier, assessment tier) are **derived server-side** — the API never trusts a client-supplied recommendation.

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
- **Vitest** (`npm test` / `npm run test:watch`) — 44 tests across 3 files covering the security-critical pure functions:
  - `tests/html.test.ts` — `escapeHtml`, `safeUrl`, `isHoneypotTripped`, `withinLengthCaps`
  - `tests/proposal-engine.test.ts` — `isValidAnswers`, program selection, `campsEligible` guard, tier selection (including restored on-campus-camps groupSize-based tiering)
  - `tests/expedition-recommendation.test.ts` — `isValidAnswerKey`, `getRecommendedTier` (Q4 drives tier, Q2 tunes prefix, Q3 surfaces group-size copy)

### Gear rental — Phase 2 quote-tool integration

The `/gear-rental` form is the customer-facing entry point for a separate quote tool deployed at `quote.campingnigeria.com`. The website project handles the form UI; the quote tool handles persistence, pricing, review queue, and customer emails.

**Form behaviour:**
- **Equipment selector** is structured, not free-text — a collapsible category list backed by a published Google Sheets CSV (`NEXT_PUBLIC_SHEETS_ITEMS_URL`, items tab, `gid=0`).
  - Live config: 13 items across 7 categories (`tents`, `blankets`, `mats`, `pads`, `pillows`, `bicycles`, `hammocks`).
  - Tents lead (primary product), then sleep gear (`pads`, `mats`, `pillows`, `blankets`), then everything else alphabetical.
  - Tents start expanded; other categories start collapsed. A "{N} selected" pill on collapsed headers shows what's inside.
  - The customer never sees prices — `lib/quote-config.ts#loadQuoteItems` reads only `id`, `name`, `category`, `available_qty` from the CSV (the `base_price_naira` column is intentionally ignored).
- **Required fields:** name, email, phone (WhatsApp-preferred), rental start/end dates, delivery zone (Abuja/Lagos/Other), and at least one item with quantity > 0 (skipped if the CSV failed to load — message field carries the request instead).
- **Optional fields:** organisation/school, message.
- **Submit** does a direct browser POST to `https://quote.campingnigeria.com/api/submit-quote` with `{ customer, delivery_zone, rental_start, rental_end, items, message }`.
- **On success** (`{ success: true, reference: 'CNQ-2026-XXXX' }`): redirect to `/gear-rental/submitted?ref=...&email=...&name=...`. The confirmation page is a server component reading `searchParams`.
- **On failure or network error:** amber banner with retry copy. No mailto fallback.
- **Equipment list unavailable** (CSV unreachable / env var missing): the equipment section is hidden and an amber notice tells the user to describe their needs in the message field.

**What the website does NOT do for gear-rental:**
- No internal-notification or customer-confirmation email — the quote tool sends those (the quote-tool's `Send Quote` action triggers the priced email).
- No honeypot enforcement, no per-IP rate limiting — the quote-tool runs its own anti-abuse stack. The honeypot input is still rendered (cheap insurance, ignored at submit time).
- No `/api/gear-quote` route — deleted in Phase 2.

**Operational dependency:** the website is only useful if the quote tool is live AND its CORS allows `https://www.campingnigeria.com`. Apex `campingnigeria.com` 307-redirects to www at the Vercel edge, so www is the only origin browsers actually use.

### SEO
- **Per-page metadata** via `lib/seo.ts#buildPageMetadata` — canonical, keywords, Open Graph (1200×630, `en_NG`), Twitter (`summary_large_image`). Used on all 14 routes.
- **Per-route dynamic OG + Twitter cards** — every major page has its own `opengraph-image.tsx` + `twitter-image.tsx` pair (10 pages × 2 = 20 route files). Each calls a shared renderer at [lib/og-image.tsx](../lib/og-image.tsx) that composites the page's hero photo behind a forest-green gradient overlay with a gold-pill eyebrow + share-optimised headline. Homepage card reads "Adventure Made Simple". WebP heroes render fine through Satori — no JPG fallbacks needed.
- **Structured data** (`lib/structured-data.ts`, rendered via `components/seo/JsonLd.tsx`):
  - `Organization` + `LocalBusiness` hybrid (global) with `PostalAddress` (198 Damboa Close, PW, Kubwa, Abuja, FCT, NG), `priceRange`, `areaServed: Nigeria`, `sameAs` (IG/FB), `contactPoint`
  - `WebSite` with publisher reference to the org `@id`
  - `BreadcrumbList` on every page
  - `FAQPage` on `/schools/international-award` driven by `AWARD_FAQS`
  - `Service` on each of the 3 program pages (Nature Craft, Leadership Development, On-Campus Camps) with `hasOfferCatalog` describing each tier
  - `Service` + `AggregateOffer` on `/schools/international-award` with real NGN prices (₦3M / ₦5M / ₦8M) — eligible for price-range rich results
- **Sitemap** (`app/sitemap.ts`) — 14 URLs with priorities, changefreq, env-driven `lastModified`, **and per-URL `<image:image>` entries** for the key pages (home, schools hub, DoE, each program, audience pages, gear rental, about).
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

Nothing as of this session.

## Next (tracked TODOs)

### Code TODOs (tracked)

- **Flip CSP from report-only to enforce** — currently `Content-Security-Policy-Report-Only`. Collect violations from real traffic for a week or two via browser DevTools (or wire up a report-uri endpoint), then rename the header key in `next.config.mjs` to `Content-Security-Policy`.
- **Re-encode hero WebM smaller** — current `/videos/hero-bg.webm` is 7.97 MB, larger than the MP4 fallback (4.8 MB). A VP9 re-encode at `-crf 34`–`36` should get it under the MP4 size while preserving WebM's codec efficiency. Until then Chrome/Firefox/Edge users download ~8 MB instead of ~5 MB.
- **Expand test coverage** — 44 pure-function tests in place. Next candidates: `lib/rate-limit.ts#getClientIp` (header parsing), route-handler integration tests hitting real payloads end-to-end.

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
