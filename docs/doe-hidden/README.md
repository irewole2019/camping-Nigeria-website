# Duke of Edinburgh assets, parked

The DoE / International Award surface is temporarily hidden. The switch is
`DOE_ENABLED` in `lib/feature-flags.ts`, which gates the pages, their OG cards,
both API routes, the `/schools` callout, the homepage links, the sitemap
entries and the SEO keyword.

This directory holds the one asset a flag cannot reach. Anything under
`public/` is served whether or not the site links to it, so the offer sheet was
moved here to stop it being downloadable at
`/pdf/CampingNigeria_DoE_Offer_download.pdf`.

**To bring the surface back:** flip `DOE_ENABLED` to `true` and move the PDF
back to `public/pdf/`.

Note the PDF also still quotes the retired Base Camp / Trail Ready / Summit
Partner tiers (NGN 3M / 5M / 8M), which no longer match anything the site
sells. Regenerate it before republishing rather than restoring it as-is.
