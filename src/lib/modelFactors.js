const FEATURE_COPY = {
  url_len: { tag: 'URL', title: 'Address length', kind: 'chars', phrase: 'The full address is about {n} characters long.' },
  url_n_dots: { tag: 'URL', title: 'Dots in the address', kind: 'count', noun: 'dot' },
  url_n_hyphens: { tag: 'URL', title: 'Hyphens in the address', kind: 'count', noun: 'hyphen' },
  url_n_underscores: { tag: 'URL', title: 'Underscores in the address', kind: 'count', noun: 'underscore' },
  url_n_slashes: { tag: 'URL', title: 'Slashes in the address', kind: 'count', noun: 'slash' },
  url_n_qmarks: { tag: 'URL', title: 'Question marks in the address', kind: 'count', noun: 'question mark' },
  url_n_equals: { tag: 'URL', title: 'Equals signs in the address', kind: 'count', noun: 'equals sign' },
  url_n_amps: { tag: 'URL', title: 'Ampersands in the address', kind: 'count', noun: 'ampersand' },
  url_n_at: { tag: 'URL', title: '@ symbols in the address', kind: 'count', noun: '@ symbol' },
  url_n_percent: { tag: 'URL', title: 'Percent signs in the address', kind: 'count', noun: 'percent sign' },
  url_n_tilde: { tag: 'URL', title: 'Tildes in the address', kind: 'count', noun: 'tilde' },
  url_n_digits: { tag: 'URL', title: 'Digits in the address', kind: 'count', noun: 'digit' },
  url_n_letters: { tag: 'URL', title: 'Letters in the address', kind: 'count', noun: 'letter' },
  url_n_upper: { tag: 'URL', title: 'Capital letters in the address', kind: 'count', noun: 'capital letter' },
  url_n_nonascii: { tag: 'URL', title: 'Non-English characters', kind: 'count', noun: 'non-English character' },
  url_digit_ratio: { tag: 'URL', title: 'How many characters are digits', kind: 'ratio', noun: 'digits' },
  url_upper_ratio: { tag: 'URL', title: 'How many characters are capitals', kind: 'ratio', noun: 'capital letters' },
  url_special_ratio: { tag: 'URL', title: 'How many characters are symbols', kind: 'ratio', noun: 'symbols' },
  url_entropy: { tag: 'URL', title: 'How random the address looks', kind: 'score', noun: 'randomness' },
  url_n_tokens: { tag: 'URL', title: 'Word-like pieces in the address', kind: 'count', noun: 'word-like piece' },
  url_max_token_len: { tag: 'URL', title: 'Longest word-like piece', kind: 'chars', phrase: 'The longest word-like piece is about {n} characters.' },
  url_n_keywords: { tag: 'URL', title: 'Suspicious words in the address', kind: 'count', noun: 'suspicious word' },
  url_n_http: { tag: 'URL', title: 'Extra “http” text inside the address', kind: 'count', noun: 'extra “http”' },
  url_has_dslash: { tag: 'URL', title: 'Double slash in the path', kind: 'flag', present: 'This address has a double slash (//) in the path.', absent: 'This address does not have a double slash (//) in the path.' },
  host_has_port: { tag: 'Host', title: 'Custom port number', kind: 'flag', present: 'This address uses a custom port number.', absent: 'This address does not use a custom port number.' },
  host_has_userinfo: { tag: 'Host', title: 'Username before the host', kind: 'flag', present: 'This address includes a username before the host.', absent: 'This address does not include a username before the host.' },
  host_is_ip: { tag: 'Host', title: 'IP address used as the website name', kind: 'flag', present: 'This address uses a raw IP address instead of a normal website name.', absent: 'This address uses a normal website name, not a raw IP address.' },
  host_len: { tag: 'Host', title: 'Website name length', kind: 'chars', phrase: 'The website name is about {n} characters long.' },
  host_n_dots: {
    tag: 'Host',
    title: 'Dots in the website name',
    kind: 'count',
    none: 'The website name has no dots.',
    one: 'The website name has 1 dot.',
    many: 'The website name has {n} dots.',
  },
  host_n_hyphens: {
    tag: 'Host',
    title: 'Hyphens in the website name',
    kind: 'count',
    none: 'The website name has no hyphens.',
    one: 'The website name has 1 hyphen.',
    many: 'The website name has {n} hyphens.',
  },
  host_entropy: { tag: 'Host', title: 'How random the website name looks', kind: 'score', noun: 'randomness' },
  host_n_subdomains: {
    tag: 'Host',
    title: 'Extra parts before the main website name',
    kind: 'count',
    none: 'There are no extra parts before the main website name.',
    one: 'There is 1 extra part before the main website name.',
    many: 'There are {n} extra parts before the main website name.',
  },
  is_punycode: { tag: 'Host', title: 'Encoded international domain', kind: 'flag', present: 'This website name uses encoded international characters (punycode).', absent: 'This website name does not use encoded international characters.' },
  bad_tld: { tag: 'Domain', title: 'Risky website ending', kind: 'flag', present: 'This address uses a website ending that often appears on risky sites.', absent: 'This address does not use a website ending from the model’s risky list.' },
  free_hosting: { tag: 'Host', title: 'Free website hosting', kind: 'flag', present: 'This address looks like free or disposable website hosting.', absent: 'This address does not look like free or disposable website hosting.' },
  brand_in_path: { tag: 'Path', title: 'Brand name in the page path', kind: 'flag', present: 'A well-known brand name appears in the page path.', absent: 'No well-known brand name appears in the page path.' },
  brand_in_subdomain: { tag: 'Host', title: 'Brand name before the main website name', kind: 'flag', present: 'A well-known brand name appears before the main website name.', absent: 'No well-known brand name appears before the main website name.' },
  brand_in_domain: { tag: 'Domain', title: 'Brand look-alike website name', kind: 'flag', present: 'The main website name looks like it borrows a well-known brand.', absent: 'The main website name does not look like a borrowed brand.' },
  typosquat: { tag: 'Domain', title: 'Look-alike website name', kind: 'flag', present: 'The website name looks unusually close to a known brand.', absent: 'The website name does not look like a brand look-alike.' },
  path_len: { tag: 'Path', title: 'Page path length', kind: 'chars', phrase: 'The page path is about {n} characters long.' },
  path_depth: {
    tag: 'Path',
    title: 'Folders in the page path',
    kind: 'count',
    none: 'There are no folders in the page path.',
    one: 'There is 1 folder in the page path.',
    many: 'There are {n} folders in the page path.',
  },
  path_max_seg_len: { tag: 'Path', title: 'Longest folder or file name', kind: 'chars', phrase: 'The longest folder or file name is about {n} characters.' },
  query_len: { tag: 'Query', title: 'Text after the ?', kind: 'chars', phrase: 'The text after ? is about {n} characters long.' },
  query_n_params: {
    tag: 'Query',
    title: 'Extra settings after the ?',
    kind: 'count',
    none: 'There are no extra settings after the ?.',
    one: 'There is 1 extra setting after the ?.',
    many: 'There are {n} extra settings after the ?.',
  },
  fragment_len: { tag: 'URL', title: 'Text after the #', kind: 'chars', phrase: 'The text after # is about {n} characters long.' },
  tld_phish_rate: { tag: 'Domain', title: 'How often this ending appears on phishing sites', kind: 'phish_rate' },
  tld_seen: { tag: 'Domain', title: 'Familiar website ending', kind: 'flag', present: 'The model has seen this website ending often enough to recognise it.', absent: 'The model has rarely or never seen this website ending.' },
  tld_times_seen: {
    tag: 'Domain',
    title: 'How common this website ending is',
    kind: 'count',
    none: 'This website ending did not appear in training.',
    one: 'This website ending appeared once in training.',
    many: 'This website ending appeared about {n} times in training.',
  },
  file_ext_none: { tag: 'Path', title: 'No file ending in the path', kind: 'flag', present: 'The page path has no normal file ending such as .html.', absent: 'The page path includes a normal file ending.' },
  file_ext_html: { tag: 'Path', title: '.html page ending', kind: 'flag', present: 'The page path ends with .html.', absent: 'The page path does not end with .html.' },
  file_ext_htm: { tag: 'Path', title: '.htm page ending', kind: 'flag', present: 'The page path ends with .htm.', absent: 'The page path does not end with .htm.' },
  file_ext_php: { tag: 'Path', title: '.php page ending', kind: 'flag', present: 'The page path ends with .php.', absent: 'The page path does not end with .php.' },
  file_ext_asp: { tag: 'Path', title: '.asp page ending', kind: 'flag', present: 'The page path ends with .asp.', absent: 'The page path does not end with .asp.' },
  file_ext_aspx: { tag: 'Path', title: '.aspx page ending', kind: 'flag', present: 'The page path ends with .aspx.', absent: 'The page path does not end with .aspx.' },
  file_ext_cfm: { tag: 'Path', title: '.cfm page ending', kind: 'flag', present: 'The page path ends with .cfm.', absent: 'The page path does not end with .cfm.' },
  file_ext_shtml: { tag: 'Path', title: '.shtml page ending', kind: 'flag', present: 'The page path ends with .shtml.', absent: 'The page path does not end with .shtml.' },
  file_ext_other: { tag: 'Path', title: 'Unusual file ending', kind: 'flag', present: 'The page path uses an uncommon file ending.', absent: 'The page path does not use an uncommon file ending.' },
}

