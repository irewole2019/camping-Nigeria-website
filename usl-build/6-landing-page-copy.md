# Landing Page Copy and Strategy
## Stage 6 Output | USL Academy

**Product:** Padi Check (internal event check-in tool) and the guest Gate pass
**Brand:** Camping Nigeria
**Date:** 2026-10-17
**Status:** complete
**Page built:** No. Copy and a build sequence were produced; nothing has been implemented.

---

## 1. GROUNDING

**Observed:** Existing MAD Settings confirmation page (`app/events/mad-settings/registered/page.tsx`) with a gold code box ("Your code / Keep this. It is how we find you at the gate."); existing customer confirmation email in `app/api/mad-settings-signup/route.ts`; brand tokens in `app/globals.css`; site house voice avoids contractions.
**Researched:** html5-qrcode supports iOS Safari 15.1+ over HTTPS (Stage 1).
**User belief:** Volunteer prefers calm, plain screens; guests will screenshot the pass.
**Missing evidence:** How the volunteer and guests actually behave (rehearsal on 28 Oct).
**User and payer:** Volunteer (user), guests (secondary user), founders (owner). No external payer.
**Caps:** None. **Paid traffic:** Not applicable; no public landing page and no acquisition.

---

## 2. ROUTING

**Surfaces (in place of one landing page):**

| # | Surface | Audience | Single job | Status |
|---|---|---|---|---|
| 1 | Confirmation page `/events/mad-settings/registered` | Guest just signed up | Screenshot the gate pass | Exists; add QR |
| 2 | Customer confirmation email | Guest | Keep the gate pass | Exists; add QR |
| 3 | Back-fill "Your gate pass" email | Guests signed up before the feature | Deliver the QR; nothing else to do | New |
| 4 | Padi Check login | Volunteer | Enter with one password | New |
| 5 | Padi Check scanner and results | Volunteer | Point, read the colour, act | New |
| 6 | Gate card (printed A5) | Volunteer | Know each colour without asking | New |

**Goal per surface:** product adoption (volunteer); keep and show the pass (guest).
**Visitor state:** Product-aware (guests have signed up; the volunteer has been briefed).
**Trust burden:** Low for guests; medium for the volunteer (fear of blame).
**Demonstration need:** High for the volunteer, met by the 5-minute walkthrough, not by the page.
**Audience path:** Separate expressions: warm guest surfaces, plain volunteer surfaces.
**Demand orientation:** Push (relief from an uncheckable gate).
**Omitted modules and why:** Proof, pricing, comparison, FAQ, founder story; nothing is sold.

---

## 3. AUTHORSHIP BRIEF

**Assets:** Real brand system and the existing gold code box. No photography or illustration needed.
**Claim ledger:**

| Claim | Proof or owner |
|---|---|
| "If your gate pass will not scan, your name still gets you in." | Founders honour it: every red goes to Toyosi; the sheet Lookup tab is the fallback |
| Live count "[N] of [M] in" | Computed from the sheet |

**Voice:**
- Could say: "You are in." / "Keep this. It is how we find you at the gate." / "Screenshot this now. Show it at the gate."
- Would never say: "INVALID TICKET. DENY ENTRY." / "Our fraud-proof system keeps you safe."
- Use: gate pass, welcome in, call Toyosi, next guest. Avoid: invalid, denied, secure, fraud, scan failed, error codes.
- Cadence: short declarative sentences, no contractions, second person.

**Visual thesis:** One big answer per screen. The gate pass lives in the gold box guests already know; Padi Check turns the whole screen into its answer, readable at arm's length at night.

**Hero direction chosen:** Artifact-led. QR inside the existing gold code box. Rejected: ticket-stub (new design work; reads as "bring a printout"); type-led headline with small QR (QR gets lost).

---

## 4. FINAL COPY

### Surface 1: Confirmation page (inside the existing gold box; rest of page unchanged)

> **Your gate pass**
> [QR code]
> MAD-B8K2MQ
> **Screenshot this now. Show it at the gate.**
> If your gate pass will not scan, your name still gets you in.

Replaces: "Your code" label and "Keep this. It is how we find you at the gate."

### Surface 2: Confirmation email (inside the existing code block)

> **Your gate pass**
> [QR code, hosted image]
> MAD-B8K2MQ
> Screenshot this now. Show it at the gate.

### Surface 3: Back-fill email

