import type { ReactNode } from 'react'

/**
 * The page frame. Since the redesign (2026-10-25) every screen draws its own
 * top row (title or back arrow, and the status pill), so this is only the
 * full-height background and the main landmark.
 */
export default function PadiCheckShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-brand-light">
      <main id="main-content">{children}</main>
    </div>
  )
}
