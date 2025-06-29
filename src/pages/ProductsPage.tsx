import { LocationBanner } from '../components/LocationBanner'
import { ProductCard } from '../components/ProductCard'
import { useStore } from '../store/useStore'
import './ProductsPage.css'

export function ProductsPage() {
  const products = useStore((state) => state.products)

  return (
    <div className="products-page">
      <div className="container">
        <LocationBanner />
        
        <div className="page-header">
          <h2>3D Geometric Shapes Collection</h2>
          <p>Discover our exclusive collection of premium 3D geometric shapes</p>
        </div>
        
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}