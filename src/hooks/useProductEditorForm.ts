
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { UseToastReturn } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';
import { useProductType } from '@/hooks/useCMSData';
import { ProductFormData } from '@/types/forms';
import { createProduct, updateProduct } from '@/services/productService';

export const useProductEditorForm = (
  productSlug: string | undefined,
  setIsLoading: (isLoading: boolean) => void,
  toast: UseToastReturn,
  navigate: NavigateFunction
) => {
  const [isCreating, setIsCreating] = useState(!productSlug);
  const { data: existingProduct, isLoading: isLoadingProduct, error } = useProductType(productSlug);

  console.log('[useProductEditorForm] Initialized with productSlug:', productSlug);
  console.log('[useProductEditorForm] Existing product data:', existingProduct);
  console.log('[useProductEditorForm] Is loading product:', isLoadingProduct);
  
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
    }
  });

  // Populate form with existing product data when available
  useEffect(() => {
    if (existingProduct && !isCreating) {
      console.log('[useProductEditorForm] Populating form with product data:', existingProduct);
      
      // Reset form with data from existing product
      form.reset({
        title: existingProduct.title || '',
        slug: existingProduct.slug || '',
        description: existingProduct.description || '',
        image: {
          url: existingProduct.image?.url || '',
          alt: existingProduct.image?.alt || ''
        },
        benefits: existingProduct.benefits && existingProduct.benefits.length > 0 
          ? existingProduct.benefits 
          : [''],
        features: existingProduct.features && existingProduct.features.length > 0 
          ? existingProduct.features.map(feature => ({
              title: feature.title || '',
              description: feature.description || '',
              // Ensure icon is always a string
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
      });
      
      console.log('[useProductEditorForm] Form populated with data:', form.getValues());
    } else if (productSlug && !existingProduct && !isLoadingProduct) {
      // If we have a slug but no product was found, and we're not still loading,
      // show an error toast and set to creating mode
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
        toast.toast({
          title: "Product created",
          description: `${data.title} has been created successfully.`
        });
        navigate(`/products/${data.slug}`);
      } else if (productSlug) { // Make sure we have the original slug
        console.log(`[useProductEditorForm] Updating product: ${productSlug}`);
        await updateProduct(data, productSlug, toast);
        toast.toast({
          title: "Product updated",
          description: `${data.title} has been updated successfully.`
        });
        
        // Navigate to the new slug if it changed
        if (data.slug !== productSlug) {
          console.log(`[useProductEditorForm] Slug changed from ${productSlug} to ${data.slug}, navigating to new URL`);
          navigate(`/products/${data.slug}`);
        } else {
          console.log('[useProductEditorForm] Slug unchanged, reloading current page');
          // Use window.location.reload() to force a complete reload of the page
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('[useProductEditorForm] Error saving product:', error);
      toast.toast({
        title: "Error",
        description: `Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isCreating,
    isLoadingProduct,
    form,
    onSubmit,
  };
};
