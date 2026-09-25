import { NextResponse } from 'next/server'
import { CONTACT } from '@/lib/constants'
import { escapeHtml, isHoneypotTripped, MAX_LENGTHS, withinLengthCaps } from '@/lib/html'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendPairedMail } from '@/lib/mail'
import {
  BRING,
  EVENT_DATE_LABEL,
  EVENT_FULL_TITLE,
  EVENT_PATH,
  EVENT_PHONE_DISPLAY,
  EVENT_PHONE_TEL,
  EVENT_TIME_LABEL,
  MIN_AGE,
  PLEASE_NOTE,
  SIGNUP_OPEN,
  TENT_CAP,
  VENUE_LABEL,
  VENUE_MAP_URL,
  WE_PROVIDE,
  formatNaira,
  getTentPackage,
  isValidPackageId,
  type TentPackageId,
} from '@/lib/events/camp-night'
import {
  generateSignupCode,
  normaliseInstagram,
  recordCampNightSignup,
} from '@/lib/events/camp-night-records'

const RECIPIENT = 'hello@campingnigeria.com'
const FROM = 'Camping Nigeria <hello@campingnigeria.com>'
const SITE_URL = 'https://www.campingnigeria.com'

interface SignupPayload {
  name: string
  email: string
  phone: string
  instagram: string
  packageId: TentPackageId
  /** Ticked the "I am 18 or over" box. Re-checked here, not trusted from the UI. */
  ageConfirmed: boolean
  /**
   * Ticked "I have already paid". Payment is offline and happens before
   * sign-up, so this is what lets the sheet's `Paid?` column say Yes.
   */
  paidConfirmed: boolean
}

