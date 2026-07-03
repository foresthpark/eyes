import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { getRandomHeroPhoto } from '../lib/gallery'
import { OptimizedImage } from '../components/OptimizedImage'
import { generateMetaTags, generateCanonicalUrl, generateOgTags } from '../lib/seo'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const heroPhoto = await getRandomHeroPhoto()
    return { heroPhoto }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: 'Double Tree | Photography Portfolio',
      },
      ...generateMetaTags({
        description:
          'Photography portfolio showcasing my view of the world through film and digital photography. Explore galleries of nature, landscapes, and life moments.',
      }),
      ...generateOgTags({
        title: 'Double Tree | Photography Portfolio',
        description:
          'Photography portfolio showcasing my view of the world through film and digital photography. Explore galleries of nature, landscapes, and life moments.',
        url: generateCanonicalUrl('/'),
        type: 'website',
      }),
    ],
    links: [
      {
        rel: 'canonical',
        href: generateCanonicalUrl('/'),
      },
      // Kick off the LCP hero download before hydration
      ...(loaderData?.heroPhoto
        ? [{ rel: 'preload', as: 'image', href: loaderData.heroPhoto.src, fetchPriority: 'high' as const }]
        : []),
    ],
  }),
})

function Home() {
  const { heroPhoto } = Route.useLoaderData()

  // Fallback to placeholder if no photo available
  const backgroundImage = heroPhoto?.src ||
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop'

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden group">
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={backgroundImage}
          alt="Forest backdrop"
          className="w-full h-full brightness-75 transition-transform duration-1000 group-hover:scale-105"
          loading="eager"
        />
      </div>

      <div className="relative z-10 flex flex-col justify-end min-h-[calc(100vh-64px)] px-margin-mobile md:px-margin pb-section max-w-3xl">
        <h1 className="font-display text-5xl md:text-8xl leading-none text-white mb-gutter uppercase">
          Capturing life through my <span className="italic normal-case">Eyes</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-gutter max-w-md">
          My view of the world. Through film and digital photography.
        </p>
        <Link
          to="/gallery"
          className="self-start inline-flex items-center gap-3 border border-white px-12 py-4 text-white text-xs font-semibold uppercase tracking-[0.1em] hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          aria-label="View portfolio gallery"
        >
          View Portfolio <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
