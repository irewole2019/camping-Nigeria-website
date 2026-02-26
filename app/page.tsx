import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { LOGO_URL, VIDEO_URL } from '@/lib/constants'
import AnimatedTagline from '@/components/home/AnimatedTagline'
import BackgroundVideo from '@/components/home/BackgroundVideo'

export const metadata: Metadata = {
  title: 'Camping Nigeria — Real Growth Happens Outside',
  description:
    'Structured, safe, and development-focused camping experiences designed to build confidence, teamwork, and environmental awareness in Nigerian schools.',
}

const NAV_BUTTONS = [
  { label: 'Schools', href: '/schools' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'Individuals', href: '/individuals' },
]

export default function GatewayPage() {
  return (
    <main id="main-content" className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <BackgroundVideo
        src={VIDEO_URL}
        poster="/placeholder.jpg"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      {/* Full page layout: logo top-center, content lower-center */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between py-16">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Camping Nigeria home"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-md"
        >
          <Image
            src={LOGO_URL}
            alt="Camping Nigeria"
            width={200}
            height={100}
            className="h-24 w-auto object-contain drop-shadow-lg"
            priority
          />
        </Link>

        {/* Tagline + buttons */}
        <div className="flex flex-col items-center gap-10 pb-32">
          {/* Animated tagline (client component) */}
          <AnimatedTagline />

          {/* Navigation buttons */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {NAV_BUTTONS.map((btn) => (
                <Link
                  key={btn.href}
                  href={btn.href}
                  className="w-52 rounded-full border border-white/30 bg-white/10 px-8 py-3 text-center font-sans text-sm font-semibold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-brand-dark hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {btn.label}
                </Link>
              ))}
            </div>

            {/* Gear rental text link */}
            <Link
              href="/gear-rental"
              className="mt-6 inline-flex items-center gap-2 font-sans text-base text-white hover:text-brand-accent transition-colors duration-200 tracking-widest uppercase underline underline-offset-8 decoration-white/40 hover:decoration-brand-accent group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Rent Camping Gears
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
