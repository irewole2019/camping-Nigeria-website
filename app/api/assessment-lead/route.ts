import { NextResponse } from 'next/server'
import { CALENDAR_BOOKING_URL } from '@/lib/constants'
import { escapeHtml, isHoneypotTripped, MAX_LENGTHS, withinLengthCaps } from '@/lib/html'
import { checkRateLimit } from '@/lib/rate-limit'
import { sendPairedMail } from '@/lib/mail'
import {
  getRecommendedTier,
  isValidAnswerKey,
  type AnswerKey,
} from '@/lib/expedition-recommendation'

const RECIPIENT = 'hello@campingnigeria.com'
const FROM = 'Camping Nigeria <assessment@campingnigeria.com>'
const SITE_URL = 'https://campingnigeria.com'
const BOOKING_URL = CALENDAR_BOOKING_URL

interface AssessmentLeadPayload {
  name: string
  email: string
  school: string
  answers: {
    q1?: AnswerKey
    q2?: AnswerKey
    q3?: AnswerKey
    q4?: AnswerKey
  }
}

// ─── Answer labels ──────────────────────────────────────────────────────────

const Q1_LABELS: Record<string, string> = {
  A: 'Principal or teacher at a school',
  B: 'Parent whose child is doing the Award',
  C: 'Award Coordinator looking for a partner',
  D: 'Exploring options and not sure yet',
}

const Q2_LABELS: Record<string, string> = {
  A: 'Yes, already running the Award',
  B: 'Considering starting it',
  C: 'No, but run other outdoor or enrichment programs',
  D: 'Not sure',
}

const Q3_LABELS: Record<string, string> = {
  A: 'Under 30 students',
  B: '30 to 60 students',
  C: '60 to 100 students',
  D: 'More than 100 students',
}

const Q4_LABELS: Record<string, string> = {
  A: 'Equipment only — will run the program themselves',
  B: 'Equipment and facilitators — program run for them',
  C: 'Everything managed — end-to-end',
  D: 'Not sure yet — needs guidance',
}

const QUESTIONS = [
  { key: 'q1', label: 'Who are you planning this for?', labels: Q1_LABELS },
  { key: 'q2', label: 'Is your school running the Award?', labels: Q2_LABELS },
  { key: 'q3', label: 'Group size', labels: Q3_LABELS },
  { key: 'q4', label: 'Management level desired', labels: Q4_LABELS },
] as const

function formatAnswer(questionKey: string, letter: string | undefined): string {
  if (!letter) return 'Not answered'
  const q = QUESTIONS.find((q) => q.key === questionKey)
  if (!q) return letter
  return q.labels[letter] ?? letter
}

// ─── Internal notification (branded HTML) ───────────────────────────────────

