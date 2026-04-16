import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import ProgramOverview from '@/components/programs/ProgramOverview'
import ProgramPillars from '@/components/programs/ProgramPillars'
import ProgramModules from '@/components/programs/ProgramModules'
import SampleSchedule from '@/components/programs/SampleSchedule'
import PackageTiers from '@/components/programs/PackageTiers'
import ProgramCta from '@/components/programs/ProgramCta'
import { NATURE_CRAFT } from '@/lib/program-data'
import { SCHOOLS_PROGRAMS } from '@/lib/media'

const data = NATURE_CRAFT

export const metadata = {
  title: 'Nature & Craft | Camping Nigeria',
  description:
    'A single-day immersive experience blending outdoor adventure, creative expression, and environmental education for Nigerian schools.',
  openGraph: {
    title: 'Nature & Craft | Camping Nigeria',
    description:
      'A single-day immersive experience blending outdoor adventure, creative expression, and environmental education for Nigerian schools.',
    url: '/schools/programs/nature-craft',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Nature & Craft | Camping Nigeria',
    description:
      'A single-day immersive experience blending outdoor adventure, creative expression, and environmental education for Nigerian schools.',
  },
}

export default function NatureCraftPage() {
  return (
    <main id="main-content">
      <Navbar />
      <PageHero
        image={SCHOOLS_PROGRAMS[1].src}
        imageAlt={SCHOOLS_PROGRAMS[1].alt}
        eyebrow="School Program"
        headline={data.title}
        subheadline={data.subtitle}
        height="h-[70dvh]"
      />
      <ProgramOverview data={data} />
      <ProgramPillars pillars={data.pillars} />
      <ProgramModules modules={data.modules} />
      <SampleSchedule label={data.schedule.label} items={data.schedule.items} />
      <PackageTiers tiers={data.tiers} />
      <ProgramCta programTitle={data.title} />
      <Footer />
    </main>
  )
}
