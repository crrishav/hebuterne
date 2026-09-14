import { createContext, useContext, useEffect, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [open, setOpen] = useState(null)

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', !!open)
  }, [open])

  useEffect(() => {
    function onKey(e) {
      if (open && e.key === 'Escape') setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const value = {
    open,
    openPanel: (name) => setOpen(name),
    closePanel: () => setOpen(null),
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
