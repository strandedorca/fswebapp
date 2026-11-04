import { createContext, useContext, useMemo, useState } from 'react'
import { readChecks, writeChecks } from '../lib/sessionStorage.js'

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [checks, setChecks] = useState(readChecks)
  const [activeId, setActiveId] = useState(null)

  const value = useMemo(() => {
    const active = checks.find((check) => check.id === activeId) ?? checks[0] ?? null

    function addCheck(entry) {
      setChecks((current) => writeChecks([entry, ...current.filter((item) => item.id !== entry.id)]))
      setActiveId(entry.id)
    }

    return { checks, active, addCheck, selectCheck: setActiveId }
  }, [checks, activeId])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used inside SessionProvider')
  return value
}
