import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Don't render on desktop even if isOpen is true
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - hidden on md and up */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu - hidden on md and up */}
      <nav
        className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50 md:hidden transform transition-transform duration-300 ease-in-out"
        aria-label="Mobile navigation"
      >
        <div className="container mx-auto px-4 py-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          
          <div className="space-y-2">
            <Link
              to="/gallery"
              onClick={onClose}
              className="block px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
              activeProps={{ className: 'text-black dark:text-white font-semibold bg-gray-50 dark:bg-gray-800' }}
              aria-current="page"
            >
              Gallery
            </Link>
            <Link
              to="/about"
              onClick={onClose}
              className="block px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
              activeProps={{ className: 'text-black dark:text-white font-semibold bg-gray-50 dark:bg-gray-800' }}
              aria-current="page"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={onClose}
              className="block px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
              activeProps={{ className: 'text-black dark:text-white font-semibold bg-gray-50 dark:bg-gray-800' }}
              aria-current="page"
            >
              Contact
            </Link>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
