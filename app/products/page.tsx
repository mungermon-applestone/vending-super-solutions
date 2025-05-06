
import { getProductTypes } from '@/lib/contentful/products'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'
import { productFallbacks } from './fallbacks'
import ContentfulDiagnostics from '@/components/common/ContentfulDiagnostics'

export const metadata = {
  title: 'Products | Vending Solutions',
  description: 'Discover our range of vending machine products and solutions.',
}

export default async function ProductsPage() {
  console.log('[Next.js] Products page rendering with enhanced error handling');
  
  let products = [];
  let usedFallback = false;
  let error = null;
  
  try {
    // Server-side data fetching with improved error logging
    console.log('[Next.js] Attempting to fetch products from Contentful');
    products = await getProductTypes();
    
    console.log(`[Next.js] Fetched ${products.length} products from Contentful`);
    
    if (products.length === 0) {
      console.warn('[Next.js] No products returned from Contentful, using fallbacks');
      products = Object.values(productFallbacks);
      usedFallback = true;
    }
  } catch (err) {
    console.error('[Next.js] Error fetching products from Contentful:', err);
    error = err instanceof Error ? err.message : 'Unknown error';
    // Use fallback data if Contentful fetch fails
    products = Object.values(productFallbacks);
    usedFallback = true;
    console.log(`[Next.js] Using ${products.length} fallback products`);
  }
  
  // Filter visible products
  const visibleProducts = products.filter(product => product.visible !== false)
  
  return (
    <main>
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl font-bold mb-4 text-[hsl(222_47%_11%)]">Our Products</h1>
            <p className="text-xl text-[hsl(215_16%_47%)]">
              Discover our complete range of vending solutions for your business needs
            </p>
          </div>
          
          {/* Diagnostic information - helpful for troubleshooting */}
          <div className="max-w-3xl mx-auto mb-8">
            <ContentfulDiagnostics />
          </div>
          
          {/* Show notification if using fallback data */}
          {usedFallback && (
            <div className="mb-8 rounded-lg bg-blue-50 p-6 text-blue-800 border border-blue-200 max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold mb-2">Using Demo Product Data</h3>
              <p className="mb-2">
                {error ? `Error connecting to Contentful: ${error}` : 'Unable to connect to Contentful content management system.'}
              </p>
              <p className="text-sm">
                To display your own products, make sure your Contentful Space ID and API key are configured correctly.
              </p>
              <div className="mt-4 pt-2 border-t border-blue-200">
                <p className="text-xs">These example products are being used for demonstration purposes only.</p>
              </div>
            </div>
          )}
          
          {visibleProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
