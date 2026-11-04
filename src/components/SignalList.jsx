const LEVEL_STYLE = {
  high: 'border-danger/40 bg-danger/10',
  medium: 'border-warn/40 bg-warn/10',
  low: 'border-sky-400/30 bg-sky-400/10',
}

const TAG_STYLE = {
  high: 'bg-danger/20 text-danger',
  medium: 'bg-warn/20 text-warn',
  low: 'bg-sky-400/20 text-sky-300',
}

export function SignalList({ signals, parts }) {
  if (signals.length === 0) {
    return (
      <p className="rounded-2xl border border-mint/30 bg-mint/10 px-4 py-4 text-sm text-slate-200">
        Nothing in the address text matched the signals this page looks for.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {signals.map((signal) => (
        <li key={signal.id} className={`rounded-2xl border px-4 py-4 ${LEVEL_STYLE[signal.level]}`}>
          <p className="font-medium text-white">
            <span className={`mr-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TAG_STYLE[signal.level]}`}>
              {signal.tag}
            </span>
            {signal.title}
          </p>
          <p className="mt-2 break-all font-mono text-xs text-mist">
            {parts.protocol}://{parts.host}
            {parts.path}
            {parts.query !== '—' ? parts.query : ''}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{signal.detail}</p>
        </li>
      ))}
    </ul>
  )
}
