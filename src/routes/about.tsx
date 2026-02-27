import { createFileRoute } from '@tanstack/react-router'
import PageSection from '../components/PageSection'
import { Breadcrumb } from '../components/Breadcrumb'
import { generateMetaTags, generateCanonicalUrl } from '../lib/seo'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      {
        title: 'About | Eyes of Forest',
      },
      ...generateMetaTags({
        description:
          'Learn about Eyes of Forest photography. Vancouver-based photographer capturing the world through film and digital photography using Hasselblad, Nikon, Pentax, and Fuji cameras.',
      }),
    ],
    links: [
      {
        rel: 'canonical',
        href: generateCanonicalUrl('/about'),
      },
    ],
  }),
})

function About() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <Breadcrumb />
      <div>
        <PageSection title="About Me">
          <p>
            I'm a photographer based in Vancouver, Canada. This is a collection of my view of the world. The things I see and the things I feel.
          </p>
          <p>
            Through my work, I hope to share my view of the world.
          </p>
          <div className="pt-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black dark:text-white mb-4">Equipment</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-200">
              <li>Hasselblad 501CM</li>
              <li>Nikon FM3A</li>
              <li>Pentax 645NII</li>
              <li>Fuji X100VI</li>
            </ul>
          </div>
        </PageSection>
      </div>
    </div>
  )
}
