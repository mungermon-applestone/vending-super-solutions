
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a product type from the database
 * @param id The UUID of the product type to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export async function deleteProductType(id: string): Promise<boolean> {
  console.log(`[deleteProductType] Attempting to delete product type with ID: ${id}`);
  
  if (!id) {
    console.error('[deleteProductType] No ID provided');
    return false;
  }
  
  try {
    // Delete the product type
    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('[deleteProductType] Error deleting product type:', error);
      return false;
    }
    
    console.log(`[deleteProductType] Successfully deleted product type with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('[deleteProductType] Error deleting product type:', error);
    return false;
  }
}
