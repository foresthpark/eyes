import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import PhotoAlbum from 'react-photo-album'
import Lightbox from "yet-another-react-lightbox"
import "react-photo-album/masonry.css"
import "yet-another-react-lightbox/styles.css"
import { useState, Suspense, useEffect } from 'react'
import { getGalleryPhotos } from '../../lib/gallery'
import { GallerySkeleton } from '../../components/LoadingSkeleton'

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
})

function CategoryGallery() {
  const { categoryName, photos } = Route.useLoaderData()
  const [index, setIndex] = useState(-1)

  // Enhance photos with lazy loading support
  const optimizedPhotos = photos.map((photo) => ({
    ...photo,
    loading: 'lazy' as const,
    fetchPriority: 'auto' as const,
  }))

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (index < 0) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIndex(-1)
      } else if (e.key === 'ArrowLeft') {
        setIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
      } else if (e.key === 'ArrowRight') {
        setIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, photos.length])

  return (
    <div className="w-full">
      <style>{`
        .react-photo-album--photo img {
          object-fit: cover !important;
          display: block !important;
        }
      `}</style>
      <div className="container mx-auto px-6 py-12 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            to="/gallery"
            className="text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
            aria-label="Back to gallery"
          >
            ← Back to Gallery
          </Link>
        </nav>

        <header className="max-w-2xl mb-16">
          <h1 className="text-4xl font-light mb-6">{categoryName}</h1>
          <p className="text-gray-500 text-lg" aria-live="polite">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </header>

        {photos.length === 0 ? (
          <div>
            <p className="text-gray-500" role="status" aria-live="polite">
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
              slides={photos}
              open={index >= 0}
              index={index}
              close={() => setIndex(-1)}
              controller={{ closeOnBackdropClick: true }}
              render={{
                buttonPrev: () => (
                  <button
                    type="button"
                    className="yarl__button yarl__button_prev"
                    aria-label="Previous photo"
                  />
                ),
                buttonNext: () => (
                  <button
                    type="button"
                    className="yarl__button yarl__button_next"
                    aria-label="Next photo"
                  />
                ),
                buttonClose: () => (
                  <button
                    type="button"
                    className="yarl__button yarl__button_close"
                    aria-label="Close lightbox"
                  />
                ),
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
