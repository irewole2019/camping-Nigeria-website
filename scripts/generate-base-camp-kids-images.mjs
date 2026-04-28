#!/usr/bin/env node
/**
 * Generate Base Camp Kids marketing images via inference.sh (openai/gpt-image-2).
 *
 * Usage: node scripts/generate-base-camp-kids-images.mjs [--only=<name>]
 *
 * Reads INFERENCE_SH_API_KEY from .env.local. Writes .webp files to
 * public/images/events/base-camp-kids/. Once all six are saved, update
 * lib/events/base-camp-kids.ts to point HERO_IMAGE etc. at the new paths.
 *
 * Brand palette woven into prompts:
 *   forest green #0e3e2e · gold #e6b325 · cream #f3efe6
 * Setting: Abuja savanna, late dry season — acacia trees, ochre grass.
 * Composition rule: kids appear only from behind / in motion blur / hands-only
 * close-ups, never as identifiable AI-generated faces.
 */

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// --- env ---
const envText = readFileSync(join(ROOT, '.env.local'), 'utf8')
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}
const KEY = process.env.INFERENCE_SH_API_KEY
if (!KEY) {
  console.error('INFERENCE_SH_API_KEY missing from .env.local')
  process.exit(1)
}

const APP = 'openai/gpt-image-2@latest'
const ENDPOINT = 'https://api.inference.sh/apps/run'
const OUT_DIR = join(ROOT, 'public/images/events/base-camp-kids')
mkdirSync(OUT_DIR, { recursive: true })

const onlyFlag = process.argv.find(a => a.startsWith('--only='))
const ONLY = onlyFlag ? onlyFlag.slice(7) : null

const JOBS = [
  {
    name: 'hero',
    width: 2048,
    height: 1152,
    prompt:
      'Wide cinematic photograph of a Children\'s Day camp scene at golden-hour morning light in the Abuja savanna, Nigeria. Mid-distance: a cluster of forest-green canvas A-frame tents with small hand-painted gold pennant flags arranged in a horseshoe on dry-season ochre grass under a pair of acacia trees. Children aged 6 to 10 in matching cream T-shirts running between tents — shown from behind or in motion blur, faces not visible. Bunting in cream and gold strung between tents. Soft warm sunlight, subtle lens flare, shallow depth of field on the foreground tent. Joyful, safe, premium documentary photography aesthetic, Fujifilm color science. No text, no logos, no readable signage.',
  },
  {
    name: 'positioning',
    width: 1280,
    height: 960,
    prompt:
      'Top-down close-up of small brown hands working on a tie-dye Adire bandana on a rustic wooden trestle table at an outdoor camp in Abuja. Indigo and gold dye in small ceramic pots, twine, gloves, a stack of folded cream T-shirts at the edge of frame, a few scattered acacia leaves. Soft diffused daylight, warm earthy palette of forest green, gold, and cream. No faces visible — only forearms and hands. Documentary product photography, premium colour grading. No text, no logos.',
  },
  {
    name: 'homepage-banner',
    width: 2048,
    height: 1152,
    prompt:
      'Wide editorial photograph of a finished Children\'s Day camp setup in the Abuja savanna at midday: four forest-green canvas A-frame tents with small house flags in gold, cream, and forest green flapping gently. A long wooden table in the foreground holds glass jars of mocktails and trays of West African small chops. A hand-painted wooden welcome arch frames the left side, no text on it. One small figure in the deep background carrying a bucket, motion-blurred, no face visible. Acacia trees, ochre dry grass, golden warm sunlight, cinematic depth of field, premium documentary photography. No text, no logos, no readable signage.',
  },
  {
    name: 'souvenir-certificate',
    width: 1024,
    height: 1024,
    prompt:
      'Flat-lay product photograph on a cream linen surface: a printed children\'s camp certificate on warm off-white textured paper with a forest-green decorative border and a gold foil seal in the lower right, beside a sprig of dried savanna grass and a small wooden name tag tied with twine. The certificate is shown obliquely so its text is illegible. Soft diffused daylight from the upper left, gentle natural shadows, premium editorial product photography. No people, no readable text.',
  },
  {
    name: 'souvenir-water-bottle',
    width: 1024,
    height: 1024,
    prompt:
      'Studio product photograph of a single matte forest-green reusable stainless steel water bottle with a brushed gold cap, standing on weathered wooden picnic-table planks outdoors. Soft natural daylight from the right, slight condensation on the bottle, a small folded cream cotton wristband resting beside the base. Shallow depth of field, blurred ochre savanna grass and acacia leaves in the background. Premium e-commerce aesthetic, warm earthy tones. No text, no logos, no readable branding.',
  },
  {
    name: 'souvenir-goodie-bag',
    width: 1024,
    height: 1024,
    prompt:
      'Three small cotton drawstring goodie bags in cream, forest green, and warm gold, lined up on a rustic wooden bench under dappled tree shade. Each bag is plump with contents, drawstrings tied with twine. A folded camp T-shirt and a rolled bandana visible behind the row. Warm natural side-light from the upper right, subtle bokeh, premium product photography, earthy colour palette. No text, no logos, no readable branding.',
  },
]

