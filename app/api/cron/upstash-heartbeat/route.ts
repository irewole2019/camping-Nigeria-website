import { NextResponse } from 'next/server'
import { escapeHtml } from '@/lib/html'
import { sendSingleMail } from '@/lib/mail'
import { getRedis } from '@/lib/redis'

export const dynamic = 'force-dynamic'

const RECIPIENT = 'hello@campingnigeria.com'
const FROM = 'Camping Nigeria <hello@campingnigeria.com>'

/**
 * Daily Upstash check, run by Vercel Cron (vercel.json), production only.
 *
 * Two jobs. The write counts as activity, so Upstash never archives the free
 * database for 30 days of disuse — which is how the previous one died, in
 * about August 2026, unnoticed for a month. And if Upstash does not answer,
 * the team gets an email: a dead Upstash fails quietly (the forms lose their
 * spam protection and Padi Check falls back to the slow sheet), so silence is
 * not evidence that it is fine.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET`. Without CRON_SECRET set
 * the route refuses everyone, so it cannot be used to burn the free quota.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let problem: string | null = null
  const redis = getRedis()
  if (!redis) {
    problem = 'UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set in Vercel.'
  } else {
    try {
      await redis.set('camping-ng:heartbeat', new Date().toISOString())
    } catch (err) {
      problem = `Upstash did not answer: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  if (!problem) return NextResponse.json({ ok: true })

  console.error(`[heartbeat] ${problem}`)
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    await sendSingleMail(resendKey, {
      from: FROM,
      to: [RECIPIENT],
      subject: 'Website alert: Upstash is not answering',
      html: `<p>The website's daily check could not reach Upstash.</p>
<p><strong>${escapeHtml(problem)}</strong></p>
<p>Until this is fixed, the website's forms have no spam protection, and Padi Check answers every scan from the Google Sheet, which takes several seconds.</p>
<p>Open <a href="https://console.upstash.com/redis">console.upstash.com</a>: if the database is archived or missing, make a new one and put its REST URL and token into Vercel (Settings, Environment Variables), then redeploy.</p>`,
    })
  }
  return NextResponse.json({ ok: false, error: problem }, { status: 503 })
}
