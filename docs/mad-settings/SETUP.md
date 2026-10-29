# MAD Settings sign-ups — setting up the sheet

One-time setup, about ten minutes. You need to do this yourself because it
happens inside your own Google account — nobody can log in as you to do it.

Until it's done, sign-ups **still work**: both emails send, and the internal
notification to `hello@campingnigeria.com` carries every field, so you could
copy rows across by hand. The sheet is what turns that into a list you can
sort, filter and check people in from.

---

## Part 1 — Make the sheet

1. Go to [sheets.new](https://sheets.new) — that opens a blank spreadsheet.
2. Name it **MAD Settings Sign-ups** (click "Untitled spreadsheet", top left).

## Part 2 — Paste in the script

3. In the menu: **Extensions → Apps Script**. A code editor opens in a new tab.
4. Delete whatever is already in the editor (usually an empty `myFunction`).
5. Open [`apps-script.gs`](apps-script.gs) from this folder, copy all of it,
   paste it into the editor.
6. Save (the disk icon, or Ctrl+S).

## Part 3 — Run it once

7. At the top of the editor there's a dropdown showing a function name. Pick
   **`setup`**, then click **Run**.
8. Google will ask for permission — it's your own script asking to edit your
   own sheet. Click through: *Review permissions* → pick your account →
   *Advanced* → *Go to (project name)* → *Allow*.

   > The "Google hasn't verified this app" warning is expected. It appears for
   > every private script. The app it hasn't verified is the one you just
   > pasted in yourself.

9. Go back to the spreadsheet tab. You should now see two tabs at the bottom:
   **Sign-ups** (with green headers) and **Lookup**.

   > **"An unknown error has occurred, please try again later."** This is what
   > happened on the first try for MAD Settings (13/10/2026). It almost always
   > means the browser is signed into **more than one Google account**: the
   > editor runs as your default account, not the one that owns the sheet.
   > Open an incognito window, sign into *only* the owning account, open the
   > sheet → Extensions → Apps Script, and run `setup` again. If it still
   > fails, wait a minute and retry — occasionally it is Google's side.

## Part 4 — Publish it

10. Back in the Apps Script editor: **Deploy → New deployment**.
11. Click the gear icon next to "Select type" and choose **Web app**.
12. Set:
    - **Execute as:** Me
    - **Who has access:** **Anyone**

    > "Anyone" sounds alarming, but it means "anyone can send a sign-up to
    > this URL" — which is exactly what the website needs to do. Nobody can
    > read the sheet through it without knowing a MAD code, and nobody can
    > see the URL from the website's pages.

13. Click **Deploy**, then **copy the Web app URL**. It looks like
    `https://script.google.com/macros/s/AKfy.../exec`.

## Part 5 — Give the URL to the website

14. **Vercel** (this is the one that matters — it's the live site):
    Vercel dashboard → the Camping Nigeria project → **Settings → Environment
    Variables** → Add:

    - Name: `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL`
    - Value: the URL from step 13
    - Environments: tick all three

    Then **redeploy** — env vars only reach a build that starts after they're
    saved.

15. **Your laptop**, optional, only if you want to test locally: add the same
    line to `.env.local` and restart `npm run dev`.

---

## Check it worked

Paste the Web app URL into a browser on its own. You should get:

```json
{"ok":true,"service":"mad-settings-signups","sheet":"Sign-ups",
 "signups":0,"tents":0,"tentCapacity":80,"tentsRemaining":80}
```

If you get that, the deployment is live. Then sign yourself up through
`/events/mad-settings` and watch a row appear. **Delete that test row
afterwards** — if you picked a sleepover ticket, it holds one of the 80 tents
until you do.

That same URL is how you check the count at any time — `signups` is every
ticket, `tentsRemaining` is how many tents are left.

---

## On the night

Every signee gets a code like `MAD-B8K2MQ` in their confirmation email.
Three ways to check one at the gate:

- **Ctrl+F the sheet** for the code. Fastest on a laptop.
- **The Lookup tab** — type a code in the yellow cell and the whole sign-up
  fills in beside it. Built for a phone, where Ctrl+F is painful.
- **The URL** with `?code=MAD-XXXXXX` on the end, for a JSON answer.

**Checked In?** starts at `No` and **Tent ID** starts blank; both are yours
to fill in at the gate. Tent ID is for the number on the tent's tag, so each
code maps to a tent for cleaning and damage checks (an idea from the Camp
Night debrief). The script never touches a row once it's written, with one
exception: a Padi Check scan writes the arrival time into **Checked In?**
(see "Padi Check" below).

**Don't edit the `Tent?` column.** It is what the 80-tent cap counts.

---

## If you redeploy the script later

Editing the code does **not** change the live URL by itself. Use
**Deploy → Manage deployments → the pencil icon → New version → Deploy** to
push changes to the same URL. Creating a *new deployment* instead gives you a
different URL, and you'd have to update Vercel again.

---

## Padi Check (gate check-in)

The script also answers the Padi Check scanner at the gate. The website asks
it to check a code, and the script either writes the arrival time into
**Checked In?** (`welcome`) or answers `already`, `not-found` or `not-paid`.
Every answer except `welcome` is added to a **Scan log** tab, so you can see
afterwards which codes were turned away. These requests must carry a shared
secret; without it the script answers `unauthorised` and changes nothing.

One-time setup, in the Apps Script editor:

1. Paste in the new `apps-script.gs` and save.
2. **Project Settings** (gear icon, left) → **Time zone** →
   **(GMT+01:00) Lagos**.
3. Still in Project Settings → **Script Properties** → **Add script property**:
   - Property: `PADI_CHECK_SECRET`
   - Value: the same secret the website has as `PADI_CHECK_SCRIPT_SECRET`.
4. Back in the editor, pick **`setupPadiCheck`** in the function dropdown and
   click **Run**. A **Scan log** tab appears in the sheet.
5. **Deploy → New deployment → Web app** (Execute as: Me, Access: Anyone).
   This makes a **separate test URL** for building and testing. Put it in
   `.env.local` as `GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL`.
   *(History: this test deployment was archived on 26/10/2026, after
   go-live. There is now one deployment, the live one, and `.env.local` has
   no sheet link, so local runs skip the sheet instead of writing test rows
   into the real one.)*

**Leave the existing deployment alone until go-live.** The live site keeps
using the old URL, on the old version, so sign-ups are unaffected while
Padi Check is being built. At go-live, switch the existing deployment to the
new version (see "If you redeploy the script later"), so its URL stays the
same and Vercel needs no change.

If the Script Property is missing or empty, every Padi Check request is
refused. Sign-ups are not affected either way.

---

## Tribes (added 26/10/2026)

Every sign-up is put in one of four tribes: **Gadaff**, **Kutinga**,
**Mandi** or **Sellas**. The sheet decides, not the website, because only
the sheet knows how many people each tribe has. Each new sign-up goes to the
tribe with the fewest people (a couple ticket counts as two), and the tribe is
written in a new **Tribe** column at the far right. The guest sees it in their
confirmation email, on the "You are in" page, and on the gate screen.

**Do this BEFORE the website update goes live** — the website expects the
sheet to answer with a tribe. It is safe the other way round too (the website
picks a fallback and the internal email says "add it to the Tribe column by
hand"), but then you have typing to do.

1. Open the **MAD Settings Sign-ups** sheet → **Extensions → Apps Script**.
2. Click in the code, press **Ctrl+A**, then **Delete**. Paste in the whole of
   `docs/mad-settings/apps-script.gs` from this repo, and press **Ctrl+S**.
   (This version includes everything Padi Check needs as well.)
3. In the function dropdown at the top, pick **`setupTribes`** and click
   **Run**. It adds the **Tribe** heading and gives everyone already in the
   sheet a tribe, spread evenly, oldest first. The **Execution log** at the
   bottom ends with a line like
   `People per tribe: {"Gadaff":1,"Kutinga":1,"Mandi":0,"Sellas":0}`.
   Running it again changes nothing.
4. Publish the new version to the live link:
   **Deploy → Manage deployments** → the deployment on the left → the
   **pencil** icon → **Version: New version** → **Deploy**. Never use
   *New deployment* here: that makes a new link the website does not know.
   (Done on 26/10/2026. There is only one deployment now: the separate test
   one was archived the same day.)
5. Check: paste the live Web app URL into a browser. It still shows the
   heartbeat (`"service":"mad-settings-signups"`). Then tell whoever is
   updating the website that the sheet is done.

**Moving someone to another tribe:** type the tribe's name in their Tribe
cell (spelling as above; capitals do not matter). New sign-ups balance
against whatever the column says. **Do not leave a Tribe cell blank** for a
real guest: blank cells are not counted, and the gate shows no tribe for
them.

**Test rows:** deleting them, as planned at go-live, is fine; the next
sign-ups simply fill whichever tribe is now smallest.

### Couples: one tribe each (added 26/10/2026)

A couple ticket is two people, so they get **two different tribes**: the
guest's in **Tribe**, their partner's in **Partner Tribe**. The form asks for
the partner's name on couple tickets, and it goes in **Partner**. Each person
counts as one when the tribes are balanced. Both tribes show in the email, on
the "You are in" page, on the gate screen (one tile each, named) and on the
printed list.

To switch it on:

1. **Extensions → Apps Script** → click in the code → **Ctrl+A** →
   **Delete** → paste the whole of `docs/mad-settings/apps-script.gs` →
   **Ctrl+S**.
2. In the dropdown at the top, pick **`setupPartnerTribes`** → **Run**. It
   adds the **Partner** and **Partner Tribe** headings at the far right and
   gives any earlier couple a second tribe. (On 26/10 there were none.)
   Running it again changes nothing.
3. **Deploy → Manage deployments** → the deployment → **pencil** →
   **Version: New version** → **Deploy**.

**Moving a partner to another tribe:** type the tribe in their Partner Tribe
cell. Keep it different from the same row's Tribe; the gate ignores a
partner tribe that matches the guest's.

---

## The 80-tent cap lives in here

Only **sleepover** tickets take a tent, so only they count. Once the sheet
holds 80 rows with `Tent?` = `Yes`, the script refuses the next sleepover
ticket and the website says "all 80 tents are taken — attendance-only tickets
are still open" instead of confirming. **No confirmation email goes out**, so
nobody is ever told they have a tent when they don't.

**Attendance-only tickets are not capped.** They are never counted and never
refused.

This is the only place the cap can work — the website is a static page and
has no idea how many people have signed up. Two consequences:

- **Until the steps above are done, there is no cap.** With no sheet there is
  no count, so tent 81 would succeed.
- **To free up a tent after a cancellation, delete that row.** Rows are
  counted, so deleting one reopens a tent.

To change the number, edit `TENT_CAP` at the top of the script *and*
`TENT_CAP` in `lib/events/mad-settings.ts`. They are two copies of the same
number — the script runs inside Google and can't read the website's code.
**Then redeploy the script as a new version** (see above). Saving it is not
enough, and until you redeploy, the website advertises one number while the
sheet still refuses at the old one.

---

## How payment works

**Payment is strictly offline and happens before sign-up.** The form is not a
checkout and never touches money. Guests pay the team by transfer or in
person, and *then* fill in the form to get their code.

So the sheet's **`Paid?` column arrives as `Yes`**, not `No`. It is not an
assumption — the form makes the guest tick "I have already paid for my ticket"
before it will submit, and the API refuses the sign-up without it.

The page says this in three places (under the ticket prices, above the form, and
on the checkbox itself), each pointing at the events number for paying.

**What you still do by hand:** if someone ticks the box without having paid,
change their `Paid?` cell to `No`. That is the one case the site cannot catch,
because it has no way to see your bank.
