import PadiLogin from '@/components/padi-check/PadiLogin'
import PadiLogo from '@/components/padi-check/PadiLogo'
import PrintButton from '@/components/padi-check/PrintButton'
import { EVENT_DATE_LABEL, EVENT_FULL_TITLE } from '@/lib/events/mad-settings'
import { getPageSession } from '@/lib/padi-check/auth'
import { DETAIL_COPY, LIST_COPY, RESULTS } from '@/lib/padi-check/copy'
import { lagosStamp, toPrintedList } from '@/lib/padi-check/roster'
import { hasRole } from '@/lib/padi-check/session'
import { sheet } from '@/lib/padi-check/sheet'

export const dynamic = 'force-dynamic'

/**
 * The printed guest list (R-011): the backup when phones fail, so "your name
 * still gets you in". Paid guests only, sorted by name; name, code, ticket,
 * tent and tribe, plus an empty box to tick by hand. Never email or phone.
 * Admin only; a volunteer session sees the admin sign-in.
 */
export default async function GuestListPage() {
  if (!hasRole(await getPageSession(), 'admin')) return <PadiLogin role="admin" />

  const roster = await sheet.roster()
  const guests = roster ? toPrintedList(roster) : null
  const c = LIST_COPY.columns

  return (
    <main id="main-content" className="min-h-dvh bg-brand-light py-8 font-sans text-brand-dark print:bg-white print:py-0">
      <style>{`@page { size: A4 portrait; margin: 12mm; }
@media print { html, body { background: #fff !important; } }`}</style>
      <div className="mx-auto max-w-[760px] px-5 print:max-w-none print:px-0">
        <div className="mb-4 flex justify-end print:hidden">{guests && <PrintButton />}</div>

        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <PadiLogo className="h-10 w-auto" />
            <div>
              <h1 className="text-2xl font-bold">{LIST_COPY.title}</h1>
              <p className="text-base">
                {EVENT_FULL_TITLE} · {EVENT_DATE_LABEL}
              </p>
            </div>
          </div>
          <div className="text-right text-sm">
            {guests && <p className="font-semibold">{LIST_COPY.count(guests.length)}</p>}
            <p>{LIST_COPY.printed(lagosStamp())}</p>
          </div>
        </header>

        {!guests ? (
          <p className="mt-8 rounded-2xl px-5 py-4 text-lg text-white" style={{ backgroundColor: RESULTS.offline.from }}>
            <strong>{RESULTS.offline.word}.</strong> {DETAIL_COPY.offline}
          </p>
        ) : guests.length === 0 ? (
          <p className="mt-8 text-lg">{LIST_COPY.empty}</p>
        ) : (
          <table className="mt-6 w-full border-collapse bg-white text-left text-[15px] print:text-[11pt]">
            <thead>
              <tr className="border-b-2 border-brand-dark">
                <th className="px-2 py-2">{c.name}</th>
                <th className="px-2 py-2">{c.code}</th>
                <th className="px-2 py-2">{c.ticket}</th>
                <th className="px-2 py-2">{c.tent}</th>
                <th className="px-2 py-2">{c.tribe}</th>
                <th className="w-12 px-2 py-2 text-center">{c.in}</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g.code} className="border-b border-brand-dark/15 break-inside-avoid">
                  <td className="px-2 py-2 font-semibold">{g.name}</td>
                  <td className="whitespace-nowrap px-2 py-2 tracking-wide">{g.code}</td>
                  <td className="px-2 py-2">{g.ticket}</td>
                  <td className="whitespace-nowrap px-2 py-2">{g.tent}</td>
                  <td className="whitespace-nowrap px-2 py-2 font-semibold">{g.tribe}</td>
                  <td className="px-2 py-2 text-center">
                    <span className="inline-block h-5 w-5 border-2 border-brand-dark/60" aria-hidden="true" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
