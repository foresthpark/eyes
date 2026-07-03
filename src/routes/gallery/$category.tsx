import { createFileRoute, notFound } from '@tanstack/react-router'
import PhotoAlbum from 'react-photo-album'
import Lightbox from "yet-another-react-lightbox"
import "react-photo-album/masonry.css"
import "yet-another-react-lightbox/styles.css"
import { useState, Suspense } from 'react'
import { getGalleryPhotos } from '../../lib/gallery'
import { GallerySkeleton } from '../../components/LoadingSkeleton'
import { Breadcrumb } from '../../components/Breadcrumb'
import { JsonLd } from '../../components/JsonLd'
import { generateMetaTags, generateCanonicalUrl, generateOgTags } from '../../lib/seo'
import { getCategoryCopy } from '../../lib/categoryCopy'

export const Route = createFileRoute('/gallery/$category')({
  component: CategoryGallery,
  loader: async ({ params }) => {
    const data = await getGalleryPhotos({ data: params.category })
    // Only 404 when the category genuinely has no photos. Transient R2 errors
    // now bubble to the ErrorBoundary (retryable) instead of a confusing 404.
    if (data.photos.length === 0) {
      throw notFound()
    }
    return data
  },
  head: ({ loaderData, params }) => {
    const { categoryName } = loaderData || { categoryName: '' }
    const description = getCategoryCopy(params.category, categoryName).metaDescription

    return {
      meta: [
        {
          title: `${categoryName} | Gallery | Double Tree`,
        },
        ...generateMetaTags({
          description,
        }),
        ...generateOgTags({
          title: `${categoryName} | Gallery | Double Tree`,
          description,
          url: generateCanonicalUrl(`/gallery/${params.category}`),
          type: 'website',
        }),
      ],
      links: [
        {
          rel: 'canonical',
          href: generateCanonicalUrl(`/gallery/${params.category}`),
        },
      ],
    }
  },
})

function CategoryGallery() {
  const { category, categoryName, photos } = Route.useLoaderData()
  const [index, setIndex] = useState(-1)
  const copy = getCategoryCopy(category, categoryName)

  // Enhance photos with lazy loading and alt text (SEO + screen readers)
  const optimizedPhotos = photos.map((photo, i) => ({
    ...photo,
    alt: photo.title ?? `${categoryName} photograph ${i + 1}`,
    loading: 'lazy' as const,
    fetchPriority: 'auto' as const,
  }))

  return (
    <div className="w-full">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: `${categoryName} | Double Tree`,
          url: generateCanonicalUrl(`/gallery/${category}`),
          description: copy.metaDescription,
          numberOfItems: photos.length,
        }}
      />
      <style>{`
        .react-photo-album--photo img {
          object-fit: cover !important;
          display: block !important;
        }
      `}</style>
      <div className="px-margin-mobile md:px-margin py-gutter md:py-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Gallery', href: '/gallery' },
            { label: categoryName },
          ]}
        />

        <header className="flex flex-col md:flex-row justify-between items-baseline mb-gutter border-b border-primary pb-4">
          <h1 className="font-display text-4xl md:text-6xl uppercase">{categoryName}</h1>
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary" aria-live="polite">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </span>
        </header>

        <p className="text-lg text-secondary mb-gutter max-w-2xl">{copy.intro}</p>

        {photos.length === 0 ? (
          <div>
            <p className="text-secondary" aria-live="polite">
              No photos found in this gallery.
            </p>
          </div>
        ) : (
          <>
            <Suspense fallback={<GallerySkeleton />}>
              <section aria-label={`${categoryName} photo gallery`}>
                <PhotoAlbum
                  layout="masonry"
                  photos={optimizedPhotos}
                  onClick={({ index: photoIndex }) => setIndex(photoIndex)}
                  columns={(containerWidth) => {
                    if (containerWidth < 640) return 1
                    if (containerWidth < 1024) return 2
                    if (containerWidth < 1536) return 3
                    return 4
                  }}
                  spacing={12}
                  padding={0}
                />
              </section>
            </Suspense>

            <Lightbox
              slides={photos.map((photo, i) => ({
                src: photo.src,
                width: photo.width,
                height: photo.height,
                alt: photo.title ?? `${categoryName} photograph ${i + 1}`,
                title: photo.title,
                description: photo.description,
              }))}
              open={index >= 0}
              index={index < 0 ? 0 : index}
              close={() => setIndex(-1)}
              controller={{
                closeOnBackdropClick: true,
                closeOnPullDown: true,
                closeOnPullUp: true,
              }}
              carousel={{
                finite: false,
                preload: 2,
                spacing: 0,
                padding: 0,
              }}
              animation={{
                swipe: 250,
                fade: 300,
                navigation: 300,
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
