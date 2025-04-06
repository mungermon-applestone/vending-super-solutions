
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
  const toast = useToast(); // Don't destructure, use the whole object
  const [isLoading, setIsLoading] = useState(false);
  const { isCreating, form, onSubmit } = useProductEditorForm(productSlug, setIsLoading, toast, navigate);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Product' : `Edit Product: ${form.watch('title')}`}
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
