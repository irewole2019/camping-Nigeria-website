/**
 * Resend transport + internal-plus-customer email orchestration.
 * All 4 form routes use this — each route only needs to build its HTML
 * bodies and hand them here with subjects and the recipient email.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

/** Strip CRLF from header values — prevents header injection in email subjects. */
export function safeHeader(s: string): string {
  return s.replace(/[\r\n]/g, ' ').trim()
}

/**
 * A file sent with the email. With `content_id`, the HTML can show it inline
 * as `<img src="cid:...">` (Resend's inline images), which is how the Gate pass
 * QR travels: no hosted URL for the mail client to fetch or block.
 */
export interface MailAttachment {
  filename: string
  /** Base64. */
  content: string
  content_id?: string
}

interface SendOne {
  from: string
  to: string[]
  subject: string
  html: string
  replyTo?: string
  attachments?: MailAttachment[]
}

async function sendOne(resendKey: string, args: SendOne): Promise<Response> {
  return fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: args.from,
      to: args.to,
      reply_to: args.replyTo,
      subject: safeHeader(args.subject),
      html: args.html,
      ...(args.attachments?.length ? { attachments: args.attachments } : {}),
    }),
  })
}

/** One email, for internal alerts that have no customer half. True if Resend accepted it. */
export async function sendSingleMail(resendKey: string, args: SendOne): Promise<boolean> {
  try {
    return (await sendOne(resendKey, args)).ok
  } catch {
    return false
  }
}

export interface PairedMailPayload {
  from: string
  internal: {
    to: string
    subject: string
    html: string
    /** Usually the customer's email so Reply goes straight to them */
    replyTo?: string
  }
  customer: {
    to: string
    subject: string
    html: string
    attachments?: MailAttachment[]
  }
}

export interface PairedMailResult {
  ok: boolean
  /** Internal email status — never fail the whole submit if only the customer confirmation fails */
  internalOk: boolean
  customerOk: boolean
}

/**
 * Sends the branded internal notification + customer confirmation in parallel.
 *
 * Success semantics: if the internal email lands, we consider the submit a
 * success (the team has the lead). The customer confirmation is nice-to-have
 * but not load-bearing. Both failures → overall failure.
 *
 * Returns `null` when `RESEND_API_KEY` is missing — callers should treat this
 * as "fall back to mailto".
 */
export async function sendPairedMail(
  resendKey: string,
  payload: PairedMailPayload,
): Promise<PairedMailResult> {
  const [internalRes, customerRes] = await Promise.all([
    sendOne(resendKey, {
      from: payload.from,
      to: [payload.internal.to],
      subject: payload.internal.subject,
      html: payload.internal.html,
      replyTo: payload.internal.replyTo,
    }),
    sendOne(resendKey, {
      from: payload.from,
      to: [payload.customer.to],
      subject: payload.customer.subject,
      html: payload.customer.html,
      attachments: payload.customer.attachments,
    }),
  ])

  if (!internalRes.ok) {
    console.error('Internal email failed:', await internalRes.text())
  }
  if (!customerRes.ok) {
    console.error('Customer email failed:', await customerRes.text())
  }

  return {
    ok: internalRes.ok, // internal success is what matters
    internalOk: internalRes.ok,
    customerOk: customerRes.ok,
  }
}
