
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProductType } from '@/hooks/cms/useProductTypes';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductHeroSection from '@/components/products/ProductHeroSection';
import ProductFeaturesList from '@/components/products/ProductFeaturesList';
import ProductExamples from '@/components/products/ProductExamples';
import CTASection from '@/components/common/CTASection';

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { data: product, isLoading, error } = useProductType(productSlug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto" />
          <p className="mt-4">Loading product information...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-xl font-semibold text-red-500 mb-4">Error Loading Product</h1>
            <p className="mb-6">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-xl font-semibold mb-4">Product Not Found</h1>
            <p className="mb-6">We couldn't find the product "{productSlug}" in the database.</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Prepare the image URL for the hero section
  const heroImage = product.image?.url || '/placeholder.svg';
  
  // Prepare benefits list (ensure it's an array)
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];

  return (
    <Layout>
      {/* Back Navigation */}
      <div className="container pt-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <ProductHeroSection
        productType={product.title}
        description={product.description}
        image={heroImage}
        benefits={benefits}
      />

      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
            <ProductFeaturesList features={product.features} />
          </div>
        </section>
      )}

      {/* Examples Section */}
      {product.examples && product.examples.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Applications</h2>
            <ProductExamples examples={product.examples} />
          </div>
        </section>
      )}

      {/* Call to Action */}
      <CTASection />
    </Layout>
  );
};

export default ProductDetail;
