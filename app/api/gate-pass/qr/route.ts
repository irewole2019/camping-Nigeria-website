import { isValidSignupCode } from '@/lib/events/mad-settings-records'
import { gatePassFields, gatePassPng, verifyGatePass } from '@/lib/gate-pass/qr'

/**
 * GET ?c=MAD-XXXXXX&n=Name&t=Ticket&s=signature → the Gate pass as a 480px
 * PNG, for the confirmation email (R-007). Anything unsigned, altered, or not
 * shaped like a MAD code is a plain 404, so the route cannot be used to draw
 * QRs for codes the site never issued. The image never changes for a given
 * URL, so it is cached for a year.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const code = q.get('c') ?? ''
  if (!isValidSignupCode(code)) return new Response('Not found', { status: 404 })

  const fields = gatePassFields(code, q.get('n') ?? '', q.get('t') ?? '')
  if (!verifyGatePass(fields, q.get('s'), process.env.GATE_PASS_SECRET)) {
    return new Response('Not found', { status: 404 })
  }

  const png = await gatePassPng(fields)
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
