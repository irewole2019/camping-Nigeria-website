/**
 * Loads the rental items list from the published Google Sheets CSV.
 *
 * The quote tool (separate project) treats this sheet as the source of truth
 * for what's rentable. We fetch the same CSV in the browser so customers see
 * the live catalogue without us needing to redeploy when stock changes.
 *
 * Only the items tab is consumed here — pricing, volume breaks and settings
 * stay on the server side of the quote tool.
 */

export interface QuoteItem {
  id: string
  name: string
  category: string
  available_qty: number
}

/** RFC 4180-ish CSV parser. Handles quoted fields, embedded quotes, BOM, CRLF. */
function parseCsv(text: string): string[][] {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)

  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
      continue
    }
    if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\r') {
      // skip — \n handles row break
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

export async function loadQuoteItems(
  url: string,
  signal?: AbortSignal,
): Promise<QuoteItem[]> {
  const res = await fetch(url, { signal, cache: 'no-store' })
  if (!res.ok) throw new Error(`Items fetch failed: ${res.status}`)
  const text = await res.text()
  const rows = parseCsv(text).filter((r) => r.some((cell) => cell.trim() !== ''))
  if (rows.length < 2) throw new Error('Items CSV is empty')

  const headers = rows[0].map((h) => h.trim().toLowerCase())
  const idIdx = headers.indexOf('id')
  const nameIdx = headers.indexOf('name')
  const catIdx = headers.indexOf('category')
  const qtyIdx = headers.indexOf('available_qty')
  if (idIdx < 0 || nameIdx < 0 || catIdx < 0) {
    throw new Error('Items CSV is missing required columns')
  }

  const items: QuoteItem[] = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    const id = (row[idIdx] || '').trim()
    const name = (row[nameIdx] || '').trim()
    if (!id || !name) continue
    items.push({
      id,
      name,
      category: (row[catIdx] || '').trim() || 'Other',
      available_qty: qtyIdx >= 0 ? Number((row[qtyIdx] || '0').trim()) || 0 : 0,
    })
  }
  return items
}
