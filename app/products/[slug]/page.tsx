
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

  // Check if in preview environment
  const isPreviewEnvironment = process.env.CONTENTFUL_ENVIRONMENT === 'preview'
  
  return (
    <div className="min-h-screen bg-[hsl(210_50%_98%)]">
      {/* Preview Environment Notice */}
      {isPreviewEnvironment && <PreviewEnvironmentNotice />}
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Products Link */}
        <div className="py-6">
          <Link 
            href="/products" 
            className="inline-flex items-center text-vending-blue hover:text-vending-blue-dark transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
        
        {/* Contentful Diagnostic Information (only shown in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8">
            <ContentfulDiagnostics slug={slug} productId={product.id} />
          </div>
        )}
        
        {/* Product Hero Section */}
        <section className="mb-16 overflow-hidden rounded-xl bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[hsl(222_47%_11%)]">{product.title}</h1>
              <div className="text-lg text-vending-gray-dark mb-8 leading-relaxed">
                {product.description}
              </div>
              
              {/* Benefits List */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-8 bg-white/50 rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
                  <ProductBenefitsList benefits={product.benefits} />
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <a 
                  href="#request-demo" 
                  className="bg-vending-blue hover:bg-vending-blue-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Request a Demo
                </a>
                <Link 
                  href="/products"
                  className="border border-vending-blue text-vending-blue hover:bg-vending-blue hover:text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  View Other Products
                </Link>
              </div>
            </div>
            
            <div>
              {product.image ? (
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
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
        </section>
        
        {/* Product Features */}
        {product.features && product.features.length > 0 && (
          <section className="mb-16 rounded-xl bg-white shadow-md overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-[hsl(222_47%_11%)]">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {product.features.map((feature) => (
                  <div key={feature.id} className="bg-[hsl(210_40%_96%)] rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-[hsl(222_47%_11%)]">{feature.title}</h3>
                    <p className="text-[hsl(215_16%_47%)]">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Recommended Machines Section */}
        <section className="mb-16 rounded-xl bg-white shadow-md overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-[hsl(222_47%_11%)]">Recommended Machines</h2>
            
            {product.recommendedMachines && product.recommendedMachines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {product.recommendedMachines.map((machine, index) => (
                  <div key={`${machine.id}-${index}`} className="rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-[hsl(214_32%_91%)]">
                    {machine.image ? (
                      <div className="h-64 bg-gray-100 relative">
                        <Image 
                          src={machine.image.url} 
                          alt={machine.image.alt || machine.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-64 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Machine Image</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{machine.title}</h3>
                      <p className="text-[hsl(215_16%_47%)] mb-4 line-clamp-2">{machine.description}</p>
                      <Link href={`/machines/${machine.slug}`} className="text-vending-blue hover:text-vending-blue-dark flex items-center font-medium">
                        View details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-[hsl(214_32%_91%)]">
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Machine Image</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Sample Machine {i}</h3>
                      <p className="text-[hsl(215_16%_47%)] mb-4 line-clamp-2">This machine would be perfect for distributing {product.title.toLowerCase()} products.</p>
                      <a href="#" className="text-vending-blue hover:text-vending-blue-dark flex items-center font-medium">
                        View details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="request-demo" className="py-12 md:py-20 bg-white rounded-xl shadow-md mb-16 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-[hsl(222_47%_11%)]">Ready to transform your vending operations?</h2>
              <p className="text-lg text-[hsl(215_16%_47%)] mb-8 leading-relaxed">
                Let us show you how our {product.title.toLowerCase()} software can streamline your operations, increase sales, and improve customer satisfaction.
              </p>
              <ul className="space-y-4">
                {['Compatible with multiple machine types', 'Easy to implement and use', 'Dedicated support team', 'Customizable to your specific needs'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-vending-teal mr-3 flex-shrink-0 mt-1" />
                    <span className="text-[hsl(215_16%_47%)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <RequestDemoForm />
          </div>
        </section>
      </div>
    </div>
  )
}
