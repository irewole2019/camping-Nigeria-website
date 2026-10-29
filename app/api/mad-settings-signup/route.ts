import { NextResponse } from 'next/server'
import { CONTACT } from '@/lib/constants'
import { escapeHtml, isHoneypotTripped, MAX_LENGTHS, withinLengthCaps } from '@/lib/html'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendPairedMail, type MailAttachment } from '@/lib/mail'
import { gatePassFields, gatePassPng } from '@/lib/gate-pass/qr'
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
  getTicket,
  isValidTicketId,
  type TicketId,
} from '@/lib/events/mad-settings'
import {
  generateSignupCode,
  normaliseInstagram,
  recordMadSettingsSignup,
} from '@/lib/events/mad-settings-records'
import { partnerTribeFromCode, tribeFromCode, type Tribe } from '@/lib/events/mad-settings-tribes'
import { socialBlockHtml, tribeBlockHtml } from '@/lib/events/mad-settings-email'

const RECIPIENT = 'hello@campingnigeria.com'
const FROM = 'Camping Nigeria <hello@campingnigeria.com>'
const SITE_URL = 'https://www.campingnigeria.com'

interface SignupPayload {
  name: string
  email: string
  phone: string
  instagram: string
  ticketId: TicketId
  /**
   * Couple tickets: the second person's name, required. Ignored (stored as
   * '') for any other ticket. Optional in the payload so a form loaded before
   * this field existed still gets a clear "add your partner's name" error.
   */
  partnerName: string
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
  if (r.partnerName !== undefined && typeof r.partnerName !== 'string') return false
  if (typeof r.ageConfirmed !== 'boolean') return false
  if (typeof r.paidConfirmed !== 'boolean') return false
  if (!isValidTicketId(r.ticketId)) return false
  return true
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function countDigits(value: string): number {
  return (value.match(/\d/g) || []).length
}

// ─── Internal notification ──────────────────────────────────────────────────

/** The tribes on a sign-up: the guest's, and for a couple the partner's (always different). */
interface Tribes {
  tribe: Tribe
  partnerTribe?: Tribe
  /**
   * False when the sheet did not assign them (row not recorded, or a script
   * that predates tribes or couples): what is shown is then the fallback
   * from the code, and the team must type it into the sheet.
   */
  inSheet: boolean
}

function buildInternalEmail(data: SignupPayload, code: string, instagram: string, tribes: Tribes): string {
  const { tribe, partnerTribe, inSheet: tribeInSheet } = tribes
  const ticket = getTicket(data.ticketId)
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
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">New MAD Settings Sign-up</h1>
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
      ${row('Ticket', escapeHtml(ticket.label))}
      ${row('Price', escapeHtml(formatNaira(ticket.price)))}
      ${row(
        'Tribe',
        tribeInSheet
          ? escapeHtml(tribe.name)
          : `<strong>${escapeHtml(tribe.name)}</strong> <span style="color:#b42318;">(not in the sheet: add it to the Tribe column by hand)</span>`,
      )}
      ${
        partnerTribe
          ? row('Partner', escapeHtml(data.partnerName || 'Not given')) +
            row(
              'Partner tribe',
              tribeInSheet
                ? escapeHtml(partnerTribe.name)
                : `<strong>${escapeHtml(partnerTribe.name)}</strong> <span style="color:#b42318;">(not in the sheet: add it to the Partner Tribe column by hand)</span>`,
            )
          : ''
      }
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:4px 0;">
        <a href="mailto:${email}?subject=Your MAD Settings sign-up (${escapeHtml(code)})" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;">
          Reply to ${firstName}
        </a>
      </td></tr>
    </table>

  </td></tr>

  <tr><td style="background-color:#0e3e2e;padding:16px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0;font-size:11px;color:#ffffff50;">Sent from campingnigeria.com MAD Settings sign-up form</p>
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

/** The inline attachment's id; the email's <img> points at `cid:` + this. */
const GATE_PASS_CID = 'gate-pass'

function buildCustomerEmail(data: SignupPayload, code: string, withGatePass: boolean, tribes: Tribes): string {
  const ticket = getTicket(data.ticketId)
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

    <!-- The Gate pass (R-008): the QR travels as an inline attachment, so the
         code text below it is what remains if a mail client hides images. -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#fdf6e3;padding:20px;" align="center">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#b8880a;font-weight:600;">Your gate pass</p>
        ${
          withGatePass
            ? `<img src="cid:${GATE_PASS_CID}" width="240" height="240" alt="Your gate pass, code ${escapeHtml(code)}" style="display:block;margin:14px auto 4px;width:240px;height:240px;border:0;background-color:#ffffff;border-radius:6px;">`
            : ''
        }
        <h2 style="margin:8px 0 6px;font-size:32px;font-weight:700;color:#0e3e2e;letter-spacing:4px;font-family:monospace;">${escapeHtml(code)}</h2>
        <p style="margin:0;font-size:14px;font-weight:700;color:#0e3e2e;">Screenshot this now. Show it at the gate.</p>
      </td></tr>
    </table>

    <!-- The tribe (26/10/2026): assigned by the sheet, least-filled first.
         A couple gets two different tribes, one each. -->
    ${tribeBlockHtml(tribes.tribe, {
      guestName: data.name,
      partner: tribes.partnerTribe ? { name: data.partnerName, tribe: tribes.partnerTribe } : undefined,
    })}

    <!-- What you booked -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;border-bottom:1px solid #f0f0f0;">Ticket</td>
        <td style="padding:10px 14px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${escapeHtml(ticket.label)} &middot; ${escapeHtml(formatNaira(ticket.price))}</td>
      </tr>
      <!-- Payment is offline and already made — this records what they told
           us, so a mismatch surfaces now rather than at the gate. -->
      <tr>
        <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;border-bottom:1px solid #f0f0f0;">Payment</td>
        <td style="padding:10px 14px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">
          Paid &middot; nothing to pay on the night.<br>
          <span style="color:#888;">If you have not paid yet, call ${escapeHtml(EVENT_PHONE_DISPLAY)} &mdash; your place is not held until you have.</span>
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

    <!-- The MAD Settings line, not the site-wide number: this event has its own
         enquiries and bookings line. See EVENT_PHONE_DISPLAY. -->
    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
      Questions before the day? Reply to this email, or call the MAD Settings line on
      <a href="${EVENT_PHONE_TEL}" style="color:#0e3e2e;font-weight:600;text-decoration:none;">${escapeHtml(EVENT_PHONE_DISPLAY)}</a>.
    </p>

    <!-- The social link the team asked for at the foot of the email. -->
    ${socialBlockHtml()}

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

    const rate = await checkRateLimit(request, 'mad-settings-signup')
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
    // A sold-out ticket is refused here too, not just greyed out on the form:
    // a page loaded before it sold out, or a direct post, still reaches this.
    if (getTicket(raw.ticketId).soldOut) {
      return NextResponse.json(
        {
          success: false,
          error: `${getTicket(raw.ticketId).name} tickets are sold out. Sleepover tickets are still available: pick one above.`,
        },
        { status: 409 },
      )
    }
    const isCouple = raw.ticketId === 'couple'
    const partnerName = isCouple && typeof raw.partnerName === 'string' ? raw.partnerName.trim() : ''

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
        { success: false, error: `MAD Settings is for adults ${MIN_AGE} and over.` },
        { status: 400 },
      )
    }
    // Payment is offline and happens before sign-up. Without this the sheet
    // could not honestly mark the row paid.
    if (!raw.paidConfirmed) {
      return NextResponse.json(
        {
          success: false,
          error: `Tickets are paid for before you sign up. Call ${EVENT_PHONE_DISPLAY} to pay, then come back and fill this in.`,
        },
        { status: 400 },
      )
    }
    // A couple ticket is two people with a tribe each, so the second person
    // needs a name for the email, the gate screen and the printed list.
    if (isCouple && !partnerName) {
      return NextResponse.json(
        { success: false, error: 'Add your partner’s name: a couple ticket is for two people.' },
        { status: 400 },
      )
    }
    if (
      !withinLengthCaps([
        [name, MAX_LENGTHS.name],
        [partnerName, MAX_LENGTHS.name],
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
      ticketId: raw.ticketId,
      partnerName,
      ageConfirmed: true,
      paidConfirmed: true,
    }
    const ticket = getTicket(payload.ticketId)

    // Record first, so the code in the email is one the sheet has accepted.
    // The script rejects a code it already holds; retry a few times rather
    // than issue two campers the same code.
    const rowFor = (signupCode: string) => ({
      code: signupCode,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      instagram,
      ticketId: payload.ticketId,
      ticketLabel: ticket.label,
      usesTent: ticket.usesTent,
      price: ticket.price,
      // Offline payment, made before sign-up and confirmed above.
      paid: 'Yes' as const,
      partnerName: payload.partnerName,
    })

    let code = generateSignupCode()
    let recorded = await recordMadSettingsSignup(rowFor(code))

    let attempts = 0
    while (!recorded.ok && recorded.error === 'duplicate-code' && attempts < 4) {
      attempts += 1
      code = generateSignupCode()
      recorded = await recordMadSettingsSignup(rowFor(code))
    }

    // One sign-up per email (29/10/2026): the sheet refuses an email it
    // already holds. Like capacity, this stops the sign-up before any email
    // goes out. The message never includes the earlier code, which is the
    // gate pass: anyone can type someone else's email address.
    if (!recorded.ok && recorded.error === 'duplicate-email') {
      return NextResponse.json(
        {
          success: false,
          error: `This email is already signed up for ${EVENT_FULL_TITLE}. Your code is in the confirmation email we sent you then (check spam too). To add or change a ticket, call ${EVENT_PHONE_DISPLAY}.`,
        },
        { status: 409 },
      )
    }

    // Capacity is the one refusal that must stop the sign-up. Everything else
    // the sheet can say is non-blocking, but sending "You are in" for tent 81
    // would be a promise we cannot keep, so this returns before any email.
    // Only a sleepover ticket can get this answer — the script does not count
    // attendance-only rows — so the message points at the ticket still open.
    if (!recorded.ok && recorded.error === 'tents-full') {
      return NextResponse.json(
        {
          success: false,
          error: `All ${TENT_CAP} tents are taken. Attendance-only tickets are still open, or call ${EVENT_PHONE_DISPLAY} to join the sleepover waiting list.`,
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
      console.error('MAD Settings sheet append failed:', recorded.error)
    }

    // The sheet assigns the tribes so the four stay even. Without its answer
    // the code decides, and the internal email asks the team to record them.
    const tribe = recorded.tribe ?? tribeFromCode(code)
    const tribes: Tribes = {
      tribe,
      ...(isCouple ? { partnerTribe: recorded.partnerTribe ?? partnerTribeFromCode(code, tribe) } : {}),
      inSheet: recorded.tribe !== undefined && (!isCouple || recorded.partnerTribe !== undefined),
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json(
        { success: false, error: 'Email is not configured. Please email hello@campingnigeria.com.' },
        { status: 422 },
      )
    }

    // The Gate pass QR, drawn here and attached inline. If drawing it fails,
    // the email still goes, with the code as text: the gate accepts a typed
    // code, and "your name still gets you in".
    let gatePass: MailAttachment | null = null
    try {
      const png = await gatePassPng(gatePassFields(code, payload.name, ticket.label))
      gatePass = { filename: `gate-pass-${code}.png`, content: png.toString('base64'), content_id: GATE_PASS_CID }
    } catch (err) {
      console.error('MAD Settings gate pass QR failed; sending without it:', err)
    }

    const result = await sendPairedMail(resendKey, {
      from: FROM,
      internal: {
        to: RECIPIENT,
        subject: `MAD Settings sign-up — ${payload.name} · ${ticket.label} · ${code}`,
        html: buildInternalEmail(payload, code, instagram, tribes),
        replyTo: payload.email,
      },
      customer: {
        to: payload.email,
        subject: `You are in — MAD Settings, ${EVENT_DATE_LABEL} (${code})`,
        html: buildCustomerEmail(payload, code, gatePass !== null, tribes),
        attachments: gatePass ? [gatePass] : undefined,
      },
    })

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: 'We could not send your confirmation. Please email hello@campingnigeria.com.' },
        { status: 422 },
      )
    }

    return NextResponse.json({
      success: true,
      code,
      tribe: tribe.id,
      ...(tribes.partnerTribe ? { partnerTribe: tribes.partnerTribe.id } : {}),
    })
  } catch (err) {
    console.error('MAD Settings sign-up error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
