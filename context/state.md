# state.md

What is built, what is in progress, what is next. Update every session.

Last updated: 2026-04-22

## Built

### Marketing pages
- **Home** (`/`) — hero video, scroll-to-top on route change. `<BackgroundVideo>` now:
  - Honours `prefers-reduced-motion` (pause) and `prefers-reduced-data` (skip video entirely, show poster only)
  - Accepts optional additional `<source>` variants (WebM first, MP4 fallback)
  - Uses `/images/schools/hero.jpg` as the backup poster — shown until first frame paints, or permanently if the video is slow/failed/blocked
  - Wired in [app/page.tsx](../app/page.tsx) to read `/videos/hero-bg.webm` when the browser supports it, falling back to the MP4 in `VIDEO_URL`
- **Schools** (`/schools`) — hub page with Duke of Edinburgh split callout (image right, gold offset border)
- **Individuals** (`/individuals`) — light marketing page, "Book Your Spot" → Microsoft Forms
- **Organizations** (`/organizations`) — light marketing page
- **About** (`/about`), **Privacy** (`/privacy-policy`), **Terms** (`/terms`)

### School programs (full sub-pages)
- **Nature Craft** — `/schools/programs/nature-craft`
- **Leadership Development** — `/schools/programs/leadership-development` (uses "CLASS" label, not "Ages")
- **On-Campus Camps** — `/schools/programs/on-campus-camps` (2-day only)

### Duke of Edinburgh (international award)
- `/schools/international-award` with 7 sections: hero, award, expedition tiers, our role, what we provide, assessment, FAQ
- **Pricing (current):** Base Camp ₦3M / Trail Ready ₦5M / Summit Partner ₦8M — all **"for up to 60 students"**, with a shared note "Additional students from ₦50,000 each — max group of 100"
- "See the full offer breakdown" → downloads `public/pdf/CampingNigeria_DoE_Offer_download.pdf`
- **4-question assessment** — the tier-recommendation logic lives in [lib/expedition-recommendation.ts](../lib/expedition-recommendation.ts) and is shared between the client (instant preview) and the API (trusted derivation for outbound email). Q2 tunes summary prefix, **Q3 weaves group size into the tier summary copy**, Q4 selects the tier.

### Lead-capture forms (all branded, all via Resend via `lib/mail.ts`)
| Route | Form file | API route | Recipient |
|---|---|---|---|
| `/contact` | `components/contact/ContactForm.tsx` | `app/api/contact/route.ts` | `hello@campingnigeria.com` |
| `/gear-rental` | `components/gear-rental/QuoteForm.tsx` | `app/api/gear-quote/route.ts` | `hello@campingnigeria.com` |
| `/schools/proposal` | `components/proposal/ProposalForm.tsx` | `app/api/proposal/route.ts` | `hello@campingnigeria.com` |
| `/schools/international-award` | `components/schools/international-award/ExpeditionAssessment.tsx` | `app/api/assessment-lead/route.ts` | `hello@campingnigeria.com` |

All 4 routes send **two** emails (internal + customer confirmation) via `sendPairedMail` from `lib/mail.ts`. Every route runs the full defensive stack: honeypot → IP rate limit → payload type guard → trim check → format check (email regex, phone digit count) → length caps. Recommendation payloads (proposal program/tier, assessment tier) are **derived server-side** — the API never trusts a client-supplied recommendation.

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

### Gear rental form specifics
- **Phone number required** (WhatsApp preferred label) — validated client + server
- **Date pickers** for rental dates (`min={today}` on start, end `min` tracks start) — `today` and `minEndDate` are initialised in a `useEffect` instead of during render, so the SSR-rendered `min=""` and the client value can't disagree near midnight.
- Combined into `"14 March 2026 – 17 March 2026"` string before POST so API + email templates stay unchanged.

### Cross-cutting
- Favicons (light + dark variants) = Camping Nigeria logo
- Sitemap includes all DoE pages, 3 program pages, and `/schools/proposal`
- Mobile pass: iOS input zoom fixed (`text-base sm:text-sm`), dynamic viewport units (`dvh`) on heroes, scroll-padding for anchor offsets
- `ScrollToTop` component forces `behavior: 'instant'` on every route change
- `npm run lint` works — `eslint@9` + `eslint-config-next@16.2.4` with flat config in `eslint.config.mjs`
- **Dependencies current: Next 16.2.4, `npm audit` clean.** Upgrade from 16.1.6 resolved 6 HIGH CVEs (HTTP request smuggling, CSRF bypass, DoS variants).

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
4. ✅ Hero video poster + reduced-data handling + WebM source slot — wired to `/images/schools/hero.jpg` as the backup poster
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
