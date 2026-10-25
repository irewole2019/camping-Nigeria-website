'use client'

import { Printer } from 'lucide-react'
import { ADMIN_COPY } from '@/lib/padi-check/copy'

/** On screen only; never on the printed page. */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-dark px-6 font-sans text-base font-semibold text-white shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50 print:hidden"
    >
      <Printer className="h-5 w-5" aria-hidden="true" />
      {ADMIN_COPY.print}
    </button>
  )
}
