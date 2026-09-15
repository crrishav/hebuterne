import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCTS, getProductImages } from '../data/products'

const WAVE_ITEMS = [
  {
    name: 'Product One',
    price: '$2,800',
    copy:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    cta: 'Shop Now',
  },
  {
    name: 'Product Two',
    price: '$6,200',
    copy: null,
    cta: 'Shop Now',
  },
  {
    name: 'Product Three',
    price: '$1,800',
    copy: null,
    cta: 'Shop Now',
  },
]

export default function Home() {
  const { addUnique } = useCart()
  const navigate = useNavigate()

  function handleBuy(product) {
    addUnique({ id: product.id, name: product.name, price: product.price, size: null })
    navigate('/checkout')
  }

  return (
    <main className="flex-1 pb-16">
      <div className="grid grid-cols-2 h-screen mb-16">
        <div />
        <div className="bg-tile" />
      </div>

      <div className="px-2 sm:px-8 md:px-16 lg:px-24 pt-8">
        <div className="grid grid-cols-4 gap-x-2 sm:gap-x-6 md:gap-x-10">
          {PRODUCTS.slice(0, 4).map((product) => (
            <div key={product.id}>
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-[3/4] bg-tile overflow-hidden">
                  <img
                    src={getProductImages(product)[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
              <div className="mt-3 flex items-center gap-6 sm:gap-10">
                <button
                  type="button"
                  onClick={() => handleBuy(product)}
                  className="text-black underline"
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addUnique({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      size: null,
                    })
                  }
                  className="text-black underline"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-2 sm:px-8 md:px-16 lg:px-24 pt-24">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-28">
          {WAVE_ITEMS.map((item, i) => {
            if (i === 0) {
              return (
                <div
                  key={item.name}
                  className="flex flex-col-reverse items-center gap-6 lg:col-span-2 lg:flex-row-reverse lg:items-stretch lg:gap-6"
                >
                  <div className="w-full lg:w-2/3">
                    <div className="bg-tile aspect-[16/9]" />
                    <div className="mt-3 text-right">
                      <h3 className="text-xs uppercase tracking-wide text-accent">{item.name}</h3>
                      <p className="text-xs tabular-nums">{item.price}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 text-left lg:w-1/3 lg:justify-center">
                    <p className="max-w-[40ch] text-sm text-black/80">{item.copy}</p>
                    {item.cta && (
                      <button type="button" className="text-black underline">
                        {item.cta}
                      </button>
                    )}
                  </div>
                </div>
              )
            }

            const isLast = i === WAVE_ITEMS.length - 1

            return (
              <div key={item.name} className={`w-full ${isLast ? 'lg:pt-[18rem]' : ''}`}>
                <div className={`bg-tile ${i === 1 ? 'aspect-[16/9]' : 'aspect-[2/1]'}`} />
                <div className="mt-3 flex flex-col gap-4 lg:flex-row-reverse lg:items-start lg:justify-between">
                  <div className="text-right">
                    <h3 className="text-xs uppercase tracking-wide text-accent">{item.name}</h3>
                    <p className="text-xs tabular-nums">{item.price}</p>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-start gap-2 text-left">
                    {item.copy && <p className="max-w-[40ch] text-sm text-black/80">{item.copy}</p>}
                    {item.cta && (
                      <button type="button" className="text-black underline">
                        {item.cta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 h-[80vh] mt-8">
        <div className="flex h-full items-start gap-4 py-6 pl-6 pr-2 lg:py-10 lg:pl-10 lg:pr-4">
          <div className="w-1/2">
            <div className="aspect-square bg-tile" />
            <button type="button" className="mt-3 text-black underline">
              Shop Now
            </button>
          </div>
          <div className="w-1/2">
            <div className="aspect-square bg-tile" />
            <button type="button" className="mt-3 text-black underline">
              Shop Now
            </button>
          </div>
        </div>
        <div className="py-6 pl-2 pr-6 lg:py-10 lg:pl-4 lg:pr-10">
          <div className="h-full bg-tile" />
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 px-2 py-16 sm:px-8 md:px-16 lg:h-screen lg:grid-cols-[1fr_auto_1fr] lg:gap-10 lg:px-24 lg:py-0 mt-2">
        <div className="lg:flex lg:justify-end">
          <p className="max-w-[40ch] text-sm text-black/80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="aspect-[9/16] h-[70.8vh] bg-tile justify-self-center" />

        <div className="justify-self-start text-right">
          <h3 className="text-xs uppercase tracking-wide text-accent">Product Name</h3>
          <p className="text-xs tabular-nums">$10</p>
        </div>
      </div>
    </main>
  )
}
