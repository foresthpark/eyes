/**
 * SEO utility functions for generating meta tags and canonical URLs
 */

/**
 * Get the base site URL from environment variables or default
 */
export function getSiteUrl(): string {
  // Always the configured production URL — window.origin would leak preview
  // domains into canonicals and OG tags
  return import.meta.env.VITE_SITE_URL || 'https://eyes.forest.dev'
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
 * Generate Open Graph and Twitter Card meta tags
 */
export function generateOgTags(options: {
  title: string
  description: string
  url: string
  type?: string
  image?: string
}): Array<{ property?: string; name?: string; content: string }> {
  const {
    title,
    description,
    url,
    type = 'website',
    image = `${getSiteUrl()}/logo512.png`,
  } = options

  return [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: 'Eyes of Forest' },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]
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
