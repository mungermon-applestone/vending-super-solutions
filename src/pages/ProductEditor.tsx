
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
  
  // Add a useEffect to check the route and form mode
  useEffect(() => {
    console.log('[ProductEditorPage] Page mounted with productSlug:', productSlug);
    console.log(`[ProductEditorPage] Form mode: ${productSlug ? 'edit existing' : 'create new'}`);
    
    // Check DOM for input fields
    setTimeout(() => {
      const inputs = document.querySelectorAll('input');
      const textareas = document.querySelectorAll('textarea');
      
      console.log(`[ProductEditorPage] Found ${inputs.length} inputs and ${textareas.length} textareas`);
      
      inputs.forEach((input, i) => {
        console.log(`[ProductEditorPage] Input #${i}:`, {
          id: input.id,
          name: input.name,
          type: input.type,
          value: input.value,
          readOnly: input.readOnly,
          disabled: input.disabled
        });
      });
      
      textareas.forEach((textarea, i) => {
        console.log(`[ProductEditorPage] Textarea #${i}:`, {
          id: textarea.id,
          name: textarea.name,
          value: textarea.value,
          readOnly: textarea.readOnly,
          disabled: textarea.disabled
        });
      });
    }, 2000);
  }, [productSlug]);
  
  return (
    <Layout>
      <ProductEditorForm productSlug={productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
