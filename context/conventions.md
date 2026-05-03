# conventions.md

Project-specific naming and patterns. If something is standard Next.js or React, it's not in here.

## File layout

- **Pages**: `app/<route>/page.tsx` (App Router)
- **API routes**: `app/api/<route>/route.ts`, default `POST` handler exported
- **Components**: `components/<feature>/<PascalComponent>.tsx` — feature-scoped folders (`schools/`, `gear-rental/`, `contact/`, `proposal/`, `home/`, `shared/`, `ui/`, `layout/`)
- **Shared helpers**: `lib/` — `html.ts`, `constants.ts`, `media.ts`, `animation.ts`, `proposal-engine.ts`, `expedition-recommendation.ts`, `program-data.ts`, `mail.ts`, `rate-limit.ts`, `seo.ts`, `structured-data.ts`, `og-image.tsx`, `quote-config.ts`, `utils.ts`
- **Assets**:
  - `public/images/<feature>/...` — **WebP only.** JPGs were cleaned up; don't reintroduce them. Export WebP from the design tool directly.
  - `public/pdf/...`
  - Video referenced via `MEDIA_VIDEO` from `lib/media.ts` (not raw paths)
  - Images registered in `lib/media.ts` with `{ src, alt }` tuples — components import the registry, never raw paths
- **Fonts**: loaded in `app/layout.tsx`, exposed via CSS vars `--font-helvetica-now` / `--font-agrandir`

## Components

- Client components start with `'use client'`. Keep them as narrow as possible — most pages are Server Components that render Client Components for interactive bits.
- Every interactive component that animates uses Framer Motion `motion.*` primitives — don't mix with CSS transitions for the same property.
- Shared primitives live in `components/ui/` (currently `Section`). Shared page scaffolding in `components/shared/` (`PageHero`, etc).

## Styling

- **Tailwind v4** with `@theme inline` in `app/globals.css` — do **not** create `tailwind.config.js`. If you need a new design token, add it to both `:root` and `@theme inline` in `globals.css`.
- Brand classes: `bg-brand-dark`, `text-brand-dark`, `bg-brand-accent`, `text-brand-accent-readable` (use for gold text on cream — the regular gold fails contrast), `bg-brand-light`, `bg-brand-dark-tint`, `bg-brand-accent-tint`.
- Fonts: `font-sans` (Helvetica Now) for body, `font-serif` (Agrandir) for headlines.
- **No emojis in UI** — use `lucide-react` icons. (Exception: none. This has come up before.)

## Forms

Every form follows the same pattern (see `QuoteForm.tsx` as the canonical example):

```tsx
const [submitted, setSubmitted] = useState(false)   // show success card
const [sending, setSending] = useState(false)       // disable submit
const [submitError, setSubmitError] = useState<string | null>(null)  // amber banner
const [errors, setErrors] = useState<FormErrors>({})  // per-field errors
```

- Inputs use a shared `inputBase` string: `w-full rounded-lg border border-brand-dark/15 bg-white px-4 py-3 font-sans text-base sm:text-sm ...` — `text-base` on mobile is load-bearing (iOS zoom fix).
- Labels use `labelBase = 'block font-sans text-sm font-semibold text-brand-dark mb-1.5'`.
- Required asterisks: `<span className="text-brand-accent">*</span>`.
- Optional hints: `<span className="text-brand-dark/40 font-normal">(Optional)</span>`.
- Error text: `text-sm text-red-600`, `role="alert"`, `aria-describedby` wired on the input.
- On submit failure, set `submitError` → renders an amber banner (`bg-amber-50 border-amber-200 text-amber-900`). **Do not** set `submitted=true` on failure — that was the old silent-failure bug.
- Success screen: full-width dark card with gold "Submit another" button that calls a `handleReset` clearing all state.
- Validation runs in a pure `validate(data)` function returning a `FormErrors` object. HTML-level `required` + JS validation both exist — both needed because browsers' `required` UX is spotty.

## API routes

Every route in `app/api/*/route.ts` follows this skeleton (in order):

