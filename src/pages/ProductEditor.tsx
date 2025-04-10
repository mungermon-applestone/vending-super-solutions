
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductEditorForm from '@/components/admin/product-editor/ProductEditorForm';
import useAdminAlert from '@/hooks/useAdminAlert';

const ProductEditorPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const isEditMode = !!productSlug && productSlug !== 'new';
  
  // Show admin alert when accessing this page
  useAdminAlert();
  
  console.log(`[ProductEditorPage] Rendering editor for product: ${productSlug || 'new product'}`);
  console.log(`[ProductEditorPage] Is edit mode: ${isEditMode}`);
  
  // Log when the component mounts or the productSlug changes
  useEffect(() => {
    console.log(`[ProductEditorPage] Product slug from URL params: ${productSlug}`);
    console.log(`[ProductEditorPage] Is this a create or edit operation: ${!isEditMode ? 'create' : 'edit'}`);
  }, [productSlug, isEditMode]);
  
  return (
    <Layout>
      <ProductEditorForm 
        key={`editor-${productSlug || 'new'}`} 
        productSlug={productSlug === 'new' ? undefined : productSlug}
        isEditMode={isEditMode}
      />
    </Layout>
  );
};

export default ProductEditorPage;
