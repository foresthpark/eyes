import { createFileRoute } from '@tanstack/react-router'
import { getRandomHeroPhoto } from '../lib/gallery'

// Stable OG image URL that 302-redirects to a random photo on each fetch.
// Reuses the hero picker (cached R2 list + presigned URL) so no new R2 logic.
export const Route = createFileRoute('/og-image')({
  server: {
    handlers: {
      GET: async () => {
        const photo = await getRandomHeroPhoto()
        if (!photo?.src) return new Response('Not found', { status: 404 })
        return new Response(null, {
          status: 302,
          headers: {
            Location: photo.src,
            // ponytail: no-store so each crawler fetch re-rolls; platform-side
            // OG caches (FB/X) still dominate how often the pick actually changes.
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
