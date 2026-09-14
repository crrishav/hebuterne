import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const fieldClass =
  'h-11 px-3 w-full border border-line bg-white text-sm outline-none focus:border-black'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const [placed, setPlaced] = useState(false)
  const [discount, setDiscount] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    clearCart()
    setPlaced(true)
  }

  if (placed) {
    return (
      <main className="flex-1 grid place-items-center text-center px-6 py-24">
        <div className="grid gap-3">
          <h1 className="text-xs uppercase tracking-wide text-accent">Thank you</h1>
          <p className="text-muted max-w-sm mx-auto">
            Your order has been placed. A confirmation will be sent by email.
          </p>
          <Link to="/" className="underline text-sm mt-2">
            Back to shop
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="flex-1 grid place-items-center text-center px-6 py-24">
        <p className="text-muted">
          Your bag is empty.{' '}
          <Link to="/" className="underline">
            Continue shopping
          </Link>
        </p>
      </main>
    )
  }

  return (
    <main className="flex-1 pb-16 md:flex md:flex-col">
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 md:flex-1">
        <div className="order-2 md:order-1 p-6 md:p-10 md:pr-12 flex flex-col gap-8 md:justify-between">
          <div className="grid gap-3">
            <h2 className="text-xs uppercase tracking-wide">Contact</h2>
            <input type="email" required placeholder="Email" className={fieldClass} />
          </div>

          <div className="grid gap-3">
            <h2 className="text-xs uppercase tracking-wide">Delivery</h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="First name" className={fieldClass} />
              <input type="text" required placeholder="Last name" className={fieldClass} />
            </div>
            <input type="text" required placeholder="Address" className={fieldClass} />
            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              className={fieldClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" required placeholder="City" className={fieldClass} />
              <input type="text" placeholder="Postal code (optional)" className={fieldClass} />
            </div>
            <input type="tel" placeholder="Phone" className={fieldClass} />
          </div>

          <div className="grid gap-3">
            <h2 className="text-xs uppercase tracking-wide">Shipping method</h2>
            <div className="flex items-center justify-between h-11 px-3 border border-line text-sm">
              <span>UK delivery, 12 working days</span>
              <span>Included</span>
            </div>
          </div>

          <button
            type="submit"
            className="h-12 bg-black text-white text-sm font-bold uppercase tracking-wide"
          >
            Place order
          </button>
        </div>

        <div className="order-1 md:order-2 p-6 md:p-10 md:pl-12 flex flex-col gap-6 md:justify-between">
          <div className="grid gap-4">
            {items.map((line) => (
              <div key={`${line.id}-${line.size}`} className="flex items-center gap-3">
                <div className="w-14 h-16 bg-tile border border-line shrink-0" />
                <div className="flex-1 text-sm">
                  <p>{line.name}</p>
                  {line.size && <p className="text-xs text-muted">UK {line.size}</p>}
                  <p className="text-xs text-muted">Qty {line.qty}</p>
                </div>
                <p className="text-sm tabular-nums">£{line.price * line.qty}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Discount code"
                className={`${fieldClass} flex-1`}
              />
              <button
                type="button"
                className="h-11 px-5 border border-line text-sm uppercase shrink-0"
              >
                Apply
              </button>
            </div>

            <div className="grid gap-2 text-sm border-t border-line pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">£{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-line pt-2 mt-1">
                <span>Total</span>
                <span className="tabular-nums">£{total}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  )
}
