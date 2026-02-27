import { getGalleryCategories } from './gallery'
import { getSiteUrl } from './seo'

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

/**
 * Generate sitemap.xml content
 */
export async function generateSitemap(): Promise<string> {
  const baseUrl = getSiteUrl()
  const urls: SitemapUrl[] = []

  // Static routes
  urls.push({
    loc: `${baseUrl}/`,
    changefreq: 'weekly',
    priority: 1.0,
  })

  urls.push({
    loc: `${baseUrl}/gallery`,
    changefreq: 'weekly',
    priority: 0.9,
  })

  urls.push({
    loc: `${baseUrl}/about`,
    changefreq: 'monthly',
    priority: 0.7,
  })

  urls.push({
    loc: `${baseUrl}/contact`,
    changefreq: 'monthly',
    priority: 0.6,
  })

  // Dynamic category routes
  try {
    const categories = await getGalleryCategories()
    for (const category of categories) {
      urls.push({
        loc: `${baseUrl}/gallery/${category.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
      })
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
    // Continue without category routes if there's an error
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}${url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `\n    <priority>${url.priority}</priority>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>`

  return xml
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
