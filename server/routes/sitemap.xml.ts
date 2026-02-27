import { generateSitemap } from '../../src/lib/sitemap'

export default defineEventHandler(async (event) => {
  const xml = await generateSitemap()
  
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  
  return xml
})
