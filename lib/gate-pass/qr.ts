import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import QRCode from 'qrcode'

/**
 * The Gate pass: a guest's QR (usl-build/7-prd.md, R-007).
 *
 * The QR holds `MAD-XXXXXX|Full Name|Ticket label`. Only the code matters to
 * the gate, which checks it against the sheet; the name and ticket are there
 * so a stock phone camera shows something readable. Nothing in the QR is
 * trusted.
 *
 * The email cannot carry an inline QR (mail clients strip SVG and data URIs),
 * so it links to `/api/gate-pass/qr`. That URL is signed with GATE_PASS_SECRET
 * so the site will not draw a QR for a code and name it was never given.
 */

export const NAME_MAX = 80

/** Pipes and line breaks would break the `a|b|c` shape, so they become spaces. */
function clean(s: string): string {
  return s.replace(/[|\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export interface GatePassFields {
  code: string
  name: string
  ticket: string
}

/** The three fields exactly as they are signed and encoded: cleaned, name capped. */
export function gatePassFields(code: string, name: string, ticket: string): GatePassFields {
  return { code: code.trim(), name: clean(name).slice(0, NAME_MAX), ticket: clean(ticket) }
}

export function gatePassText(f: GatePassFields): string {
  return `${f.code}|${f.name}|${f.ticket}`
}

export function signGatePass(f: GatePassFields, secret: string): string {
  return createHmac('sha256', secret).update(gatePassText(f)).digest('base64url')
}

/** Constant time, and false for a missing secret or signature. */
export function verifyGatePass(f: GatePassFields, signature: string | null | undefined, secret: string | undefined): boolean {
  if (!secret || !signature) return false
  const a = createHash('sha256').update(signature).digest()
  const b = createHash('sha256').update(signGatePass(f, secret)).digest()
  return timingSafeEqual(a, b)
}

/** The signed image URL for the confirmation email. */
export function gatePassImageUrl(siteUrl: string, f: GatePassFields, secret: string): string {
  const q = new URLSearchParams({ c: f.code, n: f.name, t: f.ticket, s: signGatePass(f, secret) })
  return `${siteUrl}/api/gate-pass/qr?${q.toString()}`
}

// A four-module white border (the QR "quiet zone") and medium error
// correction: readable from a phone screen held up at arm's length.
const QR_OPTIONS = { margin: 4, errorCorrectionLevel: 'M' as const, color: { dark: '#000000', light: '#ffffff' } }

/** Inline SVG for the confirmation page, drawn at `size` pixels. */
export function gatePassSvg(f: GatePassFields, size = 240): Promise<string> {
  return QRCode.toString(gatePassText(f), { ...QR_OPTIONS, type: 'svg', width: size })
}

/** 480px PNG for email. */
export function gatePassPng(f: GatePassFields): Promise<Buffer> {
  return QRCode.toBuffer(gatePassText(f), { ...QR_OPTIONS, type: 'png', width: 480 })
}
