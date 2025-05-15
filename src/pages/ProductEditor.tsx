
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductEditorForm from '@/components/admin/product-editor/ProductEditorForm';
import useAdminAlert from '@/hooks/useAdminAlert';
import { useProductTypeFromUrl } from '@/hooks/useProductTypeFromUrl';

const ProductEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const { slug, uuid } = useProductTypeFromUrl();
  
  // A product is in edit mode if the slug exists and is not 'new'
  const isEditMode = (!!slug && slug !== 'new') || (!!id && id !== 'new');
  const productSlug = slug || id;
  
  // Show admin alert when accessing this page
  useAdminAlert();
  
  console.log(`[ProductEditorPage] Rendering editor for product: ${productSlug || 'new product'}`);
  console.log(`[ProductEditorPage] Is edit mode: ${isEditMode}`);
  console.log(`[ProductEditorPage] Using product slug: ${productSlug}, uuid: ${uuid || 'none'}`);
  
  return (
    <Layout>
      <ProductEditorForm 
        key={`editor-${productSlug || 'new'}`} 
        productSlug={productSlug === 'new' ? undefined : productSlug}
        uuid={uuid}
        isEditMode={isEditMode}
      />
    </Layout>
  );
};

export default ProductEditorPage;
