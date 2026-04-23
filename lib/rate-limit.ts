import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Per-IP rate limiter for form-submission routes.
 *
 * Behaviour when `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are
 * missing:
 *   - Production: **fail closed**. The route returns 429 so we don't silently
 *     drop bot protection to honeypot-only if a deploy misses its env vars.
 *     A loud one-shot error is logged on first miss.
 *   - Development (NODE_ENV !== 'production'): fail open, allow everything.
 *     Local devs don't need an Upstash account.
 *
 * Behaviour when Upstash is reachable but the limit() call throws (transient
 * network error, Upstash outage): fail open in both envs — we'd rather let a
 * few requests through than 500 a legitimate user.
 *
 * Default budget: 5 submissions / IP / hour per route. Tuned for real humans
 * filling in forms; generous enough for a family submitting a few enquiries,
 * tight enough that a bot drains quota quickly.
 */

const WINDOW_SECONDS = 60 * 60 // 1 hour
const MAX_REQUESTS = 5

let cachedLimiter: Ratelimit | null = null
let missLoggedOnce = false

function getLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  if (cachedLimiter) return cachedLimiter

  const redis = new Redis({ url, token })
  cachedLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_SECONDS} s`),
    analytics: false,
    prefix: 'camping-ng:form',
  })
  return cachedLimiter
}

/**
 * Extracts the best-available client IP from a Request. Vercel / most CDNs
 * set `x-forwarded-for`; fall back to `x-real-ip`. Returns null when neither
 * header is present (local curl, weird proxies) so the caller can decide
 * whether to fail open or closed.
 */
export function getClientIp(request: Request): string | null {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    // XFF can be "client, proxy1, proxy2" — the client is the first entry
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const real = request.headers.get('x-real-ip')
  if (real) return real.trim()
  return null
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset: number
}

/**
 * Check whether the given IP is over its per-route budget. `routeKey` is a
 * short string like `contact` or `gear-quote` — each route has its own
 * independent budget, so a user submitting a gear quote doesn't exhaust
 * their contact-form budget.
 */
export async function checkRateLimit(
  request: Request,
  routeKey: string,
): Promise<RateLimitResult> {
  const limiter = getLimiter()

  if (!limiter) {
    // Env vars missing. In production this is a misconfiguration — fail closed.
    if (process.env.NODE_ENV === 'production') {
      if (!missLoggedOnce) {
        console.error(
          '[rate-limit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set in production. Rate limiting is disabled; returning 429 for all requests until this is fixed.',
        )
        missLoggedOnce = true
      }
      return { allowed: false, remaining: 0, reset: 0 }
    }
    // Dev: allow everything so local work isn't blocked.
    return { allowed: true, remaining: MAX_REQUESTS, reset: 0 }
  }

  const ip = getClientIp(request)
  if (!ip) {
    // Can't identify the client — fail open (same reasoning as before: better
    // a few unprotected requests than blocking legit traffic with no IP).
    return { allowed: true, remaining: MAX_REQUESTS, reset: 0 }
  }

  try {
    const { success, remaining, reset } = await limiter.limit(`${routeKey}:${ip}`)
    return { allowed: success, remaining, reset }
  } catch (err) {
    // Upstash transient failure — fail open. Logged so it shows up in monitoring.
    console.error('[rate-limit] limiter.limit() threw; allowing request:', err)
    return { allowed: true, remaining: MAX_REQUESTS, reset: 0 }
  }
}
