import { useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { useContentfulProducts } from '@/hooks/cms/useContentfulProducts';
import { useProductsPageContent } from '@/hooks/cms/useProductsPageContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import PurposeStatement from '@/components/products/sections/PurposeStatement';
import KeyFeaturesSection from '@/components/products/sections/KeyFeaturesSection';
import DemoRequest from '@/components/products/sections/DemoRequest';
import ProductsHero from '@/components/products/sections/ProductsHero';
import FeaturedBusinessGoals from '@/components/products/sections/FeaturedBusinessGoals';

const Products = () => {
  const { data: products, isLoading, error, refetch } = useContentfulProducts();
  const { 
    data: pageContent, 
    isLoading: isLoadingContent, 
    error: contentError,
    refetch: refetchContent
  } = useProductsPageContent();
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
      <ContentfulErrorBoundary contentType="Products">
        <ProductsHero />

        {/* Purpose Statement Section */}
        {pageContent && (
          <PurposeStatement 
            title={pageContent.purposeStatementTitle || "Our Products"}
            description={pageContent.purposeStatementDescription}
          />
        )}

        {/* Products Grid Section */}
        <div className="container py-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground mt-1">
                {pageContent?.categoriesSectionTitle || "Explore our product catalog"}
              </p>
              {pageContent?.categoriesSectionDescription && (
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {pageContent.categoriesSectionDescription}
                </p>
              )}
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button onClick={handleRefresh} variant="outline" className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Content
              </Button>
            </div>
          </div>

          {isLoading || isLoadingContent ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-3" />
              <p className="text-gray-500">Loading content from Contentful...</p>
            </div>
          ) : error ? (
            <ContentfulFallbackMessage
              title="Error Loading Products"
              message={error instanceof Error ? error.message : 'Failed to load products from Contentful'}
              contentType="Products"
              showRefresh={true}
              onAction={refetch}
              actionText="Try Again"
            />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>{product.slug}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/products/${product.slug}`}>
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ContentfulFallbackMessage
              title="No Products Found"
              message="We couldn't find any products in Contentful. Please make sure you've added product types to your Contentful space."
              contentType="Products"
              showRefresh={true}
              onAction={handleRefresh}
            />
          )}
        </div>
        
        {/* Key Features Section with Business Goals */}
        {pageContent && (
          <>
            <KeyFeaturesSection 
              title={pageContent.keyFeaturesTitle}
              description={pageContent.keyFeaturesDescription}
              features={pageContent.keyFeatures}
            />
            <div className="container py-12">
              <FeaturedBusinessGoals entryId="2pS1t6cAI5cgijwX0mtWzx" />
            </div>
          </>
        )}

        {/* Demo Request Section */}
        {pageContent && (
          <DemoRequest 
            title={pageContent.demoRequestTitle || "Request a Demo"}
            description={pageContent.demoRequestDescription}
            bulletPoints={pageContent.demoRequestBulletPoints}
          />
        )}
        
        {/* Debug Information */}
        {import.meta.env.DEV && (
          <div className="container mx-auto py-8 px-4">
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
          </div>
        )}
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default Products;
