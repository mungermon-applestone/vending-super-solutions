
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulProducts } from '@/hooks/cms/useContentfulProducts';
import { useProductsPageContent } from '@/hooks/cms/useProductsPageContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { isContentfulConfigured } from '@/config/cms';
import { toast } from 'sonner';
import { refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import ContentfulDebug from '@/components/debug/ContentfulDebug';
import PurposeStatement from '@/components/products/sections/PurposeStatement';
import DemoRequest from '@/components/products/sections/DemoRequest';

const ProductsPage = () => {
  const { data: productTypes, isLoading: isLoadingProducts, error: productsError, refetch } = useContentfulProducts();
  const { data: pageContent, isLoading: isLoadingContent } = useProductsPageContent();
  const navigate = useNavigate();
  const contentfulConfigured = isContentfulConfigured();

  useEffect(() => {
    console.log('[ProductsPage] Rendering with Contentful data:', {
      productsCount: productTypes?.length || 0,
      isLoading: isLoadingProducts,
      hasError: !!productsError,
      errorMessage: productsError ? (productsError instanceof Error ? productsError.message : 'Unknown error') : null
    });
  }, [productTypes, isLoadingProducts, productsError]);
  
  // Debug information for Contentful configuration
  const [debugInfo, setDebugInfo] = React.useState<{
    spaceId?: string,
    environmentId?: string,
    hasToken: boolean
  }>({
    hasToken: false
  });
  
  // Check if Contentful is configured
  useEffect(() => {
    // Check for environment variables and log them without exposing sensitive data
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

        {!contentfulConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center mb-8">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Contentful Configuration Missing</h3>
            <p className="text-amber-700 mb-4">
              Please set up your Contentful environment variables to display product data.
            </p>
            <div className="text-sm bg-white p-3 rounded border border-amber-100 mx-auto max-w-lg mb-4">
              <p className="font-mono mb-1">VITE_CONTENTFUL_SPACE_ID: {debugInfo.spaceId || 'Not set'}</p>
              <p className="font-mono mb-1">VITE_CONTENTFUL_ENVIRONMENT_ID: {debugInfo.environmentId || 'Not set'}</p>
              <p className="font-mono">CONTENTFUL_DELIVERY_TOKEN: {debugInfo.hasToken ? 'Set' : 'Not set'}</p>
            </div>
            <p className="text-xs text-gray-500">
              Note: These environment variables must be set in your deployment environment.
            </p>
          </div>
        )}

        {isLoadingProducts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {productsError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <div className="flex flex-col items-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
              <p className="text-red-600 mb-4">{productsError instanceof Error ? productsError.message : 'An unknown error occurred'}</p>
              
              <div className="bg-white p-4 rounded border border-red-100 max-w-2xl mb-6 text-left">
                <p className="font-semibold mb-2 text-red-800">Contentful Environment Variables Status:</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>Space ID: {debugInfo.spaceId ? '✓ Set' : '✗ Missing'}</li>
                  <li>Environment ID: {debugInfo.environmentId ? '✓ Set' : '✗ Missing'}</li>
                  <li>Delivery Token: {debugInfo.hasToken ? '✓ Set' : '✗ Missing'}</li>
                </ul>
                <p className="text-xs text-gray-600">
                  Note: Make sure these variables are correctly set in your Vercel environment settings.
                </p>
              </div>
              
              <Button onClick={() => refetch()} variant="outline" className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {productTypes && productTypes.length === 0 && !isLoadingProducts && !productsError && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <div className="flex flex-col items-center">
              <Info className="h-8 w-8 text-gray-500 mb-2" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">No products are currently available in your Contentful space.</p>
              
              <p className="text-sm bg-white p-3 rounded border border-gray-100 max-w-2xl mb-4 text-left">
                To add products to your Contentful space:
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Log in to your Contentful account</li>
                  <li>Navigate to your space: "{debugInfo.spaceId || 'al01e4yh2wq4'}"</li>
                  <li>Go to Content &gt; Add entry &gt; Product Type</li>
                  <li>Create products with title, slug, description and image</li>
                  <li>Publish your entries</li>
                </ol>
              </p>
              
              <Button onClick={handleRefresh} variant="outline" className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {productTypes && productTypes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productTypes.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-lg">
                {product.image && (
                  <img 
                    src={product.image.url} 
                    alt={product.image.alt || product.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x200?text=Product+Image";
                    }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{product.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                  <Button 
                    variant="ghost" 
                    className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center p-0"
                    onClick={() => navigate(`/products/${product.slug}`)}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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
