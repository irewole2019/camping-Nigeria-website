'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'
import type { ProgramModule } from '@/lib/program-data'

function ModuleCard({ module, index }: { module: ProgramModule; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: premiumEase, delay: index * 0.08 }}
      className="border border-brand-dark/10 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-brand-dark/[0.02] transition-colors duration-200"
        aria-expanded={open}
      >
        <div className="flex items-center gap-4">
          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand-accent/10 flex items-center justify-center font-serif font-bold text-brand-accent-readable text-sm">
            {index + 1}
          </span>
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-dark">{module.title}</h3>
            <p className="font-sans text-sm text-brand-dark/60 mt-0.5 hidden sm:block">{module.description}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-brand-dark/40 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: premiumEase }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-6 pt-0">
              <p className="font-sans text-sm text-brand-dark/60 mb-4 sm:hidden">{module.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                {module.activities.map((activity) => (
                  <div key={activity} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                    <span className="font-sans text-sm text-brand-dark/70">{activity}</span>
                  </div>
                ))}
              </div>

              <div className="bg-brand-accent/5 rounded-lg p-4">
                <p className="font-sans text-sm">
                  <span className="font-semibold text-brand-accent-readable">Outcome: </span>
                  <span className="text-brand-dark/70">{module.outcome}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ProgramModules({ modules }: { modules: ProgramModule[] }) {
  return (
    <Section className="bg-white">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          Program Modules
        </motion.span>
        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            What the Experience Includes
          </motion.h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {modules.map((module, i) => (
          <ModuleCard key={module.title} module={module} index={i} />
        ))}
      </div>
    </Section>
  )
}
