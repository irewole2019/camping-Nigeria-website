/**
 * MAD Settings — sign-ups webhook and code lookup
 *
 * SETUP, once — the walkthrough with screenshots-worth of detail is in
 * docs/mad-settings/SETUP.md. The short version:
 *   1. Create a Google Sheet (call it "MAD Settings Sign-ups").
 *   2. Extensions -> Apps Script, paste this file, save.
 *   3. Run `setup()` once. Accept the permission prompt. It creates the
 *      Sign-ups tab with headers.
 *   4. Deploy -> New deployment -> Web app.
 *        Execute as:  Me
 *        Access:      Anyone
 *   5. Copy the Web app URL into the site's env as
 *      GOOGLE_SHEETS_MAD_SETTINGS_WEBHOOK_URL (and into Vercel).
 *
 * The site POSTs one JSON object per sign-up to doPost, which appends a row.
 *
 * CHECKING A CODE AT THE GATE, three ways:
 *   - Ctrl+F the sheet for the code. Fastest on a laptop.
 *   - Put a code in the Lookup tab's yellow cell; the row fills in beside it.
 *     Built for a phone, where Ctrl+F is awkward.
 *   - GET the Web app URL with ?code=MAD-XXXXXX for a JSON answer.
 *
 * CAPACITY is enforced here and nowhere else. The site is statically rendered
 * and has no count of its own, so once the sheet holds TENT_CAP *tent*
 * sign-ups this script answers `tents-full` to the next sleepover ticket and
 * the site refuses it without sending a confirmation. Attendance-only rows
 * (Tent? = No) are never counted and never refused. Deleting a cancelled row
 * frees the place back up.
 *
 * THE DUPLICATE GUARD is the important part. Codes are generated randomly by
 * the site (a Sheet has no atomic counter to hand out sequential numbers), so
 * this script refuses to append a code that already exists and returns
 * { ok: false, error: 'duplicate-code' }. The site then retries with a fresh
 * code. Without this, a collision would silently give two campers the same
 * code and there would be no way to tell them apart on the night.
 *
 * PADI CHECK (the gate check-in tool, bottom of this file). A POST carrying
 * `action` — `checkin`, `stats` or `roster` — is a gate request and never
 * reaches the sign-up code. It must also carry `secret`, which has to match
 * the Script Property PADI_CHECK_SECRET, or it gets `unauthorised`. To set up:
 * Project Settings -> time zone (GMT+01:00) Lagos, add the Script Property
 * PADI_CHECK_SECRET, run `setupPadiCheck()` once (it makes the Scan log tab).
 * `checkin` is the one place this script edits a row after writing it: it
 * puts the arrival time in Checked In?. Details in SETUP.md, "Padi Check".
 */

const SHEET_NAME = 'Sign-ups'
const LOOKUP_SHEET_NAME = 'Lookup'

/**
 * 80 tents. Once the sheet holds this many rows with Tent? = Yes, doPost
 * refuses the next sleepover ticket with `tents-full` and the site sends no
 * confirmation email. Attendance-only tickets are not capped.
 *
 * This is the ONLY place the cap can be enforced — the website is statically
 * rendered and has no count of its own. It is a second copy of TENT_CAP in
 * lib/events/mad-settings.ts; change both together, then redeploy as a NEW
 * VERSION of the existing deployment (Deploy -> Manage deployments).
 *
 * To reopen a tent after a cancellation, delete the cancelled row (or raise
 * this number). Rows are counted, so a deleted row frees a place.
 */
const TENT_CAP = 80

const HEADERS = [
  'Timestamp',
  'Code',
  'Name',
  'Email',
  'Phone',
  'Instagram',
  'Ticket',
  'Tent?',
  'Price (NGN)',
  'Paid?',
  'Checked In?',
  // Filled in by hand at check-in: the number on the tent's tag. Maps each
  // code to a tent for cleaning and damage checks — from the Camp Night
  // debrief (26/09/2026). Blank for attendance-only tickets.
  'Tent ID',
  'Notes',
]

const CODE_COLUMN = 2 // 1-indexed, matches HEADERS above
const TENT_COLUMN = 8 // 'Tent?' — 1-indexed, matches HEADERS above

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME)

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]
  if (firstRow.every(function (v) { return v === '' })) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0e3e2e')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('left')
    sheet.setFrozenRows(1)

    sheet.setColumnWidth(1, 160) // Timestamp
    sheet.setColumnWidth(2, 130) // Code
    sheet.setColumnWidth(3, 200) // Name
    sheet.setColumnWidth(4, 230) // Email
    sheet.setColumnWidth(5, 150) // Phone
    sheet.setColumnWidth(6, 160) // Instagram
    sheet.setColumnWidth(7, 210) // Ticket
    sheet.setColumnWidth(8, 70)  // Tent?
    sheet.setColumnWidth(9, 110) // Price
    sheet.setColumnWidth(10, 80) // Paid?
    sheet.setColumnWidth(11, 110) // Checked In?
    sheet.setColumnWidth(12, 90) // Tent ID
    sheet.setColumnWidth(13, 240) // Notes
  }
  return sheet
}

