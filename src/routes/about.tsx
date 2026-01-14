import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <div>
          <h1 className="text-4xl font-light mb-8">About Me</h1>
          <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
            <p>
              I'm a photographer based in Vancouver, Canada. This is a collection of my view of the world. The things I see and the things I feel.
            </p>
            <p>
              Through my work, I hope to share my view of the world.
            </p>
            <div className="pt-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-black mb-4">Equipment</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li>Hasselblad 501CM</li>
                <li>Nikon FM3A</li>
                <li>Pentax 645NII</li>
              </ul>
            </div>
        </div>
      </div>
    </div>
  )
}
