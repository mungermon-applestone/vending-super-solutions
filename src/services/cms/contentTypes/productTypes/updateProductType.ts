
import { supabase } from '@/integrations/supabase/client';
import { CMSProductType } from '@/types/cms';

/**
 * Update an existing product type
 * @param id UUID of the product type to update
 * @param data Updated product type data
 * @returns The updated product type
 */
export async function updateProductType(id: string, data: any): Promise<CMSProductType> {
  try {
    console.log(`[CMS:Product Type] updateProductType: Updating product type with ID: ${id}`);
    
    const { data: updatedProductType, error } = await supabase
      .from('product_types')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      console.error('[CMS:Product Type] Error in updateProductType:', error);
      throw error;
    }
    
    console.log(`[CMS:Product Type] updateProductType: Successfully updated product type with ID: ${id}`);
    return updatedProductType as CMSProductType;
  } catch (error) {
    console.error('[CMS:Product Type] Error in updateProductType:', error);
    throw error;
  }
}

export default updateProductType;
