import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { checkUrl } from '../api/checkUrl.js'
import { SessionChart } from '../components/SessionChart.jsx'
import { SignalList } from '../components/SignalList.jsx'
import { TrustGauge } from '../components/TrustGauge.jsx'
import { UrlBreakdown } from '../components/UrlBreakdown.jsx'
import { useSession } from '../context/SessionContext.jsx'
import { explainUrl, trustBand } from '../lib/explainUrl.js'

export function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { checks, active, addCheck, selectCheck } = useSession()
  const requestedUrl = location.state?.url ?? ''
  const [status, setStatus] = useState(requestedUrl ? 'loading' : active ? 'ready' : 'empty')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'PhishGuard · Result'
  }, [])

  useEffect(() => {
    if (!requestedUrl) return undefined
    let cancelled = false
    setStatus('loading')
    setError('')

    checkUrl(requestedUrl)
      .then((result) => {
        if (cancelled) return
        addCheck({
          id: crypto.randomUUID(),
          url: requestedUrl,
          trustScore: result.trustScore,
          verdict: result.verdict,
          confidence: result.confidence,
          modelFactors: result.modelFactors,
          source: 'api',
        })
        setStatus('ready')
      })
      .catch((caught) => {
        if (cancelled) return
        setError(caught.message || 'The check failed.')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
    // A new navigation key means a new check. addCheck is stable enough for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, requestedUrl])

  function showPreview() {
    const explained = explainUrl(requestedUrl)
    const band = trustBand(explained.previewTrust)
    addCheck({
      id: crypto.randomUUID(),
      url: requestedUrl,
      trustScore: explained.previewTrust,
      verdict: band.tone === 'mint' ? 'legitimate' : 'phishing',
      confidence: null,
      modelFactors: [],
      source: 'preview',
    })
    setStatus('ready')
    navigate('/result', { replace: true, state: {} })
  }

  return (
    <div className="pt-4">
      <Link to="/" className="text-xs font-medium tracking-[0.14em] text-mist hover:text-white">
        ← ANALYSE ANOTHER URL
      </Link>

      {status === 'loading' ? <Loading /> : null}
      {status === 'error' ? <Failure message={error} onPreview={showPreview} /> : null}
      {status === 'empty' ? <Empty /> : null}
      {status === 'ready' && active ? (
        <Ready check={active} checks={checks} onSelect={selectCheck} />
      ) : null}
    </div>
  )
}

function Ready({ check, checks, onSelect }) {
  const explained = explainUrl(check.url)
  const band = trustBand(check.trustScore)
  const confidence =
    typeof check.confidence === 'number' ? `${Math.round(check.confidence * 100)}%` : null

  return (
    <div className="mt-6" aria-live="polite">
      {check.source === 'preview' ? (
        <p className="mb-4 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn">
          The API is not running, so this score is a local preview from the address text. It is not the trained model.
        </p>
      ) : null}
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
        <TrustGauge score={check.trustScore} tone={band.tone} />
        <div className="flex w-full flex-col items-center sm:items-start">
          <p className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClass(band.tone)} whitespace-pre`}>
          •   {band.label}  -  {band.verdict}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trust score: {check.trustScore}/100
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-mist">{band.summary}</p>
          <p className="mt-3 text-sm text-slate-100">
            {check.verdict === 'phishing' ? 'Phishing' : 'Legitimate'}
            {confidence ? ` - Model confidence ${confidence}` : ' - Preview, no model confidence'}
          </p>
          <p className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-mist sm:justify-start">
            <Legend swatch="bg-mint" label="65–100 Safe" />
            <Legend swatch="bg-warn" label="35–64 Suspicious" />
            <Legend swatch="bg-danger" label="0–34 Dangerous" />
          </p>
        </div>
      </div>

      <UrlBreakdown parts={explained.parts} />

      <section className="mt-8" aria-labelledby="why-title">
        <h2 id="why-title" className="text-xs font-medium tracking-[0.16em] text-mist">
          WHY THIS SCORE?
        </h2>
        <p className="mb-3 mt-2 text-sm text-mist">
          {check.source === 'api'
            ? `These ${(check.modelFactors ?? []).length} explanation${(check.modelFactors ?? []).length === 1 ? '' : 's'} come from the trained model’s strongest factors for this URL, rewritten in plain language.`
            : `The API was unavailable, so these ${explained.signals.length} explanation${explained.signals.length === 1 ? '' : 's'} are a local preview from the URL text only. They are not from the trained model.`}
        </p>
        <SignalList
          signals={check.source === 'api' ? [] : explained.signals}
          modelFactors={check.modelFactors ?? []}
          parts={explained.parts}
        />
      </section>

      <p className="mt-6 rounded-2xl border border-white/10 bg-ink-900 px-4 py-4 text-xs leading-5 text-mist">
        This page reads the address string only. It does not open the link or fetch the page. A safe score does not
        prove the site is legitimate. Check sensitive pages through a channel you already trust.
      </p>

      {checks.length > 0 ? (
        <SessionChart checks={checks} activeId={check.id} onSelect={onSelect} />
      ) : null}
    </div>
  )
}

function Loading() {
  return (
    <div className="mt-16 text-center" role="status" aria-live="polite">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-lilac" />
      <p className="mt-4 text-lg font-medium">Checking this URL</p>
      <p className="mt-1 text-sm text-mist">Waiting for the PhishGuard API.</p>
    </div>
  )
}

function Failure({ message, onPreview }) {
  return (
    <div className="mt-10 rounded-2xl border border-danger/40 bg-danger/10 px-5 py-6" role="alert">
      <h1 className="text-2xl font-semibold">The check did not finish</h1>
      <p className="mt-2 text-sm leading-6 text-slate-200">{message}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/" className="rounded-full bg-lilac px-4 py-2 text-sm font-medium text-white">
          Try another address
        </Link>
        <button
          type="button"
          onClick={onPreview}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100"
        >
          Preview signals locally
        </button>
      </div>
    </div>
  )
}

function Empty() {
  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-ink-900 px-5 py-6">
      <h1 className="text-2xl font-semibold">No result yet</h1>
      <p className="mt-2 text-sm text-mist">Analyse an address to see a trust score here.</p>
      <Link to="/" className="mt-5 inline-block rounded-full bg-lilac px-4 py-2 text-sm font-medium text-white">
        Go to Analyse
      </Link>
    </div>
  )
}

function Legend({ swatch, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${swatch}`} />
      {label}
    </span>
  )
}

function badgeClass(tone) {
  if (tone === 'danger') return 'bg-danger/15 text-danger'
  if (tone === 'warn') return 'bg-warn/15 text-warn'
  return 'bg-mint/15 text-mint'
}
