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
import { DATASET, FEATURE_IMPORTANCE } from '../data/content.js'

export function DatasetPage() {
  const [topOnly, setTopOnly] = useState(false)
  const [lengthsReady, setLengthsReady] = useState(false)
  const features = topOnly ? FEATURE_IMPORTANCE.slice(0, 5) : FEATURE_IMPORTANCE
  const balance = [
    { name: 'Phishing', value: DATASET.phishing, fill: '#ff5d73' },
    { name: 'Legitimate', value: DATASET.legitimate, fill: '#3ee0b0' },
  ]
  const lengths = [
    { name: 'Legitimate', chars: DATASET.legitimateLength, fill: '#3ee0b0' },
    { name: 'Phishing', chars: DATASET.phishingLength, fill: '#ff5d73' },
  ]
  const maxLength = Math.max(...lengths.map((item) => item.chars))

  useEffect(() => {
    document.title = 'PhishGuard · Dataset'
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => setLengthsReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="pt-4">
      <p className="text-xs font-medium tracking-[0.16em] text-mint">DATASET VISUALISATION</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Training Data Overview</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-mist">
        PhishGuard’s detector was developed and validated against a curated dataset of 10,000 URLs. These charts
        describe that training set. They are not the addresses checked in this session.
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total URLs" value="10,000" />
        <Stat label="Phishing" value="5,000" />
        <Stat label="Legitimate" value="5,000" />
        <Stat label="Features extracted" value="16" />
      </ul>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-ink-900 p-4" aria-labelledby="balance-title">
          <h2 id="balance-title" className="text-xs font-medium tracking-[0.14em] text-mist">
            CLASS BALANCE
          </h2>
          <p className="text-sm text-slate-200">Equal split across both classes</p>
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
              return (
                <li key={item.name}>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.fill }} aria-hidden="true" />
                      <span className="text-xs font-medium uppercase tracking-wide text-mist">{item.name}</span>
                    </div>
                    <p className="font-mono text-lg font-semibold leading-none" style={{ color: item.fill }}>
                      {item.chars}
                      <span className="ml-1 text-xs font-normal text-mist">chars</span>
                    </p>
                  </div>
                  <div className="h-8 overflow-hidden rounded-md bg-ink-950/80" role="img" aria-label={`${item.name}: ${item.chars} characters`}>
                    <div
                      className="flex h-full items-center rounded-md pl-3 text-xs font-medium transition-[width] duration-1000 ease-out"
                      style={{
                        width: lengthsReady ? width : '0%',
                        backgroundColor: `${item.fill}33`,
                        boxShadow: `inset -2px 0 0 ${item.fill}`,
                        color: item.fill,
                      }}
                    >
                      {item.chars} chars
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-x-3 rounded-xl border border-danger/30 bg-danger/10 px-3 py-3 text-sm text-slate-200">
            <span className="font-mono text-xl font-semibold text-danger">+75</span>
            <p className="text-sm text-mist/60">chars longer on average → Phishing URLs have more characters to hide the real destination.</p>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-white/10 bg-ink-900 p-4" aria-labelledby="feature-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="feature-title" className="text-xs font-medium tracking-[0.14em] text-mist">
              FEATURE IMPORTANCE
            </h2>
            <p className="text-sm text-slate-200">Ranked by predictive power in the trained model (0–1)</p>
          </div>
          <button
            type="button"
            aria-pressed={topOnly}
            onClick={() => setTopOnly((value) => !value)}
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-slate-100"
          >
            {topOnly ? 'Show all 10' : 'Show top 5'}
          </button>
        </div>
        <div className="mt-3 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={features} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#1c2636" horizontal={false} />
              <XAxis type="number" domain={[0, 1]} tick={{ fill: '#a8b3c4', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={148} tick={{ fill: '#d5dce6', fontSize: 12 }} />
              <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="weight" name="Importance" fill="#3ee0b0" radius={[0, 6, 6, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
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