> **Subject:** Your gate pass for MAD Settings
>
> **Here is your gate pass, [first name]**
>
> You are already signed up for MAD Settings on Saturday 31 October. Nothing has changed and there is nothing to pay or fill in. We have added a quicker way in at the gate.
>
> [QR code, hosted image]
> MAD-B8K2MQ · [Ticket name]
>
> **Screenshot this now. Show it at the gate.**
> If your gate pass will not scan, your name still gets you in.
>
> Questions? Reply to this email.

> **Revised 2026-10-25** from the founder's screen designs (the restyle in `8-build-sequence.md` Section 9). The earlier wording is in git history. House rules unchanged: no contractions; never invalid, denied, secure or fraud (the design's "Secure check-ins" tagline was dropped for that reason).

### Surface 4: Padi Check login

> [Padi Check mark: a "P" with a tick cut through it]
> **Padi** Check
> Fast. Simple. Check-ins for your events.
> Password [show/hide]
> **[Start checking in →]**
> Volunteer access only
> Wrong password: "That password did not work. Ask Toyosi for today's password."

### Surface 5: Padi Check scanner and results

**Top of every screen:** status pill **[N] of [M]** · **FAST** or **SLOW** (code screen: Padi Check mark and name on the left; result screens: back arrow on the left, which returns to scanning)
**Code screen:** "Point at the gate pass" (camera, always on) / or / **Enter a code** · Type the guest code from their ticket / [MAD-______] **[Check →]** / **Tip** · Codes usually start with MAD-

| State | Screen colour | Picture | Big word | Detail | Buttons |
|---|---|---|---|---|---|
| Valid, first arrival | Green | Initials, tick badge | **Welcome in!** | [Full name] / tiles: [Ticket label] · **Tent** or **No tent**; [h:mm AM/PM] · Check-in time | [Next guest →] |
| Already checked in | Orange | Initials, clock badge | **Already checked in** | [Full name] / tile: Checked in at [h:mm AM/PM] | [Call Toyosi] [Next guest →] |
| Not found | Red | Cross in a ring | **We cannot find this code** | [Code] (with copy button) / Check the code with the guest, or type it in again. | [Call Toyosi] [Try again] |
| Not marked paid | Red | ! in a ring | **Not marked as paid** | [Full name] / Signed up, but payment not confirmed. | [Call Toyosi] [Next guest →] |
| Network failure | Grey | Wifi-off in a ring | **Cannot reach the list** | Check your signal and try again. | [Try again] |
| Camera blocked | Dark green | QR tile | **The camera is off** | Allow the camera in your browser, or type the code below / **Type a code** [MAD-______] [Check →] / **Turn on camera** · Enable camera in browser settings (tries the camera again) | |

### Surface 6: Gate card (printed A5)

> **Padi Check · Gate card**
> **Green, Welcome in:** let them in. Hand a tent to "Tent" guests.
> **Orange, Already checked in:** do not let in yet. Call Toyosi.
> **Red:** do not turn anyone away. Call Toyosi.
> **Grey, Cannot reach the list:** try again. Still stuck? Use the Lookup tab in the Sheet.
> **Camera not working?** Type the code in the box.
> **Toyosi:** [number, from `usl-build/check-in.private.md`; printed card only]
> **Never** show or read out a guest's details to anyone else.

---

## 5. AUDITS

**Authored-copy audit:** Every line traces to Stage 4 or 5 decisions or existing site copy; no competitor could swap in; claims limited to the honoured commitment. Pass.
**Decision-role audit:** Not applicable (no external payer).
**AI-copy pattern sweep:** No stacked fragments, no "Not X. Just Y.", no empowerment language. Pass.
**Visual-authorship audit (planned):** Reuses the owned gold box; result screens are full-bleed colour with one word, not cards. Re-run on the rendered build.
**Red-flag inventory:** No cards, gradients, icons, pills or fake chrome on Padi Check. The only repeated shape is the result screen, by design (same layout, different colour).

---

## 6. MARKET EVIDENCE AND SOURCES

No live research run this session. Stage 1 source 6 (html5-qrcode iOS support) reused.

---

## 7. DECISIONS AND CHANGES

| Date | Decision | Why |
|---|---|---|
| 2026-10-17 | Contractions removed from screen copy | Site house voice ("we could not", "It is") |
| 2026-10-17 | Call Toyosi added to orange | "Already checked in" may mean a shared pass; the volunteer should not resolve it alone |
| 2026-10-17 | Grey network screen and camera-off state added | Recovery states the volunteer will meet |
