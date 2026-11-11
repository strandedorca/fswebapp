import { validateUrl } from './validateUrl.js'

const STORAGE_KEY = 'phishguard.checks'

export function readChecks() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isCheck).slice(0, 20)
  } catch {
    return []
  }
}

export function writeChecks(checks) {
  const safe = checks.filter(isCheck).slice(0, 20)
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
  return safe
}

function isCheck(item) {
  if (!item || typeof item !== 'object') return false
  if (typeof item.id !== 'string' || typeof item.url !== 'string') return false
  if (!validateUrl(item.url).ok) return false
  if (typeof item.trustScore !== 'number' || item.trustScore < 0 || item.trustScore > 100) return false
  if (item.verdict !== 'phishing' && item.verdict !== 'legitimate') return false
  if (item.source !== 'api' && item.source !== 'preview') return false
  if (item.confidence != null && typeof item.confidence !== 'number') return false
  if (item.modelFactors != null && !isModelFactors(item.modelFactors)) return false
  return true
}

function isModelFactors(value) {
  if (!Array.isArray(value)) return false
  return value.every((factor) => {
    if (!factor || typeof factor !== 'object') return false
    if (typeof factor.id !== 'string' || typeof factor.feature !== 'string') return false
    if (typeof factor.value !== 'number' || typeof factor.effect !== 'number') return false
    if (factor.direction !== 'phishing' && factor.direction !== 'legitimate') return false
    return true
  })
}
