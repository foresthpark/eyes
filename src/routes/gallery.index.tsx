import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import { getGalleryCategories } from '../lib/gallery'
import { OptimizedImage } from '../components/OptimizedImage'
import { CategoryCardSkeleton } from '../components/LoadingSkeleton'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { Breadcrumb } from '../components/Breadcrumb'
import { JsonLd } from '../components/JsonLd'
import { generateMetaTags, generateCanonicalUrl, generateOgTags, getSiteUrl } from '../lib/seo'

export const Route = createFileRoute('/gallery/')({
  component: GalleryIndex,
  loader: async () => {
    const categories = await getGalleryCategories()
    return { categories }
  },
  head: () => ({
    meta: [
      {
        title: 'Gallery | Double Tree',
      },
      ...generateMetaTags({
        description:
          'Browse photography galleries organized by category. Explore collections of nature, landscapes, and life moments captured through film and digital photography.',
      }),
      ...generateOgTags({
        title: 'Gallery | Double Tree',
        description:
          'Browse photography galleries organized by category. Explore collections of nature, landscapes, and life moments captured through film and digital photography.',
        url: generateCanonicalUrl('/gallery'),
        type: 'website',
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
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Gallery | Double Tree',
          url: generateCanonicalUrl('/gallery'),
          description:
            'Browse photography galleries organized by category.',
          hasPart: categories.map((category) => ({
            '@type': 'ImageGallery',
            name: category.name,
            url: `${getSiteUrl()}/gallery/${category.slug}`,
            numberOfItems: category.photoCount,
          })),
        }}
      />
      <div className="px-margin-mobile md:px-margin py-gutter md:py-16">
        <Breadcrumb />
        <header className="flex flex-col md:flex-row justify-between items-baseline mb-gutter border-b border-primary pb-4">
          <h1 className="font-display text-4xl md:text-6xl uppercase">Gallery</h1>
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
            My view of the world
          </span>
        </header>

        {categories.length === 0 ? (
          <div>
            <p className="text-secondary" role="status" aria-live="polite">
              No galleries found.
            </p>
          </div>
        ) : (
          <Suspense fallback={<CategoryCardSkeleton />}>
            <nav aria-label="Gallery categories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to="/gallery/$category"
                    params={{ category: category.slug }}
                    className="group relative overflow-hidden aspect-4/3 bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    aria-label={`View ${category.name} gallery with ${category.photoCount} ${category.photoCount === 1 ? 'photo' : 'photos'}`}
                  >
                    <OptimizedImage
                      src={category.coverPhoto}
                      alt={`${category.name} Photography`}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-gutter">
                      <div>
                        <h2 className="font-display text-white text-3xl uppercase mb-1">
                          {category.name}
                        </h2>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/90">
                          {category.photoCount} {category.photoCount === 1 ? 'photo' : 'photos'}
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
