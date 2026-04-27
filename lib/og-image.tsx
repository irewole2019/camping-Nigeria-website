import { ImageResponse } from 'next/og'
import { SITE_URL } from '@/lib/seo'

/**
 * Note: Next.js parses `runtime`, `size`, `contentType`, and `alt` from
 * opengraph-image.tsx / twitter-image.tsx files **statically** — they must
 * be inline string/object literals in each route file, not imports. Only
 * the renderer function below is shared.
 */

export interface HeroOgInput {
  /** Path under public/, e.g. '/images/schools/hero.webp'. Resolved against SITE_URL. */
  hero: string
  /** Short uppercase label shown in the gold-bordered pill. */
  eyebrow: string
  /** Main share-optimized headline. */
  title: string
  /** Optional supporting line under the headline. */
  subtitle?: string
}

/**
 * Renders a 1200×630 OG card with the page's hero photo as full-bleed
 * background, a forest-green gradient overlay for legibility, and the
 * brand-pill + headline + subhead in the same visual language as the rest
 * of the site.
 *
 * Note: Satori (used by ImageResponse) supports JPEG, PNG, and WebP. Hero
 * images are loaded by absolute URL — Edge runtime fetches them on render.
 */
export function renderHeroOgImage({
  hero,
  eyebrow,
  title,
  subtitle,
}: HeroOgInput): ImageResponse {
  const heroUrl = hero.startsWith('http') ? hero : `${SITE_URL}${hero}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'Arial, sans-serif',
          color: 'white',
        }}
      >
        {/* Hero photograph as full-bleed background. next/og uses Satori,
            which renders <img> via fetch — next/image is not supported here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroUrl}
          alt=""
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Forest-green gradient overlay — bottom heavier so headline reads */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            background:
              'linear-gradient(180deg, rgba(14,62,46,0.55) 0%, rgba(14,62,46,0.78) 60%, rgba(8,30,22,0.92) 100%)',
          }}
        />
        {/* Content layer */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(230, 179, 37, 0.7)',
              borderRadius: 999,
              padding: '10px 22px',
              fontSize: 22,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: '#e6b325',
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(8,30,22,0.45)',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              maxWidth: 1000,
            }}
          >
            <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, lineHeight: 1.04 }}>
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: 28,
                  color: 'rgba(255,255,255,0.92)',
                  lineHeight: 1.3,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
