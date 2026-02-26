import type { Metadata } from 'next'
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/contact/ContactForm'
import { CONTACT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact Us | Camping Nigeria',
  description:
    'Get in touch with Camping Nigeria. Reach us via email, phone, WhatsApp, or send us a message for inquiries about our outdoor education programmes.',
}

const contactCards = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    external: false,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone.replace(/\s/g, '')}`,
    external: false,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Chat with us on WhatsApp',
    href: CONTACT.whatsapp,
    external: true,
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Lagos, Nigeria',
    href: undefined,
    external: false,
  },
]

export default function ContactPage() {
  return (
    <main id="main-content">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-brand-dark pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-white/70 font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question about our programmes, gear rental, or partnerships? We would love to
            hear from you.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-brand-dark/5 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10">
                  <card.icon className="h-5 w-5 text-brand-accent" aria-hidden="true" />
                </div>
                <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-dark mb-2">
                  {card.label}
                </h2>
                {card.href ? (
                  <a
                    href={card.href}
                    {...(card.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="text-sm text-brand-dark/70 hover:text-brand-accent transition-colors duration-200"
                  >
                    {card.value}
                  </a>
                ) : (
                  <p className="text-sm text-brand-dark/70">{card.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm uppercase tracking-widest mb-3">
                <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
                Send a Message
                <span className="block w-6 h-px bg-brand-accent" aria-hidden="true" />
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark text-balance">
                We would love to hear from you
              </h2>
              <p className="mt-3 text-sm text-brand-dark/60 font-sans leading-relaxed">
                Fill in the form below and our team will respond within 24 hours.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
