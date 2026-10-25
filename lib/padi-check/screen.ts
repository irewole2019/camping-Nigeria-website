import { DETAIL_COPY, type ResultState } from './copy'
import { formatArrivalTime } from './extract-code'

/** What the check API sends back (see app/api/padi-check/check/route.ts). */
export interface CheckReply {
  status?: unknown
  name?: unknown
  ticket?: unknown
  usesTent?: unknown
  checkedInAt?: unknown
  checkedIn?: unknown
  total?: unknown
}

/**
 * What a result screen shows: name, ticket, Tent or No tent, a time, or the
 * code that was not found. Nothing else, whatever the reply carries.
 */
export interface ScreenContent {
  state: ResultState
  name?: string
  ticket?: string
  tent?: string
  time?: string
  code?: string
  detail?: string
}

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined)

/** Anything unrecognised is shown as offline rather than guessed at. */
export function toScreen(reply: CheckReply | null, code: string): ScreenContent {
  const name = str(reply?.name)
  switch (reply?.status) {
    case 'welcome':
      return {
        state: 'welcome',
        name,
        ticket: str(reply.ticket),
        tent: reply.usesTent === true ? DETAIL_COPY.tent : DETAIL_COPY.noTent,
        time: formatArrivalTime(str(reply.checkedInAt)) || undefined,
      }
    case 'already':
      return { state: 'already', name, time: formatArrivalTime(str(reply.checkedInAt)) || undefined }
    case 'not-found':
      return { state: 'not-found', code, detail: DETAIL_COPY.notFound }
    case 'not-paid':
      return { state: 'not-paid', name, detail: DETAIL_COPY.notPaid }
    default:
      return { state: 'offline', detail: DETAIL_COPY.offline }
  }
}

/** "Ada Obi" → "AO"; one letter for one word; empty for no name. */
export function initials(name: string | undefined): string {
  return (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

/** The live count from a reply, if it carries one. */
export function countsFrom(reply: CheckReply | null): { checkedIn: number; total: number } | null {
  const ok = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0
  return reply && ok(reply.checkedIn) && ok(reply.total)
    ? { checkedIn: reply.checkedIn, total: reply.total }
    : null
}
