'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Schools', href: '/schools' },
  { label: 'Individuals', href: '/individuals' },
  { label: 'Organizations', href: '/organizations' },
  { label: 'Gear Rental', href: '/gear-rental' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" aria-label="Camping Nigeria Home">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Camping%20Nigeria%20Logo%20-4Afjc35DawMRahQENzyiYcdmyAP92k.png"
              alt="Camping Nigeria"
              width={120}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/schools"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-accent text-brand-dark text-sm font-semibold rounded tracking-wide hover:bg-brand-accent/90 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              Partner With Us
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!mobileOpen}
      >
        <nav
          aria-label="Mobile navigation"
          className="bg-brand-dark/95 backdrop-blur-sm border-t border-white/10 px-4 pt-3 pb-5 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 hover:text-white font-medium py-3 border-b border-white/5 tracking-wide transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/schools"
            onClick={() => setMobileOpen(false)}
            className="mt-3 inline-flex items-center justify-center px-5 py-3 bg-brand-accent text-brand-dark text-sm font-semibold rounded tracking-wide hover:bg-brand-accent/90 transition-colors duration-200"
          >
            Partner With Us
          </Link>
        </nav>
      </div>
    </header>
  )
}
