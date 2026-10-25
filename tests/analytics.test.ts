import { describe, it, expect } from 'vitest'
import { isPadiCheckPath, scrubAnalyticsUrl } from '@/lib/analytics'

describe('what Vercel Analytics may record', () => {
  it('records nothing on Padi Check', () => {
    for (const p of ['/padi-check', '/padi-check/card', '/padi-check/list', '/padi-check/preview?state=welcome']) {
      expect(scrubAnalyticsUrl('https://www.campingnigeria.com' + p)).toBeNull()
    }
    expect(isPadiCheckPath('/padi-checkout')).toBe(false)
  })

  it('drops the name and code from sign-up confirmation pages', () => {
    expect(
      scrubAnalyticsUrl('https://www.campingnigeria.com/events/mad-settings/registered?code=MAD-B8K2MQ&name=Ada%20Obi&ticket=single'),
    ).toBe('https://www.campingnigeria.com/events/mad-settings/registered')
    expect(scrubAnalyticsUrl('https://www.campingnigeria.com/events/camp-night/registered/?code=SCN-B8K2MQ&name=Ada')).toBe(
      'https://www.campingnigeria.com/events/camp-night/registered/',
    )
  })

  it('leaves every other page alone, campaign tags included', () => {
    const u = 'https://www.campingnigeria.com/events/mad-settings?utm_source=instagram'
    expect(scrubAnalyticsUrl(u)).toBe(u)
  })
})
