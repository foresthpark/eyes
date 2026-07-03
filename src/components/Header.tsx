import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { MobileMenu } from './MobileMenu'

const navLinkClass =
  'text-xs font-semibold uppercase tracking-[0.1em] text-secondary hover:line-through focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
const navLinkActive = 'text-primary line-through'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu when resizing to desktop size
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (mediaQuery.matches) {
        setIsMobileMenuOpen(false)
      }
    }

    closeOnDesktop()
    mediaQuery.addEventListener('change', closeOnDesktop)
    return () => mediaQuery.removeEventListener('change', closeOnDesktop)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background border-b border-primary">
        <div className="flex items-center justify-between px-margin-mobile md:px-margin h-16">
          <Link
            to="/"
            className="font-display text-2xl md:text-3xl tracking-tight text-primary uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Double Tree - Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Double Tree
          </Link>

          {/* Desktop Navigation - hidden on mobile, visible on md and up */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-gutter">
            <Link
              to="/gallery"
              className={navLinkClass}
              activeProps={{ className: navLinkActive }}
            >
              Gallery
            </Link>
            <Link
              to="/rates"
              className={navLinkClass}
              activeProps={{ className: navLinkActive }}
            >
              Rates
            </Link>
            <Link
              to="/about"
              className={navLinkClass}
              activeProps={{ className: navLinkActive }}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={navLinkClass}
              activeProps={{ className: navLinkActive }}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button - visible on mobile only, hidden on md and up */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
