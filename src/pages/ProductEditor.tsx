
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductEditorForm from '@/components/admin/product-editor/ProductEditorForm';
import useAdminAlert from '@/hooks/useAdminAlert';
import useKeepFormsEditable from '@/hooks/useKeepFormsEditable';

const ProductEditorPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  // A product is in edit mode if the slug exists and is not 'new'
  const isEditMode = !!productSlug && productSlug !== 'new';
  
  // Show admin alert when accessing this page
  useAdminAlert();
  
  // Apply the hook that keeps form fields editable
  useKeepFormsEditable();
  
  console.log(`[ProductEditorPage] Rendering editor for product: ${productSlug || 'new product'}`);
  console.log(`[ProductEditorPage] Is edit mode: ${isEditMode}`);
  
  // Log when the component mounts or the productSlug changes
  useEffect(() => {
    console.log(`[ProductEditorPage] Product slug from URL params: ${productSlug}`);
    console.log(`[ProductEditorPage] Is this a create or edit operation: ${!isEditMode ? 'create' : 'edit'}`);
    
    // Additional step to ensure form remains editable
    setTimeout(() => {
      console.log('[ProductEditorPage] Ensuring form is editable after mount');
      document.querySelectorAll('input, textarea, select').forEach(el => {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          el.readOnly = false;
          el.disabled = false;
        } else if (el instanceof HTMLSelectElement) {
          el.disabled = false;
        }
      });
    }, 1000);
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
