
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UseToastReturn } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';
import { useProductType } from '@/hooks/useCMSData';
import { ProductFormData } from '@/types/forms';
import { createProduct, updateProduct } from '@/services/product';

export const useProductEditorForm = (
  productSlug: string | undefined,
  setIsLoading: (isLoading: boolean) => void,
  toast: UseToastReturn,
  navigate: NavigateFunction,
  isEditMode?: boolean
) => {
  // We're in create mode if explicitly set NOT in edit mode, or if productSlug is falsy ('new' or undefined)
  const isCreatingState = isEditMode === false || !productSlug || productSlug === 'new';
  const [isCreating, setIsCreating] = useState(isCreatingState);
  
  console.log('[useProductEditorForm] Initialized with productSlug:', productSlug);
  console.log('[useProductEditorForm] isEditMode flag:', isEditMode);
  console.log('[useProductEditorForm] isCreating mode:', isCreating);
  
  // Only fetch product data if we're in edit mode
  const { 
    data: existingProduct, 
    isLoading: isLoadingProduct, 
    error 
  } = useProductType(isCreating ? undefined : productSlug);
  
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
  });

  // Populate form with existing product data when available
  useEffect(() => {
    if (existingProduct && !isCreating) {
      console.log('[useProductEditorForm] Populating form with product data:', existingProduct);
      
      // Create a new object from the existing product data to avoid reference issues
      const productData = {
        title: existingProduct.title || '',
        slug: existingProduct.slug || '',
        description: existingProduct.description || '',
        image: {
          url: existingProduct.image?.url || '',
          alt: existingProduct.image?.alt || ''
        },
        benefits: existingProduct.benefits && existingProduct.benefits.length > 0 
          ? [...existingProduct.benefits] 
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
      };
      
      // Reset the form with clean data
      form.reset(productData);
      
      console.log('[useProductEditorForm] Form reset with values:', form.getValues());
    } else if (productSlug && productSlug !== 'new' && !existingProduct && !isLoadingProduct) {
      console.log('[useProductEditorForm] No existing product found for slug:', productSlug);
      toast.toast({
        title: "Product not found",
        description: `No product found with slug "${productSlug}". Creating a new product instead.`,
        variant: "destructive"
      });
      setIsCreating(true);
    }
  }, [existingProduct, isLoadingProduct, form, productSlug, toast, isCreating]);

  // Form submission handler
  const onSubmit = async (data: ProductFormData) => {
    console.log('[useProductEditorForm] Form submitted with data:', data);
    setIsLoading(true);
    
    try {
      if (isCreating) {
        console.log('[useProductEditorForm] Creating new product');
        await createProduct(data, toast);
        navigate(`/admin/products`);
      } else if (productSlug && productSlug !== 'new') {
        console.log(`[useProductEditorForm] Updating product: ${productSlug}`);
        console.log('[useProductEditorForm] Form data for update:', data);
        
        await updateProduct(data, productSlug, toast);
        navigate(`/admin/products`);
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
    onSubmit
  };
};
