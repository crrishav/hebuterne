import { useUI } from '../context/UIContext'

export default function Backdrop() {
  const { open, closePanel } = useUI()

  return (
    <div
      onClick={closePanel}
      aria-hidden="true"
      className={`fixed inset-0 bg-black/20 z-10 transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    />
  )
}
