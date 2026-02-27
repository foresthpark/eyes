import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumb } from '../components/Breadcrumb'
import { generateMetaTags, generateCanonicalUrl } from '../lib/seo'

export const Route = createFileRoute('/contact')({
  component: Contact,
  head: () => ({
    meta: [
      {
        title: 'Contact | Eyes of Forest',
      },
      ...generateMetaTags({
        description:
          'Get in touch with Eyes of Forest photography. Interested in prints, collaborations, or just want to say hello? Contact me via email or Instagram.',
      }),
    ],
    links: [
      {
        rel: 'canonical',
        href: generateCanonicalUrl('/contact'),
      },
    ],
  }),
})

function Contact() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <Breadcrumb />
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-light mb-6 dark:text-white">Get in Touch</h1>
        <p className="text-gray-500 dark:text-gray-300 text-lg">
          Whether you're interested in a print, a collaboration, or just want to say hello, I'd love to hear from you.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-12">
        {/* Email */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-300 mb-4">Email</p>
          <a
            href="mailto:soop_lim@proton.me"
            className="text-2xl font-light text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            soop_lim@proton.me
          </a>
        </div>

        {/* Instagram */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-300 mb-4">Instagram</p>
          <a
            href="https://instagram.com/eyes_of_forest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-light text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            @eyes_of_forest
          </a>
        </div>

        {/* Location */}
        <div className="text-center pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-300">
            Vancouver, Canada
          </p>
        </div>
      </div>
    </div>
  )
}
