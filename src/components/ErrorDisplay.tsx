import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorDisplayProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorDisplay({
  title = 'Unable to load content',
  message = 'Something went wrong while loading. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}: ErrorDisplayProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-300 mb-4" aria-hidden="true" />
      <h2 className="text-xl font-semibold mb-2 dark:text-white">{title}</h2>
      <p className="text-gray-500 dark:text-gray-300 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-900 transition-colors uppercase tracking-widest text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          aria-label={retryLabel}
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
