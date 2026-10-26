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

/** The admin sign-in on the card and list pages (Session 2.4; not in the copy deck, which has no admin surface). */
export const ADMIN_COPY = {
  tagline: 'Gate card and guest list',
  submit: 'Sign in',
  adminOnly: 'Admin access only',
  print: 'Print',
}

/** Surface 6, the printed A5 Gate card, verbatim from usl-build/6-landing-page-copy.md. */
export const CARD_COPY = {
  title: 'Padi Check · Gate card',
  rows: [
    { tone: 'welcome', lead: 'Green, Welcome in:', text: 'let them in. Hand a tent to "Tent" guests.' },
    { tone: 'already', lead: 'Orange, Already checked in:', text: 'do not let in yet. Call Toyosi.' },
    { tone: 'not-found', lead: 'Red:', text: 'do not turn anyone away. Call Toyosi.' },
    { tone: 'offline', lead: 'Grey, Cannot reach the list:', text: 'try again. Still stuck? Use the Lookup tab in the Sheet.' },
  ] as const,
  camera: { lead: 'Camera not working?', text: 'Type the code in the box.' },
  toyosi: 'Toyosi:',
  never: { lead: 'Never', text: "show or read out a guest's details to anyone else." },
}

/**
 * The volunteer's how-to page, /padi-check/guide (2026-10-26). Same rules as
 * the Gate card, in more words. No phone numbers: the page needs no sign-in.
 */
export const GUIDE_COPY = {
  linkLabel: 'How to use Padi Check',
  back: 'Back to Padi Check',
  title: 'How to use Padi Check',
  intro: 'Everything you need for the gate at MAD Settings. It takes five minutes to read.',
  before: {
    heading: 'Before the gates open',
    steps: [
      'Charge the phone fully and check it has data.',
      'Open campingnigeria.com/padi-check and sign in with the password Toyosi gives you.',
      'When the phone asks to use the camera, tap Allow.',
      'Turn the screen brightness up.',
      'Keep the Gate card and the printed guest list with you.',
    ],
  },
  checkIn: {
    heading: 'Checking in a guest',
    steps: [
      'Ask the guest to show their gate pass: the QR code in their email, or a screenshot of it.',
      'Hold the phone about an arm’s length away and point the camera at the QR code. Hold still for a second.',
      'The whole screen changes colour. Read the big words.',
      'When you are done with that guest, press Next guest.',
    ],
    noQr: {
      lead: 'No QR code?',
      text: 'Type the six letters and numbers after MAD- into the box and press Check.',
    },
  },
  colours: {
    heading: 'What the colours mean',
    rows: [
      { state: 'welcome', todo: 'Let them in and tell them their tribe. If it says Tent, hand them a tent.' },
      { state: 'already', todo: 'This code was used before, at the time shown. Do not let them in yet. Call Toyosi.' },
      { state: 'not-found', todo: 'Check the code with the guest, or type it again. Do not turn anyone away. Call Toyosi.' },
      { state: 'not-paid', todo: 'Do not turn anyone away. Call Toyosi.' },
      { state: 'offline', todo: 'There is no signal. Press Try again. Still stuck? Use the printed guest list.' },
      { state: 'camera-off', todo: 'Allow the camera in your browser settings, or type the code instead.' },
    ] as const,
    callToyosi: 'Call Toyosi is a button on every orange and red screen. It rings Toyosi straight away.',
  },
  tribes: {
    heading: 'Tribes',
    text: 'Every guest belongs to one of four tribes. The green screen shows theirs as a coloured dot with its name. Tell the guest which tribe they are in.',
  },
  topBar: {
    heading: 'The top of the screen',
    count: 'shows how many guests are in so far, out of everyone who has paid.',
    fast: 'means answers come straight away.',
    slow: 'means each check takes a few seconds. Keep going: it still works.',
  },
  problems: {
    heading: 'If something goes wrong',
    rows: [
      { lead: 'The phone dies or there is no signal.', text: 'Use the printed guest list. Find the name and tick the box. Their name still gets them in.' },
      { lead: 'The guest has no gate pass.', text: 'Ask for their name and find it on the printed list, or ask for their code and type it in.' },
      { lead: 'You are not sure.', text: 'Call Toyosi. Never guess, and never turn a guest away on your own.' },
    ],
  },
  privacy: {
    heading: 'Keep it private',
    text: "Never show or read out a guest's details to anyone else, and never share the password.",
  },
}

/** The printed guest list (R-011). */
export const LIST_COPY = {
  title: 'Padi Check · Guest list',
  columns: { name: 'Name', code: 'Code', ticket: 'Ticket', tent: 'Tent', tribe: 'Tribe', in: 'In' },
  printed: (when: string) => `Printed ${when} (Lagos time)`,
  count: (n: number) => `${n} paid ${n === 1 ? 'guest' : 'guests'}`,
  empty: 'No paid guests yet.',
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
  /** Under the tribe name on the welcome and already screens. */
  tribe: 'Tribe',
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
