import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { getRandomHeroPhoto } from '../lib/gallery'
import { OptimizedImage } from '../components/OptimizedImage'
import { generateMetaTags, generateCanonicalUrl } from '../lib/seo'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const heroPhoto = await getRandomHeroPhoto()
    return { heroPhoto }
  },
  head: () => ({
    meta: [
      {
        title: 'Eyes of Forest | Photography Portfolio',
      },
      ...generateMetaTags({
        description:
          'Photography portfolio showcasing my view of the world through film and digital photography. Explore galleries of nature, landscapes, and life moments.',
      }),
    ],
    links: [
      {
        rel: 'canonical',
        href: generateCanonicalUrl('/'),
      },
    ],
  }),
})

function Home() {
  const { heroPhoto } = Route.useLoaderData()

  // Fallback to placeholder if no photo available
  const backgroundImage = heroPhoto?.src ||
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop'

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={backgroundImage}
          alt="Forest backdrop"
          className="w-full h-full brightness-75 transition-transform duration-1000 hover:scale-105"
          loading="eager"
        />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
          Capturing life through my <span className="font-semibold italic">Eyes</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
          My view of the world. Through film and digital photography.
        </p>
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 rounded-none font-medium uppercase tracking-widest text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-gray-800 focus-visible:ring-offset-2 focus-visible:ring-offset-black dark:focus-visible:ring-offset-white transform hover:scale-105 active:scale-95"
          aria-label="View portfolio gallery"
        >
          View Portfolio <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
