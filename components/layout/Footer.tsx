import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Twitter, Facebook, Mail, Phone, MessageCircle } from 'lucide-react'
import { LOGO_URL, CONTACT, SITE_URL } from '@/lib/constants'

const quickLinks = [
  { label: 'Schools', href: '/schools' },
  { label: 'Individuals', href: '/individuals' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'Gear Rental', href: '/gear-rental' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
]

const socialLinks = [
  { label: 'Instagram', href: CONTACT.instagram, icon: Instagram },
  { label: 'Twitter / X', href: CONTACT.twitter, icon: Twitter },
  { label: 'Facebook', href: CONTACT.facebook, icon: Facebook },
]

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/70" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Camping Nigeria Home">
              <Image
                src={LOGO_URL}
                alt="Camping Nigeria"
                width={140}
                height={70}
                className="h-14 w-auto object-contain mb-4"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Structured, safe, and development-focused outdoor experiences across Nigeria.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <nav aria-label="Quick links">
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Company
            </h3>
            <nav aria-label="Company links">
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4 — Connect */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              Connect
            </h3>
            <address className="not-italic space-y-3 text-sm">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors duration-200"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                WhatsApp
              </a>
            </address>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
          &copy; 2026 Camping Nigeria. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
