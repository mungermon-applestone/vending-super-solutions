
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Form } from '@/components/ui/form';

import BasicInformation from './sections/BasicInformation';
import ProductImage from './sections/ProductImage';
import ProductBenefits from './sections/ProductBenefits';
import ProductFeatures from './sections/ProductFeatures';
import { useProductEditorForm } from '@/hooks/useProductEditorForm';

interface ProductEditorFormProps {
  productSlug?: string;
}

const ProductEditorForm = ({ productSlug }: ProductEditorFormProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a local key to force remounts when needed
  const [localFormKey, setLocalFormKey] = useState(0);
  
  // Pass the entire toast object returned from useToast()
  const { isCreating, isLoadingProduct, form, onSubmit, formKey } = useProductEditorForm(
    productSlug, 
    setIsLoading, 
    toast, // Pass the complete toast object
    navigate
  );

  console.log('[ProductEditorForm] Rendering with form values:', form.getValues());

  // Force re-render when formKey changes to ensure form is properly initialized
  useEffect(() => {
    console.log('[ProductEditorForm] Form key changed:', formKey);
    // Force a re-render of this component when the formKey changes
    setLocalFormKey(prevKey => prevKey + 1);
  }, [formKey]);

  // Handle form submission with validation
  const handleSubmit = form.handleSubmit(async (data) => {
    console.log('[ProductEditorForm] Form submission with data:', data);
    
    // Ensure the form is marked as dirty for submission
    Object.keys(data).forEach(field => {
      // @ts-ignore - We need to access fields dynamically
      form.setValue(field, data[field], { shouldDirty: true, shouldTouch: true });
    });
    
    await onSubmit(data);
  });

  // Display loading state while fetching product data
  if (isLoadingProduct && !isCreating) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Loading Product Data...</h1>
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10" key={`form-container-${localFormKey}`}>
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Product' : `Edit Product: ${form.watch('title') || 'Loading...'}`}
      </h1>

      <Form {...form}>
        <form 
          onSubmit={handleSubmit} 
          className="space-y-8" 
          key={`form-element-${localFormKey}`}
        >
          <BasicInformation form={form} />
          <ProductImage form={form} />
          <ProductBenefits form={form} />
          <ProductFeatures form={form} />

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/products')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="gap-2"
            >
              {isLoading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Product</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductEditorForm;
