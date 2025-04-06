
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductEditor from '@/components/admin/ProductEditor';
import useAdminAlert from '@/hooks/useAdminAlert';
import { useParams } from 'react-router-dom';

const ProductEditorPage = () => {
  const { productSlug } = useParams();
  const isEditing = Boolean(productSlug);
  
  // Show admin alert when accessing this page
  useAdminAlert();
  
  return (
    <Layout>
      <ProductEditor productSlug={productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
