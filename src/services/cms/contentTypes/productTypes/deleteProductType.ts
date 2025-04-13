
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a product type by ID
 * @param id ID of the product type to delete
 * @returns True if deletion was successful
 */
export async function deleteProductType(id: string): Promise<boolean> {
  try {
    console.log(`[CMS:Product Type] deleteProductType: Deleting product type with ID: ${id}`);
    
    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('[CMS:Product Type] Error in deleteProductType:', error);
      throw error;
    }
    
    console.log(`[CMS:Product Type] deleteProductType: Successfully deleted product type with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('[CMS:Product Type] Error in deleteProductType:', error);
    throw error;
  }
}

export default deleteProductType;
