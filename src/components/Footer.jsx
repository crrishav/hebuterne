import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 h-14 bg-white border-t border-line px-4 flex items-center justify-between gap-4 text-[11px] uppercase text-muted">
      <Link to="/info">Info</Link>
      <a href="mailto:studio@hebuterne.co.uk">studio@hebuterne.co.uk</a>
      <span>London</span>
    </footer>
  )
}
