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
import { LEADERSHIP_DEVELOPMENT } from '@/lib/program-data'
import { SCHOOLS_PROGRAMS } from '@/lib/media'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from '@/lib/structured-data'

const data = LEADERSHIP_DEVELOPMENT

export const metadata = buildPageMetadata({
  title: 'Leadership Development | Camping Nigeria',
  description:
    'Structured challenges that grow confident, collaborative young leaders — designed for prefects, student councils, and senior students.',
  path: '/schools/programs/leadership-development',
})

export default function LeadershipDevelopmentPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="leadership-development-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Schools', path: '/schools' },
          {
            name: 'Leadership Development',
            path: '/schools/programs/leadership-development',
          },
        ])}
      />
      <JsonLd
        id="leadership-development-service-jsonld"
        data={buildServiceJsonLd({
          name: data.title,
          description: data.overview,
          path: '/schools/programs/leadership-development',
          serviceType: 'Student leadership programme',
          offers: data.tiers.map((tier) => ({
            name: `${tier.name} — ${tier.tag}`,
            description: `${tier.duration}. Includes: ${tier.includes.join(', ')}.`,
          })),
        })}
      />
      <Navbar />
      <PageHero
        image={SCHOOLS_PROGRAMS[2].src}
        imageAlt={SCHOOLS_PROGRAMS[2].alt}
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
