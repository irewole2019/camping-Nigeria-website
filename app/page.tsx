import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import { LOGO_URL, VIDEO_URL } from '@/lib/constants'
import AnimatedTagline from '@/components/home/AnimatedTagline'
import BackgroundVideo from '@/components/home/BackgroundVideo'
import EventBanner from '@/components/home/EventBanner'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Camping Nigeria — Real Growth Happens Outside',
  description:
    'Structured, safe, and development-focused camping experiences designed to build confidence, teamwork, and environmental awareness in Nigerian schools.',
  path: '/',
})

const NAV_BUTTONS = [
  { label: 'Schools', href: '/schools' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'Individuals', href: '/individuals' },
]

export default function GatewayPage() {
  return (
    <main id="main-content">
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background video — poster falls back to the schools hero image if
            the video is slow to load, fails, or when prefers-reduced-data is set. */}
        <BackgroundVideo src={VIDEO_URL} poster="/images/schools/hero.webp" />

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
      </section>

      <EventBanner />

      <section className="bg-brand-dark text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            Outdoor Programmes in Nigeria for Schools, Organizations, and Individuals
          </h2>
          <p className="mt-4 max-w-3xl text-white/75 leading-relaxed text-base md:text-lg">
            Camping Nigeria designs structured outdoor experiences that build confidence,
            leadership, and collaboration. We support school camps, Duke of Edinburgh expedition
            delivery, team retreats, and premium gear rental with safety-first operations.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/schools"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              Explore School Programmes
            </Link>
            <Link
              href="/schools/international-award"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              Duke of Edinburgh Support
            </Link>
            <Link
              href="/schools/proposal"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              Request a School Proposal
            </Link>
            <Link
              href="/organizations"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              Plan an Organization Retreat
            </Link>
            <Link
              href="/individuals"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              Join an Individuals Camp
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              Learn About Camping Nigeria
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
