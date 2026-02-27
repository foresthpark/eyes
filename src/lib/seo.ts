/**
 * SEO utility functions for generating meta tags and canonical URLs
 */

/**
 * Get the base site URL from environment variables or default
 */
export function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin
  }
  // Server-side: use environment variable or default
  return import.meta.env.VITE_SITE_URL || 'https://eyesofforest.com'
}

/**
 * Generate canonical URL for a given path
 */
export function generateCanonicalUrl(path: string = '/'): string {
  const baseUrl = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

/**
 * Generate standard meta tags
 */
export function generateMetaTags(options: {
  description?: string
  keywords?: string
  author?: string
}): Array<{ name: string; content: string }> {
  const tags: Array<{ name: string; content: string }> = []

  if (options.description) {
    tags.push({
      name: 'description',
      content: options.description,
    })
  }

  if (options.keywords) {
    tags.push({
      name: 'keywords',
      content: options.keywords,
    })
  }

  if (options.author) {
    tags.push({
      name: 'author',
      content: options.author,
    })
  }

  return tags
}

/**
 * Default site metadata
 */
export const defaultSiteMetadata = {
  name: import.meta.env.VITE_SITE_NAME || 'Eyes of Forest',
  description:
    import.meta.env.VITE_SITE_DESCRIPTION ||
    'Photography portfolio showcasing my view of the world through film and digital photography.',
  author: 'Eyes of Forest',
  keywords: 'photography, film photography, digital photography, portfolio, nature photography, landscape photography',
}
