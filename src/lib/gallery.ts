import { createServerFn } from '@tanstack/react-start'
import { listObjects, getPresignedUrl, getObjectMetadata } from './r2'

// Only real image files — skips folder-marker objects and anything non-image
const isImageKey = (key: string) => /\.(jpe?g|png|webp|avif|gif|tiff?)$/i.test(key)

// Fisher-Yates shuffle (unbiased, unlike sort(() => Math.random() - 0.5))
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export interface GalleryPhoto {
  src: string
  width: number
  height: number
  filename: string
  title?: string
  description?: string
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
  const categoryMap = new Map<string, typeof objects>()

  for (const obj of objects) {
    if (!isImageKey(obj.key)) continue
    const match = obj.key.match(/^gallery\/([^/]+)\/(.+)$/)
    if (match) {
      const [, categorySlug] = match
      if (!categoryMap.has(categorySlug)) {
        categoryMap.set(categorySlug, [])
      }
      categoryMap.get(categorySlug)?.push(obj)
    }
  }

  // Create category objects — cover is the most recently modified photo
  for (const [slug, photos] of categoryMap.entries()) {
    if (photos.length > 0) {
      const newest = photos.reduce((a, b) =>
        b.lastModified > a.lastModified ? b : a,
      )
      const coverPhoto = await getPresignedUrl(newest.key)

      categories.push({
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        photoCount: photos.length,
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

    // List all image objects in this category
    const objects = (await listObjects(prefix)).filter((obj) => isImageKey(obj.key))

    // Resolve metadata + presigned URLs in parallel (sequential was seconds-slow)
    const results = await Promise.all(
      objects.map(async (obj): Promise<GalleryPhoto | null> => {
        try {
          const [metadata, signedUrl] = await Promise.all([
            getObjectMetadata(obj.key),
            getPresignedUrl(obj.key),
          ])

          return {
            src: signedUrl,
            width: parseInt(metadata.width || '1500', 10),
            height: parseInt(metadata.height || '1500', 10),
            filename: obj.key.split('/').pop() || '',
            title: metadata.title || metadata.caption || undefined,
            description: metadata.description || undefined,
          }
        } catch (error) {
          console.error(`Error processing ${obj.key}:`, error)
          return null // Skip files we can't process
        }
      }),
    )

    const photos = shuffle(results.filter((p): p is GalleryPhoto => p !== null))

    return {
      category,
      categoryName: category.charAt(0).toUpperCase() + category.slice(1),
      photos,
    }
  }
)

// Server function to get a random photo for homepage hero
export const getRandomHeroPhoto = createServerFn({ method: 'GET' }).handler(async () => {
  // List all photos from all categories — images only, so we never pick a
  // folder-marker or non-image key (the cause of the hero failing to load)
  const objects = (await listObjects('gallery/')).filter((obj) => isImageKey(obj.key))

  if (objects.length === 0) {
    return null
  }

  // Pick a random photo
  const randomIndex = Math.floor(Math.random() * objects.length)
  const randomPhoto = objects[randomIndex]

  // Get metadata and presigned URL
  const [metadata, signedUrl] = await Promise.all([
    getObjectMetadata(randomPhoto.key),
    getPresignedUrl(randomPhoto.key),
  ])

  return {
    src: signedUrl,
    width: parseInt(metadata.width || '1920', 10),
    height: parseInt(metadata.height || '1080', 10),
  }
})
