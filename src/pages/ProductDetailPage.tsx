
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulProductType } from '@/hooks/cms/useContentfulProductType';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ProductHeroSection from '@/components/products/ProductHeroSection';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import RecommendedMachines from '@/components/products/sections/RecommendedMachines';
import { SimpleContactCTA } from '@/components/common';
import ContentfulInitializer from '@/components/blog/ContentfulInitializer';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  console.log("[ProductDetailPage] Rendering with slug:", slug);
  
  return (
    <Layout>
      <ContentfulInitializer
        fallback={
          <div className="container mx-auto p-4">
            <ContentfulFallbackMessage
              title="Product Not Available"
              message="We're having trouble loading this product. Please check your Contentful configuration."
              contentType="product"
              showRefresh={true}
              actionText="View All Products"
              actionHref="/products"
            />
          </div>
        }
      >
        <ProductContent slug={slug} />
      </ContentfulInitializer>
    </Layout>
  );
};

const ProductContent = ({ slug }: { slug: string | undefined }) => {
  const navigate = useNavigate();
  const { 
    data, 
    isLoading, 
    error,
    refetch
  } = useContentfulProductType(slug || '');

  useEffect(() => {
    console.log("[ProductContent] Rendering with slug:", slug);
    console.log("[ProductContent] Current product data:", data);
    console.log("[ProductContent] Current error state:", error);
    
    if (!slug) {
      toast.error("Missing product slug");
      navigate("/products");
    }
  }, [slug, data, error, navigate]);
  
  // Handle the case when data is undefined but no error was thrown
  const product = data ? {
    title: data.title || 'Unnamed Product',
    slug: data.slug || '',
    description: data.description || '',
    benefits: Array.isArray(data.benefits) ? data.benefits : [],
    image: data.image || null,
    features: Array.isArray(data.features) ? data.features : [],
    recommendedMachines: Array.isArray(data.recommendedMachines) ? data.recommendedMachines : []
  } : null;

  return (
    <ContentfulErrorBoundary contentType="Product Details">
      <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container mx-auto">
          <Link to="/products" className="inline-flex items-center text-vending-blue-dark hover:text-vending-blue py-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      {/* DiagnosticInfo component has been removed from here */}

      {isLoading ? (
        <div className="container py-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product information for slug: <code className="bg-gray-100 px-1 rounded">{slug}</code>...</p>
          <p className="text-sm text-gray-500 mt-2">Attempting to fetch data from Contentful...</p>
        </div>
      ) : error ? (
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <ContentfulFallbackMessage
              title="Error Loading Product"
              message={error instanceof Error ? error.message : 'Failed to load product details'}
              contentType="product"
              actionText="Retry Loading"
              actionHref="#"
              onAction={() => refetch()}
              showAdmin={false}
            />
          </div>
        </div>
      ) : !product ? (
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <ContentfulFallbackMessage
              title="Product Not Found"
              message={`We couldn't find the product "${slug}" in our Contentful database.`}
              contentType="product"
              actionText="Browse Products"
              actionHref="/products"
              showAdmin={false}
            />
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

          {product.recommendedMachines && product.recommendedMachines.length > 0 && (
            <RecommendedMachines machines={product.recommendedMachines} />
          )}

          <SimpleContactCTA />
        </>
      )}
    </ContentfulErrorBoundary>
  );
};

export default ProductDetailPage;
