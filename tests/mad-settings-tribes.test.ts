import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  SOCIAL_URL,
  TRIBES,
  getTribe,
  isValidTribeId,
  firstNameOf,
  partnerTribeFromCode,
  peopleForTicket,
  tribeBadgeAlt,
  tribeFromCode,
  tribeFromName,
} from '@/lib/events/mad-settings-tribes'
import { TICKETS } from '@/lib/events/mad-settings'
import {
  EMAIL_SITE_URL,
  buildTribeAnnouncementEmail,
  socialBlockHtml,
  tribeAnnouncementSubject,
  tribeBlockHtml,
} from '@/lib/events/mad-settings-email'
import { generateSignupCode, recordMadSettingsSignup } from '@/lib/events/mad-settings-records'
import { toGateResult, toRoster, type RosterEntry, type SheetClient } from '@/lib/padi-check/sheet'
import { checkCode, createMemoryGateStore, refreshRoster } from '@/lib/padi-check/gate'
import { toScreen } from '@/lib/padi-check/screen'

describe('the four tribes', () => {
  it('are the four on the team’s badges, in order', () => {
    expect(TRIBES.map((t) => t.name)).toEqual(['Gadaff', 'Kutinga', 'Mandi', 'Sellas'])
    expect(new Set(TRIBES.map((t) => t.id)).size).toBe(4)
  })

  it('match the second copy of the names in the Apps Script, in the same order', () => {
    // The script assigns tribes and cannot import from the site, so it keeps
    // its own list. If the two ever differ, the site would drop a tribe the
    // sheet hands out.
    const gs = readFileSync('docs/mad-settings/apps-script.gs', 'utf8')
    const m = gs.match(/const TRIBE_NAMES = \[([^\]]+)\]/)
    expect(m).not.toBeNull()
    const names = m![1].split(',').map((s) => s.trim().replace(/^'|'$/g, ''))
    expect(names).toEqual(TRIBES.map((t) => t.name))
  })

  it('each has its badge file and a readable ink on its colour', () => {
    for (const t of TRIBES) {
      expect(readFileSync(`public${t.image}`).length).toBeGreaterThan(1000)
      expect(t.colour).toMatch(/^#[0-9a-f]{6}$/)
      expect(t.ink).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  it('reads a hand-typed sheet value, and nothing else', () => {
    expect(tribeFromName(' kutinga ')?.id).toBe('kutinga')
    expect(tribeFromName('MANDI')?.id).toBe('mandi')
    expect(tribeFromName('Wolves')).toBeNull()
    expect(tribeFromName(undefined)).toBeNull()
    expect(isValidTribeId('sellas')).toBe(true)
    expect(isValidTribeId('Sellas')).toBe(false)
    expect(getTribe('gadaff').name).toBe('Gadaff')
  })

  it('gives each badge alt text with the right article', () => {
    expect(TRIBES.map(tribeBadgeAlt)).toEqual([
      'Gadaff tribe badge: a ram',
      'Kutinga tribe badge: an eagle',
      'Mandi tribe badge: a bear',
      'Sellas tribe badge: a wolf',
    ])
  })

  it('counts a couple ticket as two people', () => {
    expect(TICKETS.map((t) => peopleForTicket(t.label))).toEqual([1, 1, 2])
    expect(peopleForTicket('couple')).toBe(2)
  })

  it('has a fallback that is stable per code and uses all four', () => {
    const code = 'MAD-B8K2MQ'
    expect(tribeFromCode(code)).toBe(tribeFromCode(code.toLowerCase()))
    const seen = new Set(Array.from({ length: 400 }, () => tribeFromCode(generateSignupCode()).id))
    expect(seen.size).toBe(4)
  })
})

describe('tribe and social email blocks', () => {
  it('show the badge from the live site, and the name as text for clients that hide images', () => {
    const html = tribeBlockHtml(getTribe('kutinga'))
    expect(html).toContain(`src="${EMAIL_SITE_URL}/images/events/mad-settings/tribes/kutinga.png"`)
    expect(html).toContain('alt="Kutinga tribe badge: an eagle"')
    expect(html).toContain('You are in <strong>Kutinga</strong>, one of the four MAD Settings tribes.')
    expect(html).toContain('#da1717')
  })

  it('closes with the social link exactly as the team gave it', () => {
    const html = socialBlockHtml()
    expect(SOCIAL_URL).toBe('https://madsettings.theboostnation.space/')
    expect(html).toContain(`href="${SOCIAL_URL}"`)
    expect(html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).toBe(
      'Visit https://madsettings.theboostnation.space/ to join the social part of the camping experience for the African Dream Camping Experience.',
    )
  })
})

describe('the sheet’s reply carries the tribe', () => {
  const env = process.env.GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL
  afterEach(() => {
    vi.unstubAllGlobals()
    process.env.GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL = env
  })

  const payload = {
    code: 'MAD-B8K2MQ',
    name: 'Ada Obi',
    email: 'ada@example.com',
    phone: '0800',
    instagram: '',
    ticketId: 'couple' as const,
    ticketLabel: 'Sleepover couple (2 in a tent)',
    usesTent: true,
    price: 35000,
    paid: 'Yes' as const,
    partnerName: 'Tunde Bello',
  }

  async function record(reply: unknown) {
    process.env.GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL = 'https://script.example/exec'
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(reply), { status: 200 })))
    return recordMadSettingsSignup(payload)
  }

  it('reads the assigned tribe', async () => {
    const r = await record({ ok: true, code: 'MAD-B8K2MQ', tribe: 'Mandi', tentsRemaining: 40 })
    expect(r.ok).toBe(true)
    expect(r.tribe?.id).toBe('mandi')
  })

  it('leaves it out when the live script predates tribes, so the route falls back and flags it', async () => {
    const r = await record({ ok: true, code: 'MAD-B8K2MQ', tentsRemaining: 40 })
    expect(r).toEqual({ ok: true })
  })

  it('ignores a value that is not a tribe', async () => {
    expect((await record({ ok: true, tribe: '<script>' })).tribe).toBeUndefined()
  })
})

