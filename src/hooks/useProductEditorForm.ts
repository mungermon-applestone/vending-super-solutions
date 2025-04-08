
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UseToastReturn } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';
import { useProductType } from '@/hooks/useCMSData';
import { ProductFormData } from '@/types/forms';
import { createProduct, updateProduct } from '@/services/product';
import { registerSlugChange } from '@/services/cms/utils/slugMatching';

export const useProductEditorForm = (
  productSlug: string | undefined,
  setIsLoading: (isLoading: boolean) => void,
  toast: UseToastReturn,
  navigate: NavigateFunction
) => {
  const [isCreating, setIsCreating] = useState(!productSlug);
  const { data: existingProduct, isLoading: isLoadingProduct, error } = useProductType(productSlug);
  const [formKey, setFormKey] = useState(Date.now()); // Use timestamp for more unique keys

  console.log('[useProductEditorForm] Initialized with productSlug:', productSlug);
  console.log('[useProductEditorForm] isCreating mode:', isCreating);
  console.log('[useProductEditorForm] Existing product data:', existingProduct);
  
  if (error) {
    console.error('[useProductEditorForm] Error loading product data:', error);
  }

  // Set up form with default values
  const form = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      image: {
        url: '',
        alt: ''
      },
      benefits: [''],
      features: [
        {
          title: '',
          description: '',
          icon: 'check',
          screenshotUrl: '',
          screenshotAlt: ''
        }
      ]
    },
    mode: 'onChange',
  });

  // Populate form with existing product data when available
  useEffect(() => {
    if (existingProduct && !isCreating) {
      console.log('[useProductEditorForm] Populating form with product data:', existingProduct);
      
      // Deep clone the data to avoid reference issues
      const productData = JSON.parse(JSON.stringify(existingProduct));
      
      // Reset the form with the cloned data
      form.reset({
        title: productData.title || '',
        slug: productData.slug || '',
        description: productData.description || '',
        image: {
          url: productData.image?.url || '',
          alt: productData.image?.alt || ''
        },
        benefits: productData.benefits && productData.benefits.length > 0 
          ? [...productData.benefits] 
          : [''],
        features: productData.features && productData.features.length > 0 
          ? productData.features.map(feature => ({
              title: feature.title || '',
              description: feature.description || '',
              icon: typeof feature.icon === 'string' ? feature.icon : 'check',
              screenshotUrl: feature.screenshot?.url || '',
              screenshotAlt: feature.screenshot?.alt || ''
            })) 
          : [
              {
                title: '',
                description: '',
                icon: 'check',
                screenshotUrl: '',
                screenshotAlt: ''
              }
            ]
      }, { 
        keepDirty: false,
        keepValues: false
      });
      
      console.log('[useProductEditorForm] Form reset with values:', form.getValues());
      
      // Force a re-render after populating the form by updating the form key
      setFormKey(Date.now());
      console.log('[useProductEditorForm] Updated form key to force re-render:', formKey);
    } else if (productSlug && !existingProduct && !isLoadingProduct) {
      console.log('[useProductEditorForm] No existing product found for slug:', productSlug);
      toast.toast({
        title: "Product not found",
        description: `No product found with slug "${productSlug}". Creating a new product instead.`,
        variant: "destructive"
      });
      setIsCreating(true);
    }
  }, [existingProduct, isCreating, isLoadingProduct, form, productSlug, toast]);

  // Form submission handler
  const onSubmit = async (data: ProductFormData) => {
    console.log('[useProductEditorForm] Form submitted with data:', data);
    setIsLoading(true);
    
    try {
      if (isCreating) {
        console.log('[useProductEditorForm] Creating new product');
        await createProduct(data, toast);
        navigate(`/admin/products`);
      } else if (productSlug) {
        console.log(`[useProductEditorForm] Updating product: ${productSlug}`);
        console.log('[useProductEditorForm] Form data for update:', data);
        
        await updateProduct(data, productSlug, toast);
        
        // Navigate to the new slug if it changed
        if (data.slug !== productSlug) {
          console.log(`[useProductEditorForm] Slug changed from ${productSlug} to ${data.slug}, navigating to new URL`);
          registerSlugChange(productSlug, data.slug);
          navigate(`/admin/products`);
        } else {
          console.log('[useProductEditorForm] Update successful, navigating to products list');
          navigate(`/admin/products`);
        }
      }
    } catch (error) {
      console.error('[useProductEditorForm] Error saving product:', error);
      // Error toast is handled in the service functions
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isCreating,
    isLoadingProduct,
    form,
    onSubmit,
    formKey,
  };
};
