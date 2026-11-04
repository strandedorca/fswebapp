export class CheckError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'CheckError'
    this.status = status
  }
}

/**
 * checkUrl: sends the address to the FastAPI predict endpoint.
 * The response is read as data and later shown as text, never as HTML.
 */
export async function checkUrl(url) {
  const base = import.meta.env.VITE_API_BASE ?? ''
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(`${base}/api/predict`, {
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
      throw new CheckError(messageFrom(body, response.status), response.status)
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

export async function checkHealth() {
  const base = import.meta.env.VITE_API_BASE ?? ''
  try {
    const response = await fetch(`${base}/api/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return false
    const body = await readJson(response)
    return body?.status === 'ok'
  } catch {
    return false
  }
}

async function readJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function messageFrom(body, status) {
  if (body && typeof body === 'object') {
    const raw = body.detail ?? body.error
    if (typeof raw === 'string') {
      const text = raw.replace(/\s+/g, ' ').trim()
      if (text) return text.slice(0, 300)
    }
  }
  if (status >= 500) return 'The PhishGuard API could not be reached.'
  return 'The server rejected this check.'
}

function normalise(body) {
  if (!body || typeof body !== 'object') {
    throw new CheckError('The server returned an unexpected response.', 502)
  }

  const phishingProbability = asUnit(body.phishing_probability)
  const confidence = asUnit(body.confidence)
  let verdict = body.verdict

  if (verdict !== 'phishing' && verdict !== 'legitimate') {
    if (phishingProbability == null) {
      throw new CheckError('The server returned an unexpected response.', 502)
    }
    verdict = phishingProbability >= 0.5 ? 'phishing' : 'legitimate'
  }

  if (phishingProbability == null) {
    throw new CheckError('The server returned an unexpected response.', 502)
  }

  return {
    url: typeof body.url === 'string' ? body.url : null,
    trustScore: Math.round((1 - phishingProbability) * 100),
    verdict,
    confidence,
    phishingProbability,
  }
}

function asUnit(value) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0 || number > 1) return null
  return number
}
