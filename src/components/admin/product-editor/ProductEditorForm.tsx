
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
import useKeepFormsEditable from '@/hooks/useKeepFormsEditable';

interface ProductEditorFormProps {
  productSlug?: string;
}

const ProductEditorForm = ({ productSlug }: ProductEditorFormProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isCreating, form, onSubmit, formKey } = useProductEditorForm(productSlug, setIsLoading, toast, navigate);
  
  // Use our aggressive form editable hook
  useKeepFormsEditable();

  useEffect(() => {
    console.log('[ProductEditorForm] Component mounted or updated with formKey:', formKey);
    console.log('[ProductEditorForm] Mode:', isCreating ? 'create' : 'edit');
    console.log('[ProductEditorForm] Product slug:', productSlug);
    console.log('[ProductEditorForm] Form values:', form.getValues());
    
    // Direct approach as a backup
    const makeAllFieldsEditable = () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
          input.readOnly = false;
          input.disabled = false;
          input.setAttribute('data-forced-editable', 'true');
        }
        if (input instanceof HTMLSelectElement) {
          input.disabled = false;
          input.setAttribute('data-forced-editable', 'true');
        }
      });
      console.log('[ProductEditorForm] Directly made all fields editable:', inputs.length);
    };
    
    // Run immediately and after a delay
    makeAllFieldsEditable();
    setTimeout(makeAllFieldsEditable, 1000);
  }, [isCreating, form, productSlug, formKey]);

  // Handle form submission with validation
  const handleSubmit = form.handleSubmit(async (data) => {
    console.log('[ProductEditorForm] Form submission with data:', data);
    // Log form state for debugging
    console.log('[ProductEditorForm] Form state on submit:', {
      isDirty: form.formState.isDirty,
      dirtyFields: form.formState.dirtyFields,
      touchedFields: form.formState.touchedFields,
    });
    
    // Make sure the form is marked as dirty to ensure submission works
    if (!form.formState.isDirty) {
      console.log('[ProductEditorForm] Form not dirty, manually marking as dirty');
      Object.keys(data).forEach(field => {
        // @ts-ignore - We need to access fields dynamically
        form.setValue(field, data[field], { shouldDirty: true });
      });
    }
    
    await onSubmit(data);
  });

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Product' : `Edit Product: ${form.watch('title') || 'Loading...'}`}
      </h1>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
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
              onClick={() => {
                console.log('[ProductEditorForm] Save button clicked');
                console.log('[ProductEditorForm] Current form values:', form.getValues());
              }}
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
