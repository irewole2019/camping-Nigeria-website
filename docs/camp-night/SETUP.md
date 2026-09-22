# Camp Night sign-ups — setting up the sheet

One-time setup, about ten minutes. You need to do this yourself because it
happens inside your own Google account — nobody can log in as you to do it.

Until it's done, sign-ups **still work**: both emails send, and the internal
notification to `hello@campingnigeria.com` carries every field, so you could
copy rows across by hand. The sheet is what turns that into a list you can
sort, filter and check people in from.

---

## Part 1 — Make the sheet

1. Go to [sheets.new](https://sheets.new) — that opens a blank spreadsheet.
2. Name it **Camp Night Sign-ups** (click "Untitled spreadsheet", top left).

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

## Part 4 — Publish it

10. Back in the Apps Script editor: **Deploy → New deployment**.
11. Click the gear icon next to "Select type" and choose **Web app**.
12. Set:
    - **Execute as:** Me
    - **Who has access:** **Anyone**

    > "Anyone" sounds alarming, but it means "anyone can send a sign-up to
    > this URL" — which is exactly what the website needs to do. Nobody can
    > read the sheet through it without knowing an SCN code, and nobody can
    > see the URL from the website's pages.

13. Click **Deploy**, then **copy the Web app URL**. It looks like
    `https://script.google.com/macros/s/AKfy.../exec`.

## Part 5 — Give the URL to the website

14. **Vercel** (this is the one that matters — it's the live site):
    Vercel dashboard → the Camping Nigeria project → **Settings → Environment
    Variables** → Add:

    - Name: `GOOGLE_SHEETS_CAMP_NIGHT_WEBHOOK_URL`
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
{"ok":true,"service":"camp-night-signups","sheet":"Sign-ups",
 "signups":0,"capacity":50,"remaining":50}
```

If you get that, the deployment is live. Then sign yourself up through
`/events/camp-night` and watch a row appear.

That same URL is how you check the count at any time — `remaining` is how
many tents are left.

---

## On the night

Every signee gets a code like `SCN-B8K2MQ` in their confirmation email.
Three ways to check one at the gate:

- **Ctrl+F the sheet** for the code. Fastest on a laptop.
- **The Lookup tab** — type a code in the yellow cell and the whole sign-up
  fills in beside it. Built for a phone, where Ctrl+F is painful.
- **The URL** with `?code=SCN-XXXXXX` on the end, for a JSON answer.

The **Paid?** and **Checked In?** columns start at `No` and are yours to edit
by hand. The script never touches a row once it's written.

---

## If you redeploy the script later

Editing the code does **not** change the live URL by itself. Use
**Deploy → Manage deployments → the pencil icon → New version → Deploy** to
push changes to the same URL. Creating a *new deployment* instead gives you a
different URL, and you'd have to update Vercel again.

---

## The 50-tent cap lives in here

Once the sheet holds 50 sign-ups, the script refuses the next one and the
website shows "all 50 tents are taken" instead of confirming. **No
confirmation email goes out**, so nobody is ever told they are in when they
are not.

This is the only place the cap can work — the website is a static page and
has no idea how many people have signed up. Two consequences:

- **Until the steps above are done, there is no cap.** With no sheet there is
  no count, so sign-up 51 would succeed.
- **To free up a place after a cancellation, delete that row.** Rows are
  counted, so deleting one reopens a tent.

To change the number, edit `TENT_CAP` at the top of the script *and*
`TENT_CAP` in `lib/events/camp-night.ts`. They are two copies of the same
number — the script runs inside Google and can't read the website's code.

---

## How payment works

**Payment is strictly offline and happens before sign-up.** The form is not a
checkout and never touches money. Campers pay the team by transfer or in
person, and *then* fill in the form to get their code.

So the sheet's **`Paid?` column arrives as `Yes`**, not `No`. It is not an
assumption — the form makes the camper tick "I have already paid for my tent"
before it will submit, and the API refuses the sign-up without it.

The page says this in three places (under the tent prices, above the form, and
on the checkbox itself), each pointing at the Camp Night number for paying.

**What you still do by hand:** if someone ticks the box without having paid,
change their `Paid?` cell to `No`. That is the one case the site cannot catch,
because it has no way to see your bank.
