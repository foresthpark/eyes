import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-light mb-6">Get in Touch</h1>
        <p className="text-gray-500 text-lg">
          Whether you're interested in a print, a collaboration, or just want to say hello, I'd love to hear from you.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-12">
        {/* Email */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Email</p>
          <a
            href="mailto:soop_lim@proton.me"
            className="text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
          >
            soop_lim@proton.me
          </a>
        </div>

        {/* Instagram */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Instagram</p>
          <a
            href="https://instagram.com/eyes_of_forest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors"
          >
            @eyes_of_forest
          </a>
        </div>

        {/* Location */}
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Vancouver, Canada
          </p>
        </div>
      </div>
    </div>
  )
}
