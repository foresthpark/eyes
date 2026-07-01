import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const linkClass =
  'block py-3 font-display text-3xl uppercase text-secondary hover:text-primary hover:line-through focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
const linkActive = 'text-primary line-through'

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Don't render on desktop even if isOpen is true
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - hidden on md and up */}
      <div
        className="fixed inset-0 bg-primary/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu - hidden on md and up */}
      <nav
        className="fixed top-16 left-0 right-0 bg-background border-b border-primary z-50 md:hidden"
        aria-label="Mobile navigation"
      >
        <div className="px-margin-mobile py-gutter">
          <div className="flex items-center justify-between mb-gutter">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div>
            <Link to="/gallery" onClick={onClose} className={linkClass} activeProps={{ className: linkActive }}>
              Gallery
            </Link>
            <Link to="/about" onClick={onClose} className={linkClass} activeProps={{ className: linkActive }}>
              About
            </Link>
            <Link to="/contact" onClick={onClose} className={linkClass} activeProps={{ className: linkActive }}>
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
