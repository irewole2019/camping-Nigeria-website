# TODO

Open product / strategy items that haven't been actioned yet. Code-level
TODOs (CSP enforcement flip, hero WebM re-encode, test coverage) live in
[context/state.md](context/state.md#next-tracked-todos) — this file is for
the bigger decisions that need a person, not a coder.

---

## Decide: brand-asset PNGs in `public/`

Four files dropped into the repo root but not wired up anywhere:

```
public/camping-nigeria-background.jpg
public/camping-nigeria-green-logo.png
public/camping-nigeria-white-logo.png
public/camping-nigeria-yellow-logo.png
```

Untracked. Need to decide what they're for before staging. Likely candidates:

- **Logo variants** — replace or augment `public/images/shared/logo.webp`. The white logo would be useful for dark backgrounds (footer, OG cards). Worth converting all three to WebP first (matches the rest of the asset library — see `context/conventions.md`).
- **Background image** — possibly hero or section background. If it's the new homepage hero, it'd swap with whatever's behind `app/page.tsx`'s `<BackgroundVideo>` poster.
- **OG-image fallback** — if Satori/`next/og` ever has trouble with our WebP heroes, a JPG variant could serve as a backup.

**Action:** decide intent, convert PNGs to WebP if keeping, place under `public/images/shared/` (or feature-scoped dir), add to `lib/media.ts` registry, wire into the right component(s). Then `git add` deliberately.

---

## Strategy: switch from quote-based recommendation engine to standard published pricing?

The current proposal flow is a 9-question recommendation engine that picks
one of three programmes × three tiers and routes to a quote conversation.
DoE already has published pricing (₦3M / ₦5M / ₦8M); the school programmes
(Nature & Craft, Leadership Development, On-Campus Camps) don't.

**The proposed pivot:** publish fixed prices for all three school programmes
too. Replace the recommendation engine with a "browse three programmes,
each with three priced tiers, pick one, fill school details" flow.

**Why it might be better:**
- Nigerian school budgeting is line-item — published prices skip the
  approval-loop friction of quote-based.
- The DoE pricing model already proves the pattern works.
- Pre-qualifies leads (sticker shock filters out unfit schools before they
  consume sales time).
- AggregateOffer schema gets price-range rich results in Google search
  (currently only DoE has these).

**Why we haven't done it:**
- It's a strategic call about positioning. Quote-based feels more
  "consultative"; published feels more "catalog." Both are valid stances.
- Requires real number commitment for nine tiers (3 programmes × 3 tiers).
- Pricing decisions should happen with Taiye and Kehinde, not just Irewole.

**Action:** team conversation to decide. If we go for it, the engine
becomes vestigial and the schools surface gets a content rebuild — own
session, plan against [context/state.md](context/state.md) and the existing
DoE pricing model as reference.

---
