'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Section from '@/components/ui/Section'
import { premiumEase } from '@/lib/animation'

const programs = [
  {
    title: '2-Day On-Campus Camps',
    subtitle: 'Immersive outdoor experiences delivered right at your school gates.',
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Eco-Awareness Modules',
    subtitle: 'Curriculum-aligned sessions that build lasting environmental stewardship.',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Leadership Development',
    subtitle: 'Structured challenges that grow confident, collaborative young leaders.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: premiumEase },
  },
}

function ParallaxCard({ title, subtitle, image }: (typeof programs)[0]) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      style={{ position: 'relative' }}
      className="h-[400px] rounded-xl overflow-hidden group"
    >
      {/* Parallax image layer */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <motion.div
          style={{ y }}
          className="absolute inset-0 h-[110%]"
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-[filter] duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
          />
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 p-7">
        <h3 className="font-serif text-xl font-bold text-brand-light leading-snug text-balance">
          {title}
        </h3>
        <p className="font-sans text-sm leading-relaxed text-brand-light/75 mt-2 text-pretty">
          {subtitle}
        </p>
      </div>
    </motion.div>
  )
}

export default function OurSchoolPrograms() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section id="school-programs" className="bg-white">
      {/* Intro copy */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <motion.span
          className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent-readable"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: premiumEase }}
        >
          Structured for Schools
        </motion.span>

        {/* Masked H2 reveal */}
        <div className="overflow-hidden mt-3">
          <motion.h2
            className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
          >
            Our School Programs
          </motion.h2>
        </div>

        <motion.p
          className="font-sans text-base leading-relaxed text-brand-dark/70 mt-5 text-pretty"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: premiumEase, delay: 0.25 }}
        >
          We design structured outdoor programs tailored to Nigerian primary and secondary schools.
          From 2-day on-campus camps to eco-awareness and leadership modules, every experience is
          planned with safety, structure, and developmental outcomes in mind.
        </motion.p>
      </div>

      {/* Cards */}
      <motion.div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {programs.map((program) => (
          <ParallaxCard key={program.title} {...program} />
        ))}
      </motion.div>
    </Section>
  )
}
