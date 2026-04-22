# conventions.md

Project-specific naming and patterns. If something is standard Next.js or React, it's not in here.

## File layout

- **Pages**: `app/<route>/page.tsx` (App Router)
- **API routes**: `app/api/<route>/route.ts`, default `POST` handler exported
- **Components**: `components/<feature>/<PascalComponent>.tsx` — feature-scoped folders (`schools/`, `gear-rental/`, `contact/`, `proposal/`, `home/`, `shared/`, `ui/`, `layout/`)
- **Shared helpers**: `lib/` — `html.ts`, `constants.ts`, `media.ts`, `animation.ts`, `proposal-engine.ts`, `program-data.ts`, `utils.ts`
- **Assets**:
  - `public/images/<feature>/...`
  - `public/pdf/...`
  - Video referenced via `MEDIA_VIDEO` from `lib/media.ts` (not raw paths)
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

Every route in `app/api/*/route.ts` follows this skeleton:

1. Parse JSON, return 400 on non-object.
2. `isValidPayload`-style type guard: check every field's `typeof`, return 400 on mismatch.
3. Trim-check required fields, return 400 on empties.
4. Field-specific validation (e.g. phone digit count) — 400 on failure.
5. Read `process.env.RESEND_API_KEY`; if missing, return `{ success: false, fallback: 'mailto' }` with 422 so the client opens a `mailto:` draft.
6. Build branded HTML with `escapeHtml()` on every user field.
7. `safeHeader(subject)` to strip CRLF.
8. `Promise.all` two `sendResendEmail` calls — internal + customer.
9. If both OK → `{ success: true }`. If only internal OK → still `{ success: true }` (customer confirmation is nice-to-have). Otherwise 422 with mailto fallback.
10. `catch` → 500 with `error: 'Internal error'`.

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
- User-facing copy uses en-dash `–` for ranges ("14 March 2026 – 17 March 2026"), em-dash `—` for asides. Don't use `-` for either.
- Naira is written `₦3,000,000` (no space).

## Routing

- `components/ScrollToTop.tsx` is mounted once in `app/layout.tsx` — don't add per-page scroll logic.
- `Link` from `next/link` for internal nav. External links + downloads use plain `<a>` with `href` and (for downloads) the `download` attribute.

## Env and secrets

- `RESEND_API_KEY` is the only runtime secret. Fail open to `mailto:` fallback if missing — never throw.
- Never commit `.env.local`. `.env.example` documents the variables.
