import { ReactLenis } from 'lenis/react'
import { Route, Routes } from 'react-router-dom'
import AnnounceBar from './components/AnnounceBar'
import Backdrop from './components/Backdrop'
import CartPanel from './components/CartPanel'
import Header from './components/Header'
import MenuPanel from './components/MenuPanel'
import OfferPanel from './components/OfferPanel'
import ScrollToTop from './components/ScrollToTop'
import { CartProvider } from './context/CartContext'
import { UIProvider } from './context/UIContext'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Info from './pages/Info'
import Product from './pages/Product'

function App() {
  return (
    <UIProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <ReactLenis root options={{ lerp: 0.1 }} />
          <ScrollToTop />
          <AnnounceBar />
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/products/:id" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>

          <Backdrop />
          <MenuPanel />
          <CartPanel />
          <OfferPanel />
        </div>
      </CartProvider>
    </UIProvider>
  )
}

export default App
