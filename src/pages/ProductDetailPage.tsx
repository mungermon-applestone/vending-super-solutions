
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulProduct } from '@/hooks/cms/useContentfulProduct';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProductHeroSection from '@/components/products/ProductHeroSection';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useContentfulProduct(slug || '');
  
  React.useEffect(() => {
    console.log("[ProductDetailPage] Initial render with slug:", slug);
  }, [slug]);
  
  if (isLoading) {
    console.log("[ProductDetailPage] Loading product data...");
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="h-96 w-full rounded-lg mb-8" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    console.error("[ProductDetailPage] Error loading product:", error);
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Product</h3>
              <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/products">Return to Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    console.log("[ProductDetailPage] No product data available for slug:", slug);
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Product Not Found</h3>
              <p className="text-amber-600">The product you're looking for doesn't exist or has been removed.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/products">Return to Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  console.log("[ProductDetailPage] Rendering product:", {
    title: product.title,
    slug: product.slug,
    description: product.description?.substring(0, 50) + '...',
    benefits: product.benefits?.length || 0,
    features: product.features?.length || 0,
    hasImage: !!product.image
  });

  return (
    <Layout>
      <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container mx-auto">
          <Link to="/products" className="inline-flex items-center text-vending-blue-dark hover:text-vending-blue py-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      <ProductHeroSection
        productType={product.title}
        description={product.description}
        image={product.image?.url || "/placeholder.svg"}
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
          <Button size="lg" className="bg-vending-teal hover:bg-vending-teal-dark">Contact Us</Button>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetailPage;
