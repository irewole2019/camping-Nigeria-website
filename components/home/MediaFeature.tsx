'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PlayCircle } from 'lucide-react'

const premiumEase = [0.16, 1, 0.3, 1]

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
      <motion.img
        src="https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?w=1600&q=80&auto=format&fit=crop"
        alt="A wide camping landscape at dusk"
        style={{ y }}
        className="absolute inset-0 w-full h-[110%] object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-dark/40" />

      {/* Centered play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <motion.button
          aria-label="Watch our experience video"
          className="flex flex-col items-center gap-4 group focus:outline-none"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: premiumEase }}
        >
          <PlayCircle
            className="w-20 h-20 text-brand-light opacity-90 transition-transform duration-500 group-hover:scale-110"
            strokeWidth={1.25}
          />
          <span className="font-serif text-lg font-semibold text-brand-light tracking-wide">
            Watch Our Experience
          </span>
        </motion.button>
      </div>
    </section>
  )
}
