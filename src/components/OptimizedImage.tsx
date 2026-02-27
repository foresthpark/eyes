import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

// Generate a simple blur placeholder (tiny 1x1 pixel data URL)
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1)
      setHasError(false)
      setIsLoading(true)
      // Force reload by adding a cache-busting parameter
      setCurrentSrc(`${src}${src.includes('?') ? '&' : '?'}retry=${retryCount + 1}&t=${Date.now()}`)
    }
  }

  // Reset currentSrc when src prop changes
  useEffect(() => {
    if (src !== currentSrc && !currentSrc.includes('retry=')) {
      setCurrentSrc(src)
      setRetryCount(0)
      setIsLoading(true)
      setHasError(false)
    }
  }, [src, currentSrc])

  if (hasError) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-2 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`${alt} - Failed to load`}
      >
        <span className="text-gray-400 dark:text-gray-300 text-sm">Failed to load image</span>
        {retryCount < 3 && (
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs text-gray-600 dark:text-gray-200 hover:text-black dark:hover:text-white underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 rounded"
            aria-label={`Retry loading ${alt}`}
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Blur placeholder */}
      {isLoading && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        decoding="async"
      />
    </div>
  )
}
