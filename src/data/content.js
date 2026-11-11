/**
 * DATASET: MOCK summary of the dataset.
 */
export const DATASET = {
  total: 10000,
  phishing: 5000,
  legitimate: 5000,
  features: 16,
  legitimateLength: 52,
  phishingLength: 127,
}

export const FEATURE_IMPORTANCE = [
  { name: 'IP in domain', weight: 0.92 },
  { name: '@ symbol', weight: 0.86 },
  { name: 'Suspicious TLD', weight: 0.8 },
  { name: 'URL length > 100', weight: 0.74 },
  { name: 'Subdomain depth ≥ 3', weight: 0.66 },
  { name: 'Suspicious keywords', weight: 0.58 },
  { name: 'Hyphens in domain', weight: 0.48 },
  { name: 'Non-standard port', weight: 0.42 },
  { name: 'Homograph chars', weight: 0.36 },
  { name: 'HTTP (no TLS)', weight: 0.3 },
]

export const EXAMPLES = [
  'http://paypal-secure-login.xyz/account/verify?token=abc123',
  'https://www.google.com',
  'https://swinburne.instructure.com/courses/77371',
  'https://tailwindcss.com/docs/styling-with-utility-classes',
]
