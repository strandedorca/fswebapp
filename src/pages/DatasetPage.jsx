import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchDatasetInfo } from '../api/checkUrl.js'

export function DatasetPage() {
  const [reloadKey, setReloadKey] = useState(0)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [info, setInfo] = useState(null)

  useEffect(() => {
    document.title = 'PhishGuard · Dataset'
  }, [])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError('')
    setInfo(null)

    fetchDatasetInfo()
      .then((data) => {
        if (cancelled) return
        setInfo(data)
        setStatus('ready')
      })
      .catch((caught) => {
        if (cancelled) return
        setError(caught.message || 'The dataset summary could not be loaded.')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return (
    <div className="pt-4">
      <p className="text-xs font-medium tracking-[0.16em] text-mint">DATASET VISUALISATION</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Training Data Overview</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-mist">
        {info
          ? `PhishGuard’s detector was developed and validated against a training set of ${info.totalUrls.toLocaleString()} URLs. These charts describe that training set. They are not the addresses checked in this session.`
          : 'These charts describe the training set behind the detector. They are not the addresses checked in this session.'}
      </p>

      {status === 'loading' ? <Loading /> : null}
      {status === 'error' ? <Failure message={error} onRetry={() => setReloadKey((value) => value + 1)} /> : null}
      {status === 'ready' && info ? <Overview info={info} /> : null}
    </div>
  )
}

function Overview({ info }) {
  const [topOnly, setTopOnly] = useState(false)
  const [lengthsReady, setLengthsReady] = useState(false)
  const features = topOnly ? info.features.slice(0, 5) : info.features
  const axisMax = Math.max(1, ...info.features.map((item) => item.weight))
  const balance = [
    { name: 'Phishing', value: info.phishing, fill: '#ff5d73' },
    { name: 'Legitimate', value: info.legitimate, fill: '#3ee0b0' },
  ]
  const lengths = [
    { name: 'Legitimate', chars: info.avgCharsLegitimate, fill: '#3ee0b0' },
    { name: 'Phishing', chars: info.avgCharsPhishing, fill: '#ff5d73' },
  ]
  const maxLength = Math.max(...lengths.map((item) => item.chars), 1)
  const note = lengthNote(info.avgCharsLegitimate, info.avgCharsPhishing)

  useEffect(() => {
    const id = requestAnimationFrame(() => setLengthsReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total URLs" value={info.totalUrls.toLocaleString()} />
        <Stat label="Phishing" value={info.phishing.toLocaleString()} />
        <Stat label="Legitimate" value={info.legitimate.toLocaleString()} />
        <Stat label="Features extracted" value={info.featuresExtracted.toLocaleString()} />
      </ul>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-ink-900 p-4" aria-labelledby="balance-title">
          <h2 id="balance-title" className="text-xs font-medium tracking-[0.14em] text-mist">
            CLASS BALANCE
          </h2>
          <p className="text-sm text-slate-200">Counts in the training split</p>
          <div className="mt-2 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="h-64 w-full min-w-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={balance}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={84}
                    paddingAngle={0}
                    stroke="none"
                  >
                    {balance.map((item) => (
                      <Cell key={item.name} fill={item.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full shrink-0 sm:w-auto sm:pr-2">
              {balance.map((item) => (
                <li key={item.name} className="grid grid-cols-[auto_1fr] items-start gap-x-3">
                  <span className="mt-1 h-4 w-4 rounded-sm" style={{ backgroundColor: item.fill }} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-slate-100">{item.name}</p>
                    <p className="font-mono text-xl font-semibold" style={{ color: item.fill }}>
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-ink-900 p-4" aria-labelledby="length-title">
          <h2 id="length-title" className="text-xs font-medium tracking-[0.14em] text-mist">
            AVERAGE URL LENGTH
          </h2>
          <p className="text-sm text-slate-200">Average character count by class</p>
          <ul className="mt-5 space-y-5">
            {lengths.map((item) => {
              const width = `${Math.round((item.chars / maxLength) * 100)}%`
              const label = formatChars(item.chars)
              return (
                <li key={item.name}>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.fill }} aria-hidden="true" />
                      <span className="text-xs font-medium uppercase tracking-wide text-mist">{item.name}</span>
                    </div>
                    <p className="font-mono text-lg font-semibold leading-none" style={{ color: item.fill }}>
                      {label}
                      <span className="ml-1 text-xs font-normal text-mist">chars</span>
                    </p>
                  </div>
                  <div className="h-8 overflow-hidden rounded-md bg-ink-950/80" role="img" aria-label={`${item.name}: ${label} characters`}>
                    <div
                      className="flex h-full items-center rounded-md pl-3 text-xs font-medium transition-[width] duration-1000 ease-out"
                      style={{
                        width: lengthsReady ? width : '0%',
                        backgroundColor: `${item.fill}33`,
                        boxShadow: `inset -2px 0 0 ${item.fill}`,
                        color: item.fill,
                      }}
                    >
                      {label} chars
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <div
            className={`mt-5 grid grid-cols-[auto_1fr] items-center gap-x-3 rounded-xl px-3 py-3 text-sm text-slate-200 ${
              note.tone === 'danger' ? 'border border-danger/30 bg-danger/10' : 'border border-white/15 bg-ink-950/40'
            }`}
          >
            <span className={`font-mono text-xl font-semibold ${note.tone === 'danger' ? 'text-danger' : 'text-slate-100'}`}>
              {note.badge}
            </span>
            <p className="text-sm text-mist/60">{note.text}</p>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-white/10 bg-ink-900 p-4" aria-labelledby="feature-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="feature-title" className="text-xs font-medium tracking-[0.14em] text-mist">
              FEATURE IMPORTANCE
            </h2>
            <p className="text-sm text-slate-200">Top features by weight in the trained model</p>
          </div>
          {info.features.length > 5 ? (
            <button
              type="button"
              aria-pressed={topOnly}
              onClick={() => setTopOnly((value) => !value)}
              className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-slate-100"
            >
              {topOnly ? `Show all ${info.features.length}` : 'Show top 5'}
            </button>
          ) : null}
        </div>
        <div className="mt-3 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={features} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#1c2636" horizontal={false} />
              <XAxis type="number" domain={[0, axisMax]} tick={{ fill: '#a8b3c4', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={168} tick={{ fill: '#d5dce6', fontSize: 12 }} />
              <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="weight" name="Importance" fill="#3ee0b0" radius={[0, 6, 6, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  )
}

function lengthNote(legitimate, phishing) {
  const delta = Math.round(phishing - legitimate)
  if (delta > 0) {
    return {
      badge: `+${delta}`,
      tone: 'danger',
      text: 'chars longer on average → Phishing URLs have more characters to hide the real destination.',
    }
  }
  if (delta < 0) {
    return {
      badge: String(delta),
      tone: 'neutral',
      text: 'chars shorter on average → In this training set, phishing URLs are shorter than legitimate ones.',
    }
  }
  return {
    badge: '0',
    tone: 'neutral',
    text: 'chars difference on average → Both classes have about the same URL length.',
  }
}

function formatChars(value) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function Loading() {
  return (
    <div className="mt-10 text-center" role="status" aria-live="polite">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-lilac" />
      <p className="mt-4 text-lg font-medium">Loading the training set</p>
      <p className="mt-1 text-sm text-mist">Waiting for the PhishGuard API.</p>
    </div>
  )
}

function Failure({ message, onRetry }) {
  return (
    <div className="mt-10 rounded-2xl border border-danger/40 bg-danger/10 px-5 py-6" role="alert">
      <h2 className="text-2xl font-semibold">The dataset summary did not load</h2>
      <p className="mt-2 text-sm leading-6 text-slate-200">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-lilac px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-ink-900 px-4 py-4 font-mono">
      <p className="text-[11px] uppercase tracking-wide text-mist">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-mint">{value}</p>
    </li>
  )
}

function ChartTip({ active, payload, suffix = '' }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-xs">
      <p className="text-slate-100">{item.payload.name ?? item.name}</p>
      <p className="mt-1 text-mist">
        {item.name}: {item.value}
        {suffix}
      </p>
    </div>
  )
}
