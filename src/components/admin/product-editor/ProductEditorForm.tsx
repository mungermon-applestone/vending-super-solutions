
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
  const { isCreating, form, onSubmit } = useProductEditorForm(productSlug, setIsLoading, toast, navigate);

  // Add debugging information
  useEffect(() => {
    console.log('[ProductEditorForm] Mounting with mode:', isCreating ? 'create' : 'edit');
    console.log('[ProductEditorForm] Initial form values:', form.getValues());
    console.log('[ProductEditorForm] Product slug:', productSlug);
    
    // Check if form fields are read-only
    setTimeout(() => {
      const formFields = document.querySelectorAll('input, textarea');
      console.log('[ProductEditorForm] Found form fields:', formFields.length);
      formFields.forEach((field, index) => {
        const isReadOnly = (field as HTMLInputElement).readOnly;
        const isDisabled = (field as HTMLInputElement).disabled;
        console.log(`[ProductEditorForm] Field ${index}: readOnly=${isReadOnly}, disabled=${isDisabled}, name=${field.getAttribute('name')}`);
      });
    }, 1000);
    
    // Register event handlers to track form interactions
    const formElement = document.querySelector('form');
    if (formElement) {
      const handleFormClick = (e: Event) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          console.log('[ProductEditorForm] Input clicked:', 
            e.target.name || e.target.id, 
            'Current value:', e.target.value,
            'ReadOnly:', e.target.readOnly,
            'Disabled:', e.target.disabled);
        }
      };
      
      formElement.addEventListener('click', handleFormClick);
      return () => {
        formElement.removeEventListener('click', handleFormClick);
      };
    }
  }, [isCreating, form, productSlug]);

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
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Product</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductEditorForm;
