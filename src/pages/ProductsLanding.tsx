
import React from 'react';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/common/PageHero';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProductTypes } from '@/hooks/cms/useProductTypes';
import { Skeleton } from '@/components/ui/skeleton';
import CTASection from '@/components/common/CTASection';

const ProductsLanding: React.FC = () => {
  const { data: products = [], isLoading, error } = useProductTypes();
  
  return (
    <Layout>
      <PageHero 
        pageKey="products"
        fallbackTitle="Our Products"
        fallbackSubtitle="Explore our comprehensive range of vending solutions designed to meet your business needs"
        fallbackImage="https://images.unsplash.com/photo-1525509131757-1f0f95e86583"
        fallbackImageAlt="Product Overview"
        fallbackPrimaryButtonText="View All Products"
        fallbackPrimaryButtonUrl="/products"
        fallbackSecondaryButtonText="Request Demo"
        fallbackSecondaryButtonUrl="/contact"
      />

      <div className="container mx-auto py-12">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load products'}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              // Product grid items will go here in future updates
              <div key={product.id} className="p-4 border rounded-lg">
                <h3 className="text-xl font-semibold">{product.title}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <CTASection />
    </Layout>
  );
};

export default ProductsLanding;
