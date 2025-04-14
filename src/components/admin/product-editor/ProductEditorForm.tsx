
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save, Copy, AlertCircle } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useProductEditorForm } from '@/hooks/useProductEditorForm';
import { useCloneProductType } from '@/hooks/cms/useCloneCMS';
import { Separator } from '@/components/ui/separator';

// Import form sections
import BasicInformation from './sections/BasicInformation';
import ProductImage from './sections/ProductImage';
import ProductBenefits from './sections/ProductBenefits';
import ProductFeatures from './sections/ProductFeatures';

interface ProductEditorFormProps {
  productSlug?: string;
  uuid?: string | null;
  isEditMode?: boolean;
}

const ProductEditorForm = ({ productSlug, uuid, isEditMode }: ProductEditorFormProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const cloneProductMutation = useCloneProductType();
  
  // Use our custom hook for form handling
  const { 
    isCreating, 
    isLoadingProduct, 
    form, 
    onSubmit,
    productId
  } = useProductEditorForm(productSlug, setIsLoading, toast, navigate, isEditMode, uuid);

  // Debug to track form value changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('[ProductEditorForm] Form values changed:', value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Force re-render the form when product changes
  useEffect(() => {
    console.log(`[ProductEditorForm] Product slug changed to: ${productSlug || 'new'}`);
    console.log(`[ProductEditorForm] Product uuid changed to: ${uuid || 'none'}`);
    setFormKey(prevKey => prevKey + 1);
  }, [productSlug, uuid]);

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

  // Calculate if the form has any errors
  const hasFormErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Product' : `Edit Product: ${form.watch('title') || 'Loading...'}`}
      </h1>
      
      {hasFormErrors && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6 flex gap-2 items-center">
          <AlertCircle className="h-5 w-5" />
          <p>Please fix the errors in the form before submitting.</p>
        </div>
      )}

      <Form {...form}>
        <form 
          onSubmit={handleFormSubmit} 
          className="space-y-8"
          key={`${formKey}-${productSlug || 'new'}`}
        >
          <BasicInformation form={form} />
          <Separator className="my-8" />
          <ProductImage form={form} />
          <Separator className="my-8" />
          <ProductBenefits form={form} />
          <Separator className="my-8" />
          <ProductFeatures form={form} />

          <div className="flex justify-end gap-4 pt-4">
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
              disabled={isLoading || hasFormErrors} 
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
