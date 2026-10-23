/**
 * Padi Check's words, verbatim from usl-build/6-landing-page-copy.md
 * (Surfaces 4 and 5). Do not rewrite them here: change the copy deck first.
 * House rules for this surface: no contractions, and never "invalid",
 * "denied", "secure" or "fraud".
 *
 * Two additions not in the deck, both agreed during the build: the
 * "Fast" / "Slow" badge (2026-10-23) and "Checking" on the button while a
 * check is in flight.
 */

export const LOGIN_COPY = {
  title: 'Padi Check',
  subtitle: 'MAD Settings · Gate',
  passwordLabel: 'Password',
  submit: 'Start checking in',
  wrongPassword: "That password did not work. Ask Toyosi for today's password.",
}

export const SCANNER_COPY = {
  wordmark: 'Padi Check',
  count: (checkedIn: number, total: number) => `${checkedIn} of ${total} in`,
  typeACode: 'Type a code',
  check: 'Check',
  checking: 'Checking',
  fast: 'Fast',
  slow: 'Slow',
}

export type ResultState = 'welcome' | 'already' | 'not-found' | 'not-paid' | 'offline' | 'camera-off'

export type ResultButton = 'call' | 'next' | 'retry'

export const BUTTON_COPY: Record<ResultButton, string> = {
  call: 'Call Toyosi',
  next: 'Next guest',
  retry: 'Try again',
}

export interface ResultSpec {
  /** Full-screen colour. White text on every one, AA at all sizes used. */
  colour: string
  word: string
  /** In screen order; the last one is the primary and takes focus. */
  buttons: ResultButton[]
}

export const RESULTS: Record<ResultState, ResultSpec> = {
  welcome: { colour: '#15803d', word: 'Welcome in', buttons: ['next'] },
  already: { colour: '#c2410c', word: 'Already checked in', buttons: ['call', 'next'] },
  'not-found': { colour: '#b91c1c', word: 'We cannot find this code', buttons: ['call', 'retry'] },
  'not-paid': { colour: '#b91c1c', word: 'Not marked as paid', buttons: ['call', 'next'] },
  offline: { colour: '#4b5563', word: 'Cannot reach the list', buttons: ['retry'] },
  'camera-off': { colour: '#0e3e2e', word: 'The camera is off', buttons: [] },
}

export const DETAIL_COPY = {
  tent: 'Tent',
  noTent: 'No tent',
  at: (time: string) => `at ${time}`,
  notFound: 'Check the code with the guest, or type it in',
  offline: 'Check your signal and try again',
  cameraOff: 'Allow the camera in your browser, or type the code below',
}