// inference.sh task status codes (from SDK)
const STATUS = { COMPLETED: 10, FAILED: 11, CANCELLED: 12 }
const STATUS_LABEL = {
  0: 'unknown', 1: 'received', 2: 'queued', 3: 'dispatched',
  4: 'preparing', 5: 'serving', 6: 'setting up', 7: 'running',
  8: 'cancelling', 9: 'uploading', 10: 'completed', 11: 'failed', 12: 'cancelled',
}
const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 10 * 60 * 1000

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { throw new Error(`non-JSON response (${res.status}): ${text.slice(0, 200)}`) }
  if (!json.success) throw new Error(`api error: ${JSON.stringify(json.error)}`)
  return json.data
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { throw new Error(`non-JSON response (${res.status}): ${text.slice(0, 200)}`) }
  if (!json.success) throw new Error(`api error: ${JSON.stringify(json.error)}`)
  return json.data
}

async function runOne(job) {
  const tag = `${job.name.padEnd(24)} ${job.width}×${job.height}`
  process.stdout.write(`▶ ${tag} … submitting`)

  // 1. Submit (returns immediately with task id, no `wait`)
  const submitted = await postJson(ENDPOINT, {
    app: APP,
    input: {
      prompt: job.prompt,
      width: job.width,
      height: job.height,
      quality: 'high',
      n: 1,
      output_format: 'webp',
      output_compression: 90,
    },
  })
  const taskId = submitted.id
  process.stdout.write(`\r▶ ${tag} … task ${taskId.slice(0, 8)}        `)

  // 2. Poll status until terminal
  const deadline = Date.now() + POLL_TIMEOUT_MS
  let lastStatus = -1
  let task
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))
    const status = await getJson(`https://api.inference.sh/tasks/${taskId}/status`)
    if (status.status !== lastStatus) {
      process.stdout.write(`\r▶ ${tag} … ${(STATUS_LABEL[status.status] || status.status).padEnd(20)}`)
      lastStatus = status.status
    }
    if (status.status === STATUS.COMPLETED) {
      task = await getJson(`https://api.inference.sh/tasks/${taskId}`)
      break
    }
    if (status.status === STATUS.FAILED || status.status === STATUS.CANCELLED) {
      task = await getJson(`https://api.inference.sh/tasks/${taskId}`)
      throw new Error(`${STATUS_LABEL[status.status]}: ${JSON.stringify(task.output || task.error || {}).slice(0, 300)}`)
    }
  }
  if (!task) throw new Error(`timed out after ${POLL_TIMEOUT_MS / 1000}s`)

  const url = task.output?.images?.[0]
  if (!url) throw new Error(`no image url in output: ${JSON.stringify(task.output)}`)

  // 3. Download
  process.stdout.write(`\r▶ ${tag} … downloading           `)
  const img = await fetch(url)
  if (!img.ok) throw new Error(`download failed ${img.status}`)
  const buf = Buffer.from(await img.arrayBuffer())
  const outPath = join(OUT_DIR, `${job.name}.webp`)
  writeFileSync(outPath, buf)
  process.stdout.write(`\r✓ ${tag}  ${(buf.length / 1024).toFixed(0).padStart(4)} KB  → ${outPath.replace(ROOT + '/', '')}\n`)
}

const queue = ONLY ? JOBS.filter(j => j.name === ONLY) : JOBS
if (ONLY && queue.length === 0) {
  console.error(`no job named "${ONLY}". options: ${JOBS.map(j => j.name).join(', ')}`)
  process.exit(1)
}

console.log(`generating ${queue.length} image${queue.length === 1 ? '' : 's'} via ${APP}`)
console.log(`output → ${OUT_DIR.replace(ROOT + '/', '')}/`)
console.log('')

let failed = 0
for (const job of queue) {
  try {
    await runOne(job)
  } catch (err) {
    failed += 1
    process.stdout.write(`\r✗ ${job.name.padEnd(24)} — ${err.message}\n`)
  }
}

console.log('')
console.log(failed === 0 ? `done. ${queue.length}/${queue.length} succeeded.` : `done. ${queue.length - failed}/${queue.length} succeeded, ${failed} failed.`)
process.exit(failed === 0 ? 0 : 1)
