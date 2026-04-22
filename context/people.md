# people.md

Who to involve for which decisions. Update when roles shift.

> **Note:** Claude scaffolded this file. Roles marked `TBD` need to be filled in — Claude only knows what's been stated explicitly or is visible in git history.

---

## Leadership team

The site is built and run by the three founders:

| Person | Role | Contact |
|---|---|---|
| **Irewole** | CEO | [@irewole2019](https://github.com/irewole2019) · `iakande@live.com` |
| **Taiye** | President | TBD |
| **Kehinde** | Managing Director | TBD |

When a decision is listed as "Leadership team" below, raise it in whatever channel the three of them use to sync — don't default to just the commit author.

## Primary decision-maker (code + architecture)

- **Irewole (CEO)** — the git owner and the person pushing code
- **Involve for:** architecture changes, stack decisions, anything affecting repo structure, CI/CD, Vercel, dependencies, code review

## Strategic / business decisions

- **Leadership team** (Irewole + Taiye + Kehinde)
- **Involve for:** pricing (DoE tiers, gear rental rates), scope of new features, brand direction, new programme launches, partnerships, go/no-go on integrations that cost money

## Content / marketing

- **Owner:** TBD (likely Leadership team)
- **Involve for:** all user-facing copy changes, tone shifts, program feature descriptions

## Design / brand

- **Owner:** TBD (likely Leadership team)
- **Involve for:** changes to brand tokens, hero imagery, photo selection, iconography (we use `lucide-react` but swaps should be deliberate)

## Operations / bookings

- **Generic inbox:** `hello@campingnigeria.com`
- **Phone / WhatsApp:** +234 704 053 8528
- **Owner:** TBD — one of the three founders monitors inbound enquiries; confirm who before assuming SLA
- **Involve for:** lead-routing changes, SLA commitments ("we reply within 24h"), Microsoft Forms workflow, Outlook Bookings calendar setup

## Duke of Edinburgh programme

- **Owner:** Leadership team (pricing authority sits here)
- **Involve for:** pricing changes to Base Camp / Trail Ready / Summit Partner tiers, the additional-students formula, updates to `public/pdf/CampingNigeria_DoE_Offer_download.pdf`, assessment recommendation logic changes

## School programmes (Nature Craft, Leadership Development, On-Campus Camps)

- **Owner:** Leadership team
- **Involve for:** changes to programme pages, pricing, class/age ranges, curriculum descriptions

## Legal / compliance

- **Owner:** Leadership team
- **Involve for:** any change to `/privacy-policy`, `/terms`, or to what personal data forms collect (recent additions: phone on gear-rental)

## Infra / deploys

- **Hosted on:** Vercel (connected to the GitHub repo)
- **Owner:** Irewole (CEO) for anything touching the repo / Vercel / env vars. Resend, Microsoft 365 and domain access may be held by different founders — confirm per-service.
- **Involve for:** env var changes (`RESEND_API_KEY`), domain/DNS changes, rate limiting, billing

## External services — who holds the keys

| Service | Purpose | Key holder |
|---|---|---|
| Resend | Transactional email | TBD |
| Microsoft 365 / Outlook Bookings | DoE consultation calendar | TBD |
| Microsoft Forms | Individual trip bookings (`forms.office.com/r/bgsZ4shNxD`) | TBD |
| Vercel | Hosting + analytics | TBD |
| Domain registrar | `campingnigeria.com` | TBD |
| Instagram `@camping_ng` | Social | TBD |
| Facebook `campinggearsng` | Social | TBD |

---

## How to fill this in

Replace each `TBD` with a name + preferred contact method (email, Slack handle, phone). If a role is held by one specific founder, name them (e.g. "Taiye") instead of writing "Leadership team". If a service key-holder isn't known, write `unknown — ask the founders` instead of leaving it blank.
