import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useCart } from '../hooks/useCart'
import type { Product } from '../types'
import { formatPrice, formatSize } from '../utils/formatters'
import './ProductCard.css'
import { Shape3D } from './Shape3D'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { 
    addToCart, 
    getCartItemQuantity, 
    incrementQuantity, 
    decrementQuantity 
  } = useCart()
  
  const quantity = getCartItemQuantity(product.id)

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="product-card">
      <div className="product-preview">
        <Canvas 
          camera={{ position: [5, 5, 5], fov: 50 }}
          shadows
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-5, -5, 5]} intensity={0.4} />
          <pointLight position={[5, 5, 10]} intensity={0.6} />
          <pointLight position={[-5, 5, -5]} intensity={0.3} />
          <Shape3D
            geometry={product.geometry}
            color={product.color}
            size={product.size}
            animate={true}
          />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-details">
          <span className="product-geometry">Shape: {product.geometry}</span>
          <span className="product-size">
            Size: {formatSize(product.size)}
          </span>
        </div>
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          {quantity > 0 ? (
            <div className="quantity-control-card">
              <button 
                className="quantity-btn-card"
                onClick={() => decrementQuantity(product.id)}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn-card"
                onClick={() => incrementQuantity(product.id)}
              >
                +
              </button>
            </div>
          ) : (
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}