# Paystack Integration — Handoff Plan

**Status:** Not started. v1 ships invoice-on-payment manually; this doc is the resume point.
**Last updated:** 2026-04-28
**Owner:** Taiye

---

## TL;DR — what to do tomorrow

1. **Sign in to Paystack** at [dashboard.paystack.com](https://dashboard.paystack.com), copy the **test** secret + public keys (top-right account menu → Settings → API Keys & Webhooks).
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
   PAYSTACK_SECRET_KEY=sk_test_...
   PAYSTACK_WEBHOOK_SECRET=     # leave blank; Paystack signs webhook bodies with the secret key
   ```
3. Read the **Architecture decisions** section below — three calls to make before writing code.
4. Implement in this order:
   1. `app/api/event-registration/route.ts` — split into "init" (create pending row + return Paystack params) and keep email send for after payment
   2. `app/api/event-registration/webhook/route.ts` — new file, verifies signature and flips Sheet row to `confirmed`
   3. `components/events/base-camp-kids/RegistrationForm.tsx` — wire `@paystack/inline-js` (recommended) or redirect-to-Paystack flow
   4. `docs/base-camp-kids/apps-script.gs` — add an `updateStatus` action so the webhook can flip a row from `pending` → `confirmed` by reference
5. Test with Paystack's [test cards](https://paystack.com/docs/payments/test-payments) (success: `4084 0840 8408 4081`, declined: `4084 0840 8408 4040`). Use ngrok for local webhook testing.
6. Promote keys to live, set them in Vercel prod, deploy.

---

## What's already in place (don't redo)

- `recordRegistration()` in [lib/event-records.ts](../../lib/event-records.ts) already takes a `status: 'pending' | 'confirmed' | 'abandoned'` field — the Sheet schema is paystack-ready.
- The Apps Script in [apps-script.gs](apps-script.gs) already writes a `Status` column. We currently always pass `'pending'`. The script needs an `updateStatus(reference, newStatus)` action added.
- The registration API ([app/api/event-registration/route.ts](../../app/api/event-registration/route.ts)) already runs the full defensive stack (honeypot → IP rate limit → type guard → email regex → phone digits → length caps → server-derived total) and generates a unique reference via `generateReference()`. That logic stays — Paystack initialisation slots in *after* validation, *before* email send.
- Confirmation page `/events/base-camp-kids/registered` already exists. It currently shows "we'll send an invoice" — that copy will change to "your seat is confirmed" once payment is wired.
- Pricing math — `computeRegistrationTotal(numChildren)` returns naira-as-integer. Paystack expects the amount in **kobo** (NGN × 100). The conversion is one multiplication; do it in the route handler, never in the client.

---

## Architecture decisions (open)

### 1. Inline checkout vs. redirect

**Inline checkout (`@paystack/inline-js`)** — embeds Paystack's modal in the page. Customer never leaves the site. Recommended by Paystack for most use cases.

- **Pros:** Same-page UX. Cleaner success/abandon handling (`onSuccess`, `onCancel` callbacks fire in the same browser tab). Confirmation URL is one we control.
- **Cons:** Adds a 30 KB script to the page. The `@paystack/inline-js` package is the easiest integration but is the v1 SDK; the v2 *standard* (Paystack Popup) is recommended for new code.

**Redirect (Paystack Standard)** — the API call returns an `authorization_url`; we 302 the user to it; Paystack returns them to our `callback_url` after payment.

- **Pros:** No JS to load; works even with strict CSP. Server-side init = no public key in browser bundles for the auth call.
- **Cons:** Two extra navigations. The "back from Paystack" round-trip can feel slow on Nigerian mobile networks.

**Recommendation:** Inline checkout via `@paystack/inline-js`. The form is already a single-page React component; bolting a modal on is a 30-line change. Most Nigerian customers expect inline now (it's how Flutterwave, Stripe, and Paystack itself promote checkout in 2026).

### 2. When does the registration row get written?

**Option A (write on submit, before payment):** Form submits → API validates → API creates Sheet row with `status: 'pending'` → API returns Paystack init params → user pays → webhook flips row to `confirmed`.

**Option B (write on webhook, after payment):** Form submits → API validates → returns Paystack init params (no Sheet row yet) → user pays → webhook receives confirmation, validates signature, *now* writes Sheet row.

**Recommendation:** **Option A.** Reasons:

- The form has child names, allergies, emergency contact — losing that to a network drop between init and webhook is bad. Writing pending preserves it.
- "Abandoned" has signal — a row with `status: pending` for >24h means someone tried to register and didn't finish. That's a follow-up opportunity.
- Webhook-based writes require the webhook to never fail. Option A means a webhook failure leaves a `pending` row that ops can manually confirm; Option B means a webhook failure means a paid registration that never appears in the Sheet.
- The existing `lib/event-records.ts` interface already supports this pattern (`status` field).

### 3. When does the customer confirmation email fire?

**Option A (on webhook — payment confirmed):** Email fires only after Paystack confirms payment. Email reads "Your seat is confirmed."

**Option B (on form submit — both):** Two emails: one immediately ("we received your registration, complete payment to confirm") and a second on webhook ("seat confirmed").

**Recommendation:** **Option A only.** Reasons:

- Two emails for one registration creates ambiguity ("which email is the real confirmation?").
- An immediate email before payment looks like a confirmation even if the customer abandons. If they then ask why they don't have a seat, the support cost is real.
- The form's submit button can show a "redirecting to payment…" state — no immediate email needed for reassurance.

The internal email (to `hello@campingnigeria.com`) should fire on **webhook confirm**, not on form submit. Otherwise the team gets pinged on every "started checkout" event regardless of conversion.

---

## Implementation sketch

### Route shape

```
/api/event-registration              POST  → init (validate, create pending row, return Paystack init payload)
/api/event-registration/webhook      POST  → Paystack confirmation (verify signature, flip status, send emails)
```

### `route.ts` (init) — diff from current

```ts
// Existing: validate → derive total → send emails → record sheet
// New:      validate → derive total → record sheet (status: pending) → return Paystack init params
//           Email send moves to webhook.

const reference = generateReference()  // already done

// Insert pending row first
await recordRegistration({
  reference,
  total,
  status: 'pending',
  parent, emergencyContact, children, notes,
})

// Return Paystack init payload — client uses this to open inline checkout
return NextResponse.json({
  success: true,
  reference,
  paystack: {
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: parent.email,
    amount: total * 100,           // naira → kobo
    currency: 'NGN',
    reference,                     // our reference, used as Paystack's idempotency key
    metadata: {
      custom_fields: [
        { display_name: 'Children', variable_name: 'children_count', value: String(children.length) },
        { display_name: 'Event', variable_name: 'event', value: 'base-camp-kids-2026' },
      ],
    },
  },
})
```

### `webhook/route.ts` (new file)

```ts
// Paystack signs every webhook body with HMAC-SHA512 of the secret key.
// We MUST verify before trusting any field.

import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { sendPairedMail } from '@/lib/mail'
import { updateRegistrationStatus } from '@/lib/event-records'  // new helper

export async function POST(req: Request) {
  const raw = await req.text()
  const signature = req.headers.get('x-paystack-signature')
  if (!signature) return NextResponse.json({ ok: false }, { status: 401 })

  const expected = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(raw)
    .digest('hex')

  if (expected !== signature) {
    console.warn('paystack: signature mismatch')
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const event = JSON.parse(raw) as { event: string; data: { reference: string; status: string; amount: number; customer: { email: string } } }

  if (event.event !== 'charge.success') {
    return NextResponse.json({ ok: true })  // ignore other events for v1
  }

  const reference = event.data.reference

  // 1. Flip the Sheet row to confirmed (idempotent — webhook may fire >1×)
  await updateRegistrationStatus(reference, 'confirmed')

  // 2. Fire paired email (internal + customer "seat confirmed")
  // (lookup the row to get the parent name/email — or pass through Paystack metadata)
  // …

  return NextResponse.json({ ok: true })
}
```

### `apps-script.gs` — add `updateStatus` action

The current `doPost` handler always appends a row. To support webhook updates, route by an `action` field:

```js
function doPost(e) {
  const data = JSON.parse(e.postData.contents)
  if (data.action === 'update_status') {
    return updateStatus(data.reference, data.status)
  }
  return appendRow(data)  // existing behaviour
}

function updateStatus(reference, newStatus) {
  const sheet = getOrCreateSheet()
  const refColumn = HEADERS.indexOf('Reference') + 1
  const statusColumn = HEADERS.indexOf('Status') + 1
  const lastRow = sheet.getLastRow()
  const refs = sheet.getRange(2, refColumn, lastRow - 1, 1).getValues().flat()
  const rowIndex = refs.indexOf(reference)
  if (rowIndex === -1) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'reference not found' })).setMimeType(ContentService.MimeType.JSON)
  }
  sheet.getRange(rowIndex + 2, statusColumn).setValue(newStatus)
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON)
}
```

Add a matching `updateRegistrationStatus(reference, status)` helper in [lib/event-records.ts](../../lib/event-records.ts) that POSTs `{ action: 'update_status', reference, status }` to the same webhook URL.

### `RegistrationForm.tsx` — wire inline checkout

```tsx
import { useEffect, useState } from 'react'

