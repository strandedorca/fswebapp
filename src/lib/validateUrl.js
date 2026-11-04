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

  return { ok: true, url: url.href, message: '' }
}

export { MAX_URL_LENGTH }
