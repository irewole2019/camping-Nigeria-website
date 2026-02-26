'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const words = ['Real', 'Growth', 'Happens', 'Outside']

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
}

const LOGO_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Camping%20Nigeria%20Logo%20-4Afjc35DawMRahQENzyiYcdmyAP92k.png'

const NAV_BUTTONS = [
  { label: 'Schools', href: '/schools' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'Individuals', href: '/individuals' },
]

export default function GatewayPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Website%20Background%20video-0ni3M91lKRRjvhQWMOe93j9gx7Pvbj.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

      {/* Full page layout: logo top-center, content lower-center */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between py-16">

        {/* Logo — centered at top, bigger */}
        <Link href="/" aria-label="Camping Nigeria home">
          <Image
            src={LOGO_URL}
            alt="Camping Nigeria"
            width={200}
            height={100}
            className="h-24 w-auto object-contain drop-shadow-lg"
            priority
          />
        </Link>

        {/* Tagline + buttons — raised from bottom */}
        <div className="flex flex-col items-center gap-10 pb-32">

          {/* Tagline */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white drop-shadow-lg tracking-tight">
              <motion.span
                className="flex flex-wrap justify-center gap-x-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {words.map((word) => (
                  <span key={word} className="overflow-hidden inline-block">
                    <motion.span className="inline-block" variants={wordVariants}>
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.span>
            </h1>
            <motion.p
              className="font-sans text-sm font-medium tracking-[0.2em] uppercase text-white/60 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
            >
              Select your experience
            </motion.p>
          </div>

          {/* Horizontal buttons */}
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
              className="mt-6 inline-flex items-center gap-2 font-sans text-base text-white hover:text-brand-accent transition-colors duration-200 tracking-widest uppercase underline underline-offset-8 decoration-white/40 hover:decoration-brand-accent group"
            >
              Rent Camping Gears
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}
