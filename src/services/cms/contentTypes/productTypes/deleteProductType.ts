
import { supabase } from '@/integrations/supabase/client';

/**
 * Deletes a product type from the database
 * @param slug Slug of the product type to delete
 * @returns True if successful, throws error otherwise
 */
export const deleteProductType = async (slug: string): Promise<boolean> => {
  console.log(`[deleteProductType] Deleting product type with slug: ${slug}`);
  
  try {
    // First, fetch the product to get its ID
    const { data: productType, error: fetchError } = await supabase
      .from('product_types')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (fetchError) {
      console.error('[deleteProductType] Error fetching product type:', fetchError);
      throw new Error(`Product type with slug '${slug}' not found`);
    }
    
    const productTypeId = productType.id;
    
    // Delete the product type
    const { error: deleteError } = await supabase
      .from('product_types')
      .delete()
      .eq('id', productTypeId);
      
    if (deleteError) {
      console.error('[deleteProductType] Error deleting product type:', deleteError);
      throw new Error(`Failed to delete product type: ${deleteError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('[deleteProductType] Error:', error);
    throw error;
  }
};
