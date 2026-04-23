import { NextResponse } from 'next/server'
import { escapeHtml, safeUrl, isHoneypotTripped, MAX_LENGTHS, withinLengthCaps } from '@/lib/html'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendPairedMail } from '@/lib/mail'
import {
  isValidAnswers,
  scoreAnswers,
  type ProposalAnswers,
  type ProposalResult,
} from '@/lib/proposal-engine'

const RECIPIENT = 'hello@campingnigeria.com'
const SITE_URL = 'https://campingnigeria.com'

interface ProposalPayload {
  answers: ProposalAnswers
  contact: {
    contactName: string
    role: string
    schoolName: string
    email: string
    phone: string
    website: string
  }
}

const OPTION_LABELS: Record<string, string> = {
  primary: 'Primary school',
  secondary: 'Secondary school',
  mixed: 'Mixed (Primary & Secondary)',
  university: 'University or College',
  'primary-1-3': 'Primary 1–3',
  'primary-4-6': 'Primary 4–6',
  'jss-1-3': 'JSS 1–3',
  'ss-1-3': 'SS 1–3',
  'under-40': 'Under 40 students',
  '40-80': '40–80 students',
  '80-150': '80–150 students',
  '150+': '150+ students',
  'team-bonding': 'Team bonding & school community',
  'eco-creativity': 'Environmental awareness & creativity',
  leadership: 'Student leadership & character development',
  celebration: 'End-of-term celebration or reward',
  general: 'General student body',
  leaders: 'Prefects, captains, or council members',
  mix: 'A mix of both',
  'half-day': 'Half day (3–4 hours)',
  'full-day': 'Full day (6–8 hours)',
  '2-days': '2 days',
  'on-campus': 'On school campus',
  'off-campus': 'Off-campus outdoor venue',
  either: 'Either works',
  'camping-tents': 'Camping & tent setup',
  'adire-crafts': 'Adire tie-dye & cultural crafts',
  'sports-games': 'Sports & team games',
  'leadership-challenges': 'Leadership challenges & simulations',
  'eco-nature': 'Eco-awareness & nature walks',
  'bonfire-stories': 'Bonfire & storytelling',
  journaling: 'Journaling & reflection',
}

const QUESTION_ORDER: { key: keyof ProposalAnswers; label: string }[] = [
  { key: 'schoolType', label: 'School type' },
  { key: 'classLevel', label: 'Class level' },
  { key: 'groupSize', label: 'Group size' },
  { key: 'primaryGoal', label: 'Primary goal' },
  { key: 'participantType', label: 'Participants' },
  { key: 'duration', label: 'Duration' },
  { key: 'venue', label: 'Venue preference' },
  { key: 'activities', label: 'Activities of interest' },
]

function formatLabel(value: string | string[]): string {
  // OPTION_LABELS values are trusted (static); unknown keys fall through
  // to raw user input, so escape the output to prevent HTML injection.
  if (Array.isArray(value)) {
    return value.map((v) => escapeHtml(OPTION_LABELS[v] || v)).join(', ')
  }
  return escapeHtml(OPTION_LABELS[value] || value)
}

// ─── Internal Notification (branded HTML) ───────────────────────────────────