1. Parse JSON, return 400 on non-object.
2. **Honeypot check** — `isHoneypotTripped(raw)` from `lib/html.ts`. If true, return `{ success: true }` with 200 (fake success — see decisions.md).
3. **Rate limit** — `await checkRateLimit(request, '<routeKey>')` from `lib/rate-limit.ts`. If `!allowed`, return 429 with a user-visible error message.
4. `isValidPayload`-style type guard: check every field's `typeof`, apply enum allowlists, return 400 on mismatch.
5. Trim-check required fields, return 400 on empties.
6. Field-specific validation — email regex, phone digit count (≥7), length caps via `withinLengthCaps` from `lib/html.ts`.
7. **Derive recommendation server-side** if applicable (proposal → `scoreAnswers`; assessment → `getRecommendedTier`). Never trust client-supplied derived results.
8. Read `process.env.RESEND_API_KEY`; if missing, return `{ success: false, fallback: 'mailto' }` with 422.
9. **Send via `sendPairedMail`** from `lib/mail.ts` — internal + customer in parallel, success = internal OK.
10. On success → `{ success: true }`. On failure → 422 with mailto fallback.
11. `catch` → 500 with `error: 'Internal error'`.

The defensive stack (honeypot, rate limit, type guard, format check, length cap) is cheap; run them before touching Resend so we never pay for an email the abuser was going to spam.

## Forms — anti-abuse wiring

Every form includes `<Honeypot />` from `components/ui/Honeypot.tsx`. Two usage patterns:

- **Uncontrolled forms** (ContactForm, QuoteForm): include `<Honeypot />` inside the `<form>` — the field value flows through `FormData`. In the POST body: `website_confirm: String(data.website_confirm || '')`.
- **Controlled forms** (ProposalForm, ExpeditionAssessment): create a `const honeypotRef = useRef<HTMLInputElement>(null)`, pass to `<Honeypot ref={honeypotRef} />`, read `honeypotRef.current?.value || ''` at submit time.

The component positions itself off-screen (`absolute left-[-9999px]`) rather than `display: none` because some bots skip hidden fields. `tabIndex={-1}` + `autoComplete="off"` keep keyboard users and password managers out.

## Server-side recommendation derivation

Form routes that produce a "recommendation" (proposal → program+tier; assessment → tier) **must derive it server-side** from the validated answers, not trust a client-supplied one. Client can still compute its own recommendation for instant UX. The shared deterministic functions are:

- `lib/proposal-engine.ts#scoreAnswers(answers)` — returns `{ program, tier, scores }`
- `lib/expedition-recommendation.ts#getRecommendedTier(q2, q3, q4)` — returns a `TierResult`

Both are pure; both accept validated inputs; both are imported by the client (for preview) and the server (for email). If you add a new form with a computed recommendation, create a shared lib module, not inline logic.

## Email templates

- Two templates per route: `buildInternalEmail(data)` and `buildCustomerEmail(data)`.
- Inline-styled HTML with `<table role="presentation">` layouts (email client compatibility).
- Header: forest green band with gold eyebrow.
- Footer: forest green band, `campingnigeria.com` link in gold, social links muted, `© {year} Camping Nigeria`.
- Middle: white card body with a gold-outlined "summary" table of what was submitted.
- Internal email has a gold "Reply to {firstName}" mailto CTA at the bottom.
- Customer email has a "What Happens Next" numbered list and ends with `hello@campingnigeria.com` + `+234 704 053 8528` contact line.
- Dates in footer: `toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })`.

## Animation

- Framer Motion with `premiumEase` from `lib/animation.ts` for hero reveals and section enters.
- Signature masked H2 reveal: wrap the heading in `overflow-hidden`, animate child `y: '100%' → '0%'` over ~0.9s.
- Section entrance: `initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}`.
- Staggered children use `staggerChildren: 0.1` on a parent variant.
- `AnimatePresence mode="wait"` for state-machine transitions (see `ExpeditionAssessment.tsx`).

## Heroes

- Always go through `components/shared/PageHero.tsx`.
- Height prop is typed: `'min-h-dvh' | 'h-[70dvh]' | 'h-[60dvh]'` — add a new variant to the type if you need another size.
- Hero copy uses the eyebrow pattern: `tracking-widest uppercase text-xs` with horizontal divider lines on either side of a short label.

## Icons

- `lucide-react` only. Import named: `import { Download } from 'lucide-react'`.
- Inline at `w-4 h-4` for body text, `w-5 h-5` for CTAs. Mark decorative icons `aria-hidden="true"`.

## Comments and copy

