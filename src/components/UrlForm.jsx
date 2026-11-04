import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EXAMPLES } from '../data/content.js'
import { MAX_URL_LENGTH, validateUrl } from '../lib/validateUrl.js'

export function UrlForm() {
  const navigate = useNavigate()
  const inputId = useId()
  const errorId = useId()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const result = validateUrl(value)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError('')
    navigate('/result', { state: { url: result.url } })
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-white/10 bg-ink-900">
        <label htmlFor={inputId} className="sr-only">
          Web address to check
        </label>
        <input
          id={inputId}
          name="url"
          value={value}
          maxLength={MAX_URL_LENGTH}
          autoComplete="off"
          spellCheck="false"
          placeholder="https://example.com/path?query=value"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError('')
          }}
          className="w-full bg-transparent px-5 py-5 font-mono text-sm text-slate-100 placeholder:text-mist/70"
        />
        <div className="flex items-center justify-between gap-3 border-t border-white/5 px-5 py-3">
          <p className="text-xs text-mist">Press Enter or click Analyse</p>
          <button
            type="submit"
            className="rounded-full bg-lilac px-4 py-2 text-sm font-medium text-white hover:bg-lilac/90"
          >
            Analyse →
          </button>
        </div>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <p className="mb-2 mt-8 text-xs font-medium tracking-[0.16em] text-mist">TRY AN EXAMPLE</p>
      <ul className="space-y-2">
        {EXAMPLES.map((example) => (
          <li key={example}>
            <button
              type="button"
              onClick={() => {
                setValue(example)
                setError('')
                document.getElementById(inputId)?.focus()
              }}
              className="w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-left font-mono text-xs text-mist hover:border-white/20 hover:text-white sm:text-sm"
            >
              {example}
            </button>
          </li>
        ))}
      </ul>
    </form>
  )
}
