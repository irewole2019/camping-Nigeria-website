import { NextResponse } from 'next/server'
import { escapeHtml, isHoneypotTripped } from '@/lib/html'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendPairedMail } from '@/lib/mail'
import {
  AWARD_LEVEL_LABELS,
  DOE_PRICE_NOTE,
  DOE_TIERS,
  isValidPayload,
  REQUESTER_LABELS,
  TIER_INTEREST_LABELS,
  type AwardProposalPayload,
  type AwardProposalScheduling,
  type TierInterest,
  type TierStaticData,
} from '@/lib/award-proposal'

const RECIPIENT = 'hello@campingnigeria.com'
const SITE_URL = 'https://campingnigeria.com'
const FROM = 'Camping Nigeria <hello@campingnigeria.com>'

// ─── Date Helpers (DD/MM/YYYY for Nigeria) ──────────────────────────────────

function formatDate(date: string): string {
  if (!date) return ''
  const [y, m, d] = date.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

function formatDateTime(date: string, time: string): string {
  const formatted = formatDate(date)
  if (!formatted) return ''
  return `${formatted} · ${time || '09:00'}`
}

function formatDateRange(scheduling: AwardProposalScheduling): string | null {
  const start = formatDateTime(scheduling.eventStartDate, scheduling.eventStartTime)
  const end = formatDateTime(scheduling.eventEndDate, scheduling.eventEndTime)
  if (!start || !end) return null
  return `${start} → ${end}`
}

// ─── Internal Email ─────────────────────────────────────────────────────────

function detailsRows(payload: AwardProposalPayload): string {
  const { details } = payload
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${escapeHtml(value)}</td>
    </tr>`

  if (details.requesterType === 'school') {
    return [
      row('Submitting as', REQUESTER_LABELS.school),
      row('School', details.schoolName),
      row('Role', details.role),
      row('Students', `${details.studentCount}`),
      row(
        'Award levels',
        details.awardLevels.map((l) => AWARD_LEVEL_LABELS[l]).join(', '),
      ),
    ].join('')
  }
  return [
    row('Submitting as', REQUESTER_LABELS.parent),
    row('Student’s school', details.studentSchool),
    row('Student’s class / year', details.studentClass),
    row('Award level', AWARD_LEVEL_LABELS[details.awardLevel]),
  ].join('')
}

function buildInternalEmail(payload: AwardProposalPayload): string {
  const { contact, scheduling, notes, tierInterest } = payload
  const contactName = escapeHtml(contact.contactName)
  const email = escapeHtml(contact.email)
  const phone = escapeHtml(contact.phone)
  const firstName = escapeHtml(contact.contactName.split(' ')[0])
  const tierLabel = escapeHtml(TIER_INTEREST_LABELS[tierInterest])
  const dateRange = formatDateRange(scheduling)
  const escapedNotes = notes.trim() ? escapeHtml(notes.trim()) : ''

  const detailsBlock = detailsRows(payload)

  const contactRow = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">${label}</td>
      <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${value}</td>
    </tr>`

  const contactRows = [
    contactRow('Contact', contactName),
    contactRow(
      'Email',
      `<a href="mailto:${email}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${email}</a>`,
    ),
    contactRow(
      'Phone',
      `<a href="tel:${phone}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${phone}</a>`,
    ),
    contactRow(
      'Preferred timing',
      dateRange
        ? escapeHtml(dateRange)
        : '<span style="color:#999;">Not specified — confirm on call</span>',
    ),
  ].join('')

  const notesBlock = escapedNotes
    ? `
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Notes</p>
    <div style="background:#fafaf8;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#3d3d3d;line-height:1.6;white-space:pre-wrap;">${escapedNotes}</p>
    </div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">New DoE Proposal Request</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">Duke of Edinburgh &middot; Camping Nigeria</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <!-- Tier interest -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Tier interest</p>
        <h2 style="margin:4px 0 0;font-size:18px;font-weight:700;color:#ffffff;">${tierLabel}</h2>
      </td></tr>
    </table>

    <!-- Requester details -->
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Requester details</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      ${detailsBlock}
    </table>

    <!-- Contact -->
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Contact</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      ${contactRows}
    </table>

    ${notesBlock}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:4px 0;">
          <a href="mailto:${email}?subject=Re: Your Duke of Edinburgh proposal request" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;">
            Reply to ${firstName}
          </a>
        </td>
      </tr>
    </table>

  </td></tr>

  <tr><td style="background-color:#0e3e2e;padding:16px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0;font-size:11px;color:#ffffff50;">
      Sent from campingnigeria.com DoE proposal form &middot; ${formatDate(new Date().toISOString().slice(0, 10))}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Customer Email ─────────────────────────────────────────────────────────

function tierCardHtml(tier: TierStaticData, isOnly: boolean): string {
  const includes = tier.includes
    .map(
      (item) =>
        `<tr><td style="padding:4px 0;font-size:14px;color:#3d3d3d;"><span style="color:#e6b325;margin-right:8px;">&#10003;</span>${escapeHtml(item)}</td></tr>`,
    )
    .join('')

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:${isOnly ? 2 : 1}px solid ${isOnly ? '#e6b325' : '#e6e0c8'};border-radius:10px;overflow:hidden;margin-bottom:20px;">
    <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">${isOnly ? 'Recommended Tier' : 'Tier'}</p>
      <h3 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#ffffff;">${escapeHtml(tier.name)}</h3>
    </td></tr>
    <tr><td style="padding:18px 20px;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0e3e2e;">${escapeHtml(tier.price)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0">${includes}</table>
    </td></tr>
  </table>`
}

function buildCustomerEmail(payload: AwardProposalPayload): string {
  const firstName = escapeHtml(payload.contact.contactName.split(' ')[0])
  const tierInterest = payload.tierInterest

  const tiersToShow: TierStaticData[] =
    tierInterest === 'unsure'
      ? DOE_TIERS
      : DOE_TIERS.filter((t) => t.key === tierInterest)

  const tiersHtml = tiersToShow
    .map((tier) => tierCardHtml(tier, tiersToShow.length === 1))
    .join('')

  const intro =
    tierInterest === 'unsure'
      ? 'Thank you for your interest in the Duke of Edinburgh expedition. Here are the three tiers we offer — our team will recommend the right fit for your group on our call.'
      : 'Thank you for your interest in the Duke of Edinburgh expedition. Here’s a recap of the tier you selected.'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background-color:#0e3e2e;padding:32px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Camping Nigeria</h1>
    <p style="margin:6px 0 0;font-size:13px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">Duke of Edinburgh Expedition Support</p>
  </td></tr>

  <tr><td style="background-color:#ffffff;padding:40px;">

    <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0e3e2e;">Hi ${firstName},</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#555555;">${intro}</p>

    ${tiersHtml}

    <p style="margin:8px 0 24px;font-size:13px;color:#888;line-height:1.6;font-style:italic;">${escapeHtml(DOE_PRICE_NOTE)}</p>

    <h3 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0e3e2e;">What Happens Next</h3>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">1.</strong>&nbsp;&nbsp;Our team reviews your request and prepares a tailored proposal.
      </td></tr>
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">2.</strong>&nbsp;&nbsp;We&apos;ll reach out within <strong>48 hours</strong> to discuss timing, group details, and the right tier${tierInterest === 'unsure' ? '' : ''}.
      </td></tr>
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">3.</strong>&nbsp;&nbsp;Once confirmed, we handle the outdoor delivery so you can focus on the Award.
      </td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
      Need a faster response? Reach us on WhatsApp at
      <a href="https://wa.me/2347040538528" style="color:#0e3e2e;font-weight:600;text-decoration:none;">+234 704 053 8528</a>
      or email <a href="mailto:hello@campingnigeria.com" style="color:#0e3e2e;font-weight:600;text-decoration:none;">hello@campingnigeria.com</a>.
    </p>

  </td></tr>

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

function tierLabelForSubject(t: TierInterest): string {
  if (t === 'unsure') return 'Tiers TBD'
  // Just the name from "Base Camp · From ₦…" — split on the bullet
  return TIER_INTEREST_LABELS[t].split('·')[0]?.trim() ?? t
}

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => null)
    if (isHoneypotTripped(raw)) {
      return NextResponse.json({ success: true })
    }
    const rate = await checkRateLimit(request, 'award-proposal')
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
    const payload: AwardProposalPayload = raw

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.error('[award-proposal] RESEND_API_KEY missing — cannot send proposal email')
      return NextResponse.json(
        {
          success: false,
          error: 'Our email service is temporarily unavailable. Please email hello@campingnigeria.com.',
        },
        { status: 503 },
      )
    }

    const subjectIdentifier =
      payload.details.requesterType === 'school'
        ? payload.details.schoolName
        : `parent · ${payload.details.studentSchool}`

    const mailResult = await sendPairedMail(resendKey, {
      from: FROM,
      internal: {
        to: RECIPIENT,
        subject: `New DoE Proposal Request — ${subjectIdentifier} · ${tierLabelForSubject(payload.tierInterest)}`,
        html: buildInternalEmail(payload),
        replyTo: payload.contact.email,
      },
      customer: {
        to: payload.contact.email,
        subject: 'Your Duke of Edinburgh Proposal Request — Camping Nigeria',
        html: buildCustomerEmail(payload),
      },
    })

    if (mailResult.ok) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json(
      {
        success: false,
        error: 'We couldn’t deliver your proposal email. Please try again or email hello@campingnigeria.com.',
      },
      { status: 502 },
    )
  } catch (error) {
    console.error('Award proposal API error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
