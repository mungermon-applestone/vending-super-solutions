
import { useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { useContentfulProducts } from '@/hooks/cms/useContentfulProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';

const Products = () => {
  const { data: products, isLoading, error, refetch } = useContentfulProducts();
  const queryClient = useQueryClient();
  
  console.log('[Products] Rendering Products page', { 
    productsCount: products?.length || 0, 
    isLoading, 
    hasError: !!error,
    errorMessage: error instanceof Error ? error.message : null
  });

  const handleRefresh = () => {
    console.log('[Products] Refreshing products data');
    queryClient.invalidateQueries({ queryKey: ['contentful', 'products'] });
  };
  
  return (
    <Layout>
      <ContentfulErrorBoundary contentType="Products">
        <PageHero 
          pageKey="products" 
          fallbackTitle="Our Products" 
          fallbackSubtitle="Explore our innovative vending solutions"
          fallbackImage="https://images.unsplash.com/photo-1588430188257-eec60f814190"
          fallbackImageAlt="Vending Products"
        />

        <div className="container py-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground mt-1">
                Explore our product catalog
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="mt-4 md:mt-0">
              Refresh Data
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-3" />
              <p className="text-gray-500">Loading products from Contentful...</p>
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
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default Products;
