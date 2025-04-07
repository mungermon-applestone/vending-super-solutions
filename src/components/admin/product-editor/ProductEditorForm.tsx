
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

  useEffect(() => {
    console.log('[ProductEditorForm] Component mounted. Mode:', isCreating ? 'create' : 'edit');
    console.log('[ProductEditorForm] Product slug:', productSlug);
    console.log('[ProductEditorForm] Initial form values:', form.getValues());
    
    // Direct approach to ensure form fields are editable
    const ensureEditableFields = () => {
      setTimeout(() => {
        const formElements = document.querySelectorAll('input, textarea, select');
        console.log(`[ProductEditorForm] Found ${formElements.length} form elements to make editable`);
        
        formElements.forEach(element => {
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            element.readOnly = false;
            element.disabled = false;
            console.log(`[ProductEditorForm] Made ${element.name || element.id || 'unnamed'} editable`);
          } else if (element instanceof HTMLSelectElement) {
            element.disabled = false;
            console.log(`[ProductEditorForm] Made ${element.name || element.id || 'unnamed'} editable`);
          }
        });
      }, 300); // Short delay to ensure the form is rendered
    };
    
    ensureEditableFields();
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
