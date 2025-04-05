
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductEditor from '@/components/admin/ProductEditor';
import useAdminAlert from '@/hooks/useAdminAlert';

const ProductEditorPage = () => {
  // Show admin alert when accessing this page
  useAdminAlert();
  
  return (
    <Layout>
      <ProductEditor />
    </Layout>
  );
};

export default ProductEditorPage;