function buildInternalEmail(body: ProposalPayload, result: ProposalResult): string {
  const { answers, contact } = body

  const schoolName = escapeHtml(contact.schoolName)
  const contactName = escapeHtml(contact.contactName)
  const role = escapeHtml(contact.role)
  const email = escapeHtml(contact.email)
  const phone = escapeHtml(contact.phone)
  const websiteHref = safeUrl(contact.website)
  const websiteDisplay = escapeHtml(contact.website)
  const firstName = escapeHtml(contact.contactName.split(' ')[0])
  const programTitle = escapeHtml(result.program.title)
  const tierName = escapeHtml(result.tier.name)
  const tierTag = escapeHtml(result.tier.tag)
  const tierDuration = escapeHtml(result.tier.duration)

  const responseRows = QUESTION_ORDER
    .filter(({ key }) => answers[key] !== undefined)
    .map(
      ({ key, label }) =>
        `<tr>
          <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${formatLabel(answers[key])}</td>
        </tr>`
    )
    .join('')

  const contactRows = [
    ['School', schoolName],
    ['Contact', `${contactName}${role ? ` (${role})` : ''}`],
    ['Email', `<a href="mailto:${email}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${email}</a>`],
    ['Phone', `<a href="tel:${phone}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${phone}</a>`],
    ...(websiteHref ? [['Website', `<a href="${escapeHtml(websiteHref)}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${websiteDisplay}</a>`]] : []),
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
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">New School Proposal Request</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">Camping Nigeria</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <!-- Recommendation -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Recommended Programme</p>
        <h2 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#ffffff;">${programTitle}</h2>
      </td></tr>
      <tr><td style="padding:16px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px;font-weight:700;color:#0e3e2e;">${tierName} <span style="font-size:11px;font-weight:600;color:#e6b325;background:#fdf8e8;padding:2px 8px;border-radius:20px;margin-left:4px;">${tierTag}</span></td>
            <td style="font-size:14px;color:#555;font-weight:600;" align="right">${tierDuration}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- School Details -->
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">School Details</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      ${contactRows}
    </table>

    <!-- Responses -->
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Form Responses</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      ${responseRows}
    </table>

    <!-- Quick Actions -->
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
      Sent from campingnigeria.com proposal form &middot; ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Customer Confirmation (branded HTML) ───────────────────────────────────

function buildCustomerEmail(body: ProposalPayload, result: ProposalResult): string {
  const { contact } = body

  // Program slugs are derived from the server-side recommendation engine,
  // which only returns known programs — safe for URL construction.
  const programUrl = `${SITE_URL}/schools/programs/${result.program.slug}`

  const firstName = escapeHtml(contact.contactName.split(' ')[0])
  const schoolName = escapeHtml(contact.schoolName)
  const programTitle = escapeHtml(result.program.title)
  const tierName = escapeHtml(result.tier.name)
  const tierTag = escapeHtml(result.tier.tag)
  const tierDuration = escapeHtml(result.tier.duration)

  const includesList = result.tier.includes
    .map(
      (item) =>
        `<tr><td style="padding:4px 0;font-size:14px;color:#3d3d3d;"><span style="color:#e6b325;margin-right:8px;">&#10003;</span>${escapeHtml(item)}</td></tr>`
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
      Thank you for your interest in bringing outdoor learning to <strong>${schoolName}</strong>. Based on your responses, here's what we recommend:
    </p>

    <!-- Recommendation Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#0e3e2e;padding:20px 24px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Recommended Programme</p>
        <h2 style="margin:6px 0 0;font-size:24px;font-weight:700;color:#ffffff;">${programTitle}</h2>
      </td></tr>
      <tr><td style="padding:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;padding-bottom:4px;">Package</td>
            <td style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;padding-bottom:4px;" align="right">Duration</td>
          </tr>
          <tr>
            <td style="font-size:18px;font-weight:700;color:#0e3e2e;">${tierName} <span style="font-size:12px;font-weight:600;color:#e6b325;background:#fdf8e8;padding:2px 8px;border-radius:20px;margin-left:6px;">${tierTag}</span></td>
            <td style="font-size:16px;color:#0e3e2e;font-weight:600;" align="right">${tierDuration}</td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
        <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#888;font-weight:600;">What's Included</p>
        <table role="presentation" cellpadding="0" cellspacing="0">${includesList}</table>
      </td></tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:4px 0 28px;">
        <a href="${programUrl}" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
          View Full Programme Details
        </a>
      </td></tr>
    </table>

    <!-- What Happens Next -->
    <h3 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0e3e2e;">What Happens Next</h3>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">1.</strong>&nbsp;&nbsp;Our team reviews your submission and prepares a tailored proposal.
      </td></tr>
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">2.</strong>&nbsp;&nbsp;We'll reach out within <strong>48 hours</strong> to discuss dates, customisation, and pricing.
      </td></tr>
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">3.</strong>&nbsp;&nbsp;Once approved, we handle all logistics so your school can focus on the students.
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

function isValidPayload(body: unknown): body is ProposalPayload {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>

  if (!isValidAnswers(b.answers)) return false

  const contact = b.contact as Record<string, unknown> | undefined
  if (!contact || typeof contact !== 'object') return false
  if (typeof contact.contactName !== 'string' || !contact.contactName.trim()) return false
  if (typeof contact.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return false
  if (typeof contact.schoolName !== 'string' || !contact.schoolName.trim()) return false
  if (typeof contact.role !== 'string') return false
  if (typeof contact.phone !== 'string' || contact.phone.replace(/\D/g, '').length < 7) return false
  if (typeof contact.website !== 'string') return false

  if (
    !withinLengthCaps([
      [contact.contactName, MAX_LENGTHS.name],
      [contact.email, MAX_LENGTHS.email],
      [contact.phone, MAX_LENGTHS.phone],
      [contact.schoolName, MAX_LENGTHS.schoolName],
      [contact.role, MAX_LENGTHS.role],
      [contact.website, MAX_LENGTHS.website],
    ])
  ) {
    return false
  }

  return true
}

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json().catch(() => null)
    // Honeypot — pretend to succeed so bots don't learn they were caught
    if (isHoneypotTripped(rawBody)) {
      return NextResponse.json({ success: true })
    }
    // Per-IP rate limit (fails open when Upstash isn't configured)
    const rate = await checkRateLimit(request, 'proposal')
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions. Please try again in a bit or email hello@campingnigeria.com.',
        },
        { status: 429 },
      )
    }
    if (!isValidPayload(rawBody)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }
    const body: ProposalPayload = rawBody
    const { contact } = body

    // Derive the recommendation server-side — never trust the client to tell
    // us what program/tier it was shown.
    const result = scoreAnswers(body.answers)

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ success: false, fallback: 'mailto' }, { status: 422 })
    }

    const mailResult = await sendPairedMail(resendKey, {
      from: 'Camping Nigeria <proposals@campingnigeria.com>',
      internal: {
        to: RECIPIENT,
        subject: `New School Proposal Request — ${contact.schoolName}`,
        html: buildInternalEmail(body, result),
        replyTo: contact.email,
      },
      customer: {
        to: contact.email,
        subject: `Your Programme Recommendation — ${result.program.title}`,
        html: buildCustomerEmail(body, result),
      },
    })

    if (mailResult.ok) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ success: false, fallback: 'mailto' }, { status: 422 })
  } catch (error) {
    console.error('Proposal API error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
