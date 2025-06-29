import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import './Header.css'

export function Header() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>3D Shapes Store</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            Cart
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>
          <Link to="/push" className="nav-link">
            🔔 Push
          </Link>
        </nav>
      </div>
    </header>
  )
}