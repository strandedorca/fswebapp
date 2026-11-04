import { useEffect } from 'react'
import { UrlForm } from '../components/UrlForm.jsx'

const POINTS = [
  {
    title: 'Sent to loca API',
    body: 'The address is posted only to the PhishGuard API server. It is not opened as a link.',
    icon: 'lock',
  },
  {
    title: 'Instant analysis',
    body: 'The score and the signals appear as soon as the model responds.',
    icon: 'bolt',
  },
  {
    title: 'Shows the signals',
    body: 'Suspicious parts of the address are highlighted, with a reason in plain language.',
    icon: 'search',
  },
  {
    title: 'Shown as text',
    body: 'The address is never inserted as HTML, so it cannot change this page.',
    icon: 'shield',
  },
]

export function HomePage() {
  useEffect(() => {
    document.title = 'PhishGuard · Analyse'
  }, [])

  return (
    <div className="pb-8 pt-6 sm:pt-10">
      <p className="mx-auto mb-6 w-fit rounded-full border border-mint/30 bg-mint/10 px-5 py-1.5 text-center text-[11px] font-medium tracking-wide text-mint whitespace-pre">
        LOCAL API ONLY    •    PAGE NEVER FETCHED    •    NO DATA TRACKING
      </p>
      <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">Is this URL safe?</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-6 text-mist sm:text-base">
        Paste a web address below. PhishGuard analyzes its structure for phishing indicators without ever fetching the page.
      </p>
      <div className="mt-8">
        <UrlForm />
      </div>
      <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map((point) => (
          <li key={point.title} className="rounded-2xl border border-white/10 bg-ink-900 px-4 py-4">
            <div className="flex flex-col items-center justify-center">
              <Icon name={point.icon} />  
              <h2 className="mt-3 text-sm font-medium">{point.title}</h2>
              <p className="mt-1 text-xs leading-5 text-mist text-center">{point.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Icon({ name }) {
  const common = 'h-5 w-5 text-warn'
  if (name === 'lock') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    )
  }
  if (name === 'bolt') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="currentColor">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    )
  }
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 5 6v6c0 4.2 2.8 7.4 7 8.5 4.2-1.1 7-4.3 7-8.5V6l-7-3z" />
    </svg>
  )
}
