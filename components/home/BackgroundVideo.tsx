'use client'

import { useEffect, useRef } from 'react'

interface BackgroundVideoProps {
  src: string
  poster?: string
}

export default function BackgroundVideo({ src, poster }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (mql.matches) {
      video.pause()
    } else {
      video.play().catch(() => {
        /* autoplay may be blocked; poster will still show */
      })
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        video.pause()
      } else {
        video.play().catch(() => {})
      }
    }

    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

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
      <source src={src} type="video/mp4" />
    </video>
  )
}
