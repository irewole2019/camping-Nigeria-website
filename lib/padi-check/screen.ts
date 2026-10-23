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

export interface ScreenContent {
  state: ResultState
  name?: string
  detail?: string
}

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined)

/**
 * The result screen for a reply, per the Surface 5 table: name, ticket,
 * Tent or No tent, and a time; nothing else, whatever the reply carries.
 * Anything unrecognised is shown as offline rather than guessed at.
 */
export function toScreen(reply: CheckReply | null, code: string): ScreenContent {
  const name = str(reply?.name)
  switch (reply?.status) {
    case 'welcome': {
      const tent = reply.usesTent === true ? DETAIL_COPY.tent : DETAIL_COPY.noTent
      return { state: 'welcome', name, detail: [str(reply.ticket), tent].filter(Boolean).join(' · ') }
    }
    case 'already': {
      const time = formatArrivalTime(str(reply.checkedInAt))
      return { state: 'already', name, detail: time ? DETAIL_COPY.at(time) : undefined }
    }
    case 'not-found':
      return { state: 'not-found', name: code, detail: DETAIL_COPY.notFound }
    case 'not-paid':
      return { state: 'not-paid', name }
    default:
      return { state: 'offline', detail: DETAIL_COPY.offline }
  }
}

/** The live count from a reply, if it carries one. */
export function countsFrom(reply: CheckReply | null): { checkedIn: number; total: number } | null {
  const ok = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0
  return reply && ok(reply.checkedIn) && ok(reply.total)
    ? { checkedIn: reply.checkedIn, total: reply.total }
    : null
}
