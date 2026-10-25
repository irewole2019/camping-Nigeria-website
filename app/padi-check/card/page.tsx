import { Phone } from 'lucide-react'
import PadiLogin from '@/components/padi-check/PadiLogin'
import PadiLogo from '@/components/padi-check/PadiLogo'
import PrintButton from '@/components/padi-check/PrintButton'
import { getPageSession } from '@/lib/padi-check/auth'
import { CARD_COPY, RESULTS } from '@/lib/padi-check/copy'
import { formatPhoneForPrint } from '@/lib/padi-check/roster'
import { hasRole } from '@/lib/padi-check/session'

export const dynamic = 'force-dynamic'

/**
 * The Gate card (R-010): what each colour means and who to call, printed on
 * A5 for the volunteer's pocket. Admin only; a volunteer session sees the
 * admin sign-in. The Toyosi number comes from PADI_CHECK_CALL_PHONE and is
 * only ever rendered for an admin.
 */
export default async function GateCardPage() {
  if (!hasRole(await getPageSession(), 'admin')) return <PadiLogin role="admin" />
  const phone = formatPhoneForPrint(process.env.PADI_CHECK_CALL_PHONE)

  return (
    <main id="main-content" className="min-h-dvh bg-brand-light py-8 print:bg-white print:py-0">
      <style>{`@page { size: A5 portrait; margin: 8mm; }
@media print { html, body { background: #fff !important; } * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
      <div className="mx-auto max-w-[560px] px-5 print:max-w-none print:px-0">
        <div className="mb-4 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <article className="rounded-3xl bg-white p-6 font-sans text-brand-dark shadow-lg print:rounded-none print:p-0 print:shadow-none">
          <header className="flex items-center gap-3">
            <PadiLogo className="h-10 w-auto" />
            <h1 className="text-2xl font-bold">{CARD_COPY.title}</h1>
          </header>

          <ul className="mt-5 space-y-2.5">
            {CARD_COPY.rows.map((row) => (
              <li
                key={row.tone}
                className="rounded-2xl px-4 py-3 text-[17px] leading-snug text-white"
                style={{ backgroundImage: `linear-gradient(to right, ${RESULTS[row.tone].from}, ${RESULTS[row.tone].to})` }}
              >
                <strong className="font-bold">{row.lead}</strong> {row.text}
              </li>
            ))}
            <li className="rounded-2xl border-2 border-brand-dark/15 px-4 py-3 text-[17px] leading-snug">
              <strong className="font-bold">{CARD_COPY.camera.lead}</strong> {CARD_COPY.camera.text}
            </li>
          </ul>

          <p className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-dark px-4 py-4 text-white">
            <Phone className="h-6 w-6 shrink-0 fill-current" aria-hidden="true" />
            <span className="text-lg font-semibold">{CARD_COPY.toyosi}</span>
            <span className="text-2xl font-bold tracking-wide">{phone}</span>
          </p>

          <p className="mt-5 border-t border-brand-dark/15 pt-4 text-[16px] leading-snug">
            <strong className="font-bold">{CARD_COPY.never.lead}</strong> {CARD_COPY.never.text}
          </p>
        </article>
      </div>
    </main>
  )
}
