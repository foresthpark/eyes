import 'dotenv/config'
import { listObjects, getObjectMetadata } from '../src/lib/r2'

async function checkMetadata() {
  console.log('Checking R2 photo metadata...\n')

  const objects = await listObjects('gallery/')

  console.log(`Found ${objects.length} photos\n`)

  for (const obj of objects.slice(0, 10)) {
    console.log(`📷 ${obj.key}`)
    const metadata = await getObjectMetadata(obj.key)
    console.log(`   Width: ${metadata.width || 'MISSING'}`)
    console.log(`   Height: ${metadata.height || 'MISSING'}`)
    console.log('')
  }
}

checkMetadata()