function buildInternalEmail(payload: AssessmentLeadPayload, recommendedName: string): string {
  const { answers } = payload
  const name = escapeHtml(payload.name)
  const email = escapeHtml(payload.email)
  const school = escapeHtml(payload.school)
  const recommended = escapeHtml(recommendedName)
  const firstName = escapeHtml(payload.name.split(' ')[0])

  const responseRows = QUESTIONS.map(
    (q) =>
      `<tr>
        <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">${escapeHtml(q.label)}</td>
        <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${escapeHtml(formatAnswer(q.key, answers[q.key as keyof AssessmentLeadPayload['answers']]))}</td>
      </tr>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f3efe6;font-family:Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3efe6;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background-color:#0e3e2e;padding:24px 40px;border-radius:12px 12px 0 0;" align="center">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">New Expedition Assessment Lead</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#e6b325;text-transform:uppercase;letter-spacing:2px;">Duke of Edinburgh &middot; Camping Nigeria</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="background-color:#ffffff;padding:32px 40px;">

    <!-- Recommended tier -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="background-color:#0e3e2e;padding:16px 20px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Recommended Tier</p>
        <h2 style="margin:4px 0 0;font-size:22px;font-weight:700;color:#ffffff;">${recommended}</h2>
      </td></tr>
    </table>

    <!-- School Details -->
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">School Details</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">School</td>
        <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${school}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">Name</td>
        <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;">${name}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-size:13px;font-weight:600;color:#0e3e2e;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">Email</td>
        <td style="padding:8px 12px;font-size:13px;color:#3d3d3d;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email}" style="color:#0e3e2e;text-decoration:none;font-weight:600;">${email}</a></td>
      </tr>
    </table>

    <!-- Assessment Responses -->
    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:600;">Assessment Responses</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fafaf8;border-radius:8px;overflow:hidden;">
      ${responseRows}
    </table>

    <!-- Quick Action -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:4px 0;">
          <a href="mailto:${email}?subject=Re: Your Duke of Edinburgh expedition enquiry" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;">
            Reply to ${firstName}
          </a>
        </td>
      </tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background-color:#0e3e2e;padding:16px 40px;border-radius:0 0 12px 12px;" align="center">
    <p style="margin:0;font-size:11px;color:#ffffff50;">
      Sent from campingnigeria.com expedition assessment &middot; ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Customer confirmation (branded HTML) ───────────────────────────────────

function buildCustomerEmail(payload: AssessmentLeadPayload, recommendedName: string): string {
  const firstName = escapeHtml(payload.name.split(' ')[0])
  const school = escapeHtml(payload.school)
  const recommended = escapeHtml(recommendedName)

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
      Thank you for completing the Duke of Edinburgh expedition assessment. Based on your answers, we&#39;ve prepared a recommendation tailored to <strong>${school}</strong>.
    </p>

    <!-- Recommendation Card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #e6b325;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="background-color:#0e3e2e;padding:20px 24px;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e6b325;font-weight:600;">Your Recommended Setup</p>
        <h2 style="margin:6px 0 0;font-size:28px;font-weight:700;color:#ffffff;">${recommended}</h2>
      </td></tr>
      <tr><td style="padding:20px 24px;">
        <p style="margin:0;font-size:14px;color:#3d3d3d;line-height:1.7;">
          This package fits schools with your profile best. Our team will reach out within <strong>24 hours</strong> to walk you through the details and next steps for your expedition.
        </p>
      </td></tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:4px 0 28px;">
        <a href="${BOOKING_URL}" style="display:inline-block;background-color:#e6b325;color:#0e3e2e;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">
          Book a Call With Our Team
        </a>
      </td></tr>
    </table>

    <!-- What Happens Next -->
    <h3 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#0e3e2e;">What Happens Next</h3>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">1.</strong>&nbsp;&nbsp;Our team reviews your responses and prepares a tailored proposal.
      </td></tr>
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">2.</strong>&nbsp;&nbsp;We&#39;ll reach out within <strong>24 hours</strong> to discuss dates, group size, and logistics.
      </td></tr>
      <tr><td style="padding:6px 0;font-size:14px;line-height:1.6;color:#555;">
        <strong style="color:#0e3e2e;">3.</strong>&nbsp;&nbsp;Once approved, we handle the outdoor delivery so your school can focus on the Award.
      </td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
      Need a faster response? Reach us on WhatsApp at
      <a href="https://wa.me/2347040538528" style="color:#0e3e2e;font-weight:600;text-decoration:none;">+234 704 053 8528</a>
      or email <a href="mailto:hello@campingnigeria.com" style="color:#0e3e2e;font-weight:600;text-decoration:none;">hello@campingnigeria.com</a>.
    </p>
    <p style="margin:16px 0 0;font-size:13px;color:#888;line-height:1.6;">
      — The Camping Nigeria Schools Team
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

// ─── Route handler ──────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json().catch(() => null)
    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    // Honeypot — pretend to succeed so bots don't learn they were caught
    if (isHoneypotTripped(raw)) {
      return NextResponse.json({ success: true })
    }
    // Per-IP rate limit (fails open when Upstash isn't configured)
    const rate = await checkRateLimit(request, 'assessment-lead')
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: 'Too many submissions. Please try again in a bit or email hello@campingnigeria.com.',
        },
        { status: 429 },
      )
    }
    const r = raw as Record<string, unknown>
    if (
      typeof r.name !== 'string' ||
      typeof r.email !== 'string' ||
      typeof r.school !== 'string' ||
      !r.answers ||
      typeof r.answers !== 'object'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Every answer key must be A/B/C/D (or absent). Rejects fabricated values.
    const rawAnswers = r.answers as Record<string, unknown>
    const answers: AssessmentLeadPayload['answers'] = {}
    for (const key of ['q1', 'q2', 'q3', 'q4'] as const) {
      const v = rawAnswers[key]
      if (v === undefined) continue
      if (!isValidAnswerKey(v)) {
        return NextResponse.json({ error: 'Invalid answer value' }, { status: 400 })
      }
      answers[key] = v
    }

    const body: AssessmentLeadPayload = {
      name: r.name,
      email: r.email,
      school: r.school,
      answers,
    }

    if (!body.name.trim() || !body.school.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (
      !withinLengthCaps([
        [body.name, MAX_LENGTHS.name],
        [body.email, MAX_LENGTHS.email],
        [body.school, MAX_LENGTHS.schoolName],
      ])
    ) {
      return NextResponse.json({ error: 'Field too long' }, { status: 400 })
    }

    // Derive the recommendation server-side — never trust the client to tell
    // us which tier it was shown.
    const tier = getRecommendedTier(answers.q2, answers.q3, answers.q4)
    const recommended = tier.name

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    const mailResult = await sendPairedMail(resendKey, {
      from: FROM,
      internal: {
        to: RECIPIENT,
        subject: `New Expedition Assessment Lead — ${body.name} from ${body.school}`,
        html: buildInternalEmail(body, recommended),
        replyTo: body.email,
      },
      customer: {
        to: body.email,
        subject: 'Your Camping Nigeria Expedition Recommendation',
        html: buildCustomerEmail(body, recommended),
      },
    })

    if (mailResult.ok) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Email delivery failed' }, { status: 500 })
  } catch (error) {
    console.error('Assessment lead API error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
