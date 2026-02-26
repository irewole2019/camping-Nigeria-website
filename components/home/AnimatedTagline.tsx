'use client'

import { motion } from 'framer-motion'
import { premiumEase } from '@/lib/animation'

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
    transition: { duration: 0.75, ease: premiumEase },
  },
}

export default function AnimatedTagline() {
  return (
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
        transition={{ duration: 0.6, ease: premiumEase, delay: 1.0 }}
      >
        Select your experience
      </motion.p>
    </div>
  )
}
