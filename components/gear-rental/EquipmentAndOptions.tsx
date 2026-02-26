'use client'

import { motion } from 'framer-motion'
import {
  Tent,
  BedDouble,
  Wind,
  Lightbulb,
  UtensilsCrossed,
  Users,
  Truck,
  Wrench,
  CalendarDays,
  PackageOpen,
} from 'lucide-react'
import Section from '@/components/ui/Section'

const premiumEase = [0.16, 1, 0.3, 1]

const equipment = [
  { icon: Tent, label: 'Tents' },
  { icon: BedDouble, label: 'Sleeping mats' },
  { icon: Wind, label: 'Blankets' },
  { icon: Lightbulb, label: 'Lighting systems' },
  { icon: UtensilsCrossed, label: 'Cooking equipment' },
  { icon: Users, label: 'Group camp setups' },
]

const options = [
  { icon: Truck, label: 'Self-pickup or delivery' },
  { icon: Wrench, label: 'Setup assistance available' },
  { icon: CalendarDays, label: 'Flexible rental durations' },
  { icon: PackageOpen, label: 'Bulk rental for schools and events' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: premiumEase } },
}

export default function EquipmentAndOptions() {
  return (
    <Section className="bg-brand-light">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

        {/* Left — Available Equipment */}
        <div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark mb-8">
            Available Equipment
          </h3>
          <motion.ul
            className="grid grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {equipment.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                variants={itemVariants}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-4 shadow-sm border border-brand-dark/5"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-accent/15 text-brand-dark shrink-0">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="font-sans text-sm font-medium text-brand-dark">
                  {label}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Right — Rental Options */}
        <div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-brand-dark mb-8">
            Rental Options
          </h3>
          <motion.ul
            className="flex flex-col gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {options.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                variants={itemVariants}
                className="flex items-center gap-4 bg-brand-dark rounded-xl px-5 py-4"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-accent/20 text-brand-accent shrink-0">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="font-sans text-sm font-semibold text-white">
                  {label}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

      </div>
    </Section>
  )
}
