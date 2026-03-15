'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Target,
  Shield,
  Compass,
  Users,
  Search,
  Leaf,
  Palette,
  Zap,
  Flame,
  User,
  MessageCircle,
  Handshake,
  Rocket,
  type LucideIcon,
} from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'
import type { ProgramPillar } from '@/lib/program-data'

const icons: Record<string, LucideIcon> = {
  Responsibility: Target,
  Resilience: Shield,
  Independence: Compass,
  Teamwork: Users,
  Curiosity: Search,
  Explore: Leaf,
  Create: Palette,
  Play: Zap,
  Gather: Flame,
  'Self-Leadership': User,
  Communication: MessageCircle,
  Collaboration: Handshake,
  Initiative: Rocket,
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: premiumEase },
  },
}

export default function ProgramPillars({ pillars }: { pillars: ProgramPillar[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const cols = pillars.length <= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'

  return (
    <Section className="bg-brand-dark">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          Core Pillars
        </motion.span>
        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-white text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            What Students Develop
          </motion.h2>
        </div>
      </div>

      <motion.div
        ref={ref}
        className={`grid grid-cols-1 ${cols} gap-6`}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {pillars.map((pillar) => (
          <motion.div
            key={pillar.title}
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300"
          >
            {(() => {
              const Icon = icons[pillar.title]
              return Icon ? (
                <Icon className="w-7 h-7 text-brand-accent" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Leaf className="w-7 h-7 text-brand-accent" strokeWidth={1.5} aria-hidden="true" />
              )
            })()}
            <h3 className="font-serif text-lg font-bold text-white mt-4 mb-2">
              {pillar.title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-white/60">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
