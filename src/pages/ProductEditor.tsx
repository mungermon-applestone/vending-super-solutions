
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductEditorForm from '@/components/admin/product-editor/ProductEditorForm';
import useAdminAlert from '@/hooks/useAdminAlert';
import { useParams } from 'react-router-dom';

const ProductEditorPage = () => {
  const { productSlug } = useParams();
  
  // Show admin alert when accessing this page
  useAdminAlert();
  
  return (
    <Layout>
      <ProductEditorForm productSlug={productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
