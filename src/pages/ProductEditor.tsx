
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
    
    // Add MutationObserver to detect DOM changes and ensure inputs remain editable
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          const inputs = document.querySelectorAll('input');
          const textareas = document.querySelectorAll('textarea');
          
          console.log(`[ProductEditorPage] DOM changed, ensuring ${inputs.length} inputs and ${textareas.length} textareas are editable`);
          
          // Force all inputs to be editable
          inputs.forEach((input) => {
            if (input.readOnly || input.disabled) {
              console.log(`[ProductEditorPage] Making input editable:`, input.name || input.id);
              input.readOnly = false;
              input.disabled = false;
            }
          });
          
          // Force all textareas to be editable
          textareas.forEach((textarea) => {
            if (textarea.readOnly || textarea.disabled) {
              console.log(`[ProductEditorPage] Making textarea editable:`, textarea.name || textarea.id);
              textarea.readOnly = false;
              textarea.disabled = false;
            }
          });
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['readonly', 'disabled']
    });
    
    // Cleanup function to disconnect observer
    return () => {
      observer.disconnect();
    };
  }, [productSlug]);
  
  return (
    <Layout>
      <ProductEditorForm productSlug={productSlug} />
    </Layout>
  );
};

export default ProductEditorPage;
