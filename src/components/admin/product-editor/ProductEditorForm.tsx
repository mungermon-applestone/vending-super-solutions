
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save, Copy } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useProductEditorForm } from '@/hooks/useProductEditorForm';
import { useCloneProductType } from '@/hooks/cms/useCloneCMS';

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
  const [isCloning, setIsCloning] = useState(false);
  const cloneProductMutation = useCloneProductType();
  
  console.log('[ProductEditorForm] Rendering with product slug:', productSlug);
  console.log('[ProductEditorForm] isEditMode flag:', isEditMode);
  
  // Use our custom hook for form handling
  const { 
    isCreating, 
    isLoadingProduct, 
    form, 
    onSubmit,
    productId
  } = useProductEditorForm(productSlug, setIsLoading, toast, navigate, isEditMode);

  const handleFormSubmit = form.handleSubmit((data) => {
    console.log('[ProductEditorForm] Form submitted with data:', data);
    onSubmit(data);
  });

  const handleCloneProduct = async () => {
    if (!productId) return;
    
    try {
      setIsCloning(true);
      const clonedProduct = await cloneProductMutation.mutateAsync(productId);
      
      if (clonedProduct) {
        toast.toast({
          title: "Product cloned",
          description: `Product has been cloned successfully.`
        });
        
        // Navigate to the newly cloned product
        navigate(`/admin/products/edit/${clonedProduct.slug}`);
      }
    } catch (error) {
      console.error("Error cloning product:", error);
      toast.toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clone product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCloning(false);
    }
  };

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

  // Debug form values
  console.log('[ProductEditorForm] Current form values:', form.getValues());

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Product' : `Edit Product: ${form.watch('title') || 'Loading...'}`}
      </h1>

      <Form {...form}>
        <form 
          onSubmit={handleFormSubmit} 
          className="space-y-8"
        >
          <BasicInformation form={form} />
          <ProductImage form={form} />
          <ProductBenefits form={form} />
          <ProductFeatures form={form} />

          <div className="flex justify-end gap-4">
            {!isCreating && productId && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCloneProduct}
                disabled={isLoading || isCloning}
                className="gap-2 mr-auto"
              >
                {isCloning ? 'Cloning...' : <><Copy className="h-4 w-4" /> Clone Product</>}
              </Button>
            )}
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
