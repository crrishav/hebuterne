import { useState } from 'react'
import { ChevronIcon } from './icons'

export default function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-xs uppercase tracking-wide"
      >
        {title}
        <ChevronIcon className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4 text-xs text-muted">{children}</div>}
    </div>
  )
}
