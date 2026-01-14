import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200"
            alt="Photographer Portrait"
            className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[4/5] object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-light mb-8">About the Photographer</h1>
          <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
            <p>
              I am a nature photographer based in the Pacific Northwest, dedicated to capturing the raw, untouched beauty of our planet's forests.
            </p>
            <p>
              My work focuses on the interplay of light and shadow, the intricate details of ancient flora, and the silent majesty of the wilderness. I believe that photography is not just about seeing, but about feeling the essence of a place.
            </p>
            <p>
              Through "Eyes of Forest," I hope to share the sense of peace and wonder that I find whenever I step beneath the canopy.
            </p>
            <div className="pt-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-black mb-4">Equipment</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li>Sony A7R IV</li>
                <li>35mm f/1.4 GM</li>
                <li>85mm f/1.4 GM</li>
                <li>16-35mm f/2.8 GM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
