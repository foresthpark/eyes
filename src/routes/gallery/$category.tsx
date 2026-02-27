import { createFileRoute, notFound } from '@tanstack/react-router'
import PhotoAlbum from 'react-photo-album'
import Lightbox from "yet-another-react-lightbox"
import "react-photo-album/masonry.css"
import "yet-another-react-lightbox/styles.css"
import { useState, Suspense, useEffect } from 'react'
import { getGalleryPhotos } from '../../lib/gallery'
import { GallerySkeleton } from '../../components/LoadingSkeleton'
import { Breadcrumb } from '../../components/Breadcrumb'
import { generateMetaTags, generateCanonicalUrl } from '../../lib/seo'

export const Route = createFileRoute('/gallery/$category')({
  component: CategoryGallery,
  loader: async ({ params }) => {
    try {
      const data = await getGalleryPhotos({ data: params.category })
      return data
    } catch {
      throw notFound()
    }
  },
  head: ({ loaderData, params }) => {
    const { categoryName, photos } = loaderData || { categoryName: '', photos: [] }
    const photoCount = photos.length
    const description = `Explore ${categoryName} photography gallery with ${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}.`

    return {
      meta: [
        {
          title: `${categoryName} | Gallery | Eyes of Forest`,
        },
        ...generateMetaTags({
          description,
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
  const { categoryName, photos } = Route.useLoaderData()
  const [index, setIndex] = useState(-1)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Enhance photos with lazy loading support
  const optimizedPhotos = photos.map((photo) => ({
    ...photo,
    loading: 'lazy' as const,
    fetchPriority: 'auto' as const,
  }))

  // When opening lightbox, sync the lightbox index
  useEffect(() => {
    if (index >= 0) {
      setLightboxIndex(index)
    }
  }, [index])

  return (
    <div className="w-full">
      <style>{`
        .react-photo-album--photo img {
          object-fit: cover !important;
          display: block !important;
        }
      `}</style>
      <div className="container mx-auto px-6 py-12 md:py-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Gallery', href: '/gallery' },
            { label: categoryName },
          ]}
        />

        <header className="max-w-2xl mb-16">
          <h1 className="text-4xl font-light mb-6 dark:text-white">{categoryName}</h1>
          <p className="text-gray-500 dark:text-gray-300 text-lg" aria-live="polite">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </header>

        {photos.length === 0 ? (
          <div>
            <p className="text-gray-500 dark:text-gray-300" aria-live="polite">
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
              slides={photos.map((photo) => ({
                src: photo.src,
                width: photo.width,
                height: photo.height,
                title: photo.title,
                description: photo.description,
              }))}
              open={index >= 0}
              index={lightboxIndex}
              close={() => setIndex(-1)}
              on={{
                view: ({ index: newIndex }) => {
                  // Update lightbox index when navigating
                  setLightboxIndex(newIndex)
                },
              }}
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