declare global { interface Window { PaystackPop?: any } }

// Load the Paystack inline script once
useEffect(() => {
  const s = document.createElement('script')
  s.src = 'https://js.paystack.co/v2/inline.js'
  s.async = true
  document.body.appendChild(s)
}, [])

async function handleSubmit(e: FormEvent) {
  e.preventDefault()
  // … existing validation …
  const res = await fetch('/api/event-registration', { method: 'POST', body: JSON.stringify(payload) })
  const { paystack, reference } = await res.json()

  const popup = new window.PaystackPop()
  popup.newTransaction({
    key: paystack.publicKey,
    email: paystack.email,
    amount: paystack.amount,
    currency: paystack.currency,
    reference: paystack.reference,
    metadata: paystack.metadata,
    onSuccess: (transaction: { reference: string }) => {
      // Optimistic redirect — webhook will confirm authoritatively
      router.push(`/events/base-camp-kids/registered?ref=${transaction.reference}`)
    },
    onCancel: () => {
      // Nothing to do — Sheet row stays `pending`. Customer can retry.
      setIsSubmitting(false)
    },
  })
}
```

---

## Webhook URL

Paystack dashboard → Settings → API Keys & Webhooks → set the webhook URL to:

```
https://campingnigeria.com/api/event-registration/webhook
```

For local testing, use ngrok:

```
ngrok http 3000
# then set the webhook URL to the https://xxx.ngrok-free.app/api/event-registration/webhook
```

You can also use Paystack's "Test Webhook" button in the dashboard, which fires a synthetic `charge.success` against any URL — useful for confirming signature verification works before placing a real test charge.

---

## Test plan (local, before Vercel)

1. Set test keys in `.env.local`. `npm run dev`. Open `/events/base-camp-kids` in browser.
2. Fill form with one child, ₦100,000 total. Submit. Modal should open.
3. Pay with test card `4084 0840 8408 4081`, expiry any future date, CVV `408`, OTP `123456`.
4. Verify:
   - Sheet row was written with `status: pending` *before* payment.
   - After successful test payment, `onSuccess` fires and the page redirects to `/events/base-camp-kids/registered?ref=BCK-2026-XXXXXX`.
   - Webhook (via ngrok) flipped the row to `status: confirmed`.
   - Two emails arrived — internal at `hello@campingnigeria.com` and confirmation at the test-registration email address.
5. Repeat with declined card `4084 0840 8408 4040`. Verify no Sheet row update, no emails fire, customer sees a Paystack-rendered "declined" message.
6. Refresh the registration page mid-payment (open form, init, then close modal without paying). Verify Sheet row stays `pending` indefinitely — fine.

## Edge cases to think about

- **Double-webhook delivery.** Paystack retries webhooks. The `updateStatus` Apps Script action is idempotent (setting `status: confirmed` twice is a no-op). The email send is **not** idempotent — fire-and-forget would double-send. Fix: check the current Sheet row status before sending email, or de-dupe via a "last_email_sent" timestamp on the row.
- **Customer pays but webhook never fires.** Rare but possible (Paystack outage during webhook delivery). Manual reconciliation: the team can check the Paystack dashboard for `charge.success` events without a matching Sheet `confirmed` row, and run a manual `updateStatus` action.
- **Customer pays the wrong amount via dashboard manual link.** Don't let them. Always init via the API so `amount` and `reference` are server-controlled.
- **Currency.** NGN only for v1. Hardcode `currency: 'NGN'` in the init call.
- **Refunds.** Out of scope for v1 — handle via the Paystack dashboard, then update the Sheet manually. The `'abandoned'` status in the existing schema is for unpaid pendings older than X days; refunded payments would need a new status (`'refunded'`) added to the type.

## Files touched (estimated)

| File | Change |
|---|---|
| `.env.local`, `.env.example` | Add 2 Paystack env vars |
| `app/api/event-registration/route.ts` | Move email send to webhook; return Paystack init payload |
| `app/api/event-registration/webhook/route.ts` | **New** — verify signature, flip status, send emails |
| `components/events/base-camp-kids/RegistrationForm.tsx` | Wire `@paystack/inline-js` (or load CDN script) |
| `lib/event-records.ts` | Add `updateRegistrationStatus()` helper |
| `docs/base-camp-kids/apps-script.gs` | Add `updateStatus` action; redeploy |
| `app/events/base-camp-kids/registered/page.tsx` | Update copy from "we'll invoice you" → "your seat is confirmed" |
| `lib/events/base-camp-kids.ts` | (maybe) add `PAYMENT_PROCESSOR = 'paystack'` constant |
| `context/state.md` | Move Paystack from "in progress" → "completed" |
| `context/decisions.md` | Add entries on inline-vs-redirect, write-pending-first, email-on-webhook |

---

## Reference docs

- [Paystack docs](https://paystack.com/docs)
- [Paystack Standard (redirect)](https://paystack.com/docs/payments/accept-payments) — authoritative server-side init pattern
- [Paystack Inline](https://paystack.com/docs/payments/accept-payments#inline-checkout) — modal embed
- [Webhook signing](https://paystack.com/docs/payments/webhooks) — HMAC-SHA512 verification example in Node
- [Test cards](https://paystack.com/docs/payments/test-payments) — success / declined / 3DS flows
