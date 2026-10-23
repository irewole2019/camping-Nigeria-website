import PadiCheckApp from '@/components/padi-check/PadiCheckApp'
import PadiLogin from '@/components/padi-check/PadiLogin'
import { callHref, getPageSession } from '@/lib/padi-check/auth'

export const dynamic = 'force-dynamic'

/**
 * /padi-check: the sign-in screen, or the scanner once signed in. The Call
 * Toyosi number is only ever put into the page for a signed-in session.
 */
export default async function PadiCheckPage() {
  const session = await getPageSession()
  if (!session) return <PadiLogin />
  return <PadiCheckApp callHref={callHref()} />
}
