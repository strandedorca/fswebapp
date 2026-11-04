import { useEffect } from 'react'

const STEPS = [
  {
    n: '01',
    title: 'Paste a URL',
    body: 'Enter any full web address. An empty or invalid address is rejected with a clear error. The full URL including query parameters gives the best results.',
  },
  {
    n: '02',
    title: 'Read the structure',
    body: 'We parse the string into host, path, TLD, and compute signals such as length, IP-as-host, look-alikes, and unusual TLDs without fetching the page.',
  },
  {
    n: '03',
    title: 'Classify and score',
    body: 'An ML model estimates phishing likelihood. That result is mapped to a 0–100 trust score and a color-coded Low / Medium / High trust band..',
  },
  {
    n: '04',
    title: 'Explain the result',
    body: 'The score stays the largest thing on the result page. Suspicious URL parts are highlighted and listed with plain-language reasons so you can see why the score moved.',
  },
]

const TEAM = [
  { initials: 'AC', name: 'Averyth Cheng', role: 'Project Manager', accent: 'mint' },
  { initials: 'KC', name: 'KanhchanacLeak Cheng', role: 'ML Engineer', accent: 'lilac' },
  { initials: 'ND', name: 'Noah Dang', role: 'Full-stack Developer', accent: 'warn' },
]

const ACCENT = {
  mint: { avatar: 'border border-mint bg-mint/15 text-mint', role: 'text-mint' },
  lilac: { avatar: 'border border-lilac bg-lilac/15 text-lilac', role: 'text-lilac' },
  warn: { avatar: 'border border-warn bg-warn/15 text-warn', role: 'text-warn' },
}

export function AboutPage() {
  useEffect(() => {
    document.title = 'PhishGuard · About'
  }, [])

  return (
    <div className="mx-auto max-w-3xl pt-4">
      <p className="text-xs font-medium tracking-[0.16em] text-mint">ABOUT PHISHGUARD</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        A security tool that respects your privacy.
      </h1>
      <p className="mt-4 text-sm leading-7 text-mist sm:text-base">
        PhishGuard is an open-source, browser-based phishing URL detector. Every analysis runs entirely in your browser.
        We do not see your URLs, your IP address, or collect any personal data.
      </p>

      <h2 className="mb-6 mt-10 text-xs font-medium tracking-[0.16em] text-mist">HOW PHISHGUARD WORKS</h2>
      <ol className="space-y-3">
        {STEPS.map((step) => (
          <li key={step.n} className="grid grid-cols-[auto_1fr] gap-x-4 rounded-2xl border border-white/10 bg-ink-900 px-4 py-5">
            <span className="font-mono text-mint font-bold text-xl">{step.n}</span>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-mist">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mb-3 mt-10 text-xs font-medium tracking-[0.16em] text-mist">THE TEAM</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {TEAM.map((person) => {
          const accent = ACCENT[person.accent]
          return (
            <li key={person.initials} className="rounded-2xl border border-white/10 bg-ink-900 px-4 py-4">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${accent.avatar}`}
              >
                {person.initials}
              </span>
              <h3 className="mt-3 font-semibold">{person.name}</h3>
              <p className={`text-sm ${accent.role} font-medium`}>{person.role}</p>
            </li>
          )
        })}
      </ul>

      <p className="border-t border-white/15 pt-8 mt-10 text-sm leading-6 text-mist/60">
        PhishGuard is open-source. Built with React, and Tailwind CSS. The model runs in FastAPI, which this front end
        calls at <span className="font-mono text-slate-200 text-mist/60">/api/predict</span>.
      </p>
    </div>
  )
}
