import React from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/seo/SEO';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import { useQueryClient } from '@tanstack/react-query';
import { useContentfulProducts } from '@/hooks/cms/useContentfulProducts';
import { useProductsPageContent } from '@/hooks/cms/useProductsPageContent';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import PurposeStatement from '@/components/products/sections/PurposeStatement';
import KeyFeaturesSection from '@/components/products/sections/KeyFeaturesSection';
import ProductsHero from '@/components/products/sections/ProductsHero';
import { SimpleContactCTA } from '@/components/common';
import ProductGrid from '@/components/products/sections/ProductGrid';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import ProductsLoadingState from '@/components/products/sections/ProductsLoadingState';
import { isPreviewEnvironment } from '@/config/cms';

const Products: React.FC = () => {
  // Optimized data fetching with React Query
  const { data: products, isLoading, error, refetch } = useContentfulProducts();
  const { 
    data: pageContent, 
    isLoading: isLoadingContent, 
    error: contentError,
    refetch: refetchContent
  } = useProductsPageContent();
  const { data: testimonialSection } = useTestimonialSection();
  const { data: machineTestimonials } = useTestimonialSection();
  const queryClient = useQueryClient();
  
  // Use React's lazy loading for performance monitoring
  const [heroVisible, setHeroVisible] = React.useState(false);
  const heroRef = React.useRef<HTMLDivElement>(null);
  
  // Intersection observer to track when hero is visible
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Performance tracking for component mount
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`[Products] Render time: ${endTime - startTime}ms`);
    };
  }, []);

  // Preload critical data for faster transitions
  React.useEffect(() => {
    // Start fetching testimonials immediately instead of waiting
    queryClient.prefetchQuery({
      queryKey: ['testimonialSection'],
      queryFn: () => useTestimonialSection().refetch()
    });
  }, [queryClient]);

  const handleRefresh = () => {
    console.log('[Products] Refreshing products data');
    queryClient.invalidateQueries({ queryKey: ['contentful', 'products'] });
    queryClient.invalidateQueries({ queryKey: ['contentful', 'productsPageContent'] });
  };
  
  // Check if we're in a development or preview environment
  const showDevTools = import.meta.env.DEV || isPreviewEnvironment();
  
  return (
    <Layout>
      <SEO 
        title="Products | Vending Solutions"
        description={pageContent?.categoriesSectionDescription || "Explore our comprehensive range of vending solutions designed for modern businesses. Find the perfect product type for your needs."}
        type="website"
        canonicalUrl={window.location.href}
        openGraph={{
          title: "Vending Solutions Products",
          description: pageContent?.categoriesSectionDescription || "Explore our comprehensive range of vending solutions designed for modern businesses.",
          type: "website"
        }}
      />
      <ContentfulErrorBoundary contentType="Products">
        {/* Skip to main content link for accessibility */}
        <a href="#products-main" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:z-50 focus:top-0 focus:left-0">
          Skip to main content
        </a>
        
        {/* Breadcrumbs for navigation context */}
        <nav aria-label="Breadcrumb" className="container py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink aria-current="page">Products</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        {/* Hero Section - Semantic header */}
        <div ref={heroRef}>
          <ProductsHero />
        </div>

        {/* Purpose Statement Section - Proper section with heading */}
        {(pageContent || isLoadingContent) && (
          <section aria-labelledby="purpose-statement-title">
            {isLoadingContent ? (
              <div className="container py-16">
                <div className="max-w-3xl mx-auto">
                  <div className="space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto" />
                    <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : pageContent ? (
              <PurposeStatement 
                title={pageContent.purposeStatementTitle || "Our Products"}
                description={pageContent.purposeStatementDescription}
              />
            ) : null}
          </section>
        )}

        {/* Products Grid Section - Main content area with ID for skip link */}
        <main id="products-main" className="container py-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              {pageContent?.categoriesSectionTitle && (
                <p className="text-muted-foreground mt-1">
                  {pageContent.categoriesSectionTitle}
                </p>
              )}
              {pageContent?.categoriesSectionDescription && (
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {pageContent.categoriesSectionDescription}
                </p>
              )}
            </div>
            
            {/* Only show refresh button in development or preview environments */}
            {showDevTools && (
              <div className="flex gap-4 mt-4 md:mt-0">
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  className="flex items-center"
                  aria-label="Refresh content"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  Refresh Content
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div aria-live="polite" aria-busy="true">
              <ProductsLoadingState />
            </div>
          ) : error ? (
            <div aria-live="assertive">
              <ContentfulFallbackMessage
                title="Error Loading Products"
                message={error instanceof Error ? error.message : 'Failed to load products from Contentful'}
                contentType="Products"
                showRefresh={true}
                onAction={refetch}
                actionText="Try Again"
              />
            </div>
          ) : products && products.length > 0 ? (
            <section aria-labelledby="products-heading">
              <h2 id="products-heading" className="sr-only">Available Products</h2>
              <ProductGrid products={products} />
            </section>
          ) : (
            <div aria-live="assertive">
              <ContentfulFallbackMessage
                title="No Products Found"
                message="We couldn't find any products in Contentful. Please make sure you've added product types to your Contentful space."
                contentType="Products"
                showRefresh={true}
                onAction={handleRefresh}
              />
            </div>
          )}
        </main>
        
        {/* Key Features Section with headings */}
        {(pageContent || isLoadingContent) && (
          <section aria-labelledby="key-features-title">
            {isLoadingContent ? (
              <div className="container py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="space-y-8">
                    <div className="space-y-4 text-center">
                      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : pageContent?.keyFeaturesTitle ? (
              <KeyFeaturesSection 
                title={pageContent.keyFeaturesTitle}
                description={pageContent.keyFeaturesDescription}
                features={pageContent.keyFeatures}
              />
            ) : null}
          </section>
        )}
        
        {/* Testimonials Section - Proper section */}
        {testimonialSection && (
          <section aria-labelledby="testimonials-title">
            <TestimonialsSection data={testimonialSection} />
          </section>
        )}

        {/* Replace Inquiry Form with SimpleContactCTA */}
        <section aria-labelledby="contact-section-title">
          <SimpleContactCTA />
        </section>
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default Products;
