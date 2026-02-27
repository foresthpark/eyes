import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg sm:text-xl font-bold tracking-tighter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
          aria-label="Eyes of Forest - Home"
        >
          EYES OF FOREST
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <Link
            to="/gallery"
            className="text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
            activeProps={{ className: 'text-black font-semibold' }}
            aria-current="page"
          >
            Gallery
          </Link>
          <Link
            to="/about"
            className="text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
            activeProps={{ className: 'text-black font-semibold' }}
            aria-current="page"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
            activeProps={{ className: 'text-black font-semibold' }}
            aria-current="page"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
