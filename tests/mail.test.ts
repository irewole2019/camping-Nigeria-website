import { describe, it, expect, vi, afterEach } from 'vitest'
import { sendPairedMail } from '@/lib/mail'

afterEach(() => vi.unstubAllGlobals())

function captureFetch() {
  const bodies: Array<Record<string, unknown>> = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init: RequestInit) => {
      bodies.push(JSON.parse(String(init.body)))
      return new Response('{}', { status: 200 })
    }),
  )
  return bodies
}

const base = {
  from: 'Camping Nigeria <hello@campingnigeria.com>',
  internal: { to: 'hello@campingnigeria.com', subject: 'Internal', html: '<p>i</p>' },
}

describe('sendPairedMail attachments', () => {
  it('sends the customer email with its inline attachment, and the internal one without', async () => {
    const bodies = captureFetch()
    const gatePass = { filename: 'gate-pass-MAD-B8K2MQ.png', content: 'iVBORw0KGgo=', content_id: 'gate-pass' }
    const r = await sendPairedMail('re_test', {
      ...base,
      customer: { to: 'ada@example.com', subject: 'You are in', html: '<img src="cid:gate-pass">', attachments: [gatePass] },
    })
    expect(r.ok).toBe(true)
    const customer = bodies.find((b) => (b.to as string[])[0] === 'ada@example.com')!
    const internal = bodies.find((b) => (b.to as string[])[0] === 'hello@campingnigeria.com')!
    expect(customer.attachments).toEqual([gatePass])
    expect(internal).not.toHaveProperty('attachments')
  })

  it('leaves attachments out entirely when there are none, as before', async () => {
    const bodies = captureFetch()
    await sendPairedMail('re_test', { ...base, customer: { to: 'ada@example.com', subject: 's', html: 'h' } })
    for (const b of bodies) expect(b).not.toHaveProperty('attachments')
  })
})
