
import { supabase } from '@/integrations/supabase/client';
import { handleCMSError, logCMSOperation } from '../types';
import { CMSProductType } from '@/types/cms';

/**
 * Update an existing product type
 * @param id UUID of the product type to update
 * @param data Updated product type data
 * @returns The updated product type
 */
export async function updateProductType(id: string, data: any): Promise<CMSProductType> {
  try {
    logCMSOperation('updateProductType', 'Product Type', `Updating product type with ID: ${id}`);
    
    const { data: updatedProductType, error } = await supabase
      .from('product_types')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      handleCMSError('updateProductType', 'Product Type', error);
      throw error;
    }
    
    logCMSOperation('updateProductType', 'Product Type', `Successfully updated product type with ID: ${id}`);
    return updatedProductType as CMSProductType;
  } catch (error) {
    handleCMSError('updateProductType', 'Product Type', error);
    throw error;
  }
}
