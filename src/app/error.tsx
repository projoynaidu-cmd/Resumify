'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to your error-reporting service here
    console.error('[Resumify] Unhandled error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#feeeed] text-[var(--danger)] grid place-items-center mb-5">
        <AlertTriangle size={28} aria-hidden />
      </div>
      <h1 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">
        Something went wrong
      </h1>
      <p className="text-[var(--text2)] mb-1 max-w-sm text-sm">
        An unexpected error occurred. Your resume data is safe in localStorage.
      </p>
      {error.digest && (
        <p className="text-[var(--text3)] font-mono text-xs mb-5">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent2)] transition-colors duration-200"
        >
          <RefreshCcw size={14} aria-hidden /> Try again
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text2)] text-sm font-medium border border-[var(--border)] hover:bg-[var(--surface2)] transition-colors duration-200"
        >
          Reload app
        </a>
      </div>
    </div>
  )
}

