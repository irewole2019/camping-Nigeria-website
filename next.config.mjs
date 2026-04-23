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
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "media-src 'self'",
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
}

export default nextConfig
