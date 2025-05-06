
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
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-4 text-[hsl(222_47%_11%)]">Our Products</h1>
            <p className="text-xl text-[hsl(215_16%_47%)]">
              Discover our complete range of vending solutions for your business needs
            </p>
          </div>
          
          {visibleProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[hsl(215_16%_47%)]">No products available at this time.</p>
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
