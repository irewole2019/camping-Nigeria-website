import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AboutHero from '@/components/about/AboutHero'
import OurStory from '@/components/about/OurStory'
import WhatWeDo from '@/components/about/WhatWeDo'
import OurValues from '@/components/about/OurValues'
import Manifesto from '@/components/about/Manifesto'
import AboutCta from '@/components/about/AboutCta'

export const metadata = {
  title: 'About | Camping Nigeria',
  description:
    'Learn about Camping Nigeria — the premier outdoor recreation and team-bonding service making camping safe, accessible, and stress-free across Nigeria.',
  openGraph: {
    title: 'About | Camping Nigeria',
    description:
      'Learn about Camping Nigeria — the premier outdoor recreation and team-bonding service making camping safe, accessible, and stress-free across Nigeria.',
    url: '/about',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'About | Camping Nigeria',
    description:
      'Learn about Camping Nigeria — the premier outdoor recreation and team-bonding service making camping safe, accessible, and stress-free across Nigeria.',
  },
}

export default function AboutPage() {
  return (
    <main id="main-content">
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
