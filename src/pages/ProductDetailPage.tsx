
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulProduct } from '@/hooks/cms/useContentfulProduct';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import ProductHeroSection from '@/components/products/ProductHeroSection';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { resetContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { resetContentfulConfig } from '@/services/cms/utils/cmsInfo';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { 
    data: product, 
    isLoading, 
    error, 
    refetch,
    isError,
    isFetching
  } = useContentfulProduct(slug || '');
  
  useEffect(() => {
    console.log(`[ProductDetailPage] Rendering with slug: ${slug}`, { 
      hasProduct: !!product,
      productTitle: product?.title || 'Not loaded',
      isLoading, 
      isFetching,
      hasError: !!error,
      errorMessage: error instanceof Error ? error.message : null 
    });
  }, [slug, product, isLoading, error, isFetching]);

  const handleRetryFetch = async () => {
    console.log('[ProductDetailPage] Resetting client and retrying fetch');
    toast.info("Refreshing Contentful connection...");
    
    // Reset all caches
    resetContentfulConfig();
    resetContentfulClient();
    
    try {
      // Force refresh the client
      await refreshContentfulClient();
      toast.success("Contentful connection refreshed");
    } catch (e) {
      console.error("Failed to refresh Contentful client", e);
      toast.error("Failed to refresh Contentful connection");
    }
    
    // Refetch the data
    refetch();
  };
  
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

        {isLoading || isFetching ? (
          <div className="container py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product information from Contentful...</p>
            {isFetching && !isLoading && (
              <div className="mt-4 text-sm text-gray-500">
                Refreshing content...
              </div>
            )}
          </div>
        ) : isError || error ? (
          <div className="container py-12">
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="font-bold text-lg text-red-800">Error Loading Product</h3>
                  <p className="text-red-700 mt-2">
                    {error instanceof Error ? error.message : 'Failed to load product details from Contentful'}
                  </p>
                  
                  <div className="mt-6">
                    <Button onClick={handleRetryFetch} variant="outline" className="mr-3 flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Connection
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/products">Browse Products</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !product ? (
          <div className="container py-12">
            <ContentfulFallbackMessage
              title="Product Not Found"
              message={`The product "${slug}" doesn't exist in Contentful or has been removed.`}
              contentType="Product"
              actionText="Browse Products"
              actionHref="/products"
            />
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
