import { Link } from 'react-router-dom'
import { useUI } from '../context/UIContext'
import Panel from './Panel'

export default function MenuPanel() {
  const { closePanel } = useUI()

  return (
    <Panel name="menu" side="left" title="Menu">
      <nav className="grid content-start py-2">
        <Link to="/" onClick={closePanel} className="px-4 md:px-6 py-3 hover:bg-tile">
          Home
        </Link>
        <Link to="/info" onClick={closePanel} className="px-4 md:px-6 py-3 hover:bg-tile">
          Info
        </Link>
        <a href="mailto:studio@hebuterne.co.uk" className="px-4 md:px-6 py-3 hover:bg-tile">
          Contact
        </a>
      </nav>
    </Panel>
  )
}
