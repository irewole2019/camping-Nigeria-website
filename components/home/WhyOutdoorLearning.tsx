import Section from '@/components/ui/Section'
import Image from 'next/image'
import { SCHOOLS_WHY_OUTDOOR_LEARNING } from '@/lib/media'

export default function WhyOutdoorLearning() {
  return (
    <Section id="why-outdoor-learning" className="bg-brand-light">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left: Image with accent border offset */}
        <div className="relative">
          {/* Accent border offset layer */}
          <div
            className="absolute -bottom-4 -right-4 w-full h-full rounded-xl border-2 border-brand-accent"
            aria-hidden="true"
          />
          <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
            <Image
              src={SCHOOLS_WHY_OUTDOOR_LEARNING.src}
              alt={SCHOOLS_WHY_OUTDOOR_LEARNING.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right: Text content */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-sans font-semibold tracking-widest uppercase text-brand-accent">
              The Case for the Outdoors
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance leading-tight">
              Why Outdoor Learning Matters
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-sans text-base leading-relaxed text-brand-dark/80">
              Some lessons cannot be taught at a desk. They are learned through shared challenges,
              problem-solving in real time, and moments of reflection under open skies.
            </p>
            <p className="font-sans text-base leading-relaxed text-brand-dark/80">
              Outdoor experiences strengthen leadership, resilience, communication, and character
              in ways traditional classrooms cannot replicate.
            </p>
          </div>

          {/* Stat strip */}
          <div className="mt-2 grid grid-cols-2 gap-6 border-t border-brand-dark/10 pt-6">
            <div>
              <p className="font-serif text-3xl font-bold text-brand-dark">94%</p>
              <p className="font-sans text-sm text-brand-dark/60 mt-1 leading-snug">of educators report improved student engagement after outdoor programs</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-brand-dark">3×</p>
              <p className="font-sans text-sm text-brand-dark/60 mt-1 leading-snug">better retention of skills learned in experiential outdoor settings</p>
            </div>
          </div>
        </div>

      </div>
    </Section>
  )
}
