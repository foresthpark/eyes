import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import PhotoAlbum from 'react-photo-album'
import Lightbox from "yet-another-react-lightbox"
import "react-photo-album/masonry.css"
import "yet-another-react-lightbox/styles.css"
import { useState } from 'react'
import { getGalleryPhotos } from '../../lib/gallery'

// Ensure images maintain aspect ratio
import { useEffect } from 'react'

export const Route = createFileRoute('/gallery/$category')({
  component: CategoryGallery,
  loader: async ({ params }) => {
    try {
      const data = await getGalleryPhotos({ data: params.category })
      return data
    } catch (error) {
      throw notFound()
    }
  },
})

function CategoryGallery() {
  const { categoryName, photos } = Route.useLoaderData()
  const [index, setIndex] = useState(-1)

  return (
    <div className="w-full">
      <style>{`
        .react-photo-album--photo img {
          object-fit: cover !important;
          display: block !important;
        }
      `}</style>
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="mb-8">
          <Link
            to="/gallery"
            className="text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-2"
          >
            ← Back to Gallery
          </Link>
        </div>

        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl font-light mb-6">{categoryName}</h1>
          <p className="text-gray-500 text-lg">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>

        {photos.length === 0 ? (
          <p className="text-gray-500">No photos found in this gallery.</p>
        ) : (
          <>
            <div className="w-full">
              <PhotoAlbum
                layout="masonry"
                photos={photos}
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
            </div>

            <Lightbox
              slides={photos}
              open={index >= 0}
              index={index}
              close={() => setIndex(-1)}
            />
          </>
        )}
      </div>
    </div>
  )
}
