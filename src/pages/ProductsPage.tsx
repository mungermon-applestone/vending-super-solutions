
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulProducts } from '@/hooks/cms/useContentfulProducts';
import { useProductsPageContent } from '@/hooks/cms/useProductsPageContent';
import { isContentfulConfigured, logContentfulConfig, CONTENTFUL_CONFIG } from '@/config/cms';
import { toast } from 'sonner';
import { refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import ContentfulConfigVerifier from '@/components/debug/ContentfulConfigVerifier';
import PurposeStatement from '@/components/products/sections/PurposeStatement';
import KeyFeaturesSection from '@/components/products/sections/KeyFeaturesSection';
import ConfigurationError from '@/components/products/sections/ConfigurationError';
import ProductsLoadingState from '@/components/products/sections/ProductsLoadingState';
import ProductsError from '@/components/products/sections/ProductsError';
import EmptyProductsList from '@/components/products/sections/EmptyProductsList';
import ProductGrid from '@/components/products/sections/ProductGrid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';

const ProductsPage = () => {
  const navigate = useNavigate();
  
  const { 
    data: productTypes, 
    isLoading: isLoadingProducts, 
    error: productsError, 
    refetch: refetchProducts 
  } = useContentfulProducts();
  
  const { 
    data: pageContent, 
    isLoading: isLoadingContent, 
    error: contentError,
    refetch: refetchContent
  } = useProductsPageContent();
  
  const { data: testimonialSection, isLoading: isLoadingTestimonials, error: testimonialError } = useTestimonialSection('products');
  
  const contentfulConfigured = isContentfulConfigured();
  
  // Debug information for Contentful configuration
  const [debugInfo, setDebugInfo] = React.useState<{
    spaceId?: string,
    environmentId?: string,
    hasToken: boolean,
    storedInLocalStorage: boolean
  }>({
    hasToken: false,
    storedInLocalStorage: false
  });
  
  useEffect(() => {
    console.log('[ProductsPage] Page Content:', pageContent);
    // Log configuration information on component mount
    logContentfulConfig();
    
    const localStorageVars = localStorage.getItem('vending-cms-env-variables');
    console.log('[ProductsPage] LocalStorage vars exist:', !!localStorageVars);
    
    if (!contentfulConfigured) {
      toast.warning('Contentful not configured. Please set up credentials in Admin > Environment Variables.');
    }
  }, [pageContent]);
  
  // Check if Contentful is configured
  useEffect(() => {
    const spaceId = CONTENTFUL_CONFIG.SPACE_ID;
    const envId = CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master';
    const hasToken = !!CONTENTFUL_CONFIG.DELIVERY_TOKEN;
    const storedVars = localStorage.getItem('vending-cms-env-variables');
    
    console.log('[ProductsPage] Config variables detected:', { 
      spaceId, 
      envId, 
      hasToken,
      storedInLocalStorage: !!storedVars
    });
    
    setDebugInfo({
      spaceId: typeof spaceId === 'string' ? (spaceId) : undefined,
      environmentId: envId,
      hasToken,
      storedInLocalStorage: !!storedVars
    });
    
    if (!contentfulConfigured) {
      console.warn('Contentful is not properly configured. Check your environment variables.');
    }
  }, [contentfulConfigured]);

  const handleRefresh = async () => {
    toast.info("Refreshing Contentful connection...");
    try {
      await refreshContentfulClient();
      refetchProducts();
      refetchContent();
      toast.success("Connection refreshed");
    } catch (err) {
      toast.error("Failed to refresh connection");
      console.error("Error refreshing Contentful client:", err);
    }
  };

  if (!contentfulConfigured) {
    return (
      <Layout>
        <div className="container py-12">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Contentful Not Configured</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>Your Contentful account needs to be configured to display content on this page.</p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/admin/environment-variables')}>
                  Configure Contentful
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ContentfulConfigVerifier only shown in development environment */}
      {import.meta.env.DEV && <ContentfulConfigVerifier />}
      
      {/* Hero/Purpose Statement Section */}
      {pageContent && (
        <PurposeStatement 
          title={pageContent.purposeStatementTitle || "Our Vending Products"}
          description={pageContent.purposeStatementDescription}
        />
      )}

      {/* Categories Section */}
      <div className="container mx-auto py-12">
        {pageContent?.categoriesSectionTitle && (
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {pageContent.categoriesSectionTitle}
            </h2>
            {pageContent.categoriesSectionDescription && (
              <p className="text-lg text-gray-600">
                {pageContent.categoriesSectionDescription}
              </p>
            )}
          </div>
        )}

        {isLoadingProducts && <ProductsLoadingState />}
        
        {productsError && (
          <ProductsError 
            error={productsError} 
            debugInfo={debugInfo}
            onRetry={() => refetchProducts()}
          />
        )}

        {productTypes && productTypes.length === 0 && !isLoadingProducts && !productsError && (
          <EmptyProductsList debugInfo={debugInfo} onRefresh={handleRefresh} />
        )}

        {productTypes && productTypes.length > 0 && <ProductGrid products={productTypes} />}
      </div>

      {/* Key Features Section */}
      {pageContent && (
        <KeyFeaturesSection 
          title={pageContent.keyFeaturesTitle}
          description={pageContent.keyFeaturesDescription}
          features={pageContent.keyFeatures}
        />
      )}

      {/* Replace TestimonialsSection with ContentfulTestimonialsCarousel */}
      <ContentfulTestimonialsCarousel 
        data={testimonialSection}
        isLoading={isLoadingTestimonials}
        error={testimonialError}
      />
      
      {/* Debug section - only shown in development mode */}
      {import.meta.env.DEV && (
        <div className="container mx-auto py-8 px-4">
          <details className="bg-gray-100 p-4 rounded-lg mb-4">
            <summary className="font-semibold cursor-pointer">Debug Information</summary>
            <div className="mt-4 text-sm">
              <h4 className="font-bold">Current Environment Variables:</h4>
              <div className="bg-gray-200 p-3 rounded mt-2 font-mono">
                <p>VITE_CONTENTFUL_SPACE_ID: {CONTENTFUL_CONFIG.SPACE_ID || 'Not set'}</p>
                <p>VITE_CONTENTFUL_ENVIRONMENT_ID: {CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'Not set'}</p>
                <p>VITE_CONTENTFUL_DELIVERY_TOKEN: {CONTENTFUL_CONFIG.DELIVERY_TOKEN ? 'Set' : 'Not set'}</p>
                <p>LocalStorage Variables: {debugInfo.storedInLocalStorage ? 'Found' : 'Not Found'}</p>
              </div>
              
              <h4 className="font-bold mt-4">Products Data:</h4>
              <pre className="bg-gray-200 p-3 rounded mt-2 overflow-auto max-h-48">
                {JSON.stringify(productTypes, null, 2)}
              </pre>
              
              <h4 className="font-bold mt-4">Page Content:</h4>
              <pre className="bg-gray-200 p-3 rounded mt-2 overflow-auto max-h-48">
                {JSON.stringify(pageContent, null, 2)}
              </pre>
              
              <h4 className="font-bold mt-4">Contentful Config:</h4>
              <pre className="bg-gray-200 p-3 rounded mt-2">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={handleRefresh}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Refresh Connection
                </button>
              </div>
            </div>
          </details>
        </div>
      )}
    </Layout>
  );
};

export default ProductsPage;
