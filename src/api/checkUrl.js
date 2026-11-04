export class CheckError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'CheckError'
    this.status = status
  }
}

/**
 * Sends the address to the local API as JSON.
 * The response is read as data and later shown as text, never as HTML.
 */
export async function checkUrl(url) {
  const base = import.meta.env.VITE_API_BASE ?? ''
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(`${base}/api/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    })

    const body = await readJson(response)
    if (!response.ok) {
      const message = messageFrom(body)
      if (message) throw new CheckError(message, response.status)
      if (response.status >= 500) {
        throw new CheckError('The PhishGuard API could not be reached.', response.status)
      }
      throw new CheckError('The server rejected this check.', response.status)
    }
    return normalise(body)
  } catch (error) {
    if (error instanceof CheckError) throw error
    if (error.name === 'AbortError') {
      throw new CheckError('The check took too long and was stopped.', 0)
    }
    throw new CheckError('The PhishGuard API could not be reached.', 0)
  } finally {
    clearTimeout(timer)
  }
}

async function readJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function messageFrom(body) {
  if (!body || typeof body !== 'object') return null
  const raw = body.message ?? body.detail
  if (typeof raw !== 'string') return null
  const text = raw.replace(/\s+/g, ' ').trim()
  return text ? text.slice(0, 300) : null
}

function normalise(body) {
  if (!body || typeof body !== 'object') {
    throw new CheckError('The server returned an unexpected response.', 502)
  }

  const probability = asUnit(body.phishing_probability ?? body.confidence)
  let verdict = body.verdict
  if (verdict !== 'phishing' && verdict !== 'legitimate' && probability != null) {
    verdict = probability >= 0.5 ? 'phishing' : 'legitimate'
  }

  let trust = asScore(body.trust_score)
  if (trust == null && probability != null) {
    trust = Math.round((1 - probability) * 100)
  }

  if (trust == null || (verdict !== 'phishing' && verdict !== 'legitimate')) {
    throw new CheckError('The server returned an unexpected response.', 502)
  }

  const confidence =
    probability == null ? null : verdict === 'phishing' ? probability : 1 - probability

  return {
    trustScore: trust,
    verdict,
    confidence,
  }
}

function asUnit(value) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0 || number > 1) return null
  return number
}

function asScore(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return null
  return Math.max(0, Math.min(100, Math.round(number)))
}
