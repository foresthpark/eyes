import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import sizeOf from 'image-size'
import { uploadFile, objectExists } from '../src/lib/r2'

const GALLERY_BASE_PATH = path.join(process.cwd(), 'public', 'gallery')

async function uploadPhotosToR2() {
  console.log('Starting photo upload to Cloudflare R2...\n')

  if (!fs.existsSync(GALLERY_BASE_PATH)) {
    console.error(`Error: Gallery directory not found at ${GALLERY_BASE_PATH}`)
    process.exit(1)
  }

  const categories = fs.readdirSync(GALLERY_BASE_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  console.log(`Found ${categories.length} categories: ${categories.join(', ')}\n`)

  let totalUploaded = 0
  let totalSkipped = 0
  let totalErrors = 0
  const uploadedFiles: string[] = []

  for (const category of categories) {
    console.log(`\n📁 Processing category: ${category}`)
    console.log('─'.repeat(50))

    const categoryPath = path.join(GALLERY_BASE_PATH, category)
    const files = fs.readdirSync(categoryPath)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort()

    console.log(`Found ${files.length} photos in ${category}\n`)

    for (const file of files) {
      const filePath = path.join(categoryPath, file)
      const r2Key = `gallery/${category}/${file}`

      try {
        // Check if file already exists in R2
        const exists = await objectExists(r2Key)
        if (exists) {
          console.log(`⏭️  Skipped: ${file} (already exists in R2)`)
          totalSkipped++
          continue
        }

        // Read image dimensions
        const buffer = fs.readFileSync(filePath)
        const dimensions = sizeOf(buffer)

        // Prepare metadata
        const metadata = {
          width: String(dimensions.width || 0),
          height: String(dimensions.height || 0),
          originalName: file,
        }

        // Upload to R2
        await uploadFile(r2Key, filePath, metadata)

        const fileSize = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2)
        console.log(`✅ Uploaded: ${file} (${fileSize}MB, ${dimensions.width}x${dimensions.height})`)
        totalUploaded++
        uploadedFiles.push(filePath)
      } catch (error) {
        console.error(`❌ Error uploading ${file}:`, error)
        totalErrors++
      }
    }
  }

  // Delete uploaded files
  let totalDeleted = 0
  for (const filePath of uploadedFiles) {
    try {
      fs.unlinkSync(filePath)
      totalDeleted++
    } catch (error) {
      console.error(`❌ Error deleting ${filePath}:`, error)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Upload Summary:')
  console.log('='.repeat(50))
  console.log(`✅ Uploaded: ${totalUploaded}`)
  console.log(`🗑️  Deleted:  ${totalDeleted}`)
  console.log(`⏭️  Skipped:  ${totalSkipped}`)
  console.log(`❌ Errors:   ${totalErrors}`)
  console.log('='.repeat(50))

  if (totalUploaded > 0) {
    console.log('\n✨ Photos successfully uploaded to Cloudflare R2 and deleted locally!')
    console.log('You can now view them in your R2 dashboard.')
  }

  if (totalErrors > 0) {
    console.log('\n⚠️  Some uploads failed. Please check the errors above.')
    process.exit(1)
  }
}

// Run the upload
uploadPhotosToR2().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