/**
 * Turn a backend top_factor into the same card shape the signal list already uses.
 * Wording follows this URL's measured value and the model's direction, so it stays consistent.
 */
export function describeModelFactor(factor) {
  const copy = FEATURE_COPY[factor.feature] ?? fallbackCopy(factor.feature)
  const toward = factor.direction === 'phishing' ? 'phishing' : 'legitimate'
  const strength = strengthFromEffect(factor.effect)
  const observation = describeObservation(copy, factor.value)
  const detail = `${observation} ${effectSentence(toward)}`

  return {
    id: factor.id,
    tag: copy.tag,
    title: copy.title,
    detail,
    tone: toward,
    level: strength,
    focus: focusFromFeature(factor.feature, copy.tag),
    value: factor.value,
    effect: factor.effect,
    direction: factor.direction,
    feature: factor.feature,
  }
}

function describeObservation(copy, rawValue) {
  const value = Number(rawValue)
  const amount = Number.isFinite(value) ? value : 0

  switch (copy.kind) {
    case 'count':
      return countSentence(copy, amount)
    case 'chars':
      return (copy.phrase ?? 'Measured length: about {n} characters.').replace('{n}', formatCount(amount))
    case 'ratio':
      return `About ${formatPercent(amount)} of this address is made of ${copy.noun}.`
    case 'score':
      return amount < 3
        ? `This address looks fairly ordinary (${formatNumber(amount)} on the model’s randomness scale).`
        : `This address looks fairly scrambled (${formatNumber(amount)} on the model’s randomness scale).`
    case 'flag':
      return amount > 0.5 ? copy.present : copy.absent
    case 'phish_rate':
      if (amount < 0.2) {
        return `This website ending is uncommon on phishing sites in the training data (about ${formatPercent(amount)}).`
      }
      if (amount < 0.5) {
        return `This website ending has a mixed history in the training data (about ${formatPercent(amount)} phishing).`
      }
      return `This website ending appears often on phishing sites in the training data (about ${formatPercent(amount)}).`
    default:
      return `The model looked at “${copy.title.toLowerCase()}” for this address (value ${formatNumber(amount)}).`
  }
}

