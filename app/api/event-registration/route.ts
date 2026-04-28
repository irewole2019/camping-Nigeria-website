import { NextResponse } from 'next/server'
import { escapeHtml, isHoneypotTripped, MAX_LENGTHS, withinLengthCaps } from '@/lib/html'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendPairedMail } from '@/lib/mail'
import { generateReference, recordRegistration } from '@/lib/event-records'
import {
  EVENT_TITLE,
  EVENT_DATE_LABEL,
  EVENT_TIME_LABEL,
  VENUE_LABEL,
  MIN_AGE,
  MAX_AGE,
  MAX_CHILDREN_PER_REGISTRATION,
  computeRegistrationTotal,
  formatNaira,
} from '@/lib/events/base-camp-kids'

const RECIPIENT = 'hello@campingnigeria.com'
const SITE_URL = 'https://campingnigeria.com'
const FROM = 'Camping Nigeria <hello@campingnigeria.com>'

interface ChildPayload {
  fullName: string
  age: number
  allergies: string
  photoConsent: boolean
}

interface RegistrationPayload {
  parent: { fullName: string; email: string; phone: string; city: string }
  emergencyContact: { name: string; phone: string }
  children: ChildPayload[]
  notes: string
}

function digitsOf(s: string): number {
  return (s.match(/\d/g) || []).length
}

function isValidChild(c: unknown): c is ChildPayload {
  if (!c || typeof c !== 'object') return false
  const o = c as Record<string, unknown>
  return (
    typeof o.fullName === 'string' &&
    typeof o.age === 'number' &&
    Number.isInteger(o.age) &&
    typeof o.allergies === 'string' &&
    typeof o.photoConsent === 'boolean'
  )
}

function isValidPayload(raw: unknown): raw is RegistrationPayload {
  if (!raw || typeof raw !== 'object') return false
  const o = raw as Record<string, unknown>

  const parent = o.parent as Record<string, unknown> | undefined
  if (
    !parent ||
    typeof parent.fullName !== 'string' ||
    typeof parent.email !== 'string' ||
    typeof parent.phone !== 'string' ||
    typeof parent.city !== 'string'
  ) {
    return false
  }

  const ec = o.emergencyContact as Record<string, unknown> | undefined
  if (!ec || typeof ec.name !== 'string' || typeof ec.phone !== 'string') return false

  if (!Array.isArray(o.children) || o.children.length === 0) return false
  if (o.children.length > MAX_CHILDREN_PER_REGISTRATION) return false
  if (!o.children.every(isValidChild)) return false

  if (typeof o.notes !== 'string') return false

  return true
}

function buildChildRows(children: ChildPayload[]): string {
  return children
    .map((c, i) => {
      const name = escapeHtml(c.fullName)
      const age = escapeHtml(String(c.age))
      const allergies = c.allergies.trim() ? escapeHtml(c.allergies) : '<span style="color:#888;">None reported</span>'
      const consent = c.photoConsent
        ? '<span style="color:#0e3e2e;font-weight:600;">Yes</span>'
        : '<span style="color:#b8880a;font-weight:600;">No (blue wristband)</span>'
      return `<tr>
        <td style="padding:12px 14px;border-bottom:1px solid #eee;font-size:14px;color:#3d3d3d;">
          <strong>Child ${i + 1}: ${name}</strong><br>
          <span style="color:#666;font-size:13px;">Age ${age} · Photos: ${consent}</span><br>
          <span style="color:#666;font-size:13px;">Allergies / notes: ${allergies}</span>
        </td>
      </tr>`
    })
    .join('')
}

