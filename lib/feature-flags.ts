/**
 * Site-wide feature flags.
 *
 * Flags here hide a whole surface without deleting it, so it can be brought
 * back by flipping one line rather than reconstructing work from git history.
 */

/**
 * The Duke of Edinburgh / International Award for Young People surface.
 *
 * **Currently hidden. This is temporary.** Set to `true` to bring all of it
 * back in one edit. Nothing was deleted.
 *
 * What this flag controls:
 *
 * | Surface | When `false` |
 * |---|---|
 * | `/schools/international-award` | 404 |
 * | `/schools/international-award/proposal` | 404 |
 * | Their OG and Twitter card routes (4) | 404 |
 * | `POST /api/assessment-lead` | 404, so nothing reaches Resend |
 * | `POST /api/award-proposal` | 404, so nothing reaches Resend |
 * | `DoECallout` section on `/schools` | not rendered |
 * | Homepage "Duke of Edinburgh Support" link and the DoE clause | not rendered |
 * | Both sitemap entries | omitted |
 * | The `Duke of Edinburgh Nigeria` SEO keyword | omitted from every page |
 *
 * Deliberately an explicit boolean rather than a date or env check, for the
 * same reason `EVENT_STATUS` in `lib/events/base-camp-kids.ts` is explicit:
 * these pages are statically rendered, so anything evaluated at build time
 * bakes in and goes stale between deploys. One line, predictable.
 *
 * The `: boolean` annotation is load-bearing. Without it TypeScript narrows
 * the const to the literal `false`, and every `if (DOE_ENABLED)` downstream
 * becomes a compile error about an impossible condition the moment the flag
 * is flipped back.
 *
 * Two things this flag does NOT reach, because they are files rather than
 * rendered output:
 *   - `public/images/schools/doe-award.webp` stays served at its URL. It is a
 *     photograph of students and is no longer referenced by anything.
 *   - The offer PDF was moved out of `public/` to `docs/` so it stops being
 *     downloadable. Move it back alongside flipping this flag.
 */
export const DOE_ENABLED: boolean = false
