/**
 * Padi Check's words. Since the founder's redesign (2026-10-25) these follow
 * the founder's screen designs, recorded in usl-build/6-landing-page-copy.md
 * (Surfaces 4 and 5); change that deck and this file together.
 *
 * House rules for this surface still hold: no contractions, and never
 * "invalid", "denied", "secure" or "fraud" (the design's "Secure check-ins"
 * tagline was dropped for that reason).
 */

export const LOGIN_COPY = {
  wordmarkBold: 'Padi',
  wordmarkLight: 'Check',
  tagline: 'Fast. Simple. Check-ins for your events.',
  passwordLabel: 'Password',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  submit: 'Start checking in',
  wrongPassword: "That password did not work. Ask Toyosi for today's password.",
  volunteerOnly: 'Volunteer access only',
}

export const SCANNER_COPY = {
  wordmark: 'Padi Check',
  /** Visible count, as drawn: "4 of 80". */
  count: (checkedIn: number, total: number) => `${checkedIn} of ${total}`,
  /** The same count for screen readers. */
  countLabel: (checkedIn: number, total: number) => `${checkedIn} of ${total} checked in`,
  pointAtPass: 'Point at the gate pass',
  or: 'or',
  enterCode: 'Enter a code',
  enterCodeHint: 'Type the guest code from their ticket',
  typeACode: 'Type a code',
  check: 'Check',
  checking: 'Checking',
  tipTitle: 'Tip',
  tipText: 'Codes usually start with MAD-',
  fast: 'Fast',
  slow: 'Slow',
  back: 'Back to scanning',
}

export type ResultState = 'welcome' | 'already' | 'not-found' | 'not-paid' | 'offline' | 'camera-off'

export type ResultButton = 'call' | 'next' | 'retry'

export const BUTTON_COPY: Record<ResultButton, string> = {
  call: 'Call Toyosi',
  next: 'Next guest',
  retry: 'Try again',
}

export interface ResultSpec {
  /** Top and bottom of the screen's gradient. White text on both, AA at all sizes used. */
  from: string
  to: string
  word: string
  /** In screen order; the last one is the primary and takes focus. */
  buttons: ResultButton[]
}

export const RESULTS: Record<ResultState, ResultSpec> = {
  welcome: { from: '#15803d', to: '#0b5a2b', word: 'Welcome in!', buttons: ['next'] },
  already: { from: '#c2410c', to: '#8a2c07', word: 'Already checked in', buttons: ['call', 'next'] },
  'not-found': { from: '#b91c1c', to: '#7f1414', word: 'We cannot find this code', buttons: ['call', 'retry'] },
  'not-paid': { from: '#b91c1c', to: '#7f1414', word: 'Not marked as paid', buttons: ['call', 'next'] },
  offline: { from: '#4b5563', to: '#2b323c', word: 'Cannot reach the list', buttons: ['retry'] },
  'camera-off': { from: '#0e3e2e', to: '#071f17', word: 'The camera is off', buttons: [] },
}

export const DETAIL_COPY = {
  tent: 'Tent',
  noTent: 'No tent',
  checkInTime: 'Check-in time',
  checkedInAt: (time: string) => `Checked in at ${time}`,
  notFound: 'Check the code with the guest, or type it in again.',
  notPaid: 'Signed up, but payment not confirmed.',
  offline: 'Check your signal and try again.',
  cameraOff: 'Allow the camera in your browser, or type the code below',
  turnOnCamera: 'Turn on camera',
  turnOnCameraHint: 'Enable camera in browser settings',
  copyCode: 'Copy code',
  copied: 'Copied',
  /** iPhone only, when the browser offers no camera at all (an in-app browser). From the build sequence, Session 2.2. */
  openInSafari: 'Open this page in Safari',
}
