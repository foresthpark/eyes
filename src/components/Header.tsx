import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tighter">
          EYES OF FOREST
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            to="/gallery"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            activeProps={{ className: 'text-black font-semibold' }}
          >
            Gallery
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            activeProps={{ className: 'text-black font-semibold' }}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            activeProps={{ className: 'text-black font-semibold' }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
