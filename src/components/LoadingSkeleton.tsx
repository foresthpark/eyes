export function GallerySkeleton() {
  return (
    <div className="w-full">
      <div className="px-margin-mobile md:px-margin py-gutter md:py-16">
        <div className="max-w-2xl mb-gutter">
          <div className="h-10 bg-surface-container w-48 mb-6 animate-pulse" />
          <div className="h-6 bg-surface-container w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-surface-container animate-pulse"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="aspect-4/3 bg-surface-container animate-pulse"
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  )
}
