import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulProductType } from '@/hooks/cms/useContentfulProductType';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProductHeroSection from '@/components/products/ProductHeroSection';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import DiagnosticInfo from '@/components/products/sections/DiagnosticInfo';
import RecommendedMachines from '@/components/products/sections/RecommendedMachines';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { 
    data, 
    isLoading, 
    error
  } = useContentfulProductType(slug || '');

  useEffect(() => {
    console.log("[ProductDetailPage] Rendering with slug:", slug);
    console.log("[ProductDetailPage] Current product data:", data);
    console.log("[ProductDetailPage] Current error state:", error);
    console.log("[ProductDetailPage] Diagnostic info:", data?.diagnosticInfo);
  }, [slug, data, error]);
  
  const product = data ? {
    title: data.title,
    slug: data.slug,
    description: data.description,
    benefits: data.benefits,
    image: data.image,
    features: data.features,
    recommendedMachines: data.recommendedMachines
  } : null;
  
  const diagnosticInfo = data?.diagnosticInfo;

  return (
    <Layout>
      <ContentfulErrorBoundary contentType="Product Details">
        <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
          <div className="container mx-auto">
            <Link to="/products" className="inline-flex items-center text-vending-blue-dark hover:text-vending-blue py-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>

        {/* Always show diagnostic info at the top of the page */}
        <div className="container mx-auto py-4">
          <DiagnosticInfo 
            slug={slug || ''} 
            error={error instanceof Error ? error : null}
            diagnosticInfo={diagnosticInfo}
          />
        </div>

        {isLoading ? (
          <div className="container py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product information for slug: <code className="bg-gray-100 px-1 rounded">{slug}</code>...</p>
            <p className="text-sm text-gray-500 mt-2">Attempting to fetch data from Contentful...</p>
          </div>
        ) : error ? (
          <div className="container py-12">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <div className="ml-3">
                    <h3 className="font-bold text-lg text-red-800">Error Loading Product</h3>
                    <p className="text-red-700 mt-2">
                      {error instanceof Error ? error.message : 'Failed to load product details'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button asChild variant="default">
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : !product ? (
          <div className="container py-12">
            <div className="max-w-3xl mx-auto">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center mb-8">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">Product Not Found</h2>
                <p className="text-orange-700 mb-6">We couldn't find the product "{slug}" in our Contentful database.</p>
                
                <Button asChild variant="default" className="mb-4">
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ProductHeroSection
              productType={product.title}
              description={product.description}
              image={product.image?.url || '/placeholder.svg'}
              benefits={product.benefits || []}
            />

            {product.features && product.features.length > 0 && (
              <section className="py-16 bg-gray-50">
                <div className="container mx-auto">
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {product.features.map((feature) => (
                        <div key={feature.id} className="bg-white rounded-lg p-6 shadow-md">
                          <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {product && product.recommendedMachines && (
              <RecommendedMachines machines={product.recommendedMachines} />
            )}

            <section className="py-16 bg-vending-blue-dark text-white">
              <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Contact our team today to learn more about {product.title} and how it can benefit your business.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-vending-teal hover:bg-vending-teal-dark"
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </section>
          </>
        )}
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default ProductDetailPage;
