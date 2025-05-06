
import { getProductTypes } from '@/lib/contentful/products'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'

export const metadata = {
  title: 'Products | Vending Solutions',
  description: 'Discover our range of vending machine products and solutions.',
}

export default async function ProductsPage() {
  // Server-side data fetching
  const products = await getProductTypes()
  
  // Filter visible products
  const visibleProducts = products.filter(product => product.visible !== false)
  
  return (
    <main>
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-gray-600">
              Discover our complete range of vending solutions for your business needs
            </p>
          </div>
          
          {visibleProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
