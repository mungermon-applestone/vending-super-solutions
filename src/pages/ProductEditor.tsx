
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductEditorForm from '@/components/admin/product-editor/ProductEditorForm';
import useAdminAlert from '@/hooks/useAdminAlert';

const ProductEditorPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  
  // Show admin alert when accessing this page
  useAdminAlert();
  
  console.log(`[ProductEditorPage] Rendering editor for product: ${productSlug || 'new product'}`);
  
  // Log when the component mounts or the productSlug changes
  useEffect(() => {
    console.log(`[ProductEditorPage] Product slug from URL params: ${productSlug}`);
    console.log(`[ProductEditorPage] Is this a create or edit operation: ${!productSlug || productSlug === 'new' ? 'create' : 'edit'}`);
  }, [productSlug]);
  
  return (
    <Layout>
      <ProductEditorForm key={`editor-${productSlug || 'new'}`} productSlug={productSlug === 'new' ? undefined : productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
