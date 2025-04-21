
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

const ProductsPage = () => {
  const { data: productTypes, isLoading: isLoadingProducts, error: productsError, refetch } = useContentfulProducts();
  const { data: pageContent, isLoading: isLoadingContent } = useProductsPageContent();
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
    console.log('[ProductsPage] Rendering with Contentful data:', {
      productsCount: productTypes?.length || 0,
      isLoading: isLoadingProducts,
      hasError: !!productsError,
      errorMessage: productsError ? (productsError instanceof Error ? productsError.message : 'Unknown error') : null
    });
  }, [productTypes, isLoadingProducts, productsError]);
  
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
      refetch();
      toast.success("Connection refreshed");
    } catch (err) {
      toast.error("Failed to refresh connection");
      console.error("Error refreshing Contentful client:", err);
    }
  };

  return (
    <Layout>
      {pageContent && (
        <PurposeStatement 
          title={pageContent.purposeStatementTitle}
          description={pageContent.purposeStatementDescription}
        />
      )}

      <div className="container mx-auto py-12">
        {pageContent?.categoriesSectionTitle && (
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-2">
              {pageContent.categoriesSectionTitle}
            </h2>
            {pageContent.categoriesSectionDescription && (
              <p className="text-xl text-gray-700">
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
            onRetry={() => refetch()}
          />
        )}

        {productTypes && productTypes.length === 0 && !isLoadingProducts && !productsError && (
          <EmptyProductsList debugInfo={debugInfo} onRefresh={handleRefresh} />
        )}

        {productTypes && productTypes.length > 0 && <ProductGrid products={productTypes} />}
      </div>

      {pageContent && (
        <DemoRequest 
          title={pageContent.demoRequestTitle || "Request a Demo"}
          description={pageContent.demoRequestDescription}
          bulletPoints={pageContent.demoRequestBulletPoints}
        />
      )}
      
      <ContentfulDebug />
    </Layout>
  );
};

export default ProductsPage;
