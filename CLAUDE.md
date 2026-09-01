# CLAUDE.md

Briefing for Claude Code. Read this before touching the repo.

## What this is

Marketing + lead-capture site for **Camping Nigeria** — an outdoor-learning / camping-gear company running school programs, individual trips, and gear rental in Nigeria. Live at `campingnigeria.com`.

The site is the main acquisition surface: it books individuals into trips (via Microsoft Forms), captures school proposals + gear-rental quotes (via Resend email), and routes Duke of Edinburgh enquiries into an Outlook Bookings calendar.

## Stack

- **Next.js 16.2.4** App Router, **React 19.2**, **TypeScript 5.7**
- **Tailwind v4** with `@theme inline` CSS-defined tokens — **no `tailwind.config.js`**. Brand tokens live in `app/globals.css`.
- **Framer Motion 12** for reveals, staggered children, masked H2 animations
- **lucide-react** for icons (no emojis in UI)
- **Resend REST API** via direct `fetch()` (not the SDK) in 5 API routes
- **@vercel/analytics** for traffic analytics
- Fonts: **Agrandir** (headings, `var(--font-agrandir)` → `font-serif`, local `.otf` via `next/font/local`) + **Inter** (body/UI, `var(--font-inter)` → `font-sans`, `next/font/google`, self-hosted at build time). `font-serif` is only Tailwind's slot name — Agrandir is a geometric sans, not a serif.

## Key routes

