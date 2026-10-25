'use client'

import { useEffect, useRef } from 'react'
import type { Html5Qrcode } from 'html5-qrcode'
import { SCANNER_COPY } from '@/lib/padi-check/copy'

/**
 * The rear camera, reading Gate passes (usl-build/7-prd.md, R-004).
 *
 * One QR, one check (AC-R004-03): the first read locks the scanner and pauses
 * the video, and it stays locked until `active` comes back true, which is
 * when the volunteer presses Next guest or Try again. A pass held in front of
 * the camera for ten seconds is still one request.
 *
 * The camera is released whenever the page is hidden (phone locked, app
 * switched) and started again when it comes back, so it never runs in a
 * pocket. html5-qrcode is loaded on demand, so the sign-in screen and the
 * rest of the site never download it.
 */

const REGION_ID = 'padi-camera'
// Html5QrcodeScannerState, copied so the library is not loaded just for an enum.
const SCANNING = 2
const PAUSED = 3

interface ScannerProps {
  /** False while a check is in flight or a result is on screen. */
  active: boolean
  /** Changed by "Turn on camera" to try starting the camera again. */
  retryKey?: number
  /** The raw text of the QR that was read. */
  onScan: (text: string) => void
  /** The camera cannot run. `unsupported` means the browser has no camera API at all. */
  onCameraOff: (unsupported: boolean) => void
  /** The camera is running, including after it was off (camera allowed later). */
  onCameraOn: () => void
}

export default function Scanner({ active, retryKey = 0, onScan, onCameraOff, onCameraOn }: ScannerProps) {
  const scanner = useRef<Html5Qrcode | null>(null)
  const startRef = useRef<() => void>(() => {})
  const locked = useRef(false)
  const activeRef = useRef(active)
  const onScanRef = useRef(onScan)
  const onCameraOffRef = useRef(onCameraOff)
  const onCameraOnRef = useRef(onCameraOn)

  useEffect(() => {
    onScanRef.current = onScan
    onCameraOffRef.current = onCameraOff
    onCameraOnRef.current = onCameraOn
  })

  // Start and stop, one at a time: a quick hide-show would otherwise race.
  useEffect(() => {
    let chain: Promise<void> = Promise.resolve()
    let gone = false

    const start = () =>
      (chain = chain.then(async () => {
        if (gone || scanner.current) return
        if (!navigator.mediaDevices?.getUserMedia) {
          onCameraOffRef.current(true)
          return
        }
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
        if (gone) return
        const instance = new Html5Qrcode(REGION_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
          useBarCodeDetectorIfSupported: true,
        })
        scanner.current = instance
        try {
          await instance.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              aspectRatio: 1,
              qrbox: (w: number, h: number) => {
                const side = Math.floor(Math.min(w, h) * 0.75)
                return { width: side, height: side }
              },
            },
            (text: string) => {
              if (locked.current || !activeRef.current) return
              locked.current = true
              try {
                instance.pause(true)
              } catch {
                // Already paused: the lock is what matters.
              }
              onScanRef.current(text)
            },
            () => {
              // Fires for every frame without a QR. Nothing to do.
            },
          )
          // The page went away while the camera was starting.
          if (gone) await instance.stop().catch(() => {})
          else onCameraOnRef.current()
        } catch {
          scanner.current = null
          if (!gone) onCameraOffRef.current(false)
        }
      }))

    const stop = () =>
      (chain = chain.then(async () => {
        const instance = scanner.current
        scanner.current = null
        if (!instance) return
        try {
          await instance.stop()
          instance.clear()
        } catch {
          // Never started, or already stopped.
        }
      }))

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stop()
      else start()
    }

    startRef.current = start
    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      gone = true
      document.removeEventListener('visibilitychange', onVisibility)
      stop()
    }
  }, [])

  // "Turn on camera": try again, for when the camera was allowed after a refusal.
  useEffect(() => {
    if (retryKey > 0) startRef.current()
  }, [retryKey])

  // Pause while a result is up; resume, unlocked, for the next guest.
  useEffect(() => {
    activeRef.current = active
    const instance = scanner.current
    if (!instance) return
    try {
      if (active) {
        locked.current = false
        if (instance.getState() === PAUSED) instance.resume()
      } else if (instance.getState() === SCANNING) {
        instance.pause(true)
      }
    } catch {
      // The camera is mid-start or mid-stop; the next change catches up.
    }
  }, [active])

  return (
    <div className="space-y-3">
      <p className="font-sans text-lg font-semibold text-brand-dark">{SCANNER_COPY.pointAtPass}</p>
      <div id={REGION_ID} className="aspect-square w-full overflow-hidden rounded-3xl bg-brand-dark shadow-lg" />
    </div>
  )
}
