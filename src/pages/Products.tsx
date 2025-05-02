
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
import InquiryForm from '@/components/machines/contact/InquiryForm';
import ProductGrid from '@/components/products/sections/ProductGrid';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';

const Products = () => {
  const { data: products, isLoading, error, refetch } = useContentfulProducts();
  const { 
    data: pageContent, 
    isLoading: isLoadingContent, 
    error: contentError,
    refetch: refetchContent
  } = useProductsPageContent();
  const { data: testimonialSection } = useTestimonialSection('products');
  const queryClient = useQueryClient();
  
  console.log('[Products] Rendering Products page', { 
    productsCount: products?.length || 0, 
    isLoading, 
    hasError: !!error,
    errorMessage: error instanceof Error ? error.message : null
  });
  
  console.log('[Products] Page content:', pageContent);

  const handleRefresh = () => {
    console.log('[Products] Refreshing products data');
    queryClient.invalidateQueries({ queryKey: ['contentful', 'products'] });
    queryClient.invalidateQueries({ queryKey: ['contentful', 'productsPageContent'] });
  };
  
  return (
    <Layout>
      <SEO 
        title="Products"
        description={pageContent?.categoriesSectionDescription || "Explore our comprehensive range of vending solutions designed for modern businesses. Find the perfect product type for your needs."}
        type="website"
        canonicalUrl={window.location.href}
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
        <ProductsHero />

        {/* Purpose Statement Section - Proper section with heading */}
        {pageContent && (
          <section aria-labelledby="purpose-statement-title">
            <PurposeStatement 
              title={pageContent.purposeStatementTitle || "Our Products"}
              description={pageContent.purposeStatementDescription}
            />
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
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                className="flex items-center"
                aria-label="Refresh content"
              >
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                Refresh Content
              </Button>
            </div>
          </div>

          {isLoading || isLoadingContent ? (
            <div className="flex flex-col items-center justify-center py-12" aria-live="polite" aria-busy="true">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-3" aria-hidden="true" />
              <p className="text-gray-500">Loading content from Contentful...</p>
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
        {pageContent && (
          <section aria-labelledby="key-features-title">
            <KeyFeaturesSection 
              title={pageContent.keyFeaturesTitle}
              description={pageContent.keyFeaturesDescription}
              features={pageContent.keyFeatures}
            />
          </section>
        )}
        
        {/* Testimonials Section - Proper section */}
        {testimonialSection && (
          <section aria-labelledby="testimonials-title">
            <TestimonialsSection data={testimonialSection} />
          </section>
        )}

        {/* Inquiry Form - Proper section */}
        <section aria-labelledby="inquiry-form-title">
          <InquiryForm title="Ready to transform your vending operations?" />
        </section>
        
        {/* Debug Information */}
        {import.meta.env.DEV && (
          <aside className="container mx-auto py-8 px-4">
            <details className="bg-gray-100 p-4 rounded-lg mb-4">
              <summary className="font-semibold cursor-pointer">Debug Information</summary>
              <div className="mt-4 text-sm">
                <h4 className="font-bold">Products Data:</h4>
                <pre className="bg-gray-200 p-3 rounded mt-2 overflow-auto max-h-48">
                  {JSON.stringify(products, null, 2)}
                </pre>
                
                <h4 className="font-bold mt-4">Page Content:</h4>
                <pre className="bg-gray-200 p-3 rounded mt-2 overflow-auto max-h-48">
                  {JSON.stringify(pageContent, null, 2)}
                </pre>
              </div>
            </details>
          </aside>
        )}
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default Products;
