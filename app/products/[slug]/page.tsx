import { getProductTypeBySlug, getProductTypes } from '@/lib/contentful/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import PreviewEnvironmentNotice from '@/components/common/PreviewEnvironmentNotice'
import ContentfulDiagnostics from '@/components/common/ContentfulDiagnostics'
import ProductBenefitsList from '@/components/products/ProductBenefitsList'
import RequestDemoForm from '@/components/products/RequestDemoForm'

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

  // Contentful preview message mockup - would normally check environment
  const isPreviewEnvironment = process.env.CONTENTFUL_ENVIRONMENT === 'preview'
  
  return (
    <main className="bg-white">
      {/* Preview Environment Notice */}
      {isPreviewEnvironment && <PreviewEnvironmentNotice />}
      
      <div className="container mx-auto px-4 py-8">
        {/* Back to Products Link */}
        <Link 
          href="/products" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
        
        {/* Contentful Diagnostic Information */}
        <ContentfulDiagnostics slug={slug} productId={product.id} />
        
        {/* Main Product Information */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h1 className="text-4xl font-bold mb-6">{product.title}</h1>
              <p className="text-xl text-gray-700 mb-8">
                {product.description}
              </p>
              
              {/* Benefits List */}
              <div className="mb-8">
                <ProductBenefitsList benefits={product.benefits || []} />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#request-demo" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded font-medium transition-colors"
                >
                  Request a Demo
                </a>
                <Link 
                  href="/products"
                  className="border border-gray-300 hover:bg-gray-100 px-5 py-3 rounded font-medium transition-colors"
                >
                  View Other Product Types
                </Link>
              </div>
            </div>
            
            <div>
              {product.image ? (
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
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
          </div>
          
          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <section className="py-12 bg-gray-50 rounded-lg px-8 mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {product.features.map((feature) => (
                  <div key={feature.id} className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Recommended Machines Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Recommended Machines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* This would be populated with actual machine data from Contentful */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Machine Image</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Sample Machine {i}</h3>
                    <p className="text-gray-600 mb-4">This machine would be perfect for distributing {product.title.toLowerCase()} products.</p>
                    <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                      View details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Contact Form */}
          <section id="request-demo" className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Ready to transform your vending operations?</h2>
                <p className="text-gray-700 mb-8">
                  Let us show you how our software can streamline your operations, increase sales, and improve customer satisfaction.
                </p>
                <ul className="space-y-4">
                  {['Compatible with multiple machine types', 'Easy to implement and use', 'Dedicated support team', 'Customizable to your specific needs'].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <RequestDemoForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
