import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
          alt="Forest backdrop"
          className="w-full h-full object-cover brightness-75 transition-transform duration-1000 hover:scale-105"
        />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
          Capturing the <span className="font-semibold italic">Soul</span> of Nature
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
          A minimalist perspective on the hidden beauty of the world's most ancient forests.
        </p>
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-black hover:text-white transition-all duration-300 rounded-none font-medium uppercase tracking-widest text-sm"
        >
          View Portfolio <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
