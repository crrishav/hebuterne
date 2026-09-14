import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import Panel from './Panel'

export default function CartPanel() {
  const { items, count, total, setQty, removeItem } = useCart()
  const { closePanel } = useUI()
  const navigate = useNavigate()

  function handleCheckout() {
    closePanel()
    navigate('/checkout')
  }

  const footer =
    items.length > 0 ? (
      <div className="p-4 md:p-6 grid gap-3">
        <div className="flex justify-between tabular-nums">
          <span>Total</span>
          <span>£{total}</span>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          className="h-12 bg-black text-white text-sm uppercase tracking-wide"
        >
          Checkout
        </button>
      </div>
    ) : null

  return (
    <Panel name="bag" side="right" title={`Bag ${String(count).padStart(2, '0')}`} footer={footer}>
      {items.length === 0 ? (
        <p className="p-4 md:p-6 text-muted">Your bag is empty.</p>
      ) : (
        items.map((line) => (
          <div
            key={`${line.id}-${line.size}`}
            className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 p-4 md:p-6 border-b border-line tabular-nums"
          >
            <span>
              {line.name}
              {line.size ? `, ${line.size}` : ''}
            </span>
            <span>£{line.price * line.qty}</span>
            <div className="col-span-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty(line.id, line.size, -1)}
                aria-label="Fewer"
                className="w-6 h-6 border border-line grid place-items-center"
              >
                &minus;
              </button>
              <span>{line.qty}</span>
              <button
                type="button"
                onClick={() => setQty(line.id, line.size, 1)}
                aria-label="More"
                className="w-6 h-6 border border-line grid place-items-center"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeItem(line.id, line.size)}
                className="ml-auto text-xs text-muted underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </Panel>
  )
}
