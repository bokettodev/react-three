import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { PushNotifications } from './components/PushNotifications'
import { CartPage } from './pages/CartPage'
import { ProductsPage } from './pages/ProductsPage'
import { PushPage } from './pages/PushPage'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="app">
        <Header />
        <PushNotifications />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/push" element={<PushPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
