
import { getProductTypeBySlug, getProductTypes } from '@/lib/contentful/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ProductFeatures from '@/components/products/ProductFeatures'

// Generate static params for common products at build time
export async function generateStaticParams() {
  const products = await getProductTypes()
  return products.map(product => ({
    slug: product.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  const product = await getProductTypeBySlug(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
  
  return {
    title: `${product.title} | Vending Solutions`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const product = await getProductTypeBySlug(slug)
  
  // Handle product not found
  if (!product) {
    notFound()
  }
  
  return (
    <main className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              {product.image ? (
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image 
                    src={product.image.url} 
                    alt={product.image.alt || product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-xl text-gray-700 mb-8">
                {product.description}
              </p>
              
              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 text-green-500">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {product.features && product.features.length > 0 && (
            <ProductFeatures 
              features={product.features}
              sectionTitle="Product Features"
              sectionDescription="Explore the features that make this product perfect for your business"
            />
          )}
        </div>
      </div>
    </main>
  )
}