describe('the gate shows the tribe', () => {
  it('keeps a valid tribe from the script, tidied, and drops anything else', () => {
    expect(toGateResult({ ok: true, status: 'welcome', name: 'Ada', tribe: 'sellas' }).tribe).toBe('Sellas')
    expect(toGateResult({ ok: true, status: 'welcome', name: 'Ada', tribe: 'Lions' }).tribe).toBeUndefined()
    const roster = toRoster({ ok: true, roster: [{ name: 'Ada', code: 'mad-ada234', ticketLabel: 'x', usesTent: false, tribe: 'Gadaff' }] })
    expect(roster?.[0].tribe).toBe('Gadaff')
  })

  it('puts the tribe on the welcome and already screens only', () => {
    expect(toScreen({ status: 'welcome', name: 'Ada', tribe: 'Kutinga' }, 'x').tribe?.id).toBe('kutinga')
    expect(toScreen({ status: 'already', name: 'Ada', tribe: 'Kutinga' }, 'x').tribe?.id).toBe('kutinga')
    expect(toScreen({ status: 'not-paid', name: 'Ada', tribe: 'Kutinga' }, 'x').tribe).toBeUndefined()
    expect(toScreen({ status: 'welcome', name: 'Ada' }, 'x').tribe).toBeUndefined()
  })

  it('answers a known guest from memory with their tribe', async () => {
    const roster: RosterEntry[] = [
      { name: 'Ada', code: 'MAD-ADA234', ticketLabel: 'Sleepover single (1 person)', usesTent: true, tribe: 'Mandi' },
    ]
    const sheet: SheetClient = {
      checkIn: async () => ({ status: 'welcome' }),
      stats: async () => ({ checkedIn: 0, total: 1 }),
      roster: async () => roster,
    }
    const store = createMemoryGateStore()
    await refreshRoster(store, sheet, Date.UTC(2026, 9, 31, 18))
    const { result } = await checkCode('MAD-ADA234', { store, sheet, now: Date.UTC(2026, 9, 31, 18) })
    expect(result.status).toBe('welcome')
    expect(result.tribe).toBe('Mandi')
  })
})

