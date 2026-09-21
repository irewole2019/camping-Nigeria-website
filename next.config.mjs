import { readFileSync } from 'node:fs'

/**
 * Mirror of `DOE_ENABLED` in `lib/feature-flags.ts`, read rather than
 * duplicated: this file is `.mjs` and cannot import TypeScript, and two
 * hand-maintained copies of a flag is exactly how a surface comes back half
 * on. Flip the flag in that one file; this follows.
 */
const DOE_ENABLED = /export const DOE_ENABLED:\s*boolean\s*=\s*true\b/.test(
  readFileSync(new URL('./lib/feature-flags.ts', import.meta.url), 'utf8'),
)

/** @type {import('next').NextConfig} */

/**
 * Starter CSP, shipped in `Report-Only` mode.
 *
 * In report-only mode browsers log violations to the DevTools console without
 * blocking anything, so enabling it doesn't risk breaking the page. Once
 * violations are clean against real traffic, rename the header key from
 * `Content-Security-Policy-Report-Only` to `Content-Security-Policy` to
 * enforce.
 *
 * Sources explained:
 * - `'unsafe-inline'` for style-src: Framer Motion injects inline styles at runtime
 * - `'unsafe-inline'` for script-src: Next.js inlines a small hydration bootstrap
 * - `va.vercel-scripts.com` / `vitals.vercel-insights.com`: @vercel/analytics
 * - `data:` images: next/image data URIs; `blob:` for object URLs
 * - `frame-ancestors 'none'` duplicates X-Frame-Options for defence in depth
 */
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "media-src 'self'",
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  // Prevents MIME-type sniffing — browsers must honour the declared Content-Type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Clickjacking protection — no one can iframe this site
  { key: 'X-Frame-Options', value: 'DENY' },
  // Leak only origin (not full URL) on cross-origin navigation
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable powerful APIs we never use
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // HSTS — force HTTPS for 2 years, include subdomains, eligible for preload list
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Report-only CSP — log violations, don't block. Flip key to 'Content-Security-Policy'
  // to enforce once the report-only stream is clean.
  { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },

  /**
   * While the DoE surface is hidden, intercept its URLs before anything
   * renders.
   *
   * A `notFound()` inside the page is not enough on its own. Next reads the
   * `alt` export from each route's `opengraph-image.tsx` statically, from the
   * AST, so it cannot be gated behind an imported flag — the 404 response
   * still carried "Duke of Edinburgh" in its `og:image:alt`. A statically
   * prerendered `notFound()` also answered 200, which reads as a soft 404.
   * Redirecting means the route is never rendered, so neither can happen.
   *
   * `permanent: false` issues a 307. That is deliberate for a temporary
   * hide: a 308 or a 404 tells Google the URL is gone and it gets dropped,
   * so restoring would mean re-earning the indexing. A 307 parks it.
   *
   * `:path*` matches zero or more segments, so this covers the base page,
   * the proposal page, and all four OG and Twitter card routes.
   */
  async redirects() {
    if (DOE_ENABLED) return []
    return [
      {
        source: '/schools/international-award/:path*',
        destination: '/schools',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
