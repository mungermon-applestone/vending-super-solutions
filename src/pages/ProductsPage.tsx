
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useContentfulProducts } from '@/hooks/cms/useContentfulProducts';
import { useProductsPageContent } from '@/hooks/cms/useProductsPageContent';
import { isContentfulConfigured } from '@/config/cms';
import { toast } from 'sonner';
import { refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import ContentfulDebug from '@/components/debug/ContentfulDebug';
import PurposeStatement from '@/components/products/sections/PurposeStatement';
import DemoRequest from '@/components/products/sections/DemoRequest';
import ConfigurationError from '@/components/products/sections/ConfigurationError';
import ProductsLoadingState from '@/components/products/sections/ProductsLoadingState';
import ProductsError from '@/components/products/sections/ProductsError';
import EmptyProductsList from '@/components/products/sections/EmptyProductsList';
import ProductGrid from '@/components/products/sections/ProductGrid';
import KeyFeaturesSection from '@/components/products/sections/KeyFeaturesSection';

const ProductsPage = () => {
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
  
  const contentfulConfigured = isContentfulConfigured();
  
  // Debug information for Contentful configuration
  const [debugInfo, setDebugInfo] = React.useState<{
    spaceId?: string,
    environmentId?: string,
    hasToken: boolean
  }>({
    hasToken: false
  });
  
  useEffect(() => {
    console.log('[ProductsPage] Page Content:', pageContent);
  }, [pageContent]);
  
  // Check if Contentful is configured
  useEffect(() => {
    const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
    const envId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
    const hasToken = !!(import.meta.env.CONTENTFUL_DELIVERY_TOKEN || import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN);
    
    setDebugInfo({
      spaceId: typeof spaceId === 'string' ? (spaceId.slice(0, 4) + '...') : undefined,
      environmentId: envId,
      hasToken
    });
    
    if (!contentfulConfigured) {
      console.warn('Contentful is not properly configured. Check your environment variables.');
      toast.warning('Contentful configuration missing. Some content may not display correctly.');
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

  return (
    <Layout>
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

        {!contentfulConfigured && <ConfigurationError debugInfo={debugInfo} />}
        
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

      {/* Demo Request Section */}
      {pageContent && (
        <DemoRequest 
          title={pageContent.demoRequestTitle || "Request a Demo"}
          description={pageContent.demoRequestDescription}
          bulletPoints={pageContent.demoRequestBulletPoints}
        />
      )}
      
      {/* Debug section - conditionally render based on a query param or dev mode */}
      {import.meta.env.DEV && (
        <div className="container mx-auto py-8 px-4">
          <details className="bg-gray-100 p-4 rounded-lg mb-4">
            <summary className="font-semibold cursor-pointer">Debug Information</summary>
            <div className="mt-4 text-sm">
              <h4 className="font-bold">Products Data:</h4>
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
      
      <ContentfulDebug />
    </Layout>
  );
};

export default ProductsPage;
