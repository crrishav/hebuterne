import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'hebuterne.bag'
const MAX_QTY = 5

function readBag() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readBag)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  function addItem(item) {
    setItems((prev) => {
      const existing = prev.find((l) => l.id === item.id && l.size === item.size)
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + item.qty) } : l,
        )
      }
      return [...prev, item]
    })
  }

  function addUnique(item) {
    setItems((prev) => {
      if (prev.some((l) => l.id === item.id)) return prev
      return [...prev, { ...item, qty: item.qty ?? 1 }]
    })
  }

  function setQty(id, size, delta) {
    setItems((prev) =>
      prev
        .map((l) =>
          l.id === id && l.size === size
            ? { ...l, qty: Math.min(MAX_QTY, l.qty + delta) }
            : l,
        )
        .filter((l) => l.qty > 0),
    )
  }

  function removeItem(id, size) {
    setItems((prev) => prev.filter((l) => !(l.id === id && l.size === size)))
  }

  function clearCart() {
    setItems([])
  }

  const count = items.reduce((n, l) => n + l.qty, 0)
  const total = items.reduce((n, l) => n + l.qty * l.price, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, addUnique, setQty, removeItem, clearCart, count, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
