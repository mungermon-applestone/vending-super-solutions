import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductEditorForm from '@/components/admin/product-editor/ProductEditorForm';
import useAdminAlert from '@/hooks/useAdminAlert';
import { useKeepFormsEditable } from '@/hooks/useKeepFormsEditable';

const ProductEditorPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  
  // Show admin alert when accessing this page
  useAdminAlert();
  
  // Keep forms editable
  useKeepFormsEditable();
  
  console.log(`[ProductEditorPage] Rendering editor for product: ${productSlug || 'new product'}`);
  
  return (
    <Layout>
      <ProductEditorForm productSlug={productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