/** How many sign-ups are in the sheet, excluding the header row. */
function countSignups(sheet) {
  return Math.max(0, sheet.getLastRow() - 1)
}

/** How many sign-ups hold a tent — the number TENT_CAP is checked against. */
function countTents(sheet) {
  const last = sheet.getLastRow()
  if (last < 2) return 0
  const flags = sheet.getRange(2, TENT_COLUMN, last - 1, 1).getValues()
  let n = 0
  for (let i = 0; i < flags.length; i += 1) {
    if (String(flags[i][0]).trim().toLowerCase() === 'yes') n += 1
  }
  return n
}

/** Returns the 1-indexed row for a code, or -1. */
function findRowByCode(sheet, code) {
  const last = sheet.getLastRow()
  if (last < 2) return -1
  const codes = sheet.getRange(2, CODE_COLUMN, last - 1, 1).getValues()
  for (let i = 0; i < codes.length; i += 1) {
    if (String(codes[i][0]).trim().toUpperCase() === String(code).trim().toUpperCase()) {
      return i + 2
    }
  }
  return -1
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

function doPost(e) {
  // Serialise appends. Both the capacity check and the duplicate-code check
  // read the sheet and then write to it, so without a lock two sign-ups
  // arriving together could both read 79 tents and both be let in — or both
  // claim the same code. 30s is far longer than an append takes.
  const lock = LockService.getScriptLock()
  try {
    lock.waitLock(30000)
  } catch (err) {
    return jsonOut({ ok: false, error: 'busy' })
  }

  try {
    const body = JSON.parse(e.postData.contents)
    const sheet = getOrCreateSheet()

    // Padi Check. A body carrying `action` comes from the gate, never from the
    // sign-up form, and stops here; a body without one runs the sign-up code
    // below exactly as before. Still inside the lock, so two scans of one code
    // cannot both come back `welcome`.
    if (body.action) return jsonOut(handlePadiCheck(body, sheet))

    if (!body.code) return jsonOut({ ok: false, error: 'missing-code' })

    // Capacity, for tent tickets only. Checked before the duplicate guard so a
    // full camp answers 'tents-full' rather than sending the site into its
    // retry loop. `usesTent` comes from the site's ticket definition; an
    // attendance-only ticket skips this entirely.
    const usesTent = body.usesTent === true
    if (usesTent && countTents(sheet) >= TENT_CAP) {
      return jsonOut({ ok: false, error: 'tents-full', capacity: TENT_CAP })
    }

    // The guarantee the random code generator cannot make on its own.
    if (findRowByCode(sheet, body.code) !== -1) {
      return jsonOut({ ok: false, error: 'duplicate-code' })
    }

    sheet.appendRow([
      new Date(),
      body.code,
      body.name || '',
      body.email || '',
      body.phone || '',
      body.instagram || '',
      body.ticketLabel || body.ticketId || '',
      usesTent ? 'Yes' : 'No', // Tent? — what countTents reads
      body.price || '',
      // Paid? — payment happens offline BEFORE sign-up, and the form makes the
      // guest confirm it, so this arrives as 'Yes'. Correct it by hand in the
      // rare case someone signs up without having paid.
      body.paid || 'No',
      'No',   // Checked In? — set by hand on the night
      '',     // Tent ID — set by hand at check-in
      '',     // Notes
    ])

    return jsonOut({
      ok: true,
      code: body.code,
      tentsRemaining: Math.max(0, TENT_CAP - countTents(sheet)),
    })
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

/**
 * GET with ?code=MAD-XXXXXX returns that signee as JSON.
 * GET with no parameters returns a heartbeat, so pasting the deployment URL
 * in a browser confirms the deployment is live.
 */
function doGet(e) {
  const code = e && e.parameter && e.parameter.code
  const sheet = getOrCreateSheet()

  if (!code) {
    const tents = countTents(sheet)
    return jsonOut({
      ok: true,
      service: 'mad-settings-signups',
      sheet: SHEET_NAME,
      signups: countSignups(sheet),
      tents: tents,
      tentCapacity: TENT_CAP,
      tentsRemaining: Math.max(0, TENT_CAP - tents),
    })
  }

  const row = findRowByCode(sheet, code)
  if (row === -1) return jsonOut({ ok: false, error: 'not-found', code: code })

  const values = sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0]
  const record = {}
  for (let i = 0; i < HEADERS.length; i += 1) record[HEADERS[i]] = values[i]
  return jsonOut({ ok: true, row: row, record: record })
}

/**
 * Builds the Lookup tab: type a code in B1 and the sign-up fills in below.
 * Meant for a phone at the gate, where Ctrl+F is painful.
 */
function setupLookupTab() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(LOOKUP_SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(LOOKUP_SHEET_NAME)
  sheet.clear()

  sheet.getRange('A1').setValue('Enter code:').setFontWeight('bold')
  sheet.getRange('B1').setBackground('#fdf6e3').setBorder(true, true, true, true, false, false)
  sheet.setColumnWidth(1, 150)
  sheet.setColumnWidth(2, 280)

  for (let i = 0; i < HEADERS.length; i += 1) {
    const row = i + 3
    sheet.getRange(row, 1).setValue(HEADERS[i]).setFontWeight('bold')
    // IFERROR keeps the tab clean before a code is typed and when one is wrong.
    sheet
      .getRange(row, 2)
      .setFormula(
        '=IFERROR(INDEX(\'' + SHEET_NAME + '\'!' +
          columnLetter(i + 1) + ':' + columnLetter(i + 1) +
          ', MATCH($B$1, \'' + SHEET_NAME + '\'!' +
          columnLetter(CODE_COLUMN) + ':' + columnLetter(CODE_COLUMN) +
          ', 0)), IF($B$1="", "", "NOT FOUND"))',
      )
  }
  sheet.getRange(3, 1, HEADERS.length, 1).setBackground('#e8f0ed')
}

function columnLetter(n) {
  let s = ''
  while (n > 0) {
    const m = (n - 1) % 26
    s = String.fromCharCode(65 + m) + s
    n = Math.floor((n - m) / 26)
  }
  return s
}

/** Run this once after pasting the script. */
function setup() {
  getOrCreateSheet()
  setupLookupTab()
}

// ---------------------------------------------------------------------------
// Padi Check — gate check-in (usl-build/7-prd.md, R-001)
// ---------------------------------------------------------------------------

const SCAN_LOG_SHEET_NAME = 'Scan log'
const SCAN_LOG_HEADERS = ['Timestamp', 'Code', 'Status', 'Name']

// 1-indexed, looked up from HEADERS so they cannot drift from it.
const NAME_COLUMN = HEADERS.indexOf('Name') + 1
const TICKET_COLUMN = HEADERS.indexOf('Ticket') + 1
const PAID_COLUMN = HEADERS.indexOf('Paid?') + 1
const CHECKED_IN_COLUMN = HEADERS.indexOf('Checked In?') + 1

/**
 * Routes a gate request. Every action needs the shared secret, held in the
 * Script Property PADI_CHECK_SECRET and in the website's env as
 * PADI_CHECK_SCRIPT_SECRET. If the property is missing or empty, every
 * action is refused, so a half-configured script fails closed.
 */
function handlePadiCheck(body, sheet) {
  const secret = PropertiesService.getScriptProperties().getProperty('PADI_CHECK_SECRET')
  if (!secret || typeof body.secret !== 'string' || body.secret !== secret) {
    return { ok: false, error: 'unauthorised' }
  }

  if (body.action === 'checkin') return padiCheckIn(sheet, body.code, body.at)
  if (body.action === 'stats') {
    const counts = countArrivals(sheet)
    return { ok: true, checkedIn: counts.checkedIn, total: counts.total }
  }
  if (body.action === 'roster') return { ok: true, roster: padiRoster(sheet) }
  return { ok: false, error: 'unknown-action' }
}

/**
 * Marks a code as arrived. Answers one of four statuses; only `welcome`
 * writes to Sign-ups, and every other status is appended to the Scan log.
 * The response never carries email, phone, Instagram or price.
 *
 * `at` is the time the gate let the guest in. The website answers the gate
 * from its own fast copy of the list and sends the arrival here afterwards,
 * sometimes after a retry, so the sheet records the gate's time rather than
 * the moment this call happened to land. Anything not shaped like
 * yyyy-MM-ddTHH:mm:ss is ignored and the current Lagos time is used.
 */
function padiCheckIn(sheet, code, at) {
  if (!code) return { ok: false, error: 'missing-code' }

  const row = findRowByCode(sheet, code)
  if (row === -1) {
    logScan(code, 'not-found', '')
    return withCounts(sheet, { ok: true, status: 'not-found' })
  }

  const values = sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0]
  const guest = {
    name: String(values[NAME_COLUMN - 1]),
    ticket: String(values[TICKET_COLUMN - 1]),
    usesTent: isYes(values[TENT_COLUMN - 1]),
  }

  if (!isYes(values[PAID_COLUMN - 1])) {
    logScan(code, 'not-paid', guest.name)
    return withCounts(sheet, Object.assign({ ok: true, status: 'not-paid' }, guest))
  }

  const checkedIn = values[CHECKED_IN_COLUMN - 1]
  if (hasArrived(checkedIn)) {
    logScan(code, 'already', guest.name)
    return withCounts(
      sheet,
      Object.assign({ ok: true, status: 'already', checkedInAt: formatArrival(checkedIn) }, guest),
    )
  }

  const time = typeof at === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(at) ? at : lagosNow()
  sheet.getRange(row, CHECKED_IN_COLUMN).setValue(time)
  return withCounts(sheet, Object.assign({ ok: true, status: 'welcome', checkedInAt: time }, guest))
}

/**
 * Paid rows only: the four fields the printed gate list needs, plus
 * `checkedInAt` for guests already marked in, so the website's fast copy
 * of the list knows who has arrived.
 */
function padiRoster(sheet) {
  const last = sheet.getLastRow()
  if (last < 2) return []
  const rows = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues()
  const out = []
  for (let i = 0; i < rows.length; i += 1) {
    const r = rows[i]
    if (!isYes(r[PAID_COLUMN - 1])) continue
    const entry = {
      name: String(r[NAME_COLUMN - 1]),
      code: String(r[CODE_COLUMN - 1]),
      ticketLabel: String(r[TICKET_COLUMN - 1]),
      usesTent: isYes(r[TENT_COLUMN - 1]),
    }
    if (hasArrived(r[CHECKED_IN_COLUMN - 1])) entry.checkedInAt = formatArrival(r[CHECKED_IN_COLUMN - 1])
    out.push(entry)
  }
  return out
}

/**
 * checkedIn: rows whose Checked In? is neither blank nor `No`.
 * total: rows with Paid? = Yes.
 */
function countArrivals(sheet) {
  const last = sheet.getLastRow()
  if (last < 2) return { checkedIn: 0, total: 0 }
  const rows = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues()
  let checkedIn = 0
  let total = 0
  for (let i = 0; i < rows.length; i += 1) {
    if (hasArrived(rows[i][CHECKED_IN_COLUMN - 1])) checkedIn += 1
    if (isYes(rows[i][PAID_COLUMN - 1])) total += 1
  }
  return { checkedIn: checkedIn, total: total }
}

function withCounts(sheet, result) {
  const counts = countArrivals(sheet)
  result.checkedIn = counts.checkedIn
  result.total = counts.total
  return result
}

function isYes(v) {
  return String(v).trim().toLowerCase() === 'yes'
}

function hasArrived(v) {
  const s = String(v).trim().toLowerCase()
  return s !== '' && s !== 'no'
}

function lagosNow() {
  return Utilities.formatDate(new Date(), 'Africa/Lagos', "yyyy-MM-dd'T'HH:mm:ss")
}

/**
 * Sheets may turn the written ISO string into a date, and a time typed by
 * hand certainly will. Either way, send back the same string shape.
 */
function formatArrival(v) {
  if (v instanceof Date) return Utilities.formatDate(v, 'Africa/Lagos', "yyyy-MM-dd'T'HH:mm:ss")
  return String(v)
}

function getOrCreateScanLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SCAN_LOG_SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(SCAN_LOG_SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet
      .getRange(1, 1, 1, SCAN_LOG_HEADERS.length)
      .setValues([SCAN_LOG_HEADERS])
      .setFontWeight('bold')
      .setBackground('#0e3e2e')
      .setFontColor('#ffffff')
    sheet.setFrozenRows(1)
    sheet.setColumnWidth(1, 160)
    sheet.setColumnWidth(2, 130)
    sheet.setColumnWidth(3, 100)
    sheet.setColumnWidth(4, 200)
  }
  return sheet
}

/**
 * A not-found code is whatever was scanned or typed, so it is capped in
 * length and kept from starting with = + - @, which Sheets would read as a
 * formula.
 */
function logScan(code, status, name) {
  let safe = String(code).trim().slice(0, 40)
  if (/^[=+\-@]/.test(safe)) safe = "'" + safe
  getOrCreateScanLog().appendRow([new Date(), safe, status, name])
}

/** Run once after pasting this version: creates the Scan log tab. */
function setupPadiCheck() {
  getOrCreateScanLog()
}
