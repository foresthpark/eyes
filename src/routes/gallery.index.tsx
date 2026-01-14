import { createFileRoute, Link } from '@tanstack/react-router'
import { getGalleryCategories } from '../lib/gallery'

export const Route = createFileRoute('/gallery/')({
  component: GalleryIndex,
  loader: async () => {
    const categories = await getGalleryCategories()
    return { categories }
  },
})

function GalleryIndex() {
  const { categories } = Route.useLoaderData()

  return (
    <div className="w-full">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl font-light mb-6">Gallery</h1>
          <p className="text-gray-500 text-lg mb-12">
            My view of the world. Through film and digital photography.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-500">No galleries found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to="/gallery/$category"
                params={{ category: category.slug }}
                className="group relative overflow-hidden rounded-lg aspect-4/3 bg-gray-100 hover:shadow-xl transition-shadow"
              >
                <img
                  src={category.coverPhoto}
                  alt={`${category.name} Photography`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <h2 className="text-white text-2xl font-light mb-2">
                      {category.name}
                    </h2>
                    <p className="text-white/80 text-sm">
                      View {category.photoCount} {category.photoCount === 1 ? 'photo' : 'photos'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