- Comments explain **why**, not **what**. If the only thing a comment adds is a restatement of the code, delete it.
- One-liner comments are fine; avoid multi-paragraph JSDoc unless the helper is exported for external consumers.
- User-facing copy uses en-dash `–` for ranges, em-dash `—` for asides. Don't use `-` for either.
- **Dates render as `DD/MM/YYYY`** (Nigerian/British numeric — e.g. `14/03/2026`). All server-rendered dates go through `formatDate` / `formatDateTime` helpers in the route files. Native `<input type="date">` rendering follows the browser's own locale and we can't override it; everywhere else in our UI/email templates, use the helper.
- Naira is written `₦3,000,000` (no space).

## Routing

- `components/ScrollToTop.tsx` is mounted once in `app/layout.tsx` — don't add per-page scroll logic.
- `Link` from `next/link` for internal nav. External links + downloads use plain `<a>` with `href` and (for downloads) the `download` attribute.

## SEO

Every page adds **two things**:

```tsx
import { buildPageMetadata } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'Page Title | Camping Nigeria',
  description: 'One sentence that reads like a search snippet.',
  path: '/path-from-root',
})

export default function Page() {
  return (
    <main id="main-content">
      <JsonLd
        id="page-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          // ...ancestors...
          { name: 'This Page', path: '/path-from-root' },
        ])}
      />
      {/* ... */}
    </main>
  )
}
```

- `buildPageMetadata` fills canonical, keywords, Open Graph, Twitter automatically. Only provide `title`, `description`, `path`; override `keywords`/`type` when needed.
- Every page gets a `BreadcrumbList`. Pages with rich content (FAQ, programmes, services) additionally get `FaqJsonLd` / `ServiceJsonLd`.
- Organization + WebSite JSON-LD are emitted once in `app/layout.tsx` — don't re-emit per page.
- Address, phone, socials flow from `CONTACT` in `lib/constants.ts`. **Never hardcode the company address** — use `CONTACT.address.formatted` (or the structured fields for schema).
- Sitemap (`app/sitemap.ts`): add new pages to `ROUTES` with `changeFrequency`, `priority`, and an `image` URL if there's a primary hero/feature image.

### OG + Twitter cards (per-route)

Every major page has a pair of route-segment files: `app/<route>/opengraph-image.tsx` and `app/<route>/twitter-image.tsx`. Both call the shared renderer at `lib/og-image.tsx#renderHeroOgImage`, which composites the page's hero photo behind a forest-green gradient overlay with the gold-pill eyebrow + headline + subtitle.

Template for a new route's OG (or Twitter) file — copy verbatim, change only the 4 config strings + the renderer args:

```tsx
import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Camping Nigeria <Page> — <share headline>'

export default function Image() {
  return renderHeroOgImage({
    hero: '/images/<feature>/hero.webp',
    eyebrow: '<Short Label>',
    title: '<Share-optimised headline>',
    subtitle: '<One-line supporting copy>',
  })
}
```

**Critical constraint:** `runtime`, `size`, `contentType`, and `alt` must be **inline literals** — Next parses route-segment config from the source AST and rejects imported constants or re-exports. The renderer function is the only shareable part. See decisions.md for the full explanation.

**Pairing:** the OG and Twitter files for a given route are usually byte-identical (same hero, same copy, same dimensions). Both are needed because Next does not auto-mirror — Twitter cards default to the OG image only as a fallback when twitter-image is absent at the route level, but for predictable rendering across crawlers we explicitly emit both.

## Env and secrets

- `RESEND_API_KEY` — transactional email. Fail open to `mailto:` fallback if missing; never throw.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — per-IP rate limiting. Fail *closed* in production (429) when missing; fail open in dev. Production deploys MUST have both set.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — optional. When set, adds `<meta name="google-site-verification">` to the root layout.
- `NEXT_PUBLIC_SEO_LAST_MODIFIED` — optional ISO date used for sitemap `<lastmod>` timestamps. Defaults to a baked-in fallback if missing.
- Never commit `.env.local`. `.env.example` documents the full list.

## Dev commands

```bash
npm run dev        # next dev on :3000 / :3001
npm run build      # production build — run before merging
npm run lint       # eslint flat config in eslint.config.mjs
npm test           # vitest run (pure-function tests)
npm run test:watch # vitest watch mode
npx tsc --noEmit   # type check
```

`npm audit` is clean as of Next 16.2.4.
