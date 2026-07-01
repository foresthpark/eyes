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
      <AlertCircle className="w-12 h-12 text-secondary mb-4" aria-hidden="true" />
      <h2 className="font-display text-2xl mb-2">{title}</h2>
      <p className="text-secondary mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 border border-primary px-8 py-3 hover:bg-primary hover:text-on-primary uppercase tracking-widest text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={retryLabel}
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
