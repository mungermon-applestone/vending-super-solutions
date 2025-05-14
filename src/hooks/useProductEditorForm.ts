
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UseToastReturn } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';
import { useProductType } from '@/hooks/cms/useProductTypes';
import { ProductFormData } from '@/types/forms';
import { createProduct, updateProduct } from '@/services/cms/products';
import { CMSProductType } from '@/types/cms';

/**
 * Custom hook for handling product editor form state and operations
 */
export const useProductEditorForm = (
  productSlug: string | undefined,
  setIsLoading: (isLoading: boolean) => void,
  toast: UseToastReturn,
  navigate: NavigateFunction,
  isEditMode?: boolean,
  uuid?: string | null
) => {
  // We're in create mode if explicitly set NOT in edit mode, or if productSlug is falsy ('new' or undefined)
  const isCreatingState = isEditMode === false || !productSlug || productSlug === 'new';
  const [isCreating, setIsCreating] = useState(isCreatingState);
  const [formInitialized, setFormInitialized] = useState(false);
  
  console.log('[useProductEditorForm] Initialized with productSlug:', productSlug);
  console.log('[useProductEditorForm] Initialized with UUID:', uuid);
  console.log('[useProductEditorForm] isEditMode flag:', isEditMode);
  console.log('[useProductEditorForm] isCreating mode:', isCreating);
  
  // Default form values
  const defaultValues: ProductFormData = {
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
  };
  
  // Only fetch product data if we're in edit mode
  const { 
    data: existingProduct, 
    isLoading: isLoadingProduct, 
    error 
  } = useProductType(isCreating ? undefined : productSlug, uuid);
  
  console.log('[useProductEditorForm] Existing product data:', existingProduct);
  
  if (error) {
    console.error('[useProductEditorForm] Error loading product data:', error);
  }

  // Set up form with default values
  const form = useForm<ProductFormData>({
    defaultValues,
    mode: 'onChange', // This makes the form more responsive to changes
  });

  // Force reset form completely when product changes
  useEffect(() => {
    if (productSlug || uuid) {
      console.log('[useProductEditorForm] Product identifier changed');
      // Reset form to clean state
      form.reset(defaultValues);
      setFormInitialized(false);
    }
  }, [productSlug, uuid, form]);

  /**
   * Populate form with existing product data when available
   */
  useEffect(() => {
    if (existingProduct && !isCreating && !formInitialized) {
      console.log('[useProductEditorForm] Populating form with product data:', existingProduct);
      
      try {
        // Deep clone any objects to avoid reference issues
        const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));
        
        // Cast existingProduct to the correct type
        const product = existingProduct as CMSProductType;
        
        // Create a new object from the existing product data to avoid reference issues
        const productData: ProductFormData = {
          title: product.title || '',
          slug: product.slug || '',
          description: product.description || '',
          image: deepClone(product.image) || { url: '', alt: '' },
          benefits: Array.isArray(product.benefits) && product.benefits.length > 0 
            ? [...product.benefits] 
            : [''],
          features: Array.isArray(product.features) && product.features.length > 0 
            ? deepClone(product.features.map(feature => ({
                title: feature.title || '',
                description: feature.description || '',
                icon: typeof feature.icon === 'string' ? feature.icon : 'check',
                screenshotUrl: feature.screenshot?.url || '',
                screenshotAlt: feature.screenshot?.alt || ''
              })))
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
        
        // Complete reset of the form with new values - more reliable than field-by-field setting
        form.reset(productData);
        
        // Mark form as initialized to prevent overwrites
        setFormInitialized(true);

        console.log('[useProductEditorForm] Form reset with values:', form.getValues());
      } catch (err) {
        console.error('[useProductEditorForm] Error when setting form values:', err);
        toast.toast({
          title: "Form Error",
          description: "There was a problem loading the product data into the form.",
          variant: "destructive"
        });
      }
    } else if (productSlug && productSlug !== 'new' && !existingProduct && !isLoadingProduct) {
      console.log('[useProductEditorForm] No existing product found for slug:', productSlug);
      toast.toast({
        title: "Product not found",
        description: `No product found with slug "${productSlug}". Creating a new product instead.`,
        variant: "destructive"
      });
      setIsCreating(true);
    }
  }, [existingProduct, isLoadingProduct, form, productSlug, toast, isCreating, formInitialized]);

  // Form submission handler
  const onSubmit = async (data: ProductFormData) => {
    console.log('[useProductEditorForm] Form submitted with data:', data);
    setIsLoading(true);
    
    try {
      // Create a completely new data object to avoid any reference issues
      const formattedData: ProductFormData = {
        title: data.title.trim(),
        slug: data.slug.trim(),
        description: data.description.trim(),
        // Ensure image is properly formatted
        image: {
          url: data.image?.url || "",
          alt: data.image?.alt || ""
        },
        // Filter out empty benefits
        benefits: Array.isArray(data.benefits) 
          ? [...data.benefits].filter(benefit => benefit && benefit.trim() !== '')
          : [],
        // Clean up features
        features: Array.isArray(data.features)
          ? data.features.filter(feature => feature.title.trim() !== '' || feature.description.trim() !== '')
          : []
      };
      
      console.log('[useProductEditorForm] Cleaned data for submission:', formattedData);
      
      if (isCreating) {
        console.log('[useProductEditorForm] Creating new product');
        await createProduct(formattedData, toast);
        navigate('/admin/products');
      } else if (productSlug && productSlug !== 'new') {
        console.log(`[useProductEditorForm] Updating product: ${productSlug}`);
        
        await updateProduct(formattedData, productSlug, toast);
        navigate('/admin/products');
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
    productId: existingProduct?.id || null
  };
};
