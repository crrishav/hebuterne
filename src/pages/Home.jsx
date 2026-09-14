import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCTS } from '../data/products'

export default function Home() {
  const { addUnique } = useCart()
  const navigate = useNavigate()

  function handleBuy(product) {
    addUnique({ id: product.id, name: product.name, price: product.price, size: null })
    navigate('/checkout')
  }

  return (
    <main className="flex-1 pt-8 pb-16">
      <div className="max-w-5xl mx-auto px-2 sm:px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-2 gap-x-2 sm:gap-x-6 md:gap-x-10 gap-y-10 md:gap-y-16">
          {PRODUCTS.map((product) => (
            <div key={product.id}>
              <Link to={`/products/${product.id}`} className="block">
                <div className="aspect-[3/4] bg-tile" />
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
    </main>
  )
}