describe('couples: two people, two different tribes', () => {
  it('takes the first name by spaces, not by the letter s (bug in the 26/10 tribe email)', () => {
    expect(firstNameOf('Tosin Ade')).toBe('Tosin')
    expect(firstNameOf('  Sola   Bello ')).toBe('Sola')
    expect(firstNameOf('')).toBe('')
    const html = buildTribeAnnouncementEmail({ name: 'Tosin Ade', code: 'MAD-B8K2MQ' }, getTribe('mandi'))
    expect(html).toContain('Meet your tribe, Tosin<')
  })

  it('never gives a partner the guest’s own tribe in the fallback', () => {
    for (let i = 0; i < 200; i++) {
      const code = generateSignupCode()
      const guest = tribeFromCode(code)
      expect(partnerTribeFromCode(code, guest).id).not.toBe(guest.id)
    }
  })

  it('shows both tribes, named, in the email', () => {
    const html = tribeBlockHtml(getTribe('kutinga'), {
      guestName: 'Ada Obi',
      partner: { name: 'Tunde Bello', tribe: getTribe('mandi') },
    })
    expect(html).toContain('Your tribes')
    expect(html).toContain('/tribes/kutinga.png')
    expect(html).toContain('/tribes/mandi.png')
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    expect(text).toContain('You are in Kutinga and Tunde is in Mandi')
  })

  it('says "your partner" when the name is not known (couples from before the form asked)', () => {
    const html = tribeBlockHtml(getTribe('kutinga'), { guestName: 'Ada', partner: { name: '', tribe: getTribe('sellas') } })
    expect(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).toContain('your partner is in Sellas')
    expect(tribeAnnouncementSubject(getTribe('kutinga'), { name: '', tribe: getTribe('sellas') })).toBe(
      'Your MAD Settings tribes: Kutinga and Sellas',
    )
  })

  it('passes a couple through the gate with both tribes, and drops a partner tribe equal to the guest’s', () => {
    const r = toGateResult({ ok: true, status: 'welcome', name: 'Ada', tribe: 'Kutinga', partnerName: 'Tunde', partnerTribe: 'mandi' })
    expect(r).toMatchObject({ tribe: 'Kutinga', partnerName: 'Tunde', partnerTribe: 'Mandi' })
    const same = toGateResult({ ok: true, status: 'welcome', name: 'Ada', tribe: 'Kutinga', partnerTribe: 'Kutinga' })
    expect(same.partnerTribe).toBeUndefined()
    const screen = toScreen({ status: 'welcome', name: 'Ada', tribe: 'Kutinga', partnerName: 'Tunde', partnerTribe: 'Mandi' }, 'x')
    expect(screen.partner?.tribe.id).toBe('mandi')
    expect(screen.partner?.name).toBe('Tunde')
  })

  it('remembers a couple in the gate memory', async () => {
    const roster: RosterEntry[] = [
      { name: 'Ada', code: 'MAD-ADA234', ticketLabel: 'Sleepover couple (2 in a tent)', usesTent: true, tribe: 'Kutinga', partnerName: 'Tunde', partnerTribe: 'Mandi' },
    ]
    const sheet: SheetClient = {
      checkIn: async () => ({ status: 'welcome' }),
      stats: async () => ({ checkedIn: 0, total: 1 }),
      roster: async () => roster,
    }
    const store = createMemoryGateStore()
    await refreshRoster(store, sheet, Date.UTC(2026, 9, 31, 18))
    const { result } = await checkCode('MAD-ADA234', { store, sheet, now: Date.UTC(2026, 9, 31, 18) })
    expect(result).toMatchObject({ status: 'welcome', tribe: 'Kutinga', partnerName: 'Tunde', partnerTribe: 'Mandi' })
  })
})

describe('couples: the sign-up route', () => {
  const saved = { ...process.env }
  afterEach(() => {
    vi.unstubAllGlobals()
    process.env = { ...saved }
  })

  async function signUp(body: Record<string, unknown>, sheetReply: Record<string, unknown>) {
    process.env.GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL = 'https://sheet.invalid/exec'
    process.env.RESEND_API_KEY = 're_test'
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    const sheetPosts: Record<string, unknown>[] = []
    const mails: Record<string, unknown>[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        const json = JSON.parse(String(init?.body))
        if (url.startsWith('https://sheet.invalid')) {
          sheetPosts.push(json)
          return new Response(JSON.stringify({ ...sheetReply, code: json.code }), { status: 200 })
        }
        mails.push(json)
        return new Response(JSON.stringify({ id: 'x' }), { status: 200 })
      }),
    )
    const { POST } = await import('@/app/api/mad-settings-signup/route')
    const res = await POST(
      new Request('http://localhost/api/mad-settings-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.1.1.${Math.floor(Math.random() * 250)}` },
        body: JSON.stringify({
          name: 'Ada Obi',
          email: 'ada@example.com',
          phone: '0803 000 0000',
          instagram: '',
          ageConfirmed: true,
          paidConfirmed: true,
          website_confirm: '',
          ...body,
        }),
      }),
    )
    return { res, json: await res.json(), sheetPosts, mails }
  }

  it('refuses a couple ticket without the partner’s name, before touching the sheet', async () => {
    const { res, json, sheetPosts } = await signUp({ ticketId: 'couple', partnerName: '  ' }, { ok: true })
    expect(res.status).toBe(400)
    expect(json.error).toMatch(/partner/i)
    expect(sheetPosts).toHaveLength(0)
  })

  it('sends the partner to the sheet and both tribes to the guest', async () => {
    const { res, json, sheetPosts, mails } = await signUp(
      { ticketId: 'couple', partnerName: 'Tunde Bello' },
      { ok: true, tribe: 'Kutinga', partnerTribe: 'Mandi' },
    )
    expect(res.status).toBe(200)
    expect(json).toMatchObject({ success: true, tribe: 'kutinga', partnerTribe: 'mandi' })
    expect(sheetPosts[0].partnerName).toBe('Tunde Bello')
    const guestMail = mails.find((m) => (m.to as string[])[0] === 'ada@example.com')!
    expect(String(guestMail.html)).toContain('Tunde</strong> is in <strong>Mandi')
  })

  it('ignores a partner name sent with a single ticket', async () => {
    const { json, sheetPosts } = await signUp({ ticketId: 'single', partnerName: 'Someone' }, { ok: true, tribe: 'Sellas' })
    expect(json.partnerTribe).toBeUndefined()
    expect(sheetPosts[0].partnerName).toBe('')
  })
})
