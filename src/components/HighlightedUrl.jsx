export function HighlightedUrl({ parts }) {
  return (
    <p className="break-all font-mono text-sm leading-6">
      <span className={parts.protocol === 'https' ? 'text-mint' : 'text-warn'}>{parts.protocol}://</span>
      <span className="text-danger">{parts.host}</span>
      {parts.port ? <span className="text-warn">:{parts.port}</span> : null}
      <span className="text-sky-300">{parts.path}</span>
      {parts.query !== '—' ? <span className="text-lilac">{parts.query}</span> : null}
    </p>
  )
}
