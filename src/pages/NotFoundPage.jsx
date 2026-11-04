import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'PhishGuard · Page not found'
  }, [])

  return (
    <div className="mx-auto max-w-xl pt-16 text-center">
      <p className="text-sm font-medium tracking-[0.16em] text-mint">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">This page does not exist</h1>
      <p className="mt-3 text-sm leading-6 text-mist">
        The address in the browser bar is not one of PhishGuard’s pages. The URL you came to analyse is entered on
        the Analyse page, not in the address bar of this app.
      </p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-lilac px-4 py-2 text-sm font-medium text-white">
        Back to Analyse
      </Link>
    </div>
  )
}
