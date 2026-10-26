# CLAUDE.md

Briefing for Claude Code. Read this before touching the repo.

## What this is

Marketing + lead-capture site for **Camping Nigeria** — an outdoor-learning / camping-gear company running school programs, community events and trips, and gear rental in Nigeria. Live at `campingnigeria.com`.

The site is the main acquisition surface: it grows the African Dream Community and books people into trips (Open Camp seats via Microsoft Forms) and captures school proposals + gear-rental quotes (via Resend email).

> **The Duke of Edinburgh / International Award surface is currently hidden.** One switch: `DOE_ENABLED` in `lib/feature-flags.ts`, set to `false`. It is a temporary hide, not a removal — nothing was deleted, and flipping the flag to `true` restores every page, route, section, link, sitemap entry and keyword. Read that file before touching anything DoE-related; the routes below still exist in the tree but are unreachable.

## Stack

- **Next.js 16.2.4** App Router, **React 19.2**, **TypeScript 5.7**
- **Tailwind v4** with `@theme inline` CSS-defined tokens — **no `tailwind.config.js`**. Brand tokens live in `app/globals.css`.
- **Framer Motion 12** for reveals, staggered children, masked H2 animations
- **lucide-react** for icons (no emojis in UI)
- **Resend REST API** via direct `fetch()` (not the SDK) in 5 API routes
- **@vercel/analytics** for traffic analytics
- Fonts: **Agrandir** (headings, `var(--font-agrandir)` → `font-serif`) + **DM Sans** (body/UI, `var(--font-dm-sans)` → `font-sans`). Both are local files in `public/fonts/` via `next/font/local` — **no `next/font/google`**, so builds never depend on Google being reachable. `font-serif` is only Tailwind's slot name; neither face is a serif.

## Key routes

