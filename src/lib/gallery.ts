import { createServerFn } from '@tanstack/react-start'
import { listObjects, getPresignedUrl, getObjectMetadata } from './r2'

export interface GalleryPhoto {
  src: string
  width: number
  height: number
  filename: string
}

export interface GalleryCategory {
  name: string
  slug: string
  photoCount: number
  coverPhoto: string
}

// Server function to get all gallery categories
export const getGalleryCategories = createServerFn({ method: 'GET' }).handler(async () => {
  const categories: GalleryCategory[] = []

  // List all objects in the gallery prefix
  const objects = await listObjects('gallery/')

  // Group objects by category (first folder after gallery/)
  const categoryMap = new Map<string, string[]>()

  for (const obj of objects) {
    const match = obj.key.match(/^gallery\/([^/]+)\/(.+)$/)
    if (match) {
      const [, categorySlug] = match
      if (!categoryMap.has(categorySlug)) {
        categoryMap.set(categorySlug, [])
      }
      const categoryKeys = categoryMap.get(categorySlug)
      if (categoryKeys) {
        categoryKeys.push(obj.key)
      }
    }
  }

  // Create category objects with cover photos
  for (const [slug, photoKeys] of categoryMap.entries()) {
    if (photoKeys.length > 0) {
      // Get presigned URL for the first photo as cover
      const coverPhoto = await getPresignedUrl(photoKeys[0])

      categories.push({
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        photoCount: photoKeys.length,
        coverPhoto,
      })
    }
  }

  return categories
})

// Server function to get photos for a specific category
export const getGalleryPhotos = createServerFn({ method: 'GET' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const category = data
    const prefix = `gallery/${category}/`

    // List all objects in this category
    const objects = await listObjects(prefix)

    const photos: GalleryPhoto[] = []

    for (const obj of objects) {
      try {
        // Get object metadata for dimensions
        const metadata = await getObjectMetadata(obj.key)

        // Generate presigned URL
        const signedUrl = await getPresignedUrl(obj.key)

        // Extract filename
        const filename = obj.key.split('/').pop() || ''

        photos.push({
          src: signedUrl,
          width: parseInt(metadata.width || '1500', 10),
          height: parseInt(metadata.height || '1500', 10),
          filename,
        })
      } catch (error) {
        console.error(`Error processing ${obj.key}:`, error)
        // Skip files we can't process
      }
    }

    return {
      category,
      categoryName: category.charAt(0).toUpperCase() + category.slice(1),
      photos,
    }
  }
)

// Server function to get a random photo for homepage hero
export const getRandomHeroPhoto = createServerFn({ method: 'GET' }).handler(async () => {
  // List all photos from all categories
  const objects = await listObjects('gallery/')

  if (objects.length === 0) {
    return null
  }

  // Pick a random photo
  const randomIndex = Math.floor(Math.random() * objects.length)
  const randomPhoto = objects[randomIndex]

  // Get metadata and presigned URL
  const metadata = await getObjectMetadata(randomPhoto.key)
  const signedUrl = await getPresignedUrl(randomPhoto.key)

  return {
    src: signedUrl,
    width: parseInt(metadata.width || '1920', 10),
    height: parseInt(metadata.height || '1080', 10),
  }
})
