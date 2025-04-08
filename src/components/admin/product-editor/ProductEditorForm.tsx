
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ProductFormData } from '@/types/forms';
import { useProductType } from '@/hooks/useCMSData';
import { createProduct, updateProduct } from '@/services/product';

// Import form sections
import BasicInformation from './sections/BasicInformation';
import ProductImage from './sections/ProductImage';
import ProductBenefits from './sections/ProductBenefits';
import ProductFeatures from './sections/ProductFeatures';

interface ProductEditorFormProps {
  productSlug?: string;
}

const ProductEditorForm = ({ productSlug }: ProductEditorFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isCreating = !productSlug;
  
  // Fetch product data if editing
  const { data: existingProduct, isLoading: isLoadingProduct } = useProductType(productSlug);
  
  console.log('[ProductEditorForm] Rendering with product slug:', productSlug);
  console.log('[ProductEditorForm] Is creating new product:', isCreating);
  
  // Initialize form with default values
  const form = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      image: { url: '', alt: '' },
      benefits: [''],
      features: [{ title: '', description: '', icon: 'check', screenshotUrl: '', screenshotAlt: '' }]
    }
  });
  
  // Populate form with existing product data when available
  useEffect(() => {
    if (existingProduct && !isCreating) {
      console.log('[ProductEditorForm] Populating form with product data:', existingProduct);
      
      // Create a clean object from the existing product data
      const productData: ProductFormData = {
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
          : [{ title: '', description: '', icon: 'check', screenshotUrl: '', screenshotAlt: '' }]
      };
      
      // Reset the form with clean data
      form.reset(productData);
      
      console.log('[ProductEditorForm] Form reset with values:', form.getValues());
    }
  }, [existingProduct, isCreating, form]);

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (data) => {
    console.log('[ProductEditorForm] Form submission with data:', data);
    setIsLoading(true);
    
    try {
      if (isCreating) {
        console.log('[ProductEditorForm] Creating new product');
        await createProduct(data, { toast });
        navigate('/admin/products');
      } else if (productSlug) {
        console.log(`[ProductEditorForm] Updating product: ${productSlug}`);
        await updateProduct(data, productSlug, { toast });
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('[ProductEditorForm] Error saving product:', error);
      // Error toast is handled in the service functions
    } finally {
      setIsLoading(false);
    }
  });

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

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Product' : `Edit Product: ${form.watch('title') || 'Loading...'}`}
      </h1>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <BasicInformation form={form} />
          <ProductImage form={form} />
          <ProductBenefits form={form} />
          <ProductFeatures form={form} />

          <div className="flex justify-end gap-4">
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
