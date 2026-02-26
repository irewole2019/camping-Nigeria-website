import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service | Camping Nigeria',
  description:
    'Read the terms and conditions governing the use of Camping Nigeria services, bookings, and equipment rental.',
}

export default function TermsOfServicePage() {
  return (
    <main id="main-content">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-brand-dark pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-white/70 font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our services.
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
                Acceptance of Terms
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed">
                By accessing or using the Camping Nigeria website and services, you agree to be
                bound by these Terms of Service. If you are booking on behalf of a school,
                organization, or group, you confirm that you have the authority to agree to these
                terms on their behalf. If you do not agree with any part of these terms, please do
                not use our services.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">Services</h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mb-3">
                Camping Nigeria provides structured outdoor education and camping experiences for
                schools, individuals, and organizations across Nigeria. Our services include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>School outdoor education programmes and excursions</li>
                <li>Individual camping and adventure experiences</li>
                <li>Corporate and organizational team-building retreats</li>
                <li>Camping equipment and gear rental</li>
                <li>Programme planning and consultation</li>
              </ul>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mt-3">
                We reserve the right to modify, suspend, or discontinue any aspect of our services
                at any time with reasonable notice to affected bookings.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Booking and Payment
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>
                  All bookings are subject to availability and confirmation by Camping Nigeria.
                </li>
                <li>
                  A deposit may be required to secure your booking. The specific amount and payment
                  schedule will be communicated at the time of booking.
                </li>
                <li>
                  Full payment must be received before the programme start date unless alternative
                  arrangements have been agreed upon in writing.
                </li>
                <li>
                  Prices are quoted in Nigerian Naira (NGN) and are subject to change. Confirmed
                  bookings will be honoured at the agreed price.
                </li>
                <li>
                  For school and organizational bookings, we may offer invoicing options. Please
                  contact us to discuss payment arrangements.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Cancellation and Refunds
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>
                  <strong>More than 30 days before the programme:</strong> Full refund minus a 10%
                  administrative fee.
                </li>
                <li>
                  <strong>15 to 30 days before the programme:</strong> 50% refund of the total
                  booking amount.
                </li>
                <li>
                  <strong>Less than 15 days before the programme:</strong> No refund, though
                  rescheduling may be considered on a case-by-case basis.
                </li>
                <li>
                  Camping Nigeria reserves the right to cancel or reschedule programmes due to
                  weather conditions, safety concerns, or insufficient participation. In such
                  cases, a full refund or rescheduled date will be offered.
                </li>
                <li>
                  Refunds will be processed within 14 business days of the cancellation approval.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Safety and Liability
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed mb-3">
                Participant safety is our highest priority. By booking with Camping Nigeria, you
                acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>
                  Outdoor activities carry inherent risks. Participants take part in activities at
                  their own risk, and Camping Nigeria will not be held liable for injuries or
                  damages arising from participation, except where caused by our negligence.
                </li>
                <li>
                  All participants (or their parent/guardian for minors) must complete a health and
                  safety declaration form before the programme.
                </li>
                <li>
                  You must disclose any medical conditions, allergies, or physical limitations that
                  could affect participation or require special attention.
                </li>
                <li>
                  Camping Nigeria maintains trained safety personnel and first-aid facilities at all
                  programme locations.
                </li>
                <li>
                  Participants must follow all safety instructions and guidelines provided by our
                  staff. Failure to do so may result in removal from the programme without a
                  refund.
                </li>
                <li>
                  For school bookings, the school must ensure adequate teacher-to-student
                  supervision ratios as communicated during programme planning.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Equipment Rental
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-brand-dark/70 font-sans leading-relaxed">
                <li>
                  Rental equipment must be returned in the same condition it was received, allowing
                  for normal wear and tear.
                </li>
                <li>
                  Renters are responsible for any loss, theft, or damage to equipment beyond
                  normal wear and tear. Replacement or repair costs will be charged accordingly.
                </li>
                <li>
                  Equipment must be returned by the agreed date. Late returns may incur additional
                  daily charges.
                </li>
                <li>
                  A security deposit may be required for high-value equipment. This deposit will be
                  refunded upon satisfactory return of the equipment.
                </li>
                <li>
                  Rental equipment is for personal or organizational use only and may not be
                  sub-let to third parties.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Intellectual Property
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed">
                All content on the Camping Nigeria website, including text, images, logos,
                graphics, videos, and programme materials, is the property of Camping Nigeria and
                is protected by Nigerian copyright and intellectual property laws. You may not
                reproduce, distribute, modify, or create derivative works from any content without
                our prior written consent. Photographs and videos taken during programmes may be
                used by Camping Nigeria for marketing purposes, subject to consent as outlined in
                our Privacy Policy.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">
                Governing Law
              </h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed">
                These Terms of Service are governed by and construed in accordance with the laws
                of the Federal Republic of Nigeria. Any disputes arising from or in connection
                with these terms shall be subject to the exclusive jurisdiction of the courts of
                Lagos State, Nigeria. We encourage parties to seek amicable resolution through
                mediation before pursuing litigation.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">Contact</h2>
              <p className="text-sm text-brand-dark/70 font-sans leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
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
