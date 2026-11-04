import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo.jsx'

const LINKS = [
  { to: '/', label: 'Analyse', end: true },
  { to: '/dataset', label: 'Dataset' },
  { to: '/about', label: 'About' },
]

export function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink-800 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="relative border-b border-white/15">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 text-mint" onClick={() => setOpen(false)}>
            <Logo />
            <span className="text-xs font-semibold tracking-[0.22em]">PHISHGUARD</span>
          </NavLink>
          <button
            type="button"
            className="rounded-md border border-white/10 px-3 py-2 text-sm text-mist sm:hidden"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
          <nav
            id="site-nav"
            className={`${open ? 'block' : 'hidden'} absolute left-4 right-4 top-16 rounded-xl border border-white/10 bg-ink-900 p-2 sm:static sm:block sm:border-0 sm:bg-transparent sm:p-0`}
          >
            <ul className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-1">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive ? 'bg-mint/15 text-mint' : 'text-mist hover:text-white'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <Outlet />
      </main>
      <footer className="whitespace-pre border-t border-white/15 px-4 py-6 text-center text-xs text-mist/70">
        PhishGuard    •    COS30049 Phishing URL Detection prototype    •    Session 15 Group 7
      </footer>
    </div>
  )
}
