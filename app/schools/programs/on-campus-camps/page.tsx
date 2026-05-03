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
import { ON_CAMPUS_CAMPS } from '@/lib/program-data'
import { SCHOOLS_PROGRAMS } from '@/lib/media'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from '@/lib/structured-data'

const data = ON_CAMPUS_CAMPS

export const metadata = buildPageMetadata({
  title: 'Multi-day On-Campus Camps | Camping Nigeria',
  description:
    'Immersive multi-day camp experiences delivered right at your school gates — adventure, teamwork, and growth without long-distance travel.',
  path: '/schools/programs/on-campus-camps',
})

export default function OnCampusCampsPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="on-campus-camps-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Schools', path: '/schools' },
          { name: 'Multi-day On-Campus Camps', path: '/schools/programs/on-campus-camps' },
        ])}
      />
      <JsonLd
        id="on-campus-camps-service-jsonld"
        data={buildServiceJsonLd({
          name: data.title,
          description: data.overview,
          path: '/schools/programs/on-campus-camps',
          serviceType: 'Overnight school camp',
          offers: data.tiers.map((tier) => ({
            name: `${tier.name} — ${tier.tag}`,
            description: `${tier.duration}. Includes: ${tier.includes.join(', ')}.`,
          })),
        })}
      />
      <Navbar />
      <PageHero
        image={SCHOOLS_PROGRAMS[0].src}
        imageAlt={SCHOOLS_PROGRAMS[0].alt}
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
