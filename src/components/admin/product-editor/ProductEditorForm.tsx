import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useProductEditorForm } from '@/hooks/useProductEditorForm';
import useKeepFormsEditable from '@/hooks/useKeepFormsEditable';

// Import form sections
import BasicInformation from './sections/BasicInformation';
import ProductImage from './sections/ProductImage';
import ProductBenefits from './sections/ProductBenefits';
import ProductFeatures from './sections/ProductFeatures';

interface ProductEditorFormProps {
  productSlug?: string;
  isEditMode?: boolean;
}

const ProductEditorForm = ({ productSlug, isEditMode }: ProductEditorFormProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply the hook that keeps form fields editable
  useKeepFormsEditable();
  
  // Log that we're trying to edit a specific product
  console.log('[ProductEditorForm] Rendering with product slug:', productSlug);
  console.log('[ProductEditorForm] isEditMode flag:', isEditMode);
  
  // Use our custom hook for form handling
  const { 
    isCreating, 
    isLoadingProduct, 
    form, 
    onSubmit 
  } = useProductEditorForm(productSlug, setIsLoading, toast, navigate, isEditMode);

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
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Product' : `Edit Product: ${form.watch('title') || 'Loading...'}`}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
