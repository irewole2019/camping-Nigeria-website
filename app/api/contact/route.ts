import { NextResponse } from 'next/server'
import { escapeHtml, isHoneypotTripped, MAX_LENGTHS, withinLengthCaps } from '@/lib/html'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendPairedMail } from '@/lib/mail'

const RECIPIENT = 'hello@campingnigeria.com'
const SITE_URL = 'https://campingnigeria.com'

interface ContactPayload {
  fullName: string
  email: string
  subject: string
  message: string
}

// ─── Internal Notification (branded HTML) ───────────────────────────────────

function buildInternalEmail(data: ContactPayload): string {
  const fullName = escapeHtml(data.fullName)
  const email = escapeHtml(data.email)
  const subject = escapeHtml(data.subject)
  const message = escapeHtml(data.message)
  const firstName = escapeHtml(data.fullName.split(' ')[0])
  const replySubject = encodeURIComponent(`Re: ${data.subject}`)

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">New Contact Message</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">Camping Nigeria</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <!-- Subject & Sender -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Subject</p>
        <h2 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#ffffff;">${subject}</h2>
      </td></tr>
      <tr><td style="padding:20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;font-weight:600;color:#0e3e2e;padding-bottom:4px;">From</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#3d3d3d;">${fullName} &mdash; <a href="mailto:${email}" style="color:#0e3e2e;font-weight:600;text-decoration:none;">${email}</a></td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Message -->
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Message</p>
    <div style="background:#fafaf8;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#3d3d3d;line-height:1.7;white-space:pre-wrap;">${message}</p>
    </div>

    <!-- Quick Action -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:4px 0;">
          <a href="mailto:${email}?subject=${replySubject}" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;">
            Reply to ${firstName}
          </a>
        </td>
      </tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background-color:#0e3e2e;padding:16px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0;font-size:11px;color:#ffffff50;">
      Sent from campingnigeria.com contact form &middot; ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Customer Confirmation (branded HTML) ───────────────────────────────────

function buildCustomerEmail(data: ContactPayload): string {
  const firstName = escapeHtml(data.fullName.split(' ')[0])
  const subject = escapeHtml(data.subject)
  const message = escapeHtml(data.message)

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
      Thank you for getting in touch. We've received your message and a member of our team will respond within <strong>24 hours</strong>.
    </p>

    <!-- Message Summary Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Your Message</p>
        <h2 style="margin:4px 0 0;font-size:18px;font-weight:700;color:#ffffff;">${subject}</h2>
      </td></tr>
      <tr><td style="padding:20px;">
        <p style="margin:0;font-size:14px;color:#3d3d3d;line-height:1.7;white-space:pre-wrap;">${message}</p>
      </td></tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:4px 0 28px;">
        <a href="${SITE_URL}" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
          Explore Our Programmes
        </a>
      </td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
      Need a faster response? Reach us on WhatsApp at
      <a href="https://wa.me/2347040538528" style="color:#0e3e2e;font-weight:600;text-decoration:none;">+234 704 053 8528</a>
      or call us directly.
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
    const rate = await checkRateLimit(request, 'contact')
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
      typeof r.subject !== 'string' ||
      typeof r.message !== 'string'
    ) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }
    const data = raw as ContactPayload

    if (!data.fullName.trim() || !data.email.trim() || !data.subject.trim() || !data.message.trim()) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 })
    }
    if (
      !withinLengthCaps([
        [data.fullName, MAX_LENGTHS.name],
        [data.email, MAX_LENGTHS.email],
        [data.subject, MAX_LENGTHS.subject],
        [data.message, MAX_LENGTHS.longText],
      ])
    ) {
      return NextResponse.json({ success: false, error: 'Field too long' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ success: false, fallback: 'mailto' }, { status: 422 })
    }

    const result = await sendPairedMail(resendKey, {
      from: 'Camping Nigeria <hello@campingnigeria.com>',
      internal: {
        to: RECIPIENT,
        subject: `Contact: ${data.subject} — ${data.fullName}`,
        html: buildInternalEmail(data),
        replyTo: data.email,
      },
      customer: {
        to: data.email,
        subject: `We've received your message — Camping Nigeria`,
        html: buildCustomerEmail(data),
      },
    })

    if (result.ok) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ success: false, fallback: 'mailto' }, { status: 422 })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