Public pages (all App Router `page.tsx`):
- `/` — home (hero video, schools/individuals/gear teasers)
- `/offers` — published-pricing hub. Hero with one pill button per market, then group cards. Each market has its own route: `/offers/schools`, `/offers/organizations`, `/offers/individuals`. All content in `lib/offers-data.ts`; shared shell in `components/offers/OfferGroupPage.tsx`. **Not in the main navbar** — reached from the footer Quick Links, the homepage grid, and an `OfferShowcase` section on each market's own page. Detail rendering is shared via `components/offers/OfferDetail.tsx`. Coexists with the quote-based flows rather than replacing them — see `context/decisions.md`.
- `/events/base-camp-kids` — one-day event activation with its own registration form, sibling-discount pricing engine, and Sheets recording → `/api/event-registration`. Source of truth: `lib/events/base-camp-kids.ts`. Confirmation page at `/events/base-camp-kids/registered`.
- `/about`, `/individuals`, `/organizations` — light marketing pages. `/individuals` and `/organizations` each carry an `OfferShowcase` section (compact offer cards that expand into a modal), as does `/schools`.
- `/schools` — hub, includes the Duke of Edinburgh callout
- `/schools/international-award` — full DoE page with 4-question assessment → `/api/assessment-lead`. Q3 (group size) is a free integer; phone is required on the capture phase. Assessment results CTAs are conditional: equipment-only takers go to `/gear-rental`, everyone else to `/schools/international-award/proposal?tier={recommended}`
- `/schools/international-award/proposal` — dedicated DoE proposal form for both schools and parents, with published-tier selection (Base Camp / Trail Ready / Summit Partner / Not sure) → `/api/award-proposal`
- `/schools/programs/{nature-craft,leadership-development,on-campus-camps}` — three school sub-programs
- `/schools/proposal` — deterministic smart form (9 questions, `proposal-engine.ts` picks a program from qualitative answers; an optional Step 6 date+time picker captures preferred timing for the team but doesn't drive scoring) → `/api/proposal`
- `/gear-rental` — equipment rental page + structured quote form → POSTs **direct to `quote.campingnigeria.com/api/submit-quote`** (separate project). Confirmation page at `/gear-rental/submitted`. The website project no longer has a `/api/gear-quote` route — pricing, persistence, and email all live in the quote tool.
- `/events` — hub listing upcoming and past editions, driven entirely by the registry in `lib/events/index.ts`. Adding an event = a detail module + one registry entry; no page edits. With nothing upcoming it renders an empty state pointing at `/contact` and `/schools/proposal`.
- `/events/base-camp-kids` — the 30 May 2026 Children's Day camp, now a **past edition**. `EVENT_STATUS` in `lib/events/base-camp-kids.ts` drives everything: `'past'` closes the registration form, drops the ticket `Offer` from the Event JSON-LD, switches Hero/Pricing/metadata to recap copy, and makes `/api/event-registration` return 403. Deliberately a flag rather than a date comparison — the pages are statically rendered, so `Date.now()` bakes in at build time. Confirmation page at `/events/base-camp-kids/registered`.
- `/contact` — contact form → `/api/contact`
- `/privacy-policy`, `/terms`

Internal API routes (in `app/api/*/route.ts`): `contact`, `proposal`, `assessment-lead`, `award-proposal`, `event-registration` (currently gated closed — see `/events/base-camp-kids` above). Each runs the full defensive stack before Resend: honeypot (`website_confirm`) → per-IP rate limit (Upstash, 5/hr/route) → type-guard validation with enum allowlists → format checks (email regex, phone digits) → length caps → server-side recommendation derivation (proposal + assessment) → escape-html on every user field in the template → send both emails via `lib/mail.ts#sendPairedMail`. Internal notification to `hello@campingnigeria.com`, customer confirmation to the submitter. Falls back to opening a pre-filled `mailto:` if `RESEND_API_KEY` is missing.

The gear-rental form does **not** use this stack — it talks straight to the quote tool. The website hosts the form UI + the live-CSV equipment selector + the confirmation page; everything else is upstream. See [context/state.md](context/state.md) for the Phase 2 quote-tool integration details.

## External services

- **Resend** — transactional email. Needs `RESEND_API_KEY` env var. From address: `rentals@campingnigeria.com` / similar per route.
- **Microsoft Forms** — individual trip bookings. URL lives in `lib/constants.ts#BOOKING_FORM_URL`. All "Book Your Spot" CTAs link out — don't re-hardcode it.
- **Outlook Bookings** — DoE consultation calendar. URL lives in `lib/constants.ts#CALENDAR_BOOKING_URL`. **Cannot be iframed** (X-Frame-Options) — always link-out.
- **Vercel** — hosting + analytics.

## Brand tokens

Defined in `app/globals.css` `:root`, exposed to Tailwind via `@theme inline`:

| Token | Hex | Usage |
|---|---|---|
| `--brand-dark` | `#0e3e2e` | Forest green — primary surfaces, body text |
| `--brand-accent` | `#e6b325` | Gold — CTAs, accents, borders |
| `--brand-accent-readable` | `#b8880a` | Darker gold for text on cream |
| `--brand-light` | `#f3efe6` | Cream — page background |
| `--brand-dark-tint` | `#e8f0ed` | Cool green tint — soft backgrounds |
| `--brand-accent-tint` | `#fdf6e3` | Cream-gold tint — price boxes |

Use as `bg-brand-dark`, `text-brand-accent-readable`, etc.

## Contact + ownership

- **Storefront address:** Shop No. 17A, Arts and Craft Village, Sani Abacha Way, Wuse, Abuja 904101, FCT, Nigeria (Plus code `3F8M+9RW`)
- Domain contact: `hello@campingnigeria.com` / `+234 903 404 2503`. WhatsApp is a click-to-chat short link, not a number-based `wa.me/<digits>` URL — see `lib/constants.ts#CONTACT`
- Socials: Instagram `@campingnigeria`, Facebook `campinggearsng`
- Built by the three founders: **Irewole** (CEO · [@irewole2019](https://github.com/irewole2019) · `iakande@live.com`), **Taiye** (President), **Kehinde** (Managing Director). See [context/people.md](context/people.md) for who to involve in which decisions.

## Where to look next

- [context/state.md](context/state.md) — what's built, in progress, next
- [context/decisions.md](context/decisions.md) — *why* things are built this way
- [context/conventions.md](context/conventions.md) — naming patterns, shared helpers
- [context/people.md](context/people.md) — who to involve for which decisions

## Local dev

```bash
npm install
npm run dev       # localhost:3000 (or :3001 if 3000 is taken)
npm run build     # production build — run before merging
npm run lint      # eslint
npm test          # vitest run (83 pure-function tests)
npm run test:watch # vitest watch mode
npx tsc --noEmit  # type check
```

Needs `.env.local` with `RESEND_API_KEY` for email delivery, `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` for per-IP rate limiting (rate limit fails open in dev without them, fails *closed* in prod), and `NEXT_PUBLIC_SHEETS_ITEMS_URL` for the gear-rental equipment selector to populate (without it, the form falls back to a message-only flow with an amber notice). All three plus the optional SEO env vars are documented in `.env.example`.