// Same shape as the other routes: check every field's type and enum before
// touching anything expensive.
function isValidPayload(raw: unknown): raw is SignupPayload {
  if (!raw || typeof raw !== 'object') return false
  const r = raw as Record<string, unknown>
  if (typeof r.name !== 'string') return false
  if (typeof r.email !== 'string') return false
  if (typeof r.phone !== 'string') return false
  // Instagram is optional, but must be a string when present.
  if (typeof r.instagram !== 'string') return false
  if (typeof r.ageConfirmed !== 'boolean') return false
  if (typeof r.paidConfirmed !== 'boolean') return false
  if (!isValidPackageId(r.packageId)) return false
  return true
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function countDigits(value: string): number {
  return (value.match(/\d/g) || []).length
}

// ─── Internal notification ──────────────────────────────────────────────────

function buildInternalEmail(data: SignupPayload, code: string, instagram: string): string {
  const pkg = getTentPackage(data.packageId)
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const phone = escapeHtml(data.phone)
  const ig = escapeHtml(instagram || 'Not given')
  const firstName = escapeHtml(data.name.split(' ')[0])

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${value}</td>
    </tr>`

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">New Camp Night Sign-up</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">${escapeHtml(EVENT_DATE_LABEL)}</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;" align="center">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Sign-up code</p>
        <h2 style="margin:6px 0 0;font-size:30px;font-weight:700;color:#ffffff;letter-spacing:3px;font-family:monospace;">${escapeHtml(code)}</h2>
      </td></tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      ${row('Name', name)}
      ${row('Email', `<a href="mailto:${email}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${email}</a>`)}
      ${row('Phone', `<a href="tel:${phone.replace(/\s/g, '')}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${phone}</a>`)}
      ${row('Instagram', ig)}
      ${row('Tent package', escapeHtml(pkg.label))}
      ${row('Price', escapeHtml(formatNaira(pkg.price)))}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:4px 0;">
        <a href="mailto:${email}?subject=Your Camp Night sign-up (${escapeHtml(code)})" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;">
          Reply to ${firstName}
        </a>
      </td></tr>
    </table>

  </td></tr>

  <tr><td style="background-color:#0e3e2e;padding:16px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0;font-size:11px;color:#ffffff50;">Sent from campingnigeria.com Camp Night sign-up form</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Camper confirmation ────────────────────────────────────────────────────

function bulletList(items: readonly string[]): string {
  return items
    .map(
      (item) =>
        `<tr><td style="padding:5px 0 5px 0;font-size:14px;color:#3d3d3d;line-height:1.6;vertical-align:top;width:16px;">&bull;</td><td style="padding:5px 0;font-size:14px;color:#3d3d3d;line-height:1.6;">${escapeHtml(item)}</td></tr>`,
    )
    .join('')
}

function buildCustomerEmail(data: SignupPayload, code: string): string {
  const pkg = getTentPackage(data.packageId)
  const firstName = escapeHtml(data.name.split(' ')[0])

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background-color:#0e3e2e;padding:28px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">You are in, ${firstName}</h1>
    <p style="margin:8px 0 0;font-size:13px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">${escapeHtml(EVENT_FULL_TITLE)} &middot; ${escapeHtml(EVENT_DATE_LABEL)}</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <!-- The code -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#fdf6e3;padding:20px;" align="center">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#b8880a;font-weight:600;">Your camp code</p>
        <h2 style="margin:8px 0 6px;font-size:32px;font-weight:700;color:#0e3e2e;letter-spacing:4px;font-family:monospace;">${escapeHtml(code)}</h2>
        <p style="margin:0;font-size:13px;color:#6b6455;">Keep this. It is how we find you at the gate.</p>
      </td></tr>
    </table>

    <!-- What you booked -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;border-bottom:1px solid #f0f0f0;">Tent</td>
        <td style="padding:10px 14px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${escapeHtml(pkg.label)} &middot; ${escapeHtml(formatNaira(pkg.price))}</td>
      </tr>
      <!-- Payment is offline and already made — this records what they told
           us, so a mismatch surfaces now rather than at the gate. -->
      <tr>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;border-bottom:1px solid #f0f0f0;">Payment</td>
        <td style="padding:10px 14px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">
          Paid &middot; nothing to pay on the night.<br>
          <span style="color:#888;">If you have not paid yet, call ${escapeHtml(EVENT_PHONE_DISPLAY)} &mdash; your tent is not held until you have.</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;border-bottom:1px solid #f0f0f0;">When</td>
        <td style="padding:10px 14px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${escapeHtml(EVENT_DATE_LABEL)}, ${escapeHtml(EVENT_TIME_LABEL)}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;">Venue</td>
        <td style="padding:10px 14px;font-size:13px;color:#3d3d3d;">
          ${escapeHtml(VENUE_LABEL)}<br>
          <a href="${escapeHtml(VENUE_MAP_URL)}" style="color:#b8880a;font-weight:600;text-decoration:none;">Open in Google Maps</a>
        </td>
      </tr>
    </table>

    <!-- We are providing -->
    <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">We are providing</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${bulletList(WE_PROVIDE)}</table>

    <!-- You should come with -->
    <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">You should come with</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${bulletList(BRING)}</table>

    <!-- Please note -->
    <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Please note</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${bulletList(PLEASE_NOTE)}</table>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

    <!-- The Camp Night line, not the site-wide number: this event has its own
         enquiries and bookings line. See EVENT_PHONE_DISPLAY. -->
    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
      Questions before the night? Reply to this email, or call the Camp Night line on
      <a href="${EVENT_PHONE_TEL}" style="color:#0e3e2e;font-weight:600;text-decoration:none;">${escapeHtml(EVENT_PHONE_DISPLAY)}</a>.
    </p>

  </td></tr>

  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0 0 8px;font-size:13px;color:#ffffff99;">
      <a href="${SITE_URL}${EVENT_PATH}" style="color:#e6b325;text-decoration:none;font-weight:600;">campingnigeria.com</a>
    </p>
    <p style="margin:0;font-size:11px;color:#ffffff50;">
      <a href="${escapeHtml(CONTACT.instagram)}" style="color:#ffffff70;text-decoration:none;">Instagram</a>
      &nbsp;&middot;&nbsp;
      <a href="${escapeHtml(CONTACT.facebook)}" style="color:#ffffff70;text-decoration:none;">Facebook</a>
      &nbsp;&middot;&nbsp;
      <a href="${escapeHtml(CONTACT.whatsapp)}" style="color:#ffffff70;text-decoration:none;">WhatsApp</a>
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

// ─── Handler ────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => null)
    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Honeypot — fake success so bots do not learn they were caught.
    if (isHoneypotTripped(raw)) {
      return NextResponse.json({ success: true, code: generateSignupCode() })
    }

    const rate = await checkRateLimit(request, 'camp-night-signup')
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many sign-ups from this connection. Try again shortly, or email hello@campingnigeria.com.',
        },
        { status: 429 },
      )
    }

    // Sign-ups close when the edition does. Checked independently of the form
    // not rendering, for stale caches and direct posts.
    if (!SIGNUP_OPEN) {
      return NextResponse.json(
        {
          success: false,
          error: `Sign-ups for ${EVENT_FULL_TITLE} (${EVENT_DATE_LABEL}) are closed. Email hello@campingnigeria.com to hear about the next one.`,
        },
        { status: 403 },
      )
    }

    if (!isValidPayload(raw)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const name = raw.name.trim()
    const email = raw.email.trim()
    const phone = raw.phone.trim()
    const instagram = normaliseInstagram(raw.instagram)

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (countDigits(phone) < 7) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
    }
    // Adults-only night. The form makes this a required checkbox; this is the
    // check that actually holds, for direct posts and stale clients.
    if (!raw.ageConfirmed) {
      return NextResponse.json(
        { success: false, error: `Camp Night is for adults ${MIN_AGE} and over.` },
        { status: 400 },
      )
    }
    // Payment is offline and happens before sign-up. Without this the sheet
    // could not honestly mark the row paid.
    if (!raw.paidConfirmed) {
      return NextResponse.json(
        {
          success: false,
          error: `Tents are paid for before you sign up. Call ${EVENT_PHONE_DISPLAY} to pay, then come back and fill this in.`,
        },
        { status: 400 },
      )
    }
    if (
      !withinLengthCaps([
        [name, MAX_LENGTHS.name],
        [email, MAX_LENGTHS.email],
        [phone, MAX_LENGTHS.phone],
        [instagram, MAX_LENGTHS.name],
      ])
    ) {
      return NextResponse.json({ error: 'Field too long' }, { status: 400 })
    }

    const payload: SignupPayload = {
      name,
      email,
      phone,
      instagram,
      packageId: raw.packageId,
      ageConfirmed: true,
      paidConfirmed: true,
    }
    const pkg = getTentPackage(payload.packageId)

    // Record first, so the code in the email is one the sheet has accepted.
    // The script rejects a code it already holds; retry a few times rather
    // than issue two campers the same code.
    const rowFor = (signupCode: string) => ({
      code: signupCode,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      instagram,
      packageId: payload.packageId,
      packageLabel: pkg.label,
      price: pkg.price,
      // Offline payment, made before sign-up and confirmed above.
      paid: 'Yes' as const,
    })

    let code = generateSignupCode()
    let recorded = await recordCampNightSignup(rowFor(code))

    let attempts = 0
    while (!recorded.ok && recorded.error === 'duplicate-code' && attempts < 4) {
      attempts += 1
      code = generateSignupCode()
      recorded = await recordCampNightSignup(rowFor(code))
    }

    // Capacity is the one refusal that must stop the sign-up. Everything else
    // the sheet can say is non-blocking, but sending "You are in" for tent 61
    // would be a promise we cannot keep, so this returns before any email.
    if (!recorded.ok && recorded.error === 'event-full') {
      return NextResponse.json(
        {
          success: false,
          error: `All ${TENT_CAP} tents are taken. Call ${EVENT_PHONE_DISPLAY} to join the waiting list.`,
        },
        { status: 409 },
      )
    }

    if (!recorded.ok) {
      // Non-blocking, matching Base Camp Kids: the email is the source of
      // truth that a sign-up happened, and the internal notification carries
      // every field so the row can be added by hand.
      //
      // Note this means capacity is only enforced once the webhook is
      // configured — with no sheet there is no count. See TENT_CAP.
      console.error('Camp Night sheet append failed:', recorded.error)
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json(
        { success: false, error: 'Email is not configured. Please email hello@campingnigeria.com.' },
        { status: 422 },
      )
    }

    const result = await sendPairedMail(resendKey, {
      from: FROM,
      internal: {
        to: RECIPIENT,
        subject: `Camp Night sign-up — ${payload.name} · ${pkg.label} · ${code}`,
        html: buildInternalEmail(payload, code, instagram),
        replyTo: payload.email,
      },
      customer: {
        to: payload.email,
        subject: `You are in — Camp Night, ${EVENT_DATE_LABEL} (${code})`,
        html: buildCustomerEmail(payload, code),
      },
    })

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: 'We could not send your confirmation. Please email hello@campingnigeria.com.' },
        { status: 422 },
      )
    }

    return NextResponse.json({ success: true, code })
  } catch (err) {
    console.error('Camp Night sign-up error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
