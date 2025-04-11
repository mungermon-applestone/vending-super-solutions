
import { supabase } from '@/integrations/supabase/client';
import { handleCMSError, logCMSOperation } from '../types';

/**
 * Update an existing product type
 * @param id UUID of the product type to update
 * @param data Updated product type data
 * @returns Boolean indicating success
 */
export async function updateProductType(id: string, data: any): Promise<boolean> {
  try {
    logCMSOperation('updateProductType', 'Product Type', `Updating product type with ID: ${id}`);
    
    const { error } = await supabase
      .from('product_types')
      .update(data)
      .eq('id', id);
      
    if (error) {
      handleCMSError('updateProductType', 'Product Type', error);
      return false;
    }
    
    logCMSOperation('updateProductType', 'Product Type', `Successfully updated product type with ID: ${id}`);
    return true;
  } catch (error) {
    handleCMSError('updateProductType', 'Product Type', error);
    return false;
  }
}
