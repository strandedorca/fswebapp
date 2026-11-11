import { describeModelFactor } from '../lib/modelFactors.js'

const LEVEL_STYLE = {
  high: 'border-danger/40 bg-danger/10',
  medium: 'border-warn/40 bg-warn/10',
  low: 'border-sky-400/30 bg-sky-400/10',
}

const LEVEL_TEXT = {
  high: 'text-danger',
  medium: 'text-warn',
  low: 'text-sky-300',
}

const TAG_STYLE = {
  high: 'border border-danger/50 text-danger',
  medium: 'border border-warn/50 text-warn',
  low: 'border border-sky-400/50 text-sky-300',
}

const MARK_STYLE = {
  high: 'rounded-sm bg-danger/35 px-0.5 text-danger',
  medium: 'rounded-sm bg-warn/35 px-0.5 text-warn',
  low: 'rounded-sm bg-sky-400/35 px-0.5 text-sky-300',
}

export function SignalList({ signals, modelFactors = [], parts }) {
  const explainedFactors = modelFactors.map(describeModelFactor)

  if (signals.length === 0 && explainedFactors.length === 0) {
    return (
      <p className="rounded-2xl border border-mint/30 bg-mint/10 px-4 py-4 text-sm text-slate-200">
        No explanation details are available for this result.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {explainedFactors.map((factor) => (
        <ExplanationCard
          key={factor.id}
          level={factor.level}
          tag={factor.tag}
          title={factor.title}
          focus={factor.focus}
          parts={parts}
          detail={factor.detail}
          meta={`Feature value: ${formatNumber(factor.value)} - Contribution: ${formatNumber(factor.effect)}`}
        />
      ))}

      {signals.map((signal) => (
        <ExplanationCard
          key={signal.id}
          level={signal.level}
          tag={signal.tag}
          title={signal.title}
          focus={signal.focus}
          parts={parts}
          detail={signal.detail}
        />
      ))}
    </ul>
  )
}

function ExplanationCard({ level, tag, title, focus, parts, detail, meta }) {
  return (
    <li className={`rounded-2xl border px-4 py-4 ${LEVEL_STYLE[level]}`}>
      <p className={`flex flex-wrap items-center gap-2 font-medium ${LEVEL_TEXT[level]}`}>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TAG_STYLE[level]}`}>
          {tag}
        </span>
        <span>{title}</span>
      </p>
      <p className="mt-3 break-all rounded-lg bg-ink-950/90 px-3 py-2 font-mono text-xs leading-6">
        <FocusedUrl parts={parts} focus={focus} level={level} />
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p>
      {meta ? <p className="mt-2 font-mono text-xs text-mist">{meta}</p> : null}
    </li>
  )
}

function FocusedUrl({ parts, focus, level }) {
  const mark = MARK_STYLE[level]
  const mute = 'text-mist/55'
  const soft = focus === 'protocol' ? mark : `${mute} underline decoration-sky-400/50`
  const whole = focus === 'url'

  if (parts.isIp || parts.subdomain === '—') {
    return (
      <>
        <span className={soft}>{parts.protocol}://</span>
        <span className={whole || focus === 'host' || focus === 'domain' || focus === 'tld' ? mark : mute}>{parts.host}</span>
        {parts.port ? (
          <span className={whole || focus === 'port' ? mark : mute}>:{parts.port}</span>
        ) : null}
        <span className={whole || focus === 'path' ? mark : mute}>{parts.path}</span>
        {parts.query !== '—' ? <span className={whole || focus === 'query' ? mark : mute}>{parts.query}</span> : null}
      </>
    )
  }

  return (
    <>
      <span className={soft}>{parts.protocol}://</span>
      {parts.subdomain !== '—' ? (
        <>
          <span className={whole || focus === 'subdomain' || focus === 'host' ? mark : mute}>{parts.subdomain}</span>
          <span className={mute}>.</span>
        </>
      ) : null}
      <span className={whole || focus === 'domain' || focus === 'host' ? mark : mute}>{parts.domain}</span>
      {parts.tld !== '—' ? (
        <span className={whole || focus === 'tld' || focus === 'host' ? mark : mute}>{parts.tld}</span>
      ) : null}
      {parts.port ? <span className={whole || focus === 'port' ? mark : mute}>:{parts.port}</span> : null}
      <span className={whole || focus === 'path' ? mark : mute}>{parts.path}</span>
      {parts.query !== '—' ? <span className={whole || focus === 'query' ? mark : mute}>{parts.query}</span> : null}
    </>
  )
}

function formatNumber(value) {
  return Number(value).toFixed(4)
}
