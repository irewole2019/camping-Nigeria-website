# CLAUDE.md

Briefing for Claude Code. Read this before touching the repo.

## What this is

Marketing + lead-capture site for **Camping Nigeria** — an outdoor-learning / camping-gear company running school programs, individual trips, and gear rental in Nigeria. Live at `campingnigeria.com`.

The site is the main acquisition surface: it books individuals into trips (via Microsoft Forms), captures school proposals + gear-rental quotes (via Resend email), and routes Duke of Edinburgh enquiries into an Outlook Bookings calendar.

## Stack

- **Next.js 16.1.6** App Router, **React 19.2**, **TypeScript 5.7**
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
- `/schools/proposal` — deterministic smart form (8 questions, `proposal-engine.ts` picks a program) → `/api/proposal`
- `/gear-rental` — equipment rental page + quote form → `/api/gear-quote`
- `/contact` — contact form → `/api/contact`
- `/privacy-policy`, `/terms`

API routes (all in `app/api/*/route.ts`): `contact`, `gear-quote`, `proposal`, `assessment-lead`. Each validates with an `isValidPayload` type guard, escapes every user field with `lib/html.ts#escapeHtml`, strips CRLF from subjects, and sends **two branded HTML emails per submit** — an internal notification to `hello@campingnigeria.com` and a customer confirmation to the submitter. Falls back to opening a pre-filled `mailto:` if `RESEND_API_KEY` is missing.

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
npm run dev    # localhost:3000 (or :3001 if 3000 is taken)
npm run build  # production build — run before merging
npm run lint   # eslint
npx tsc --noEmit  # type check
```

Needs `.env.local` with `RESEND_API_KEY=...` for email delivery in dev. Without it, forms fall back to `mailto:` drafts.
