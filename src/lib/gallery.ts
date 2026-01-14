import { createServerFn } from '@tanstack/react-start'
import fs from 'node:fs'
import path from 'node:path'
import sizeOf from 'image-size'

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

const GALLERY_BASE_PATH = path.join(process.cwd(), 'public', 'gallery')

// Server function to get all gallery categories
export const getGalleryCategories = createServerFn({ method: 'GET' }).handler(async () => {
  const categories: GalleryCategory[] = []

  if (!fs.existsSync(GALLERY_BASE_PATH)) {
    return categories
  }

  const dirs = fs.readdirSync(GALLERY_BASE_PATH, { withFileTypes: true })

  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const categoryPath = path.join(GALLERY_BASE_PATH, dir.name)
      const files = fs.readdirSync(categoryPath)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))

      if (files.length > 0) {
        const coverPhoto = `/gallery/${dir.name}/${files[0]}`

        categories.push({
          name: dir.name.charAt(0).toUpperCase() + dir.name.slice(1),
          slug: dir.name,
          photoCount: files.length,
          coverPhoto,
        })
      }
    }
  }

  return categories
})

// Server function to get photos for a specific category
export const getGalleryPhotos = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const category = ctx.data as string
    const categoryPath = path.join(GALLERY_BASE_PATH, category)

    if (!fs.existsSync(categoryPath)) {
      throw new Error(`Gallery category "${category}" not found`)
    }

    const files = fs.readdirSync(categoryPath)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort()

    const photos: GalleryPhoto[] = []

    for (const file of files) {
      const filePath = path.join(categoryPath, file)
      try {
        const buffer = fs.readFileSync(filePath)
        const dimensions = sizeOf(buffer)

        photos.push({
          src: `/gallery/${category}/${file}`,
          width: dimensions.width || 1500,
          height: dimensions.height || 1500,
          filename: file,
        })
      } catch (error) {
        console.error(`Error reading dimensions for ${file}:`, error)
        // Skip files we can't read
      }
    }

    return {
      category,
      categoryName: category.charAt(0).toUpperCase() + category.slice(1),
      photos,
    }
  }
)
