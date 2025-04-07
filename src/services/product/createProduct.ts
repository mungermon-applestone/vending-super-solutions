
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';
import type { UseToastReturn } from '@/hooks/use-toast';
import { addProductImage, addProductBenefits, addProductFeatures } from './productHelpers';

/**
 * Create a new product
 */
export const createProduct = async (data: ProductFormData, toast: UseToastReturn) => {
  console.log('[productService] Creating product with data:', data);
  
  try {
    // Check if a product with this slug already exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('product_types')
      .select('id')
      .eq('slug', data.slug)
      .maybeSingle();
    
    if (existingProduct) {
      console.error(`[productService] Product with slug "${data.slug}" already exists`);
      throw new Error(`A product with the slug "${data.slug}" already exists`);
    }
    
    // Create the product type
    const { data: newProductType, error: createError } = await supabase
      .from('product_types')
      .insert({
        title: data.title,
        slug: data.slug,
        description: data.description,
        visible: true
      })
      .select('id')
      .single();

    if (createError || !newProductType) {
      console.error('[productService] Error creating product:', createError);
      throw new Error(createError?.message || 'Failed to create product type');
    }

    console.log('[productService] Created product type:', newProductType);

    // Add product image
    await addProductImage(data, newProductType.id);
    
    // Add product benefits
    await addProductBenefits(data, newProductType.id);
    
    // Add product features
    await addProductFeatures(data, newProductType.id);
    
    return newProductType.id;
  } catch (error) {
    console.error('[productService] Error in createProduct:', error);
    throw error;
  }
};
