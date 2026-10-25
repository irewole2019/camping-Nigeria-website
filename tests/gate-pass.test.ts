import { describe, it, expect, beforeAll } from 'vitest'
import {
  NAME_MAX,
  gatePassFields,
  gatePassImageUrl,
  gatePassPng,
  gatePassSvg,
  gatePassText,
  signGatePass,
  verifyGatePass,
} from '@/lib/gate-pass/qr'
import { GET } from '@/app/api/gate-pass/qr/route'

const SECRET = 'test-gate-pass-secret-not-real'
const ADA = gatePassFields('MAD-B8K2MQ', 'Ada Obi', 'Sleepover single (1 person)')

describe('Gate pass text', () => {
  it('is CODE|Name|Ticket', () => {
    expect(gatePassText(ADA)).toBe('MAD-B8K2MQ|Ada Obi|Sleepover single (1 person)')
  })

  it('caps the name at 80 characters', () => {
    const f = gatePassFields('MAD-B8K2MQ', 'A'.repeat(200), 'T')
    expect(f.name).toHaveLength(NAME_MAX)
  })

  it('keeps the three-part shape whatever the name contains', () => {
    const f = gatePassFields('MAD-B8K2MQ', 'Ada | Obi\nX', 'Ticket|Two')
    expect(gatePassText(f)).toBe('MAD-B8K2MQ|Ada Obi X|Ticket Two')
    expect(gatePassText(f).split('|')).toHaveLength(3)
  })
})

describe('Gate pass signature (AC-R007-01)', () => {
  it('verifies its own signature', () => {
    expect(verifyGatePass(ADA, signGatePass(ADA, SECRET), SECRET)).toBe(true)
  })

  it('rejects an altered code, name or ticket', () => {
    const s = signGatePass(ADA, SECRET)
    expect(verifyGatePass({ ...ADA, code: 'MAD-B8K2MR' }, s, SECRET)).toBe(false)
    expect(verifyGatePass({ ...ADA, name: 'Bayo' }, s, SECRET)).toBe(false)
    expect(verifyGatePass({ ...ADA, ticket: 'Attendance only (no tent)' }, s, SECRET)).toBe(false)
  })

  it('rejects unsigned, wrong-secret and missing-secret cases', () => {
    expect(verifyGatePass(ADA, '', SECRET)).toBe(false)
    expect(verifyGatePass(ADA, null, SECRET)).toBe(false)
    expect(verifyGatePass(ADA, signGatePass(ADA, 'another-secret'), SECRET)).toBe(false)
    expect(verifyGatePass(ADA, signGatePass(ADA, SECRET), undefined)).toBe(false)
  })
})

describe('Gate pass images', () => {
  it('draws an SVG at the requested size', async () => {
    const svg = await gatePassSvg(ADA, 240)
    expect(svg).toMatch(/^<svg/)
    expect(svg).toContain('width="240"')
    expect(svg).not.toContain('Ada') // path data only, never the name as markup
  })

  it('draws a 480px PNG', async () => {
    const png = await gatePassPng(ADA)
    expect(png.subarray(1, 4).toString()).toBe('PNG')
    expect(png.readUInt32BE(16)).toBe(480) // IHDR width
    expect(png.readUInt32BE(20)).toBe(480)
  })
})

describe('GET /api/gate-pass/qr', () => {
  beforeAll(() => {
    process.env.GATE_PASS_SECRET = SECRET
  })

  const url = gatePassImageUrl('https://example.test', ADA, SECRET)

  it('serves the PNG for a signed URL, cached for a year', async () => {
    const res = await GET(new Request(url))
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/png')
    expect(res.headers.get('cache-control')).toBe('public, max-age=31536000, immutable')
  })

  it('404s an altered URL', async () => {
    const altered = url.replace('n=Ada+Obi', 'n=Someone+Else')
    expect(altered).not.toBe(url)
    expect((await GET(new Request(altered))).status).toBe(404)
  })

  it('404s an unsigned URL and a badly shaped code', async () => {
    expect((await GET(new Request(url.replace(/&s=[^&]*/, '')))).status).toBe(404)
    const bad = gatePassFields('NOT-A-CODE', 'Ada', 'T')
    expect((await GET(new Request(gatePassImageUrl('https://example.test', bad, SECRET)))).status).toBe(404)
  })
})
