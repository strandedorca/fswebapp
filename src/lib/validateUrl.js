const MAX_URL_LENGTH = 2048

/**
 * Front-end checks are for a clear message next to the field.
 * The API must apply the same limits again, because a request can skip this page.
 */
export function validateUrl(input) {
  const value = typeof input === 'string' ? input.trim() : ''

  if (!value) {
    return { ok: false, message: 'Enter a web address before analysing.' }
  }

  if (value.length > MAX_URL_LENGTH) {
    return {
      ok: false,
      message: `That address is longer than ${MAX_URL_LENGTH} characters.`,
    }
  }

  if (/\s/.test(value)) {
    return { ok: false, message: 'The address cannot contain spaces.' }
  }

  let url
  try {
    url = new URL(value)
  } catch {
    return {
      ok: false,
      message: 'Enter a full address, including http:// or https://.',
    }
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, message: 'Only http and https addresses can be checked.' }
  }

  if (url.username || url.password) {
    return {
      ok: false,
      message: 'Remove any username or password from the address.',
    }
  }

  if (!url.hostname) {
    return { ok: false, message: 'That address has no host name.' }
  }

  // Match the backend URL_pattern: IPv4 host, or a domain with a letters-only TLD.
  // Rejects values the form would accept but /api/predict would reject (e.g. localhost).
  const host = url.hostname
  const isIpv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host) && host.split('.').every((part) => Number(part) <= 255)
  const isDomain = /^[\w.-]+\.[a-zA-Z]{2,}$/.test(host)
  if (!isIpv4 && !isDomain) {
    return {
      ok: false,
      message: 'Enter a full well-formed URL, for example https://example.com.',
    }
  }

  return { ok: true, url: url.href, message: '' }
}

export { MAX_URL_LENGTH }