function buildInternalEmail(data: RegistrationPayload, total: number, reference: string): string {
  const fullName = escapeHtml(data.parent.fullName)
  const firstName = escapeHtml(data.parent.fullName.split(' ')[0])
  const email = escapeHtml(data.parent.email)
  const phone = escapeHtml(data.parent.phone)
  const city = escapeHtml(data.parent.city)
  const ecName = escapeHtml(data.emergencyContact.name)
  const ecPhone = escapeHtml(data.emergencyContact.phone)
  const notes = data.notes.trim()
    ? escapeHtml(data.notes)
    : '<span style="color:#888;">—</span>'
  const totalLabel = escapeHtml(formatNaira(total))
  const refLabel = escapeHtml(reference)
  const replySubject = encodeURIComponent(`Re: ${EVENT_TITLE} registration ${reference}`)

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">New Base Camp Kids Registration</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">${escapeHtml(EVENT_DATE_LABEL)}</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Total Due · ${refLabel}</p>
        <h2 style="margin:4px 0 0;font-size:24px;font-weight:700;color:#ffffff;">${totalLabel}</h2>
        <p style="margin:4px 0 0;font-size:12px;color:#ffffff99;">${data.children.length} child(ren) · invoice to send</p>
      </td></tr>
    </table>

    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Parent / Guardian</p>
    <div style="background:#fafaf8;border-radius:8px;padding:16px 20px;margin-bottom:18px;font-size:14px;color:#3d3d3d;line-height:1.6;">
      <strong>${fullName}</strong><br>
      <a href="mailto:${email}" style="color:#0e3e2e;font-weight:600;text-decoration:none;">${email}</a><br>
      ${phone}<br>
      ${city}
    </div>

    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Emergency Contact</p>
    <div style="background:#fafaf8;border-radius:8px;padding:16px 20px;margin-bottom:18px;font-size:14px;color:#3d3d3d;line-height:1.6;">
      <strong>${ecName}</strong><br>${ecPhone}
    </div>

    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Children</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;border-radius:8px;margin-bottom:18px;">
      ${buildChildRows(data.children)}
    </table>

    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Notes</p>
    <div style="background:#fafaf8;border-radius:8px;padding:16px 20px;margin-bottom:24px;font-size:14px;color:#3d3d3d;line-height:1.6;white-space:pre-wrap;">${notes}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:4px 0;">
        <a href="mailto:${email}?subject=${replySubject}" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;">
          Reply to ${firstName}
        </a>
      </td></tr>
    </table>

  </td></tr>

  <tr><td style="background-color:#0e3e2e;padding:16px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0;font-size:11px;color:#ffffff50;">
      Submitted via campingnigeria.com · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function buildCustomerEmail(data: RegistrationPayload, total: number, reference: string): string {
  const firstName = escapeHtml(data.parent.fullName.split(' ')[0])
  const childNames = data.children
    .map((c) => `${escapeHtml(c.fullName)} (age ${escapeHtml(String(c.age))})`)
    .join(', ')
  const totalLabel = escapeHtml(formatNaira(total))
  const refLabel = escapeHtml(reference)

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background-color:#0e3e2e;padding:32px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">${escapeHtml(EVENT_TITLE)}</h1>
    <p style="margin:6px 0 0;font-size:13px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">${escapeHtml(EVENT_DATE_LABEL)} · ${escapeHtml(EVENT_TIME_LABEL)}</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:40px;">

    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0e3e2e;">Hi ${firstName},</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#555555;">
      We've received your registration for Base Camp Kids. Your seat${data.children.length > 1 ? 's are' : ' is'} on hold while we send your invoice.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Your Reference · ${refLabel}</p>
        <h2 style="margin:4px 0 0;font-size:18px;font-weight:700;color:#ffffff;">${data.children.length} child${data.children.length === 1 ? '' : 'ren'}</h2>
      </td></tr>
      <tr><td style="padding:18px 20px;">
        <p style="margin:0 0 12px;font-size:14px;color:#3d3d3d;line-height:1.6;">${childNames}</p>
        <p style="margin:0;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Total due</p>
        <p style="margin:2px 0 0;font-size:22px;font-weight:700;color:#0e3e2e;">${totalLabel}</p>
      </td></tr>
    </table>

    <p style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#b8880a;font-weight:600;">What happens next</p>
    <ol style="margin:0 0 24px;padding-left:20px;color:#3d3d3d;font-size:14px;line-height:1.7;">
      <li style="margin-bottom:8px;"><strong style="color:#0e3e2e;">Invoice within 24 hours.</strong> We'll send payment instructions to this email.</li>
      <li style="margin-bottom:8px;"><strong style="color:#0e3e2e;">Your seat locks in once payment clears.</strong> We'll confirm by email.</li>
      <li><strong style="color:#0e3e2e;">A week before the event</strong> we send the venue address, packing list, drop-off plan, and your child's house assignment.</li>
    </ol>

    <p style="margin:0 0 24px;font-size:13px;color:#888;line-height:1.6;">
      <strong style="color:#3d3d3d;">Venue:</strong> ${escapeHtml(VENUE_LABEL)}.
    </p>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
      Need to change something or ask a question? Reply to this email, or message us on WhatsApp at
      <a href="https://wa.me/2347040538528" style="color:#0e3e2e;font-weight:600;text-decoration:none;">+234 704 053 8528</a>.
    </p>

  </td></tr>

  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0 0 8px;font-size:13px;color:#ffffff99;">
      <a href="${SITE_URL}" style="color:#e6b325;text-decoration:none;font-weight:600;">campingnigeria.com</a>
    </p>
    <p style="margin:12px 0 0;font-size:11px;color:#ffffff40;">
      &copy; ${new Date().getFullYear()} Camping Nigeria. All rights reserved.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => null)
    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    if (isHoneypotTripped(raw)) {
      return NextResponse.json({ success: true })
    }

    const rate = await checkRateLimit(request, 'event-registration')
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions. Please try again in a bit or email hello@campingnigeria.com.',
        },
        { status: 429 },
      )
    }

    if (!isValidPayload(raw)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }
    const data = raw

    if (
      !data.parent.fullName.trim() ||
      !data.parent.email.trim() ||
      !data.parent.phone.trim() ||
      !data.parent.city.trim() ||
      !data.emergencyContact.name.trim() ||
      !data.emergencyContact.phone.trim()
    ) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.parent.email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 })
    }
    if (digitsOf(data.parent.phone) < 7 || digitsOf(data.emergencyContact.phone) < 7) {
      return NextResponse.json({ success: false, error: 'Invalid phone' }, { status: 400 })
    }
    if (
      !withinLengthCaps([
        [data.parent.fullName, MAX_LENGTHS.name],
        [data.parent.email, MAX_LENGTHS.email],
        [data.parent.phone, MAX_LENGTHS.phone],
        [data.parent.city, MAX_LENGTHS.organization],
        [data.emergencyContact.name, MAX_LENGTHS.name],
        [data.emergencyContact.phone, MAX_LENGTHS.phone],
        [data.notes, MAX_LENGTHS.longText],
      ])
    ) {
      return NextResponse.json({ success: false, error: 'Field too long' }, { status: 400 })
    }
    for (const child of data.children) {
      if (!child.fullName.trim()) {
        return NextResponse.json({ success: false, error: "Each child needs a name" }, { status: 400 })
      }
      if (child.age < MIN_AGE || child.age > MAX_AGE) {
        return NextResponse.json(
          { success: false, error: `Children must be aged ${MIN_AGE}–${MAX_AGE}` },
          { status: 400 },
        )
      }
      if (
        !withinLengthCaps([
          [child.fullName, MAX_LENGTHS.name],
          [child.allergies, MAX_LENGTHS.shortText],
        ])
      ) {
        return NextResponse.json({ success: false, error: 'Field too long' }, { status: 400 })
      }
    }

    // Server-derived total + reference — never trust a client-supplied number.
    const total = computeRegistrationTotal(data.children.length)
    const reference = generateReference()

    // Record to Sheets in parallel with email send. Sheet failure is logged
    // but does not fail the request — the internal email is the team's
    // backup paper trail.
    const sheetPromise = recordRegistration({
      reference,
      total,
      status: 'pending',
      parent: data.parent,
      emergencyContact: data.emergencyContact,
      children: data.children,
      notes: data.notes,
    })

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      const sheet = await sheetPromise
      if (!sheet.ok) console.error('[event-registration] Sheet record failed:', sheet.error)
      return NextResponse.json({ success: false, fallback: 'mailto', reference }, { status: 422 })
    }

    const [emailResult, sheetResult] = await Promise.all([
      sendPairedMail(resendKey, {
        from: FROM,
        internal: {
          to: RECIPIENT,
          subject: `Base Camp Kids registration — ${data.parent.fullName} (${data.children.length} child${data.children.length === 1 ? '' : 'ren'}) · ${reference}`,
          html: buildInternalEmail(data, total, reference),
          replyTo: data.parent.email,
        },
        customer: {
          to: data.parent.email,
          subject: `We've got your seats — Base Camp Kids 30 May (${reference})`,
          html: buildCustomerEmail(data, total, reference),
        },
      }),
      sheetPromise,
    ])

    if (!sheetResult.ok) {
      console.error('[event-registration] Sheet record failed:', sheetResult.error)
    }

    if (emailResult.ok) {
      return NextResponse.json({ success: true, total, reference })
    }
    return NextResponse.json({ success: false, fallback: 'mailto', reference }, { status: 422 })
  } catch (error) {
    console.error('Event registration API error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
