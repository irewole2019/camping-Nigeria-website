'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { premiumEase } from '@/lib/animation'

export default function MediaFeature() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section
      id="media-feature"
      ref={ref}
      className="relative w-full h-[60vh] min-h-[420px] overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 h-[110%]"
      >
        <Image
          src="https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?w=1600&q=80&auto=format&fit=crop"
          alt="A wide camping landscape at dusk"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-dark/40" />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: premiumEase }}
        >
          <span className="font-serif text-lg font-semibold text-brand-light tracking-wide">
            Watch Our Experience
          </span>
          <p className="font-sans text-sm text-brand-light/70">
            Video coming soon
          </p>
        </motion.div>
      </div>
    </section>
  )
}
