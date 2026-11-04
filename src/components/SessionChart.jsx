import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { bandColor, trustBand } from '../lib/explainUrl.js'

export function SessionChart({ checks, activeId, onSelect }) {
  const data = [...checks].reverse().map((check, index) => ({
    id: check.id,
    label: shorten(check.url),
    trustScore: check.trustScore,
    fill: bandColor(trustBand(check.trustScore).tone),
    index: index + 1,
  }))

  return (
    <section className="mt-10 border-t border-white/15 pt-10" aria-labelledby="session-title">
      <h2 id="session-title" className="text-lg font-semibold">
        Checks this session
      </h2>
      <p className="mt-1 text-sm text-mist">
        Each bar is one address checked in this browser tab. Select a bar to open that result again.
      </p>
      <div className="mt-4 h-72 rounded-2xl border border-white/10 bg-ink-900 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#1c2636" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#a8b3c4', fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={70} />
            <YAxis domain={[0, 100]} tick={{ fill: '#a8b3c4', fontSize: 12 }} width={32} />
            <Tooltip content={<ScoreTip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar
              dataKey="trustScore"
              name="Trust score"
              radius={[6, 6, 0, 0]}
              onClick={(bar) => {
                const id = bar?.id ?? bar?.payload?.id
                if (id) onSelect(id)
              }}
            >
              {data.map((item) => (
                <Cell key={item.id} fill={item.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {checks.map((check) => (
          <li key={check.id}>
            <button
              type="button"
              onClick={() => onSelect(check.id)}
              aria-current={check.id === activeId ? 'true' : undefined}
              className={`max-w-full truncate rounded-full border px-3 py-1 text-left font-mono text-xs ${
                check.id === activeId ? 'border-mint text-mint' : 'border-white/10 text-mist'
              }`}
            >
              {check.trustScore} · {shorten(check.url)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ScoreTip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-xs">
      <p className="max-w-xs break-all text-slate-100">{item.label}</p>
      <p className="mt-1 text-mist">Trust score {item.trustScore}/100</p>
    </div>
  )
}

function shorten(url) {
  if (url.length <= 28) return url
  return `${url.slice(0, 26)}…`
}
