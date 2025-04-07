
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductEditorForm from '@/components/admin/product-editor/ProductEditorForm';
import useAdminAlert from '@/hooks/useAdminAlert';
import useKeepFormsEditable from '@/hooks/useKeepFormsEditable';

const ProductEditorPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  
  // Show admin alert when accessing this page
  useAdminAlert();
  
  // Use our custom hook to ensure forms stay editable
  useKeepFormsEditable();
  
  console.log(`[ProductEditorPage] Rendering editor for product: ${productSlug || 'new product'}`);
  
  useEffect(() => {
    console.log('[ProductEditorPage] Page mounted with productSlug:', productSlug);
    console.log(`[ProductEditorPage] Form mode: ${productSlug ? 'edit existing' : 'create new'}`);
    
    // Add class to the body to help identify this is an editor page
    document.body.classList.add('product-editor-page');
    
    return () => {
      document.body.classList.remove('product-editor-page');
    };
  }, [productSlug]);
  
  return (
    <Layout>
      <ProductEditorForm productSlug={productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
