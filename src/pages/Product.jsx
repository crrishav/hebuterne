import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AccordionItem from '../components/AccordionItem'
import { useCart } from '../context/CartContext'
import { PRODUCTS, SIZES, getProductImages } from '../data/products'

export default function Product() {
  const { id } = useParams()
  const product = PRODUCTS.find((p) => String(p.id) === id)
  const { addItem, addUnique } = useCart()
  const [size, setSize] = useState(null)
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState(product?.colors?.[0]?.key ?? null)
  const sliderRef = useRef(null)

  if (!product) {
    return (
      <main className="flex-1 grid place-items-center py-24 text-center">
        <p>
          Product not found.{' '}
          <Link to="/" className="underline">
            Back home
          </Link>
        </p>
      </main>
    )
  }

  const images = getProductImages(product, color)

  function handleBuy() {
    if (!size) {
      setSizeError(true)
      return
    }
    addItem({ id: product.id, name: product.name, size, color, qty: 1, price: product.price })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleColorChange(key) {
    setColor(key)
    setActiveImage(0)
    if (sliderRef.current) sliderRef.current.scrollTo({ left: 0 })
  }

  function handleSliderScroll() {
    const el = sliderRef.current
    if (!el) return
    setActiveImage(Math.round(el.scrollLeft / el.clientWidth))
  }

  const recommended = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <main className="flex-1 pb-16">
      <div className="grid md:grid-cols-2">
        {/* Mobile: swipeable image slider */}
        <div className="md:hidden relative">
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className="flex overflow-x-auto snap-x snap-mandatory"
          >
            {images.map((src, i) => (
              <div key={src} className="aspect-[3/4] bg-tile shrink-0 w-full snap-center overflow-hidden">
                <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 right-3 text-xs bg-white/80 px-2 py-1 tabular-nums">
            {activeImage + 1} / {images.length}
          </div>
        </div>

        {/* Desktop: stacked gallery, scrolls behind the sticky info panel */}
        <div className="hidden md:grid gap-0.5 md:border-r md:border-line">
          {images.map((src, i) => (
            <div key={src} className="aspect-[3/4] bg-tile overflow-hidden">
              <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div>
          <div className="md:sticky md:top-[60px] p-6 md:p-10 grid gap-3 w-full md:max-w-[600px] md:mx-auto">
            <div className="flex md:contents items-center gap-4">
              <div className="flex-1 grid gap-3 md:contents">
                <div className="grid gap-1">
                  <h1 className="text-xs uppercase tracking-wide text-accent">{product.name}</h1>
                  <p className="text-xs tabular-nums">£{product.price}</p>
                </div>

                {product.colors && (
                  <div className="grid gap-2 mt-2">
                    <p className="text-xs text-muted">
                      Colour: {product.colors.find((c) => c.key === color)?.label}
                    </p>
                    <div className="flex items-center gap-3" role="group" aria-label="Colour">
                      {product.colors.map((c) => (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => handleColorChange(c.key)}
                          aria-label={c.label}
                          aria-pressed={color === c.key}
                          className={`h-6 w-6 rounded-full border ${
                            color === c.key ? 'ring-2 ring-black ring-offset-2' : 'border-line'
                          }`}
                          style={{ backgroundColor: c.swatch }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 mt-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s)
                        setSizeError(false)
                      }}
                      className={`text-sm tabular-nums underline ${size === s ? 'font-bold' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className={`text-xs -mt-1 ${sizeError ? 'text-error' : 'text-muted'}`}>
                  {sizeError ? 'Pick a size' : size ? `UK ${size}` : 'UK sizes'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleBuy}
                className="shrink-0 h-12 px-6 md:px-0 md:w-full bg-black text-white text-sm font-bold uppercase tracking-wide md:mt-2"
              >
                {added ? 'Added' : 'Add to bag'}
              </button>
            </div>

            <p className="text-sm text-muted mt-4">
              A bias-cut slip in mid-weight silk charmeuse, finished with adjustable straps and a
              side seam closure. Cut fuller through the hip for an easy, fluid drape, and lined
              throughout in the same silk.
            </p>

            <div className="mt-4 border-b border-line">
              <AccordionItem title="Composition & care">
                100% mulberry silk charmeuse, woven in Nepal. Hand wash cold or dry clean. Cool
                iron on the reverse if needed.
              </AccordionItem>
              <AccordionItem title="Delivery">
                Made to order in London. Ships in 12 working days. UK delivery included.
              </AccordionItem>
              <AccordionItem title="Contact us">
                Questions about sizing or your order? Email{' '}
                <a href="mailto:studio@hebuterne.co.uk" className="underline">
                  studio@hebuterne.co.uk
                </a>
                .
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-2 sm:px-8 md:px-16 lg:px-24 pt-16 pb-8">
        <h2 className="text-center text-xs uppercase tracking-wide mb-8">You may also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 sm:gap-x-6 gap-y-8">
          {recommended.map((p) => (
            <div key={p.id}>
              <Link to={`/products/${p.id}`} className="block">
                <div className="aspect-[3/4] bg-tile overflow-hidden">
                  <img
                    src={getProductImages(p)[0]}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
              <div className="mt-3 flex items-center gap-4">
                <Link to={`/products/${p.id}`} className="text-black underline text-xs">
                  Buy
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    addUnique({ id: p.id, name: p.name, price: p.price, size: null })
                  }
                  className="text-black underline text-xs"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
