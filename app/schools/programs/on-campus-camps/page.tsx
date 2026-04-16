import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import ProgramOverview from '@/components/programs/ProgramOverview'
import ProgramPillars from '@/components/programs/ProgramPillars'
import ProgramModules from '@/components/programs/ProgramModules'
import SampleSchedule from '@/components/programs/SampleSchedule'
import PackageTiers from '@/components/programs/PackageTiers'
import ProgramCta from '@/components/programs/ProgramCta'
import { ON_CAMPUS_CAMPS } from '@/lib/program-data'
import { SCHOOLS_PROGRAMS } from '@/lib/media'

const data = ON_CAMPUS_CAMPS

export const metadata = {
  title: '2-Day On-Campus Camps | Camping Nigeria',
  description:
    'Immersive 2-day camp experiences delivered right at your school gates — adventure, teamwork, and growth without long-distance travel.',
  openGraph: {
    title: '2-Day On-Campus Camps | Camping Nigeria',
    description:
      'Immersive 2-day camp experiences delivered right at your school gates — adventure, teamwork, and growth without long-distance travel.',
    url: '/schools/programs/on-campus-camps',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: '2-Day On-Campus Camps | Camping Nigeria',
    description:
      'Immersive 2-day camp experiences delivered right at your school gates — adventure, teamwork, and growth without long-distance travel.',
  },
}

export default function OnCampusCampsPage() {
  return (
    <main id="main-content">
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
