import Link from 'next/link'
import type { ReactNode } from 'react'
import { BatteryFull, ChevronLeft, Gauge, LifeBuoy, Palette, Phone, ScanLine, ShieldCheck, Users } from 'lucide-react'
import PadiLogo from '@/components/padi-check/PadiLogo'
import StatusPill from '@/components/padi-check/StatusPill'
import { TRIBES } from '@/lib/events/mad-settings-tribes'
import { GUIDE_COPY, RESULTS } from '@/lib/padi-check/copy'

export const metadata = { title: 'How to use Padi Check' }

/**
 * The volunteer's how-to, /padi-check/guide (2026-10-26): the Gate card in
 * more words, readable at home before the night. No sign-in and nothing
 * private on it, so no phone numbers. noindex and no analytics, like every
 * /padi-check route.
 */

function Section({ icon, heading, children }: { icon: ReactNode; heading: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-3 font-sans text-xl font-bold text-brand-dark">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark-tint" aria-hidden="true">
          {icon}
        </span>
        {heading}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Steps({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={s} className="flex gap-3 font-sans text-[17px] leading-snug text-brand-dark">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-dark text-sm font-bold text-white" aria-hidden="true">
            {i + 1}
          </span>
          <span className="pt-0.5">{s}</span>
        </li>
      ))}
    </ol>
  )
}

export default function PadiCheckGuidePage() {
  const g = GUIDE_COPY
  return (
    <main id="main-content" className="min-h-dvh bg-brand-light pb-12 font-sans text-brand-dark">
      <div className="mx-auto w-full max-w-[480px] px-5 pt-4">
        <Link
          href="/padi-check"
          className="-ml-2 inline-flex h-11 items-center gap-1 rounded-full pr-3 text-base font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          {g.back}
        </Link>

        <header className="mt-4 flex items-center gap-3">
          <PadiLogo className="h-12 w-auto" />
          <h1 className="text-[1.9rem] font-bold leading-tight">{g.title}</h1>
        </header>
        <p className="mt-3 text-lg text-brand-dark/80">{g.intro}</p>

        <div className="mt-6 space-y-4">
          <Section icon={<BatteryFull className="h-5 w-5" />} heading={g.before.heading}>
            <Steps steps={g.before.steps} />
          </Section>

          <Section icon={<ScanLine className="h-5 w-5" />} heading={g.checkIn.heading}>
            <Steps steps={g.checkIn.steps} />
            <p className="mt-4 rounded-2xl bg-brand-accent-tint px-4 py-3 text-[17px] leading-snug">
              <strong>{g.checkIn.noQr.lead}</strong> {g.checkIn.noQr.text}
            </p>
          </Section>

          <Section icon={<Palette className="h-5 w-5" />} heading={g.colours.heading}>
            <ul className="space-y-3">
              {g.colours.rows.map((row) => {
                const r = RESULTS[row.state]
                return (
                  <li
                    key={row.state}
                    className="rounded-2xl px-4 py-3.5 text-white"
                    style={{ backgroundImage: `linear-gradient(to bottom, ${r.from}, ${r.to})` }}
                  >
                    <p className="text-xl font-bold leading-tight">{r.word}</p>
                    <p className="mt-1 text-base leading-snug">{row.todo}</p>
                  </li>
                )
              })}
            </ul>
            <p className="mt-4 flex gap-3 text-[17px] leading-snug">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 fill-current" aria-hidden="true" />
              {g.colours.callToyosi}
            </p>
          </Section>

          <Section icon={<Users className="h-5 w-5" />} heading={g.tribes.heading}>
            <p className="text-[17px] leading-snug">{g.tribes.text}</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {TRIBES.map((t) => (
                <li key={t.id} className="flex items-center gap-2 rounded-xl border border-brand-dark/10 px-3 py-2 text-base font-semibold">
                  <span className="h-6 w-6 shrink-0 rounded-full border-2 border-brand-dark/20" style={{ backgroundColor: t.colour }} aria-hidden="true" />
                  {t.name}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={<Gauge className="h-5 w-5" />} heading={g.topBar.heading}>
            <div className="space-y-3 text-[17px] leading-snug">
              <p className="flex flex-wrap items-center gap-2">
                <StatusPill counts={{ checkedIn: 12, total: 80 }} fast={null} tone="light" />
                <span>{g.topBar.count}</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <StatusPill counts={null} fast={true} tone="light" />
                <span>{g.topBar.fast}</span>
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <StatusPill counts={null} fast={false} tone="light" />
                <span>{g.topBar.slow}</span>
              </p>
            </div>
          </Section>

          <Section icon={<LifeBuoy className="h-5 w-5" />} heading={g.problems.heading}>
            <ul className="space-y-3">
              {g.problems.rows.map((p) => (
                <li key={p.lead} className="text-[17px] leading-snug">
                  <strong>{p.lead}</strong> {p.text}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={<ShieldCheck className="h-5 w-5" />} heading={g.privacy.heading}>
            <p className="text-[17px] leading-snug">{g.privacy.text}</p>
          </Section>
        </div>

        <Link
          href="/padi-check"
          className="mt-8 flex h-16 w-full items-center justify-center rounded-full bg-brand-dark text-xl font-bold text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50"
        >
          {g.back}
        </Link>
      </div>
    </main>
  )
}
