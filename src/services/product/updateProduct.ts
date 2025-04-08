import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';
import type { UseToastReturn } from '@/hooks/use-toast';
import { registerSlugChange } from '@/services/cms/utils/slugMatching';
import { updateProductImage, updateProductBenefits, updateProductFeatures } from './productHelpers';

/**
 * Update an existing product
 */
export const updateProduct = async (data: ProductFormData, originalSlug: string, { toast }: UseToastReturn) => {
  console.log('[productService] Updating product:', originalSlug, 'with data:', data);
  
  try {
    // First get the product ID from the original slug
    const { data: productData, error: fetchError } = await supabase
      .from('product_types')
      .select('id, slug')
      .eq('slug', originalSlug)
      .maybeSingle();

    // If the product doesn't exist, throw an error
    if (!productData) {
      console.error(`[productService] Product with slug "${originalSlug}" not found`);
      throw new Error(`Product with slug "${originalSlug}" not found`);
    }

    const productId = productData.id;
    console.log('[productService] Found product ID for update:', productId);

    // If the slug is being changed, check that the new slug doesn't already exist
    // (skip this check if the slug isn't changing)
    if (data.slug !== originalSlug) {
      const { data: existingWithNewSlug, error: slugCheckError } = await supabase
        .from('product_types')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', productId) // Exclude the current product
        .maybeSingle();
      
      if (existingWithNewSlug) {
        console.error(`[productService] Cannot update: slug "${data.slug}" already in use by another product`);
        throw new Error(`The slug "${data.slug}" is already in use by another product`);
      }
      
      // Register the slug change for future lookups
      registerSlugChange(originalSlug, data.slug);
      console.log(`[productService] Registered slug change: "${originalSlug}" -> "${data.slug}"`);
    }

    // Update the product type
    const { error: updateError } = await supabase
      .from('product_types')
      .update({
        title: data.title,
        slug: data.slug,
        description: data.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) {
      console.error('[productService] Error updating product:', updateError);
      throw new Error(updateError.message);
    }

    console.log('[productService] Product type updated successfully');
    
    // Update product image
    await updateProductImage(data, productId);
    
    // Update product benefits
    await updateProductBenefits(data, productId);
    
    // Update product features
    await updateProductFeatures(data, productId);
    
    return productId;
  } catch (error) {
    console.error('[productService] Error in updateProduct:', error);
    throw error;
  }
};
