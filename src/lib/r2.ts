import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'node:fs'

// Cloudflare R2 Configuration from environment variables
const ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID!
const SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY!
const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME!
const ENDPOINT = process.env.CLOUDFLARE_S3_ENDPOINT!

if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME || !ENDPOINT) {
  throw new Error('Missing required R2 environment variables')
}

// Initialize S3 Client for R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
})

export interface R2Object {
  key: string
  size: number
  lastModified: Date
  metadata?: Record<string, string>
}

/**
 * List objects in R2 bucket with optional prefix
 */
export async function listObjects(prefix?: string): Promise<R2Object[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  })

  const response = await r2Client.send(command)

  if (!response.Contents) {
    return []
  }

  return response.Contents.map(obj => ({
    key: obj.Key!,
    size: obj.Size || 0,
    lastModified: obj.LastModified || new Date(),
  }))
}

/**
 * Get object metadata from R2
 */
export async function getObjectMetadata(key: string): Promise<Record<string, string>> {
  const command = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  const response = await r2Client.send(command)
  return response.Metadata || {}
}

export interface PresignedUrlOptions {
  expiresIn?: number
  responseContentDisposition?: string
}

/**
 * Generate a presigned URL for an R2 object
 */
export async function getPresignedUrl(
  key: string,
  options: PresignedUrlOptions | number = 86400,
): Promise<string> {
  const resolved =
    typeof options === 'number'
      ? { expiresIn: options }
      : { expiresIn: 86400, ...options }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ...(resolved.responseContentDisposition
      ? { ResponseContentDisposition: resolved.responseContentDisposition }
      : {}),
  })

  const url = await getSignedUrl(r2Client, command, {
    expiresIn: resolved.expiresIn ?? 86400,
  })
  return url
}

/**
 * Read and parse a JSON object from R2
 */
export async function getJson<T>(key: string): Promise<T | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    const response = await r2Client.send(command)
    const body = await response.Body?.transformToString()
    if (!body) return null
    return JSON.parse(body) as T
  } catch {
    return null
  }
}

/**
 * Write a JSON object to R2
 */
export async function putJson(key: string, data: unknown): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  })
  await r2Client.send(command)
}

/**
 * Upload a file to R2
 */
export async function uploadFile(
  key: string,
  filePath: string,
  metadata?: Record<string, string>
): Promise<void> {
  const fileBuffer = fs.readFileSync(filePath)

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    Metadata: metadata,
  })

  await r2Client.send(command)
}

/**
 * Upload a buffer to R2
 */
export async function uploadBuffer(
  key: string,
  buffer: Buffer,
  options?: {
    metadata?: Record<string, string>
    contentType?: string
  },
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    Metadata: options?.metadata,
    ContentType: options?.contentType,
  })

  await r2Client.send(command)
}

/**
 * Check if an object exists in R2
 */
export async function objectExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    await r2Client.send(command)
    return true
  } catch (error) {
    return false
  }
}