function effectSentence(toward) {
  return toward === 'phishing'
    ? 'That made the score look more like phishing.'
    : 'That made the score look more like a normal, legitimate site.'
}

function countSentence(copy, amount) {
  const count = Math.round(amount)
  if (copy.none && copy.one && copy.many) {
    if (count <= 0) return copy.none
    if (count === 1) return copy.one
    return copy.many.replace('{n}', String(count))
  }
  const noun = copy.noun ?? 'item'
  if (count <= 0) return `This address has no ${plural(noun, 0)}.`
  if (count === 1) return `This address has 1 ${noun}.`
  return `This address has ${count} ${plural(noun, count)}.`
}

function plural(noun, count) {
  if (count === 1) return noun
  if (noun.endsWith('s') || noun.endsWith('x') || noun.endsWith('ch') || noun.endsWith('sh')) return `${noun}es`
  if (noun.endsWith('y') && !/[aeiou]y$/i.test(noun)) return `${noun.slice(0, -1)}ies`
  return `${noun}s`
}

function fallbackCopy(feature) {
  return {
    tag: 'Model',
    title: humanizeFeature(feature),
    kind: 'unknown',
  }
}

function humanizeFeature(feature) {
  return String(feature)
    .replace(/^phi[\s_]*/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll('_', ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function focusFromFeature(feature, tag) {
  if (feature.startsWith('query_') || feature === 'url_n_qmarks' || feature === 'url_n_equals' || feature === 'url_n_amps') {
    return 'query'
  }
  if (feature.startsWith('path_') || feature.startsWith('file_ext') || feature === 'brand_in_path' || feature === 'url_n_slashes') {
    return 'path'
  }
  if (feature === 'brand_in_subdomain' || feature === 'host_n_subdomains') return 'subdomain'
  if (feature === 'bad_tld' || feature.startsWith('tld_')) return 'tld'
  if (
    feature === 'brand_in_domain' ||
    feature === 'typosquat' ||
    feature === 'host_n_hyphens' ||
    feature === 'host_n_dots'
  ) {
    return 'domain'
  }
  if (
    feature.startsWith('host_') ||
    feature === 'is_punycode' ||
    feature === 'free_hosting' ||
    feature === 'url_n_at'
  ) {
    return 'host'
  }
  if (feature === 'host_has_port') return 'port'

  const byTag = {
    URL: 'url',
    Host: 'host',
    Domain: 'domain',
    Path: 'path',
    Query: 'query',
    Subdomain: 'subdomain',
    Protocol: 'protocol',
  }
  return byTag[tag] ?? 'url'
}

function strengthFromEffect(effect) {
  const magnitude = Math.abs(Number(effect) || 0)
  if (magnitude >= 0.75) return 'high'
  if (magnitude >= 0.25) return 'medium'
  return 'low'
}

function formatNumber(value) {
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function formatCount(value) {
  return Math.round(Number(value)).toLocaleString()
}

function formatPercent(value) {
  return `${Math.round(Number(value) * 100)}%`
}
