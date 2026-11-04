import { useEffect } from 'react'

const STEPS = [
  {
    n: '01',
    title: 'Paste a URL',
    body: 'Enter a full web address. An empty or invalid address is rejected beside the field, before anything is sent. Include the path and query when you have them.',
  },
  {
    n: '02',
    title: 'Read the structure',
    body: 'The page splits the address into protocol, host, path, and query, and lists signals such as an IP host, a look-alike name, or a missing lock. It does not open the link.',
  },
  {
    n: '03',
    title: 'Classify and score',
    body: 'Your API runs the model once per check. The likelihood is mapped to a 0–100 trust score and a low, medium, or high band.',
  },
  {
    n: '04',
    title: 'Explain the result',
    body: 'The score stays the largest thing on the result page. Suspicious parts are highlighted and each one has a plain-language reason.',
  },
]

const TEAM = [
  { initials: 'AC', name: 'Averyth Cheng', role: 'Project manager' },
  { initials: 'KC', name: 'KanhchanacLeak Cheng', role: 'ML engineer' },
  { initials: 'ND', name: 'Noah Dang', role: 'Full-stack developer' },
]

export function AboutPage() {
  useEffect(() => {
    document.title = 'PhishGuard · About'
  }, [])

  return (
    <div className="mx-auto max-w-3xl pt-4">
      <p className="text-xs font-medium tracking-[0.16em] text-mint">ABOUT PHISHGUARD</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        A security tool that respects what it shows you.
      </h1>
      <p className="mt-4 text-sm leading-7 text-mist sm:text-base">
        PhishGuard checks whether a web address looks like phishing. The page sends that address only to your own
        API, shows it back as text, and never turns it into HTML or a link. A front-end check can tell you the
        address is empty or the wrong kind of URL. The API is what enforces the limit.
      </p>

      <h2 className="mb-3 mt-10 text-xs font-medium tracking-[0.16em] text-mist">HOW PHISHGUARD WORKS</h2>
      <ol className="space-y-3">
        {STEPS.map((step) => (
          <li key={step.n} className="rounded-2xl border border-white/10 bg-ink-900 px-4 py-4">
            <h3 className="font-medium">
              <span className="mr-2 text-mint">{step.n}</span>
              {step.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-mist">{step.body}</p>
          </li>
        ))}
      </ol>

      <h2 className="mb-3 mt-10 text-xs font-medium tracking-[0.16em] text-mist">THE TEAM</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {TEAM.map((person) => (
          <li key={person.initials} className="rounded-2xl border border-white/10 bg-ink-900 px-4 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint/15 text-sm font-semibold text-mint">
              {person.initials}
            </span>
            <h3 className="mt-3 font-medium">{person.name}</h3>
            <p className="text-sm text-mist">{person.role}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm leading-6 text-mist">
        Built with React for the COS30049 phishing URL detector. The model runs in FastAPI, which this front end
        calls at <span className="font-mono text-slate-200">/api/check</span>.
      </p>
    </div>
  )
}
