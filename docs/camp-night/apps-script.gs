/**
 * Camp Night — sign-ups webhook and code lookup
 *
 * SETUP, once — the walkthrough with screenshots-worth of detail is in
 * docs/camp-night/SETUP.md. The short version:
 *   1. Create a Google Sheet (call it "Camp Night Sign-ups").
 *   2. Extensions -> Apps Script, paste this file, save.
 *   3. Run `setup()` once. Accept the permission prompt. It creates the
 *      Sign-ups tab with headers.
 *   4. Deploy -> New deployment -> Web app.
 *        Execute as:  Me
 *        Access:      Anyone
 *   5. Copy the Web app URL into the site's env as
 *      GOOGLE_SHEETS_CAMP_NIGHT_WEBHOOK_URL (and into Vercel).
 *
 * The site POSTs one JSON object per sign-up to doPost, which appends a row.
 *
 * CHECKING A CODE AT THE GATE, three ways:
 *   - Ctrl+F the sheet for the code. Fastest on a laptop.
 *   - Put a code in the Lookup tab's yellow cell; the row fills in beside it.
 *     Built for a phone, where Ctrl+F is awkward.
 *   - GET the Web app URL with ?code=SCN-XXXXXX for a JSON answer.
 *
 * THE DUPLICATE GUARD is the important part. Codes are generated randomly by
 * the site (a Sheet has no atomic counter to hand out sequential numbers), so
 * this script refuses to append a code that already exists and returns
 * { ok: false, error: 'duplicate-code' }. The site then retries with a fresh
 * code. Without this, a collision would silently give two campers the same
 * code and there would be no way to tell them apart on the night.
 */

const SHEET_NAME = 'Sign-ups'
const LOOKUP_SHEET_NAME = 'Lookup'

const HEADERS = [
  'Timestamp',
  'Code',
  'Name',
  'Email',
  'Phone',
  'Instagram',
  'Tent Package',
  'Price (NGN)',
  'Paid?',
  'Checked In?',
  'Notes',
]

const CODE_COLUMN = 2 // 1-indexed, matches HEADERS above

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
    sheet.setColumnWidth(7, 190) // Tent Package
    sheet.setColumnWidth(8, 110) // Price
    sheet.setColumnWidth(9, 80)  // Paid?
    sheet.setColumnWidth(10, 110) // Checked In?
    sheet.setColumnWidth(11, 240) // Notes
  }
  return sheet
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
  try {
    const body = JSON.parse(e.postData.contents)
    const sheet = getOrCreateSheet()

    if (!body.code) return jsonOut({ ok: false, error: 'missing-code' })

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
      body.packageLabel || body.packageId || '',
      body.price || '',
      'No',   // Paid? — set by hand as payments land
      'No',   // Checked In? — set by hand on the night
      '',     // Notes
    ])

    return jsonOut({ ok: true, code: body.code })
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) })
  }
}

/**
 * GET with ?code=SCN-XXXXXX returns that signee as JSON.
 * GET with no parameters returns a heartbeat, so pasting the deployment URL
 * in a browser confirms the deployment is live.
 */
function doGet(e) {
  const code = e && e.parameter && e.parameter.code
  if (!code) {
    return jsonOut({ ok: true, service: 'camp-night-signups', sheet: SHEET_NAME })
  }

  const sheet = getOrCreateSheet()
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
