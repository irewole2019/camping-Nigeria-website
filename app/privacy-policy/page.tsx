import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Camping Nigeria',
  description:
    'Learn how Camping Nigeria collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-brand-dark pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70 font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Your privacy matters to us. This policy explains how we handle your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-brand-dark max-w-none space-y-10">
            <p className="text-sm text-brand-dark/60 font-sans">
              Last updated: February 26, 2026
            </p>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Information We Collect
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mb-3">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>Register for a camping programme or outdoor experience</li>
                <li>Request a gear rental quote or make a booking</li>
                <li>Contact us via our website, email, phone, or WhatsApp</li>
                <li>Subscribe to our newsletter or communications</li>
                <li>Submit a form on behalf of a school, organization, or group</li>
              </ul>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mt-3">
                This information may include your name, email address, phone number, organization
                name, participant details (including age and health information for safety
                purposes), and payment information.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                How We Use Your Information
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>Process bookings and deliver our camping and outdoor education services</li>
                <li>Communicate with you about your programme or rental</li>
                <li>Ensure the safety and well-being of all participants</li>
                <li>Send important updates, confirmations, and logistics information</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our programmes, services, and website experience</li>
                <li>Comply with legal obligations under Nigerian law</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Information Sharing
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mb-3">
                We do not sell or rent your personal information to third parties. We may share
                your information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>
                  <strong>Service Providers:</strong> With trusted partners who assist us in
                  operating our services (e.g., payment processors, transportation providers),
                  bound by confidentiality agreements.
                </li>
                <li>
                  <strong>Safety Requirements:</strong> With medical or emergency personnel when
                  necessary for participant safety during outdoor programmes.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> When required by law, regulation, or legal
                  process under Nigerian jurisdiction.
                </li>
                <li>
                  <strong>Schools and Organizations:</strong> Programme reports and attendance
                  records may be shared with the booking institution as part of our service.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Data Security
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed">
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction. This includes encrypted data transmission, secure storage practices,
                and restricted access to personal data. While we strive to protect your
                information, no method of transmission over the internet is completely secure, and
                we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mb-3">
                As an outdoor education company that works closely with schools, we take
                children&apos;s privacy very seriously. We adhere to the following principles:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>
                  We collect children&apos;s information only with verifiable parental or school
                  consent through the booking institution.
                </li>
                <li>
                  Personal data of minors is used solely for programme delivery, safety, and
                  emergency contact purposes.
                </li>
                <li>
                  Photographs or videos of minors are only taken and used with explicit written
                  consent from parents or guardians.
                </li>
                <li>
                  We do not knowingly collect personal information from children under 13 without
                  parental consent.
                </li>
                <li>
                  Parents and guardians may request to review, update, or delete their child&apos;s
                  information at any time.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">Your Rights</h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mb-3">
                In accordance with the Nigeria Data Protection Regulation (NDPR), you have the
                right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for data processing at any time</li>
                <li>Lodge a complaint with the National Information Technology Development Agency (NITDA)</li>
              </ul>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mt-3">
                To exercise any of these rights, please contact us using the details below.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">Contact Us</h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <address className="not-italic mt-3 text-sm text-brand-dark/70 font-sans leading-relaxed space-y-1">
                <p>
                  <strong>Camping Nigeria</strong>
                </p>
                <p>Lagos, Nigeria</p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:hello@campingnigeria.com"
                    className="text-brand-accent hover:underline"
                  >
                    hello@campingnigeria.com
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
