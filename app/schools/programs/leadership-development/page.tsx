import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import ProgramOverview from '@/components/programs/ProgramOverview'
import ProgramPillars from '@/components/programs/ProgramPillars'
import ProgramModules from '@/components/programs/ProgramModules'
import SampleSchedule from '@/components/programs/SampleSchedule'
import PackageTiers from '@/components/programs/PackageTiers'
import ProgramCta from '@/components/programs/ProgramCta'
import { LEADERSHIP_DEVELOPMENT } from '@/lib/program-data'
import { SCHOOLS_PROGRAMS } from '@/lib/media'

const data = LEADERSHIP_DEVELOPMENT

export const metadata = {
  title: 'Leadership Development | Camping Nigeria',
  description:
    'Structured challenges that grow confident, collaborative young leaders — designed for prefects, student councils, and senior students.',
  openGraph: {
    title: 'Leadership Development | Camping Nigeria',
    description:
      'Structured challenges that grow confident, collaborative young leaders — designed for prefects, student councils, and senior students.',
    url: '/schools/programs/leadership-development',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Leadership Development | Camping Nigeria',
    description:
      'Structured challenges that grow confident, collaborative young leaders — designed for prefects, student councils, and senior students.',
  },
}

export default function LeadershipDevelopmentPage() {
  return (
    <main id="main-content">
      <Navbar />
      <PageHero
        image={SCHOOLS_PROGRAMS[2].src}
        imageAlt={SCHOOLS_PROGRAMS[2].alt}
        eyebrow="School Program"
        headline={data.title}
        subheadline={data.subtitle}
        height="h-[70vh]"
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
