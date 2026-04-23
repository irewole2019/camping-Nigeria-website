import { NextResponse } from 'next/server'
import { escapeHtml, isHoneypotTripped, MAX_LENGTHS, withinLengthCaps } from '@/lib/html'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendPairedMail } from '@/lib/mail'

const RECIPIENT = 'hello@campingnigeria.com'
const SITE_URL = 'https://campingnigeria.com'

interface GearQuotePayload {
  fullName: string
  email: string
  phone: string
  organization: string
  equipment: string
  rentalDates: string
}

// ─── Internal Notification (branded HTML) ───────────────────────────────────

function buildInternalEmail(data: GearQuotePayload): string {
  const fullName = escapeHtml(data.fullName)
  const email = escapeHtml(data.email)
  const phone = escapeHtml(data.phone)
  const phoneDigits = data.phone.replace(/\D/g, '')
  const organization = escapeHtml(data.organization)
  const equipment = escapeHtml(data.equipment)
  const rentalDates = escapeHtml(data.rentalDates)
  const firstName = escapeHtml(data.fullName.split(' ')[0])

  const contactRows = [
    ['Name', fullName],
    ['Email', `<a href="mailto:${email}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${email}</a>`],
    ['Phone', `<a href="tel:${phoneDigits}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${phone}</a>`],
    ...(data.organization ? [['Organization', organization]] : []),
  ]
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">${label}</td>
          <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${value}</td>
        </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">New Gear Rental Request</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">Camping Nigeria</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <!-- Rental Details Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Equipment Requested</p>
      </td></tr>
      <tr><td style="padding:20px;">
        <p style="margin:0 0 16px;font-size:14px;color:#3d3d3d;line-height:1.6;">${equipment}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Rental Dates</td>
          </tr>
          <tr>
            <td style="font-size:16px;font-weight:700;color:#0e3e2e;padding-top:4px;">${rentalDates}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Contact Details -->
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Contact Details</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      ${contactRows}
    </table>

    <!-- Quick Action -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:4px 0;">
          <a href="mailto:${email}" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;">
            Reply to ${firstName}
          </a>
        </td>
      </tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background-color:#0e3e2e;padding:16px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0;font-size:11px;color:#ffffff50;">
      Sent from campingnigeria.com gear rental form &middot; ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Customer Confirmation (branded HTML) ───────────────────────────────────

function buildCustomerEmail(data: GearQuotePayload): string {
  const firstName = escapeHtml(data.fullName.split(' ')[0])
  const equipment = escapeHtml(data.equipment)
  const rentalDates = escapeHtml(data.rentalDates)

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background-color:#0e3e2e;padding:32px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Camping Nigeria</h1>
    <p style="margin:6px 0 0;font-size:13px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">Outdoor Learning Reimagined</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background-color:#ffffff;padding:40px;">

    <!-- Greeting -->
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0e3e2e;">
      Hi ${firstName},
    </p>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#555555;">
      Thank you for your gear rental enquiry. We've received your request and our team will prepare a personalised quote for you.
    </p>

    <!-- Request Summary Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#0e3e2e;padding:20px 24px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Your Request</p>
        <h2 style="margin:6px 0 0;font-size:24px;font-weight:700;color:#ffffff;">Gear Rental Quote</h2>
      </td></tr>
      <tr><td style="padding:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;padding-bottom:8px;">Equipment Requested</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#3d3d3d;padding-bottom:16px;line-height:1.6;">${equipment}</td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;padding-bottom:8px;">Rental Dates</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#3d3d3d;font-weight:600;">${rentalDates}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:4px 0 28px;">
        <a href="${SITE_URL}/gear-rental" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
          View Our Gear Catalogue
        </a>
      </td></tr>
    </table>

    <!-- What Happens Next -->
    <h3 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0e3e2e;">What Happens Next</h3>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">1.</strong>&nbsp;&nbsp;Our team reviews your equipment request and checks availability.
      </td></tr>
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">2.</strong>&nbsp;&nbsp;We'll send you a detailed quote within <strong>24 hours</strong>.
      </td></tr>
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">3.</strong>&nbsp;&nbsp;Once confirmed, we handle delivery and pickup logistics.
      </td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
      Have questions? Reply to this email or reach us at
      <a href="mailto:hello@campingnigeria.com" style="color:#0e3e2e;font-weight:600;text-decoration:none;">hello@campingnigeria.com</a>
      or call <a href="tel:+2347040538528" style="color:#0e3e2e;font-weight:600;text-decoration:none;">+234 704 053 8528</a>.
    </p>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0 0 8px;font-size:13px;color:#ffffff99;">
      <a href="${SITE_URL}" style="color:#e6b325;text-decoration:none;font-weight:600;">campingnigeria.com</a>
    </p>
    <p style="margin:0;font-size:11px;color:#ffffff50;">
      <a href="https://www.instagram.com/camping_ng/" style="color:#ffffff70;text-decoration:none;">Instagram</a>
      &nbsp;&middot;&nbsp;
      <a href="https://www.facebook.com/campinggearsng" style="color:#ffffff70;text-decoration:none;">Facebook</a>
      &nbsp;&middot;&nbsp;
      <a href="https://wa.me/2347040538528" style="color:#ffffff70;text-decoration:none;">WhatsApp</a>
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

// ─── Route Handler ──────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => null)
    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }
    // Honeypot — pretend to succeed so bots don't learn they were caught
    if (isHoneypotTripped(raw)) {
      return NextResponse.json({ success: true })
    }
    // Per-IP rate limit (fails open when Upstash isn't configured)
    const rate = await checkRateLimit(request, 'gear-quote')
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions. Please try again in a bit or email hello@campingnigeria.com.',
        },
        { status: 429 },
      )
    }
    const r = raw as Record<string, unknown>
    if (
      typeof r.fullName !== 'string' ||
      typeof r.email !== 'string' ||
      typeof r.phone !== 'string' ||
      typeof r.equipment !== 'string' ||
      typeof r.rentalDates !== 'string' ||
      (r.organization !== undefined && typeof r.organization !== 'string')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }
    const data = raw as GearQuotePayload

    if (
      !data.fullName.trim() ||
      !data.email.trim() ||
      !data.phone.trim() ||
      !data.equipment.trim() ||
      !data.rentalDates.trim()
    ) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    if (data.phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json({ success: false, error: 'Invalid phone number' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 })
    }
    if (
      !withinLengthCaps([
        [data.fullName, MAX_LENGTHS.name],
        [data.email, MAX_LENGTHS.email],
        [data.phone, MAX_LENGTHS.phone],
        [data.organization ?? '', MAX_LENGTHS.organization],
        [data.equipment, MAX_LENGTHS.longText],
        [data.rentalDates, MAX_LENGTHS.shortText],
      ])
    ) {
      return NextResponse.json({ success: false, error: 'Field too long' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ success: false, fallback: 'mailto' }, { status: 422 })
    }

    const result = await sendPairedMail(resendKey, {
      from: 'Camping Nigeria <rentals@campingnigeria.com>',
      internal: {
        to: RECIPIENT,
        subject: `Gear Rental Quote Request — ${data.fullName}`,
        html: buildInternalEmail(data),
        replyTo: data.email,
      },
      customer: {
        to: data.email,
        subject: 'Your Gear Rental Quote Request — Camping Nigeria',
        html: buildCustomerEmail(data),
      },
    })

    if (result.ok) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ success: false, fallback: 'mailto' }, { status: 422 })
  } catch (error) {
    console.error('Gear quote API error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
