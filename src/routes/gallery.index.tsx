import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import { getGalleryCategories } from '../lib/gallery'
import { OptimizedImage } from '../components/OptimizedImage'
import { CategoryCardSkeleton } from '../components/LoadingSkeleton'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { Breadcrumb } from '../components/Breadcrumb'
import { generateMetaTags, generateCanonicalUrl } from '../lib/seo'

export const Route = createFileRoute('/gallery/')({
  component: GalleryIndex,
  loader: async () => {
    const categories = await getGalleryCategories()
    return { categories }
  },
  head: () => ({
    meta: [
      {
        title: 'Gallery | Eyes of Forest',
      },
      ...generateMetaTags({
        description:
          'Browse photography galleries organized by category. Explore collections of nature, landscapes, and life moments captured through film and digital photography.',
      }),
    ],
    links: [
      {
        rel: 'canonical',
        href: generateCanonicalUrl('/gallery'),
      },
    ],
  }),
})

function GalleryIndex() {
  const { categories } = Route.useLoaderData()

  return (
    <div className="w-full">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <Breadcrumb />
        <header className="max-w-2xl mb-16">
          <h1 className="text-4xl font-semibold mb-6 dark:text-white">Gallery</h1>
          <p className="text-gray-500 dark:text-gray-300 text-lg mb-12">
            My view of the world. Through film and digital photography.
          </p>
        </header>

        {categories.length === 0 ? (
          <div>
            <p className="text-gray-500 dark:text-gray-300" role="status" aria-live="polite">
              No galleries found.
            </p>
          </div>
        ) : (
          <Suspense fallback={<CategoryCardSkeleton />}>
            <nav aria-label="Gallery categories">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to="/gallery/$category"
                    params={{ category: category.slug }}
                    className="group relative overflow-hidden rounded-lg aspect-4/3 bg-gray-100 dark:bg-gray-800 hover:shadow-xl dark:hover:shadow-gray-700/50 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 transform hover:-translate-y-1"
                    aria-label={`View ${category.name} gallery with ${category.photoCount} ${category.photoCount === 1 ? 'photo' : 'photos'}`}
                  >
                    <OptimizedImage
                      src={category.coverPhoto}
                      alt={`${category.name} Photography`}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent dark:from-black/80 dark:via-black/30 flex items-end p-6 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                        <h2 className="text-white text-2xl font-light mb-2">
                          {category.name}
                        </h2>
                        <p className="text-white/90 dark:text-white/80 text-sm">
                          View {category.photoCount} {category.photoCount === 1 ? 'photo' : 'photos'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          </Suspense>
        )}
      </div>
    </div>
  )
}
