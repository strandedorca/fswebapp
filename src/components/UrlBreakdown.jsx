import { HighlightedUrl } from './HighlightedUrl.jsx'

const FIELDS = [
  ['protocol', 'Protocol'],
  ['subdomain', 'Subdomain'],
  ['domain', 'Domain'],
  ['tld', 'TLD'],
  ['path', 'Path'],
  ['query', 'Query'],
]

export function UrlBreakdown({ parts }) {
  return (
    <section className="mt-8" aria-labelledby="breakdown-title">
      <h2 id="breakdown-title" className="text-xs font-medium tracking-[0.16em] text-mist">
        URL BREAKDOWN
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
        <div className="border-b border-white/5 px-4 py-4">
          <HighlightedUrl parts={parts} />
        </div>
        <dl className="grid gap-4 px-4 py-4 sm:grid-cols-2">
          {FIELDS.map(([key, label]) => (
            <div key={key}>
              <dt className="text-[11px] uppercase tracking-wide text-mist">{label}</dt>
              <dd className="mt-1 break-all font-mono text-sm text-slate-100">{parts[key]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
