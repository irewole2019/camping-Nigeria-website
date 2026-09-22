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
{"ok":true,"service":"camp-night-signups","sheet":"Sign-ups"}
```

If you get that, the deployment is live. Then sign yourself up through
`/events/camp-night` and watch a row appear.

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

## Two things this does not do

- **It does not take payment.** Tickets are ₦20,000–₦30,000 and the form
  collects no money. Sign-ups arrive unpaid, and `Paid?` is a column you fill
  in as transfers land. If you want payment on the form, that's a separate
  piece of work.
- **It does not cap at 50 tents.** Nothing stops sign-up 51. Watch the row
  count, or ask for a cap to be built.
