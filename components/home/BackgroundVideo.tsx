'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

interface VideoSource {
  src: string
  type: string
  media?: string
}

interface BackgroundVideoProps {
  src: string
  poster?: string
  /** Optional additional sources (e.g. WebM, or a smaller mobile variant). The base `src` remains the final fallback. */
  sources?: VideoSource[]
}

function subscribeReducedData(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia('(prefers-reduced-data: reduce)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getReducedDataSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-data: reduce)').matches
}

function getReducedDataServerSnapshot(): boolean {
  return false
}

/**
 * Honours `prefers-reduced-motion` (pause) and `prefers-reduced-data` (skip
 * the video entirely, show poster only). The `sources` array is ordered —
 * the browser picks the first compatible one, falling through to `src`.
 */
export default function BackgroundVideo({ src, poster, sources }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const skipVideo = useSyncExternalStore(
    subscribeReducedData,
    getReducedDataSnapshot,
    getReducedDataServerSnapshot,
  )

  useEffect(() => {
    if (skipVideo) return
    const video = videoRef.current
    if (!video) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotion.matches) {
      video.pause()
    } else {
      video.play().catch(() => {
        /* autoplay may be blocked; poster will still show */
      })
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) video.pause()
      else video.play().catch(() => {})
    }

    reducedMotion.addEventListener('change', handleMotionChange)
    return () => reducedMotion.removeEventListener('change', handleMotionChange)
  }, [skipVideo])

  if (skipVideo) {
    if (!poster) return null
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    )
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
      className="absolute inset-0 h-full w-full object-cover object-center"
    >
      {sources?.map((s) => (
        <source key={s.src} src={s.src} type={s.type} media={s.media} />
      ))}
      <source src={src} type="video/mp4" />
    </video>
  )
}
