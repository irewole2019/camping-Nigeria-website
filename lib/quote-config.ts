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
  /**
   * Optional override for the item thumbnail. When set, takes precedence over
   * the `/images/gear-rental/items/<id>.webp` static fallback, so non-devs can
   * swap images by editing the sheet — no redeploy needed.
   *
   * Google Drive share links (`drive.google.com/file/d/<ID>/…`) are normalised
   * to `lh3.googleusercontent.com/d/<ID>` so they actually render in `<img>`.
   */
  image_url?: string
}

/**
 * Google Drive's `/file/d/<ID>/view` URL is an HTML viewer page — `<img>` tags
 * can't display it. Their CDN does support direct hotlinking via
 * `lh3.googleusercontent.com/d/<ID>`, which works for any "Anyone with the
 * link → Viewer" file. We rewrite the URL so the sheet stays editable with
 * whatever URL form Google's Share dialog produces.
 */
function normaliseImageUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  const m = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([A-Za-z0-9_-]{20,})/)
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`
  return trimmed
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
  const imgIdx = headers.indexOf('image_url')
  if (idIdx < 0 || nameIdx < 0 || catIdx < 0) {
    throw new Error('Items CSV is missing required columns')
  }

  const items: QuoteItem[] = []
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    const id = (row[idIdx] || '').trim()
    const name = (row[nameIdx] || '').trim()
    if (!id || !name) continue
    const image_url = imgIdx >= 0 ? normaliseImageUrl(row[imgIdx] || '') : ''
    items.push({
      id,
      name,
      category: (row[catIdx] || '').trim() || 'Other',
      available_qty: qtyIdx >= 0 ? Number((row[qtyIdx] || '0').trim()) || 0 : 0,
      ...(image_url ? { image_url } : {}),
    })
  }
  return items
}
