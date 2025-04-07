
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
  
  useEffect(() => {
    console.log('[ProductEditorPage] Page mounted with productSlug:', productSlug);
    console.log(`[ProductEditorPage] Form mode: ${productSlug ? 'edit existing' : 'create new'}`);
    
    // Force all inputs to be editable immediately when rendered
    const makeFormsEditable = () => {
      const formElements = document.querySelectorAll('input, textarea, select');
      console.log(`[ProductEditorPage] Found ${formElements.length} form elements to make editable`);
      
      formElements.forEach((element) => {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.readOnly = false;
          element.disabled = false;
        } else if (element instanceof HTMLSelectElement) {
          element.disabled = false;
        }
      });
    };
    
    // Apply immediately and after a short delay to ensure React has rendered
    makeFormsEditable();
    const timer = setTimeout(makeFormsEditable, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [productSlug]);
  
  return (
    <Layout>
      <ProductEditorForm productSlug={productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
