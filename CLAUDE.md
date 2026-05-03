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
- **Resend REST API** via direct `fetch()` (not the SDK) in 4 API routes
- **@vercel/analytics** for traffic analytics
- Fonts: `var(--font-helvetica-now)` (sans) + `var(--font-agrandir)` (serif)

## Key routes

Public pages (all App Router `page.tsx`):
- `/` — home (hero video, schools/individuals/gear teasers)
- `/about`, `/individuals`, `/organizations` — light marketing pages
- `/schools` — hub, includes the Duke of Edinburgh callout
- `/schools/international-award` — full DoE page with 4-question assessment → `/api/assessment-lead`
- `/schools/programs/{nature-craft,leadership-development,on-campus-camps}` — three school sub-programs
- `/schools/proposal` — deterministic smart form (9 questions, `proposal-engine.ts` picks a program from qualitative answers; an optional Step 6 date+time picker captures preferred timing for the team but doesn't drive scoring) → `/api/proposal`
- `/gear-rental` — equipment rental page + structured quote form → POSTs **direct to `quote.campingnigeria.com/api/submit-quote`** (separate project). Confirmation page at `/gear-rental/submitted`. The website project no longer has a `/api/gear-quote` route — pricing, persistence, and email all live in the quote tool.
- `/contact` — contact form → `/api/contact`
- `/privacy-policy`, `/terms`

Internal API routes (in `app/api/*/route.ts`): `contact`, `proposal`, `assessment-lead`. Each runs the full defensive stack before Resend: honeypot (`website_confirm`) → per-IP rate limit (Upstash, 5/hr/route) → type-guard validation with enum allowlists → format checks (email regex, phone digits) → length caps → server-side recommendation derivation (proposal + assessment) → escape-html on every user field in the template → send both emails via `lib/mail.ts#sendPairedMail`. Internal notification to `hello@campingnigeria.com`, customer confirmation to the submitter. Falls back to opening a pre-filled `mailto:` if `RESEND_API_KEY` is missing.

The gear-rental form does **not** use this stack — it talks straight to the quote tool. The website hosts the form UI + the live-CSV equipment selector + the confirmation page; everything else is upstream. See [context/state.md](context/state.md) for the Phase 2 quote-tool integration details.

## External services

- **Resend** — transactional email. Needs `RESEND_API_KEY` env var. From address: `rentals@campingnigeria.com` / similar per route.
- **Microsoft Forms** — individual trip bookings. Hardcoded link: `https://forms.office.com/r/bgsZ4shNxD`. All "Book Your Spot" CTAs link out.
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

- **Registered address:** 198 Damboa Close, PW, Kubwa, Abuja, FCT, Nigeria
- Domain contact: `hello@campingnigeria.com` / `+234 704 053 8528` (WhatsApp: `wa.me/2347040538528`)
- Socials: Instagram `@camping_ng`, Facebook `campinggearsng`
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
npm test          # vitest run (44 pure-function tests)
npm run test:watch # vitest watch mode
npx tsc --noEmit  # type check
```

Needs `.env.local` with `RESEND_API_KEY` for email delivery, `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` for per-IP rate limiting (rate limit fails open in dev without them, fails *closed* in prod), and `NEXT_PUBLIC_SHEETS_ITEMS_URL` for the gear-rental equipment selector to populate (without it, the form falls back to a message-only flow with an amber notice). All three plus the optional SEO env vars are documented in `.env.example`.
