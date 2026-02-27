export function GallerySkeleton() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-2xl mb-16">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-6 animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
              style={{
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="aspect-4/3 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  )
}
