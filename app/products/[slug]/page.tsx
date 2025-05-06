
import { getProductTypeBySlug, getProductTypes } from '@/lib/contentful/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
  const product = await getProductTypeBySlug(params.slug)
  
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
  console.log('Next.js product page rendering for slug:', params.slug);
  
  const product = await getProductTypeBySlug(params.slug)
  
  // Handle product not found
  if (!product) {
    console.log('Product not found for slug:', params.slug);
    notFound()
  }

  // Log when product is found for debugging
  console.log('Product found:', product.title, 'with slug:', product.slug);

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
            <ContentfulDiagnostics slug={params.slug} productId={product.id} />
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

        {/* Contact Form Section */}
        <section id="request-demo" className="py-12">
          <RequestDemoForm />
        </section>
      </div>
    </div>
  )
}
