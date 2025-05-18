
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useContentfulProducts } from '@/hooks/cms/useContentfulProducts';
import ProductGrid from '@/components/products/sections/ProductGrid';
import { CMSProductType } from '@/types/cms';
import ProductsHero from '@/components/products/sections/ProductsHero';
import ProductsError from '@/components/products/sections/ProductsError';
import ProductsLoadingState from '@/components/products/sections/ProductsLoadingState';
import EmptyProductsList from '@/components/products/sections/EmptyProductsList';
import PurposeStatement from '@/components/products/sections/PurposeStatement';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ConfigurationError from '@/components/products/sections/ConfigurationError';
import { validateContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';

// This is the main Products page component
const Products = () => {
  const [isConfigured, setIsConfigured] = useState(true);
  const [canRefresh, setCanRefresh] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  // Fetch products from Contentful
  const { 
    data: products = [], 
    isLoading, 
    error,
    refetch
  } = useContentfulProducts();

  // Check Contentful configuration on mount
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const isValid = await validateContentfulClient();
        setIsConfigured(isValid);
      } catch (err) {
        console.error('Error checking Contentful configuration:', err);
        setIsConfigured(false);
      }
    };
    
    checkConfiguration();
  }, []);

  // Handler for retry button that returns a Promise
  const handleRefreshContentful = async (): Promise<void> => {
    setCanRefresh(false);
    try {
      await refreshContentfulClient();
      await refetch();
      setIsConfigured(true);
    } catch (err) {
      console.error('Failed to refresh Contentful client:', err);
      setIsConfigured(false);
    } finally {
      setTimeout(() => {
        setCanRefresh(true);
      }, 2000);
    }
    return Promise.resolve();
  };

  // Toggle debug information
  const handleToggleDebug = () => {
    setShowDebug(prev => !prev);
  };

  // If Contentful is not configured, show configuration error
  if (!isConfigured) {
    return (
      <ConfigurationError 
        debugInfo={{
          spaceId: process.env.VITE_CONTENTFUL_SPACE_ID || '',
          environmentId: process.env.VITE_CONTENTFUL_ENVIRONMENT || '',
          hasToken: !!process.env.VITE_CONTENTFUL_DELIVERY_TOKEN
        }}
      />
    );
  }

  // If there's an error, show error state
  if (error) {
    return (
      <ProductsError 
        error={error} 
        onRetry={refetch} 
        debugInfo={{
          spaceId: process.env.VITE_CONTENTFUL_SPACE_ID || '',
          environmentId: process.env.VITE_CONTENTFUL_ENVIRONMENT || '',
          hasToken: !!process.env.VITE_CONTENTFUL_DELIVERY_TOKEN
        }}
      />
    );
  }

  // If loading, show loading state
  if (isLoading) {
    return <ProductsLoadingState />;
  }

  // If no products, show empty state
  if (!products || products.length === 0) {
    return (
      <EmptyProductsList 
        debugInfo={{
          spaceId: process.env.VITE_CONTENTFUL_SPACE_ID || ''
        }}
        onRefresh={refetch}
      />
    );
  }

  // Sort products by displayOrder if available
  const sortedProducts = [...products].sort((a, b) => {
    // First by displayOrder if available
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    // Fall back to title
    return a.title.localeCompare(b.title);
  });

  return (
    <ContentfulErrorBoundary contentType="products">
      <div className="flex flex-col min-h-screen">
        <ProductsHero />
        
        <div className="container mx-auto px-4 py-12 flex-grow">
          <PurposeStatement title="Our Products" />
          
          <div className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Our Products</h2>
                <p className="text-gray-600 mt-1">
                  Choose the right vending solution for your business
                </p>
              </div>
            </div>
            
            <ProductGrid products={sortedProducts as CMSProductType[]} />
          </div>
        </div>
      </div>
    </ContentfulErrorBoundary>
  );
};

export default Products;
