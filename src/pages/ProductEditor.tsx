
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
  
  // Enhanced debugging for input issues
  useEffect(() => {
    console.log('[ProductEditorPage] Component mounted, checking for input focus issues...');
    
    // Check for any global event handlers that might be interfering with form inputs
    const inputElements = document.querySelectorAll('input, textarea');
    console.log(`[ProductEditorPage] Found ${inputElements.length} input/textarea elements on page`);
    
    // Log when an input receives focus and track input values
    const handleFocus = (e: Event) => {
      console.log('[ProductEditorPage] Input focus event:', e.target);
    };
    
    const handleChange = (e: Event) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        console.log(`[ProductEditorPage] Input changed: ${e.target.name || 'unnamed'} = ${e.target.value}`);
      }
    };
    
    // Add debug event listeners
    inputElements.forEach(el => {
      el.addEventListener('focus', handleFocus);
      el.addEventListener('input', handleChange);
    });
    
    // Test if direct DOM manipulation works
    setTimeout(() => {
      console.log('[ProductEditorPage] Testing direct DOM access for inputs...');
      const titleInput = document.querySelector('input[name="title"]');
      if (titleInput) {
        console.log('[ProductEditorPage] Found title input directly in DOM');
      } else {
        console.log('[ProductEditorPage] Could not find title input in DOM');
      }
    }, 2000);
    
    return () => {
      // Clean up listeners
      inputElements.forEach(el => {
        el.removeEventListener('focus', handleFocus);
        el.removeEventListener('input', handleChange);
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
