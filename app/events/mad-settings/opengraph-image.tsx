import { renderHeroOgImage } from '@/lib/og-image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'MAD Settings — Pop-up, bonfire party and camping in Abuja, 31 October 2026'

// Subtitle is tense-neutral and price-free on purpose: these files are parsed
// statically and cannot read EVENT_STATUS, so whatever they say has to stay
// true after the event. See decisions.md, "Retiring an event…".
export default function Image() {
  return renderHeroOgImage({
    hero: '/images/events/mad-settings/card.webp',
    eyebrow: 'MAD Settings · Abuja',
    title: 'Pop-up, bonfire party and camping, Sat 31 October',
    subtitle: 'Three DJs, a bonfire, games and a night under canvas.',
  })
}
