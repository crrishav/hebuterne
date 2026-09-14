import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { BagIcon, MenuIcon, SearchIcon } from './icons'

export default function Header() {
  const { openPanel } = useUI()
  const { count } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const searchRef = useRef(null)

  function toggleSearch() {
    setSearchOpen((prev) => {
      const next = !prev
      if (next) {
        requestAnimationFrame(() => inputRef.current?.focus())
      }
      return next
    })
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setSearchOpen(false)
      inputRef.current?.blur()
    }
  }

  useEffect(() => {
    if (!searchOpen) return

    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchOpen])

  return (
    <header className="sticky top-0 z-10 bg-white h-[60px] grid grid-cols-[1fr_auto_1fr] items-center border-b border-line">
      <div className="flex items-center h-full">
        <button
          type="button"
          onClick={() => openPanel('menu')}
          aria-label="Menu"
          aria-expanded={false}
          className="w-[60px] h-[60px] grid place-items-center md:border-r md:border-line"
        >
          <MenuIcon />
        </button>
        <a
          href="mailto:studio@hebuterne.co.uk"
          className="hidden md:flex items-center h-full px-5 border-r border-line"
        >
          Help
        </a>
      </div>

      <Link to="/" className="text-[21px] font-medium tracking-[-0.03em] justify-self-center">
        Hebuterne
      </Link>

      <div className="justify-self-end flex items-center h-full">
        <div ref={searchRef} className="hidden md:flex items-center h-full border-l border-line">
          <button
            type="button"
            onClick={toggleSearch}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="flex items-center gap-1.5 px-5 h-full shrink-0"
          >
            <SearchIcon />
            {!searchOpen && <span className="text-xs">Search</span>}
          </button>

          <div
            className={`relative h-full flex items-center overflow-hidden transition-[width] duration-300 ease-out ${
              searchOpen ? 'w-56 pr-5' : 'w-0'
            }`}
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              tabIndex={searchOpen ? 0 : -1}
              aria-hidden={!searchOpen}
              placeholder=""
              className="w-full bg-transparent outline-none text-xs h-8"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-5 bottom-2 h-px bg-black origin-right transition-transform duration-300 ease-out"
              style={{ transform: searchOpen ? 'scaleX(1)' : 'scaleX(0)' }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => openPanel('bag')}
          aria-label="Bag"
          aria-expanded={false}
          className="flex items-center gap-1.5 px-5 h-full md:border-l md:border-line"
        >
          <BagIcon />
          <span className="text-xs tabular-nums">{String(count).padStart(2, '0')}</span>
        </button>
      </div>
    </header>
  )
}
