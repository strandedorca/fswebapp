import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function ErrorPage({ onRetry }) {
  useEffect(() => {
    document.title = 'PhishGuard · Something went wrong'
  }, [])

  return (
    <div className="mx-auto min-h-[70vh] max-w-xl px-4 pt-16 text-center">
      <p className="text-sm font-medium tracking-[0.16em] text-danger">UNEXPECTED ERROR</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-3 text-sm leading-6 text-mist">
        This page is the fallback for a failure inside the interface. The details stay off the screen. You can go
        back to Analyse and try again.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        {onRetry ? (
          <button type="button" onClick={onRetry} className="rounded-full bg-lilac px-4 py-2 text-sm font-medium text-white">
            Try again
          </button>
        ) : null}
        <Link to="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100">
          Back to Analyse
        </Link>
      </div>
    </div>
  )
}
