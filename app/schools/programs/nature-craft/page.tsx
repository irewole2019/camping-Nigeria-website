import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import PageHero from '@/components/shared/PageHero'
import ProgramOverview from '@/components/programs/ProgramOverview'
import ProgramPillars from '@/components/programs/ProgramPillars'
import ProgramModules from '@/components/programs/ProgramModules'
import SampleSchedule from '@/components/programs/SampleSchedule'
import PackageTiers from '@/components/programs/PackageTiers'
import ProgramCta from '@/components/programs/ProgramCta'
import { NATURE_CRAFT } from '@/lib/program-data'
import { SCHOOLS_PROGRAMS } from '@/lib/media'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from '@/lib/structured-data'

const data = NATURE_CRAFT

export const metadata = buildPageMetadata({
  title: 'Nature & Craft | Camping Nigeria',
  description:
    'A single-day immersive experience blending outdoor adventure, creative expression, and environmental education for Nigerian schools.',
  path: '/schools/programs/nature-craft',
})

export default function NatureCraftPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="nature-craft-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Schools', path: '/schools' },
          { name: 'Nature & Craft', path: '/schools/programs/nature-craft' },
        ])}
      />
      <JsonLd
        id="nature-craft-service-jsonld"
        data={buildServiceJsonLd({
          name: data.title,
          description: data.overview,
          path: '/schools/programs/nature-craft',
          serviceType: 'Outdoor education programme',
          offers: data.tiers.map((tier) => ({
            name: `${tier.name} — ${tier.tag}`,
            description: `${tier.duration}. Includes: ${tier.includes.join(', ')}.`,
          })),
        })}
      />
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
