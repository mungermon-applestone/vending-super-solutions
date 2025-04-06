
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductHeroSection from '@/components/products/ProductHeroSection';
import ProductFeaturesList from '@/components/products/ProductFeaturesList';
import ProductExamples from '@/components/products/ProductExamples';
import ProductVideoSection from '@/components/products/ProductVideoSection';
import CTASection from '@/components/common/CTASection';
import { useProductType } from '@/hooks/useCMSData';
import ProductDetailSkeleton from '@/components/products/ProductDetailSkeleton';
import { useProductTypeFromUrl } from '@/hooks/useProductTypeFromUrl';
import { productFallbacks } from '@/data/productFallbacks';

const ProductDetail = () => {
  const navigate = useNavigate();
  const productType = useProductTypeFromUrl();
  
  console.log("ProductDetail rendering for product type:", productType);
  
  // Use the hook from useCMSData with clearer enabled condition
  const { data: productTypeData, isLoading, error, refetch } = useProductType(productType);
  
  // Log what we're receiving from the API to help debug
  useEffect(() => {
    console.log("Product data from API:", {
      productTypeData,
      isLoading,
      error,
      slug: productType
    });
    
    if (error) {
      console.error("Error loading product data:", error);
    }
  }, [productTypeData, isLoading, error, productType]);
  
  // Force refetch when product type changes
  useEffect(() => {
    if (productType) {
      console.log(`ProductDetail: Product type changed to ${productType}, refetching data`);
      refetch();
    }
  }, [productType, refetch]);
  
  // Use CMS data if available, otherwise try fallbacks, default to grocery
  const fallbackData = productFallbacks[productType] || productFallbacks['grocery'];
  const currentProductData = productTypeData || fallbackData;
  
  if (isLoading) {
    return (
      <Layout>
        <ProductDetailSkeleton />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <ProductHeroSection 
        productType={currentProductData.title}
        description={currentProductData.description}
        image={currentProductData.image.url}
        benefits={currentProductData.benefits}
      />
      
      <ProductFeaturesList features={currentProductData.features} />
      
      {currentProductData.examples && currentProductData.examples.length > 0 && (
        <ProductExamples examples={currentProductData.examples} />
      )}
      
      {currentProductData.video && (
        <ProductVideoSection
          title={currentProductData.video.title}
          description={currentProductData.video.description}
          thumbnailImage={currentProductData.video.thumbnailImage.url}
        />
      )}
      
      <CTASection />
    </Layout>
  );
};

export default ProductDetail;
