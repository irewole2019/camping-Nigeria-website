/**
 * Base Camp Kids — Registrations webhook
 *
 * Paste this into Extensions → Apps Script in your registrations sheet.
 * Run `setup()` once to create the Registrations tab with brand-coloured
 * headers, then Deploy → New deployment → Web app → execute as Me, access
 * Anyone. Paste the resulting Web app URL into the website's
 * GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL env var.
 *
 * The website's /api/event-registration route POSTs JSON to doPost on every
 * registration; doPost appends a row. doGet exists only as a sanity check —
 * hitting the deployment URL in a browser returns a JSON heartbeat.
 */

const SHEET_NAME = 'Registrations'

const HEADERS = [
  'Timestamp',
  'Status',
  'Reference',
  'Parent Name',
  'Email',
  'Phone',
  'City',
  '# Kids',
  'Total (NGN)',
  'Children',
  'Emergency Contact',
  'Notes',
  'Allergies?',
  'Photo Consent',
]

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]
  const headerEmpty = firstRow.every(v => v === '')
  if (headerEmpty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0e3e2e')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('left')
    sheet.setFrozenRows(1)

    // Column widths tuned for readability
    sheet.setColumnWidth(1, 160)  // Timestamp
    sheet.setColumnWidth(2, 100)  // Status
    sheet.setColumnWidth(3, 150)  // Reference
    sheet.setColumnWidth(4, 180)  // Parent Name
    sheet.setColumnWidth(5, 220)  // Email
    sheet.setColumnWidth(6, 140)  // Phone
    sheet.setColumnWidth(7, 110)  // City
    sheet.setColumnWidth(8, 70)   // # Kids
    sheet.setColumnWidth(9, 110)  // Total
    sheet.setColumnWidth(10, 380) // Children (multi-line)
    sheet.setColumnWidth(11, 220) // Emergency
    sheet.setColumnWidth(12, 250) // Notes
    sheet.setColumnWidth(13, 90)  // Allergies?
    sheet.setColumnWidth(14, 120) // Photo Consent
  }

  return sheet
}

/**
 * Run this once after pasting the script. It creates the tab + headers and
 * leaves the sheet ready to receive registrations.
 */
function setup() {
  getOrCreateSheet()
  Logger.log('Sheet initialised. Next: Deploy → New deployment → Web app → Anyone has access.')
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Base Camp Kids registration webhook is live' }))
    .setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Empty POST body')
    }
    const data = JSON.parse(e.postData.contents)
    const sheet = getOrCreateSheet()
    const kids = Array.isArray(data.children) ? data.children : []

    const childrenSummary = kids
      .map((c, i) => `${i + 1}. ${c.fullName} (age ${c.age}) — ${c.allergies || 'no allergies'} — photo: ${c.photoConsent ? 'yes' : 'no'}`)
      .join('\n')

    const allergyFlag = kids.some(c => c.allergies && String(c.allergies).trim()) ? 'Y' : 'N'
    const photoConsentRatio = kids.length > 0
      ? `${kids.filter(c => c.photoConsent).length}/${kids.length}`
      : '—'

    sheet.appendRow([
      new Date(),
      data.status || 'pending',
      data.reference || '',
      data.parent && data.parent.fullName,
      data.parent && data.parent.email,
      data.parent && data.parent.phone,
      data.parent && data.parent.city,
      kids.length,
      data.total,
      childrenSummary,
      data.emergencyContact ? `${data.emergencyContact.name} — ${data.emergencyContact.phone}` : '',
      data.notes || '',
      allergyFlag,
      photoConsentRatio,
    ])

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
