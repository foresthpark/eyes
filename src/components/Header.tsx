import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { MobileMenu } from './MobileMenu'

const navLinkClass =
  'text-xs font-semibold uppercase tracking-[0.1em] text-secondary hover:line-through focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
const navLinkActive = 'text-primary line-through'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu when resizing to desktop size
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile])

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
            aria-label="Eyes of Forest - Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Eyes of Forest
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
          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </header>

      {isMobile && <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
    </>
  )
}
