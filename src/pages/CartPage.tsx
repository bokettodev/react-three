import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Shape3D } from '../components/Shape3D'
import { useStore } from '../store/useStore'
import './CartPage.css'

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Add some geometric shapes to get started!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h2>Shopping Cart</h2>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="item-preview">
                  <Canvas 
                    camera={{ position: [3, 3, 3], fov: 50 }}
                    shadows
                  >
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[5, 5, 3]} intensity={0.8} castShadow />
                    <directionalLight position={[-3, -3, 3]} intensity={0.4} />
                    <pointLight position={[3, 3, 5]} intensity={0.6} />
                    <pointLight position={[-3, 3, -3]} intensity={0.3} />
                    <Shape3D
                      geometry={item.product.geometry}
                      color={item.product.color}
                      size={item.product.size.map(s => s * 0.8) as [number, number, number]}
                      animate={true}
                    />
                    <OrbitControls enableZoom={false} />
                  </Canvas>
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  <p className="item-description">{item.product.description}</p>
                  <div className="item-meta">
                    <span className="item-shape">Shape: {item.product.geometry}</span>
                    <span className="item-size">Size: {item.product.size.join(' × ')}</span>
                  </div>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-price">
                    <span className="unit-price">${item.product.price} each</span>
                    <span className="total-price">${item.product.price * item.quantity}</span>
                  </div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Items ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>${cart.total}</span>
                </div>
                <div className="summary-row shipping">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${cart.total}</span>
                </div>
              </div>
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}