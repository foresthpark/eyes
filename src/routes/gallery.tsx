import { createFileRoute } from '@tanstack/react-router'
import PhotoAlbum, { Photo } from 'react-photo-album'
import "react-photo-album/masonry.css"

export const Route = createFileRoute('/gallery')({
  component: Gallery,
})

const photos: Photo[] = [
  { src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200', width: 1200, height: 1600 },
  { src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1200', width: 1200, height: 800 },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200', width: 1200, height: 1500 },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200', width: 1200, height: 800 },
  { src: 'https://plus.unsplash.com/premium_photo-1768241560249-9e452c219952?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1200', width: 1200, height: 800 },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200', width: 1200, height: 900 },
  // { src: 'https://images.unsplash.com/photo-1500627760128-09026402ec94?q=80&w=1200', width: 1200, height: 1600 },
  // { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200', width: 1200, height: 800 },
  // { src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200', width: 1200, height: 800 },
  { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200', width: 1200, height: 900 },
]

function Gallery() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl font-light mb-6">Gallery</h1>
          <p className="text-gray-500 text-lg">
            A collection of moments captured in the wild. Each image tells a story of serenity and power found only in the heart of nature.
          </p>
        </div>
        
        <div className="w-full">
          <PhotoAlbum
            layout="masonry"
            photos={photos}
            columns={(containerWidth) => {
              if (containerWidth < 640) return 1
              if (containerWidth < 1024) return 2
              if (containerWidth < 1536) return 3
              return 4
            }}
            spacing={16}
            padding={0}
          />
        </div>
      </div>
    </div>
  )
}
