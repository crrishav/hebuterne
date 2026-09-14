import { useState } from 'react'
import Panel from './Panel'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE_KEY = 'hebuterne.offerCode'

function makeCode() {
  return 'HEB' + Math.random().toString(36).slice(2, 7).toUpperCase()
}

export default function OfferPanel() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(() => localStorage.getItem(CODE_KEY))
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function submit(e) {
    e.preventDefault()
    const value = email.trim().toLowerCase()
    if (!EMAIL_RE.test(value)) {
      setError('Enter a valid email.')
      return
    }
    const newCode = makeCode()
    localStorage.setItem(CODE_KEY, newCode)
    setCode(newCode)
    setError('')
  }

  function copy() {
    if (!code) return
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <Panel name="offer" side="right" title="10% off your first order">
      {code ? (
        <div className="p-4 md:p-6 grid gap-3">
          <p>Your code</p>
          <p className="text-xl tracking-wide tabular-nums">{code}</p>
          <button
            type="button"
            onClick={copy}
            className="h-12 bg-black text-white text-sm uppercase tracking-wide"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="p-4 md:p-6 grid gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            className={`h-11 px-3 border bg-white focus:outline-none focus:border-black ${
              error ? 'border-error' : 'border-line'
            }`}
          />
          <button
            type="submit"
            className="h-12 bg-black text-white text-sm uppercase tracking-wide"
          >
            Send code
          </button>
          <p className={`text-xs ${error ? 'text-error' : 'text-muted'}`}>
            {error || 'One code per person.'}
          </p>
        </form>
      )}
    </Panel>
  )
}
