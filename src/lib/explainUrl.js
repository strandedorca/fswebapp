const KEYWORDS = [
  'login',
  'verify',
  'account',
  'banking',
  'secure',
  'update',
  'password',
  'wallet',
  'unlock',
  'paypal',
  'apple',
  'microsoft',
  'amazon',
  'signin',
  'confirm',
]

const SUSPICIOUS_TLDS = new Set([
  'xyz',
  'top',
  'tk',
  'gq',
  'ml',
  'cf',
  'zip',
  'mov',
  'rest',
  'country',
  'support',
  'loan',
  'click',
  'icu',
])

const WEIGHT = { high: 28, medium: 14, low: 6 }

export function parseUrl(raw) {
  const url = new URL(raw)
  const host = url.hostname
  const isIp = isIpAddress(host)
  let subdomain = '—'
  let domain = host
  let tld = '—'

  if (!isIp) {
    const labels = host.split('.').filter(Boolean)
    if (labels.length >= 2) {
      tld = `.${labels.at(-1)}`
      domain = labels.at(-2)
      subdomain = labels.length > 2 ? labels.slice(0, -2).join('.') : '—'
    }
  }

  return {
    protocol: url.protocol.replace(':', ''),
    host,
    subdomain,
    domain,
    tld,
    path: url.pathname || '/',
    query: url.search || '—',
    port: url.port,
    isIp,
  }
}

export function explainUrl(raw) {
  const parts = parseUrl(raw)
  const host = parts.host.toLowerCase()
  const path = parts.path.toLowerCase()
  const signals = []

  if (parts.isIp) {
    signals.push({
      id: 'ip',
      level: 'high',
      tag: 'Host',
      focus: 'host',
      title: 'IP address used as host',
      detail:
        'Legitimate sites almost always use a domain name, not an IP address. Phishing sites often use an IP to avoid registering a traceable domain.',
    })
  }

  if (parts.protocol === 'http') {
    signals.push({
      id: 'http',
      level: 'medium',
      tag: 'Protocol',
      focus: 'protocol',
      title: 'Unencrypted HTTP',
      detail:
        'Legitimate services almost universally enforce HTTPS. Without TLS, traffic is sent in plaintext and can be intercepted.',
    })
  }

  if (host.includes('@')) {
    signals.push({
      id: 'at',
      level: 'high',
      tag: 'Host',
      focus: 'host',
      title: '@ symbol in the address',
      detail:
        'Text before an @ sign can disguise the real host. The browser navigates to the host that follows it.',
    })
  }

  const tldName = parts.tld.replace('.', '').toLowerCase()
  if (SUSPICIOUS_TLDS.has(tldName)) {
    signals.push({
      id: 'tld',
      level: 'medium',
      tag: 'Domain',
      focus: 'tld',
      title: 'Suspicious TLD',
      detail: `The ending ${parts.tld} is often used by short-lived phishing domains.`,
    })
  }

  const mixedLabels = host.split('.').some((label) => /[a-z]/.test(label) && /\d/.test(label))
  if (!parts.isIp && mixedLabels) {
    signals.push({
      id: 'lookalike',
      level: 'medium',
      tag: 'Domain',
      focus: 'domain',
      title: 'Look-alike characters in domain',
      detail:
        'The domain mixes letters and digits. Swaps such as “l” for “1” or “o” for “0” are used to impersonate a real name.',
    })
  }

  const inHost = KEYWORDS.some((word) => host.includes(word))
  const inPath = KEYWORDS.some((word) => path.includes(word))
  if (inHost || inPath) {
    signals.push({
      id: 'brand',
      level: inHost ? 'high' : 'medium',
      tag: inHost ? 'Host' : 'Path',
      focus: inHost ? 'host' : 'path',
      title: 'Brand look-alike wording',
      detail:
        'Words such as “login”, “banking”, and “verify”, or a well-known brand name, often appear on pages that try to collect credentials.',
    })
  }

  if (raw.length > 100) {
    signals.push({
      id: 'length',
      level: 'low',
      tag: 'URL',
      focus: 'url',
      title: 'Unusually long URL',
      detail:
        'Phishing addresses are often much longer, which can hide the real destination past the part a person reads first.',
    })
  }

  if (parts.subdomain !== '—' && parts.subdomain.split('.').length >= 3) {
    signals.push({
      id: 'depth',
      level: 'medium',
      tag: 'Subdomain',
      focus: 'subdomain',
      title: 'Deep subdomain',
      detail:
        'Several subdomain labels can make a fake host look as if it belongs to a brand that only appears later in the name.',
    })
  }

  if (!parts.isIp && parts.domain.includes('-')) {
    signals.push({
      id: 'hyphen',
      level: 'low',
      tag: 'Domain',
      focus: 'domain',
      title: 'Hyphens in the domain',
      detail: 'Hyphens often glue a brand to words such as “secure” or “login”.',
    })
  }

  if (parts.port && parts.port !== '80' && parts.port !== '443') {
    signals.push({
      id: 'port',
      level: 'medium',
      tag: 'Host',
      focus: 'port',
      title: 'Non-standard port',
      detail: 'Everyday websites use port 80 or 443. Another port is unusual for a public login page.',
    })
  }

  if (/[^\u0000-\u007f]/.test(parts.host)) {
    signals.push({
      id: 'homograph',
      level: 'high',
      tag: 'Domain',
      focus: 'host',
      title: 'Homograph characters',
      detail:
        'The host contains characters outside basic English letters. Some of those characters look identical to a real brand.',
    })
  }

  return { parts, signals, previewTrust: scoreFromSignals(signals) }
}

export function trustBand(score) {
  if (score <= 34) {
    return {
      label: 'Low trust',
      verdict: 'Likely phishing',
      tone: 'danger',
      summary:
        'This URL shows strong signs of a phishing attempt. Do not visit it or enter any information.',
    }
  }
  if (score <= 64) {
    return {
      label: 'Medium trust',
      verdict: 'Suspicious',
      tone: 'warn',
      summary:
        'Some parts of this URL look unusual. Treat it with caution before you sign in or enter any information.',
    }
  }
  return {
    label: 'High trust',
    verdict: 'Likely legitimate',
    tone: 'mint',
    summary:
      'No strong phishing signals stood out in this address. A high score still does not prove the page is safe.',
  }
}

export function bandColor(tone) {
  if (tone === 'danger') return '#ff5d73'
  if (tone === 'warn') return '#e2b15a'
  return '#3ee0b0'
}

function scoreFromSignals(signals) {
  const score = signals.reduce((total, signal) => total - WEIGHT[signal.level], 88)
  return Math.max(4, Math.min(96, score))
}

function isIpAddress(host) {
  if (host.includes(':')) return true
  const parts = host.split('.')
  return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}
