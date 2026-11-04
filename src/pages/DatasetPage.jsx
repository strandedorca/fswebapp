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
  const features = topOnly ? FEATURE_IMPORTANCE.slice(0, 5) : FEATURE_IMPORTANCE
  const balance = [
    { name: 'Phishing', value: DATASET.phishing, fill: '#ff5d73' },
    { name: 'Legitimate', value: DATASET.legitimate, fill: '#3ee0b0' },
  ]
  const lengths = [
    { name: 'Legitimate', chars: DATASET.legitimateLength, fill: '#147a62' },
    { name: 'Phishing', chars: DATASET.phishingLength, fill: '#8d3040' },
  ]

  useEffect(() => {
    document.title = 'PhishGuard · Dataset'
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
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={balance} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={2}>
                  {balance.map((item) => (
                    <Cell key={item.name} fill={item.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex justify-center gap-6 text-sm">
            <li className="text-danger">Phishing · 5,000</li>
            <li className="text-mint">Legitimate · 5,000</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-ink-900 p-4" aria-labelledby="length-title">
          <h2 id="length-title" className="text-xs font-medium tracking-[0.14em] text-mist">
            AVERAGE URL LENGTH
          </h2>
          <p className="text-sm text-slate-200">Average character count by class</p>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lengths} layout="vertical" margin={{ left: 16, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={90} tick={{ fill: '#a8b3c4', fontSize: 12 }} />
                <Tooltip content={<ChartTip suffix=" chars" />} />
                <Bar dataKey="chars" name="Characters" radius={[0, 6, 6, 0]} barSize={18}>
                  {lengths.map((item) => (
                    <Cell key={item.name} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-3 text-sm text-slate-200">
            <span className="font-semibold text-danger">+75</span> chars longer on average. Phishing URLs use the
            extra length to hide the real destination.
          </p>
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
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="weight" name="Importance" fill="#3ee0b0" radius={[0, 6, 6, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-ink-900 px-4 py-4">
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
