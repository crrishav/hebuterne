import { useUI } from '../context/UIContext'
import { CloseIcon } from './icons'

export default function Panel({ name, side, title, footer, children }) {
  const { open, closePanel } = useUI()
  const isOpen = open === name

  const translate =
    side === 'left'
      ? isOpen
        ? 'translate-x-0'
        : '-translate-x-full'
      : isOpen
        ? 'translate-x-0'
        : 'translate-x-full'

  const border = side === 'left' ? 'border-r border-line' : 'border-l border-line'
  const position = side === 'left' ? 'left-0' : 'right-0'

  return (
    <aside
      aria-label={title}
      aria-hidden={!isOpen}
      className={`fixed top-0 bottom-0 ${position} w-[min(360px,100%)] bg-white flex flex-col z-20 ${border} transition-transform duration-300 ease-out ${translate} ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="h-[60px] flex items-center justify-between pl-4 md:pl-6 border-b border-line shrink-0">
        <span>{title}</span>
        <button
          type="button"
          onClick={closePanel}
          aria-label="Close"
          className="w-[60px] h-[60px] grid place-items-center shrink-0"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
      {footer && <div className="border-t border-line shrink-0">{footer}</div>}
    </aside>
  )
}
