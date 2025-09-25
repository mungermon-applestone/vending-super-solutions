
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useContentfulProductType } from '@/hooks/cms/useContentfulProductType';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import ProductHeroSection from '@/components/products/ProductHeroSection';
import ProductFeaturesList from '@/components/products/ProductFeaturesList';
import ProductExamples from '@/components/products/ProductExamples';
import SimpleContactCTA from '@/components/common/SimpleContactCTA';
import ProductVideoSection from '@/components/products/ProductVideoSection';
import RecommendedMachines from '@/components/products/sections/RecommendedMachines';
import ProductDetailSEO from '@/components/seo/ProductDetailSEO';
import { useTranslatedProduct } from '@/hooks/useTranslatedProduct';

/**
 * Product detail page that displays detailed information about a specific product
 */
const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useContentfulProductType(slug || '');
  const { translatedContent: translatedProduct, isLoading: isTranslating } = useTranslatedProduct(product);
  
  // Use translated content if available, fallback to original
  const displayProduct = translatedProduct || product;
  
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Log product data for debugging
  useEffect(() => {
    if (displayProduct) {
      console.log('[ProductDetail] Loaded product data:', displayProduct);
    } else if (!isLoading) {
      console.log('[ProductDetail] No product data found for slug:', slug);
    }
  }, [displayProduct, isLoading, slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-16 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto" />
        <p className="mt-4">Loading product information...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
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
    );
  }

  // Not found state
  if (!displayProduct) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-xl font-semibold mb-4">Product Not Found</h1>
          <p className="mb-6">We couldn't find the product "{slug}" in the database.</p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Prepare the image URL for the hero section
  const heroImage = displayProduct.image?.url || '/placeholder.svg';
  
  // Prepare benefits list (ensure it's an array)
  const benefits = Array.isArray(displayProduct.benefits) ? displayProduct.benefits : [];
  
  // Check if product has examples - with proper typing
  // @ts-ignore - Handling potential missing examples property
  const productExamples = displayProduct.examples || [];
  const hasExamples = productExamples && Array.isArray(productExamples) && productExamples.length > 0;

  // Log information about recommended machines
  if (displayProduct.recommendedMachines) {
    console.log('[ProductDetail] Number of recommended machines:', displayProduct.recommendedMachines.length);
    displayProduct.recommendedMachines.forEach((machine, index) => {
      console.log(`[ProductDetail] Machine ${index + 1}:`, {
        id: machine.id,
        title: machine.title,
        hasImage: !!machine.image,
        hasThumbnail: !!machine.thumbnail,
        hasMachineThumbnail: !!machine.machineThumbnail
      });
    });
  } else {
    console.log('[ProductDetail] No recommended machines for this product');
  }

  return (
    <>
      {/* Add SEO component */}
      <ProductDetailSEO product={displayProduct} />

      {/* Back Navigation */}
      <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container pt-6 pb-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <ProductHeroSection
        productType={displayProduct.title}
        description={displayProduct.description}
        image={heroImage}
        benefits={benefits}
      />

      {/* Video Section - With orientation property check */}
      {displayProduct.video && (
        <ProductVideoSection
          title={displayProduct.video.title || "See Our Solution in Action"}
          description={displayProduct.video.description || "Watch how our solution can transform your business"}
          videoId={displayProduct.video.youtubeId}
          videoUrl={displayProduct.video.url}
          thumbnailImage={displayProduct.video.thumbnailImage?.url || heroImage}
          orientation={displayProduct.video.orientation || 'horizontal'}
        />
      )}

      {/* Features Section - Updated to use our new component without extra heading */}
      {displayProduct.features && displayProduct.features.length > 0 && (
        <section className="py-12 bg-gray-50">
          <ProductFeaturesList features={displayProduct.features} />
        </section>
      )}

      {/* Examples Section - with proper null check */}
      {hasExamples && (
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Applications</h2>
            {/* @ts-ignore - Handling potential missing examples property */}
            <ProductExamples examples={productExamples} />
          </div>
        </section>
      )}

      {/* Recommended Machines Section */}
      {displayProduct.recommendedMachines && displayProduct.recommendedMachines.length > 0 && (
        <RecommendedMachines machines={displayProduct.recommendedMachines} />
      )}

      {/* Single CTA Section */}
      <div className="py-16 bg-gray-50">
        <SimpleContactCTA
          title="Ready to Get Started?"
          description="Get in touch and we'll start you on your vending journey."
          primaryButtonText="Schedule a Demo"
          secondaryButtonText="Check out Machines"
          secondaryButtonUrl="/machines"
        />
      </div>
    </>
  );
};

export default ProductDetail;
