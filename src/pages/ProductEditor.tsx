
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
  
  // Add effect for debugging input issues
  useEffect(() => {
    console.log('[ProductEditorPage] Component mounted, checking for input focus issues...');
    
    // Check for any global event handlers that might be interfering with form inputs
    const inputElements = document.querySelectorAll('input, textarea');
    console.log(`[ProductEditorPage] Found ${inputElements.length} input/textarea elements on page`);
    
    // Log when an input receives focus
    const handleFocus = (e: Event) => {
      console.log('[ProductEditorPage] Input focus event:', e.target);
    };
    
    // Add focus listeners to help debug
    inputElements.forEach(el => {
      el.addEventListener('focus', handleFocus);
    });
    
    return () => {
      // Clean up listeners
      inputElements.forEach(el => {
        el.removeEventListener('focus', handleFocus);
      });
    };
  }, []);
  
  return (
    <Layout>
      <ProductEditorForm productSlug={productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
