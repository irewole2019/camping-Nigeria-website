# state.md

What is built, what is in progress, what is next. Update every session.

Last updated: 2026-04-22

## Built

### Marketing pages
- **Home** (`/`) — hero video (no poster image), schools/individuals/gear teasers, scroll-to-top on route change
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
- "See the full offer breakdown" → downloads `public/pdf/CampingNigeria_DoE_Offer_download.pdf` (not a page navigation)
- 4-question interactive assessment (`ExpeditionAssessment.tsx`) with capture → questions → submitting → results state machine; q4 drives tier, q2/q3 lightly tailor copy; "Start again" fully resets

### Lead-capture forms (all branded, all via Resend)
| Route | Form file | API route | Recipient |
|---|---|---|---|
| `/contact` | `components/contact/ContactForm.tsx` | `app/api/contact/route.ts` | `hello@campingnigeria.com` |
| `/gear-rental` | `components/gear-rental/QuoteForm.tsx` | `app/api/gear-quote/route.ts` | `hello@campingnigeria.com` |
| `/schools/proposal` | `components/proposal/ProposalForm.tsx` | `app/api/proposal/route.ts` | `hello@campingnigeria.com` |
| `/schools/international-award` | `components/schools/international-award/ExpeditionAssessment.tsx` | `app/api/assessment-lead/route.ts` | `hello@campingnigeria.com` |

All 4 routes send **two** emails (internal + customer confirmation). All user fields are HTML-escaped; all URLs go through `safeUrl()`; all subjects are CRLF-stripped. `isValidPayload` type guard returns 400 on malformed payloads.

### Gear rental form (most recently updated)
- **Phone number required** (WhatsApp preferred label) — validated client + server
- **Date pickers** for rental dates — two native `<input type="date">` side-by-side, `min={today}` on start, end `min` tracks start. Combined into `"14 March 2026 – 17 March 2026"` string before POST so API + email templates stay unchanged.

### Cross-cutting
- Favicons (light + dark variants) = Camping Nigeria logo
- Sitemap includes all DoE pages, 3 program pages, and `/schools/proposal`
- Mobile pass: iOS input zoom fixed (`text-base sm:text-sm`), dynamic viewport units (`dvh`) on heroes, scroll-padding for anchor offsets
- `ScrollToTop` component forces `behavior: 'instant'` on every route change

## In progress

Nothing as of this session.

## Next (candidates — not committed)

- No queued work. Waiting on direction from owner.

Possible future candidates that have come up in conversation but are **not** approved:
- Structured rental-dates / state / delivery fields on the gear-rental form (would require API + email template work)
- Richer gear selector (checklist grid) instead of free-text equipment field
- Per-program "View full programme details" links inside school-proposal result emails
