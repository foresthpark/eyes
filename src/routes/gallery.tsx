import { createFileRoute } from '@tanstack/react-router'
import PhotoAlbum, { Photo } from 'react-photo-album'
import Lightbox from "yet-another-react-lightbox"
import "react-photo-album/masonry.css"
import "yet-another-react-lightbox/styles.css"
import { useState } from 'react'

export const Route = createFileRoute('/gallery')({
  component: Gallery,
})

const filmPhotos: Photo[] = [
  { src: '/gallery/film/DSC_0055.jpg', width: 3497, height: 3554 },
  { src: '/gallery/film/DSC_0071.jpg', width: 2585, height: 3514 },
  { src: '/gallery/film/DSC_0096-Edit-instagram.jpg', width: 1500, height: 2236 },
  { src: '/gallery/film/DSC_0184-instagram.jpg', width: 1500, height: 2233 },
  { src: '/gallery/film/DSC_0219-instagram.jpg', width: 1500, height: 2203 },
  { src: '/gallery/film/DSC_0296-Edit-Edit-instagram.jpg', width: 1500, height: 2234 },
  { src: '/gallery/film/DSC_0324-Edit-instagram.jpg', width: 1500, height: 2233 },
  { src: '/gallery/film/DSCF1612.jpg', width: 2979, height: 2979 },
  { src: '/gallery/film/DSCF1619.jpg', width: 2969, height: 2969 },
  { src: '/gallery/film/DSCF3363-Edit-2-instagram.jpg', width: 1500, height: 1500 },
]

const digitalPhotos: Photo[] = [
  { src: '/gallery/digital/DSCF3211-Edit-instagram.jpg', width: 1500, height: 1010 },
  { src: '/gallery/digital/DSCF3447-Edit-instagram.jpg', width: 1500, height: 1000 },
  { src: '/gallery/digital/DSCF3563-Edit-instagram.jpg', width: 1500, height: 2250 },
  { src: '/gallery/digital/DSCF3569-Edit-instagram.jpg', width: 1500, height: 919 },
  { src: '/gallery/digital/DSCF3573-Edit-instagram.jpg', width: 1500, height: 2250 },
]

function Gallery() {
  const [index, setIndex] = useState(-1)
  const [currentPhotos, setCurrentPhotos] = useState<Photo[]>(filmPhotos)

  const handleFilmClick = ({ index: photoIndex }: { index: number }) => {
    setCurrentPhotos(filmPhotos)
    setIndex(photoIndex)
  }

  const handleDigitalClick = ({ index: photoIndex }: { index: number }) => {
    setCurrentPhotos(digitalPhotos)
    setIndex(photoIndex)
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl font-light mb-6">Gallery</h1>
          <p className="text-gray-500 text-lg">
            A collection of moments captured in the wild. Each image tells a story of serenity and power found only in the heart of nature.
          </p>
        </div>

        {/* Film Gallery */}
        <div className="mb-20">
          <h2 className="text-3xl font-light mb-8">Film</h2>
          <div className="w-full">
            <PhotoAlbum
              layout="masonry"
              photos={filmPhotos}
              onClick={handleFilmClick}
              columns={(containerWidth) => {
                if (containerWidth < 640) return 1
                if (containerWidth < 1024) return 2
                if (containerWidth < 1536) return 3
                return 4
              }}
              spacing={4}
              padding={0}
            />
          </div>
        </div>

        {/* Digital Gallery */}
        <div>
          <h2 className="text-3xl font-light mb-8">Digital</h2>
          <div className="w-full">
            <PhotoAlbum
              layout="masonry"
              photos={digitalPhotos}
              onClick={handleDigitalClick}
              columns={(containerWidth) => {
                if (containerWidth < 640) return 1
                if (containerWidth < 1024) return 2
                if (containerWidth < 1536) return 3
                return 4
              }}
              spacing={4}
              padding={0}
            />
          </div>
        </div>

        {/* Lightbox */}
        <Lightbox
          slides={currentPhotos}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
        />
      </div>
    </div>
  )
}
