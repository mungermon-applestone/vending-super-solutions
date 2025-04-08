
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
  toastObj: { toast: UseToastReturn['toast'] }, // Update the parameter type here
  navigate: NavigateFunction
) => {
  const [isCreating, setIsCreating] = useState(!productSlug);
  const { data: existingProduct, isLoading: isLoadingProduct, error } = useProductType(productSlug);
  const [formKey, setFormKey] = useState(0); // Add a key to force re-render

  const { toast } = toastObj; // Extract the toast function

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
      
      // First reset the form to clear any previous data
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
      
      console.log('[useProductEditorForm] Form reset with values:', form.getValues());
      
      // Force field updates separately to ensure they're applied
      if (existingProduct.title) form.setValue('title', existingProduct.title);
      if (existingProduct.slug) form.setValue('slug', existingProduct.slug);
      if (existingProduct.description) form.setValue('description', existingProduct.description);
      
      // Force a re-render after populating the form
      setTimeout(() => {
        setFormKey(prev => prev + 1);
        console.log('[useProductEditorForm] Forced re-render with new formKey:', formKey + 1);
      }, 100);
    } else if (productSlug && !existingProduct && !isLoadingProduct) {
      console.log('[useProductEditorForm] No existing product found for slug:', productSlug);
      toast({
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
        await createProduct(data, { toast });
        toast({
          title: "Product created",
          description: `${data.title} has been created successfully.`
        });
        navigate(`/admin/products`);
      } else if (productSlug) {
        console.log(`[useProductEditorForm] Updating product: ${productSlug}`);
        console.log('[useProductEditorForm] Form data for update:', data);
        
        await updateProduct(data, productSlug, { toast });
        
        toast({
          title: "Product updated",
          description: `${data.title} has been updated successfully.`
        });
        
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
      toast({
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
    formKey,
  };
};