Public pages (all App Router `page.tsx`):
- `/` — home (hero video, schools/community/gear teasers)
- `/offers` — published-pricing hub. Hero with one pill button per market, then group cards. Each market has its own route: `/offers/schools`, `/offers/organizations`, `/offers/community`. All content in `lib/offers-data.ts`; shared shell in `components/offers/OfferGroupPage.tsx`. **Not in the main navbar** — reached from the footer Quick Links, the homepage grid, and an `OfferShowcase` section on each market's own page. Detail rendering is shared via `components/offers/OfferDetail.tsx`. Coexists with the quote-based flows rather than replacing them — see `context/decisions.md`.
- `/about`, `/organizations` — light marketing pages. `/organizations` carries an `OfferShowcase` section (compact offer cards that expand into a modal), as does `/schools`. `/community` deliberately does **not** — the founders took the offers off it on 14/10/2026; they live only at `/offers/community`.
- `/community` — **The African Dream Community**, which **replaced `/individuals` on 14/10/2026** (single-hop 308 redirects from `/individuals` and `/offers/individuals` and everything under them, in `next.config.mjs`; live since 14/10/2026). "Individuals" is gone from every audience label, link, route and the offers group; general prose that uses "individuals" to mean people (gear rental, About, Terms, site OG) was deliberately left alone. Content in `lib/community.ts`, from the team's page document. Full-screen video hero modelled on the homepage gateway; a hero clip trimmed and cross-faded so it loops with no black frame; three "Events we've hosted" gallery slots (`EVENT_SLOTS`) that darken on hover and reveal an "Explore Gallery →" text link bottom-left, opening a native `<dialog>` — September Camp Night plus two placeholders, all with empty `photos` until the founders say which photos belong to which event. **Join the Community → Instagram `@africandream_ng`**; the WhatsApp line is the same `0704 053 8528` as the event pages, and still not in `CONTACT`.
- `/schools` — hub. Its Duke of Edinburgh callout is **hidden** while `DOE_ENABLED` is false.
- `/schools/international-award` — **hidden** (307s to `/schools`). Full DoE page with 4-question assessment → `/api/assessment-lead`. Q3 (group size) is a free integer; phone is required on the capture phase. **Sells the school offers** (Field Day / Campus Expedition / Outdoor Year) via `OfferShowcase`; Q4 asks about time commitment and selects one of them. Every result routes to `/schools/international-award/proposal?tier={recommended}`. The Base Camp / Trail Ready / Summit Partner tiers were retired — see `context/decisions.md`.
- `/schools/international-award/proposal` — **hidden** (307s to `/schools`). Dedicated DoE proposal form for both schools and parents, with package selection (Field Day / Campus Expedition / Outdoor Year / Not sure) → `/api/award-proposal`. Legacy `?tier=base-camp|trail-ready|summit-partner` links deliberately fall through to "Not sure".
- `/schools/programs/{nature-craft,leadership-development,on-campus-camps}` — three school sub-programs
- `/schools/proposal` — deterministic smart form (9 questions, `proposal-engine.ts` picks a program from qualitative answers; an optional Step 6 date+time picker captures preferred timing for the team but doesn't drive scoring) → `/api/proposal`
- `/gear-rental` — equipment rental page + structured quote form → POSTs **direct to `quote.campingnigeria.com/api/submit-quote`** (separate project). Confirmation page at `/gear-rental/submitted`. The website project no longer has a `/api/gear-quote` route — pricing, persistence, and email all live in the quote tool.
- `/events` — hub listing upcoming and past editions, driven entirely by the registry in `lib/events/index.ts`. Adding an event = a detail module + one registry entry; no page edits. With nothing upcoming it renders an empty state pointing at `/contact` and `/schools/proposal`. Currently one event is upcoming — MAD Settings — so it is `FEATURED_UPCOMING_EVENT` and drives the homepage banner.
- `/events/mad-settings` — **MAD Settings**, 31 October 2026, a pop-up / bonfire party / camping day-into-night at the same Brooks Garden venue, presented by African Dream Community × Tbee Sounds. **Built on the Camp Night framework file for file** (`lib/events/mad-settings.ts`, `mad-settings-records.ts`, `/api/mad-settings-signup`, `components/events/mad-settings/`, `docs/mad-settings/`), with the same four rules below — private venue, offline pay-first, cap in the Apps Script, event-only phone line. **One difference that matters:** three tickets, and *Attendance only* (₦10,000) has no tent. So the **80-tent cap counts sleepover rows only** (`usesTent` → the sheet's `Tent?` column); attendance-only is uncapped. Codes are `MAD-XXXXXX`. Its sheet is a separate deployment behind `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` — **one deployment only**: the separate TEST deployment was archived on 26/10/2026, and `.env.local` deliberately has no sheet link, so local runs never write into the live sheet. **Tribes** (26/10/2026): every sign-up is put in one of four tribes (Gadaff, Kutinga, Mandi, Sellas — `lib/events/mad-settings-tribes.ts`), **assigned by the Apps Script** (least-filled, a couple counts as two) into the sheet's last column, **Tribe**, and shown in the confirmation email, the "You are in" page, the Padi Check welcome/already screens and the printed list. `TRIBE_NAMES` in the script is a second copy of the names (a test checks they match). Every confirmation email ends with the team's social link, `https://madsettings.theboostnation.space/`. Live since 13/10/2026, status `'upcoming'` — flip to `'past'` after the night; description, OG copy and trust line are already built to survive that.
- `/events/camp-night` — the **26 September 2026** adults' overnight camp at Brooks Garden, Abuja, now a **past edition** (`EVENT_STATUS = 'past'` since 28/09/2026): the sign-up form is gone, `/api/camp-night-signup` returns 403, the ticket `Offer` is dropped from the Event JSON-LD, and hero, description, OG cards and sitemap priority switched to recap. Source of truth: `lib/events/camp-night.ts`. While open, sign-ups issued an `SCN-XXXXXX` code and recorded the row to a Google Sheet via Apps Script. Confirmation page at `/events/camp-night/registered` still works for existing codes. Debrief (guest feedback, follow-ups, ideas for the next edition) at `docs/camp-night/debrief-2026-09-26.md`; phone numbers are in the gitignored `.private.md` beside it. Four things to know before reusing it for another edition:
  - **The venue is not public.** Use `VENUE_PUBLIC_LABEL` (the city) on anything a stranger can load; `VENUE_NAME` / `VENUE_LABEL` / `VENUE_MAP_URL` are for the confirmation email and the coded confirmation page only. That includes the Event JSON-LD, which is indexed into rich results.
  - **Payment is offline and happens before sign-up**, so the sheet's `Paid?` arrives as `Yes` behind a required checkbox.
  - The **60-tent cap is enforced in the Apps Script only** (`docs/camp-night/apps-script.gs`), because the page is static and cannot count — no webhook means no cap, and rows are what it counts, so a test row occupies a tent until deleted.
  - The enquiries number `+234 704 053 8528` belongs to this event alone and is deliberately **not** in `CONTACT`, with a test enforcing that.

  Setup guide: `docs/camp-night/SETUP.md`.
- `/events/kiddies-hike` — the 21 August 2026 potluck family hike, a **past edition** with real photography. Source of truth: `lib/events/kiddies-hike.ts`. Built from the approved copy deck at `docs/events/CampingNigeria_KiddiesHike_EventBreakdown_v3.docx`; that deck's no-em-dash house style is deliberate on this page and differs from Base Camp Kids.
- `/events/base-camp-kids` — the 30 May 2026 Children's Day camp, now a **past edition**. `EVENT_STATUS` in `lib/events/base-camp-kids.ts` drives everything: `'past'` closes the registration form, drops the ticket `Offer` from the Event JSON-LD, switches Hero/Pricing/metadata to recap copy, and makes `/api/event-registration` return 403. Deliberately a flag rather than a date comparison — the pages are statically rendered, so `Date.now()` bakes in at build time. Confirmation page at `/events/base-camp-kids/registered`.
- `/padi-check` — **Padi Check**, the gate check-in tool for MAD Settings (built 17–26/10/2026; plan and decisions in `usl-build/`, especially `8-build-sequence.md` Section 9). Volunteer password → rear-camera QR scanner plus a typed-code box → one full-screen answer per scan: green **Welcome in!**, orange **Already checked in**, red **We cannot find this code** / **Not marked as paid**, grey **Cannot reach the list**, and a camera-off screen. Look and copy follow the founder's designs (25/10/2026), recorded in `usl-build/6-landing-page-copy.md` Surfaces 4–6. The green and orange screens also show the guest's **tribe** as a colour-swatch tile. Admin password opens `/padi-check/card` (A5 Gate card with the Toyosi number from `PADI_CHECK_CALL_PHONE`) and `/padi-check/list` (printed backup: paid guests, name/code/ticket/tent/tribe only). `/padi-check/guide` is the volunteer how-to (it explains tribes too). `/padi-check/preview` shows all six screens with made-up guests (signed-in, never in production). Every `/padi-check` route is noindex, robots-disallowed, and has no Vercel Analytics (`components/SiteAnalytics.tsx`). Four things to know:
  - **The Google Sheet is too slow to answer the gate** (median 4.8 s, a third of calls past 15 s), so known guests are answered from a copy of the paid list in **Upstash** (`lib/padi-check/gate.ts`) and the arrival is written to the sheet afterwards, retried until it lands. The sheet stays the record. Unknown codes still ask the sheet. The scanner's **Fast/Slow** badge says which is happening.
  - The Apps Script (`docs/mad-settings/apps-script.gs`) gained `checkin`, `stats` and `roster` actions behind the `PADI_CHECK_SECRET` Script Property (= `PADI_CHECK_SCRIPT_SECRET` on the site), and a **Scan log** tab of every non-welcome scan. Since 26/10/2026 it also assigns tribes and has a fourth action, `tribe-mailing` (paid guests with email and tribe, the only action that returns emails), used once by `scripts/send-tribe-emails.ts`.
  - Guests get a **Gate pass** QR (`CODE|Name|Ticket`, only the code is trusted) on `/events/mad-settings/registered` and inline in the confirmation email (`lib/gate-pass/qr.ts`; a signed PNG route `/api/gate-pass/qr` also exists, unused).
  - The camera needs `camera=(self)`: `next.config.mjs` overrides the site-wide `Permissions-Policy` for `/padi-check` only.
- `/contact` — contact form → `/api/contact`
- `/privacy-policy`, `/terms`

Internal API routes (in `app/api/*/route.ts`): `contact`, `proposal`, `assessment-lead` and `award-proposal` (both currently 404 — the DoE surface is hidden), `event-registration` (gated closed — see `/events/base-camp-kids` above), `camp-night-signup` (gated closed since 28/09/2026 — see `/events/camp-night` above), `mad-settings-signup` (open — see `/events/mad-settings` above). Each runs the full defensive stack before Resend: honeypot (`website_confirm`) → per-IP rate limit (Upstash, 5/hr/route) → type-guard validation with enum allowlists → format checks (email regex, phone digits) → length caps → server-side recommendation derivation (proposal + assessment) → escape-html on every user field in the template → send both emails via `lib/mail.ts#sendPairedMail`. Internal notification to `hello@campingnigeria.com`, customer confirmation to the submitter. Falls back to opening a pre-filled `mailto:` if `RESEND_API_KEY` is missing.

Padi Check has its own routes under `app/api/padi-check/` — `login`, `logout`, `check`, `stats`, `roster` (admin) — with signed `padi_session` cookies (`lib/padi-check/session.ts`), a 5-wrong-passwords lockout, and per-session rate limits; plus `app/api/gate-pass/qr` and the daily `app/api/cron/upstash-heartbeat` (Vercel Cron in `vercel.json`, needs `CRON_SECRET`), which keeps the free Upstash database from being archived and emails hello@ if it stops answering.

The gear-rental form does **not** use this stack — it talks straight to the quote tool. The website hosts the form UI + the live-CSV equipment selector + the confirmation page; everything else is upstream. See [context/state.md](context/state.md) for the Phase 2 quote-tool integration details.

## External services

- **Resend** — transactional email. Needs `RESEND_API_KEY` env var. From address: `rentals@campingnigeria.com` / similar per route.
- **Microsoft Forms** — Open Camp seat bookings. URL lives in `lib/constants.ts#BOOKING_FORM_URL`. All "Book Your Spot" CTAs link out — don't re-hardcode it.
- **Outlook Bookings** — DoE consultation calendar. URL lives in `lib/constants.ts#CALENDAR_BOOKING_URL`. **Cannot be iframed** (X-Frame-Options) — always link-out.
- **Vercel** — hosting + analytics (through `components/SiteAnalytics.tsx`, which skips Padi Check and strips names and codes from confirmation-page URLs).
- **Upstash Redis** — form rate limiting and Padi Check's gate memory. Free plan, one database, archived after 30 days unused: the old one was found dead on 23/10/2026. A new one is in `.env.local` and Vercel (all environments); the daily heartbeat keeps it alive. Under a founder's personal account for now — move it to a shared login after the event.

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
npm test          # vitest run (224 tests, mostly pure functions)
npm run test:watch # vitest watch mode
npx tsc --noEmit  # type check
```

Needs `.env.local` with `RESEND_API_KEY` for email delivery, `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` for per-IP rate limiting (rate limit fails open in dev without them, fails *closed* in prod), and `NEXT_PUBLIC_SHEETS_ITEMS_URL` for the gear-rental equipment selector to populate (without it, the form falls back to a message-only flow with an amber notice). All three plus the optional SEO env vars are documented in `.env.example`.

Three Apps Script webhooks record event sign-ups to Google Sheets: `GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL` (Base Camp Kids), `GOOGLE_SHEETS_CAMP_NIGHT_WEBHOOK_URL` (Camp Night) and `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL` (MAD Settings) — each a separate sheet and deployment. All are optional and fail soft: sign-ups still send both emails and the internal one carries every field, so the row can be added by hand. **The MAD Settings one is load-bearing for capacity right now** — the 80-tent cap is counted in the sheet, so with the webhook unset there is no cap at all (the same was true of Camp Night's 60). Deploying any of them is a manual job in the owner's own Google account; see `docs/mad-settings/SETUP.md`.

Padi Check needs seven more, all in `.env.example`: `PADI_CHECK_SCRIPT_SECRET`, `PADI_CHECK_PASSWORD`, `PADI_CHECK_ADMIN_PASSWORD`, `PADI_CHECK_SESSION_SECRET`, `GATE_PASS_SECRET`, `PADI_CHECK_CALL_PHONE` (the Toyosi number, never committed), and `CRON_SECRET` for the heartbeat. Rotate both passwords after every event; rotating `PADI_CHECK_SESSION_SECRET` signs everyone out.

**A note on rate limiting:** *missing* Upstash env vars fail closed in production, but an Upstash host that is set and *unreachable* fails **open** in both environments (`lib/rate-limit.ts` catches the throw). A dead Redis therefore looks exactly like a working one until a bot finds a form — which is what happened in 2026, and why the shared client (`lib/redis.ts`) now times out at 1.5 s and the daily heartbeat exists.
