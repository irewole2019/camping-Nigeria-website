'use client'

import type { Ref } from 'react'

/**
 * Off-screen honeypot field. Real users never see or tab into it; drive-by bots
 * autofill anything named `website`/`url`/`confirm`, so a non-empty value is a
 * strong signal the submit came from a scraper.
 *
 * The wrapper uses absolute positioning (not `display:none`) because some bots
 * skip hidden fields entirely. `tabIndex={-1}` + `autoComplete="off"` keep
 * keyboard users and password managers out of it.
 *
 * Server-side: check `body.website_confirm` with `isHoneypotTripped()` and
 * return fake success so the bot thinks it worked.
 */
export default function Honeypot({ ref }: { ref?: Ref<HTMLInputElement> }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
      <label htmlFor="website_confirm">Leave this field empty</label>
      <input
        ref={ref}
        id="website_confirm"
        name="website_confirm"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  )
}
