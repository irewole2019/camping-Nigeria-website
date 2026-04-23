import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import AboutHero from '@/components/about/AboutHero'
import OurStory from '@/components/about/OurStory'
import WhatWeDo from '@/components/about/WhatWeDo'
import OurValues from '@/components/about/OurValues'
import Manifesto from '@/components/about/Manifesto'
import AboutCta from '@/components/about/AboutCta'
import { buildPageMetadata } from '@/lib/seo'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: 'About | Camping Nigeria',
  description:
    'Learn about Camping Nigeria — the premier outdoor recreation and team-bonding service making camping safe, accessible, and stress-free across Nigeria.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="about-breadcrumb-jsonld"
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <Navbar />
      <AboutHero />
      <OurStory />
      <WhatWeDo />
      <OurValues />
      <Manifesto />
      <AboutCta />
      <Footer />
    </main>
  )
}
