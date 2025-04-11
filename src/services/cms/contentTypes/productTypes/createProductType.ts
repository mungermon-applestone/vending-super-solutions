
import { supabase } from '@/integrations/supabase/client';
import { handleCMSError, logCMSOperation } from '../types';

/**
 * Create a new product type
 * @param data Product type data
 * @returns ID of the created product type
 */
export async function createProductType(data: any): Promise<string> {
  try {
    logCMSOperation('createProductType', 'Product Type', `Creating new product type: ${data.title}`);
    
    const { data: productType, error } = await supabase
      .from('product_types')
      .insert(data)
      .select('id')
      .single();
      
    if (error) {
      handleCMSError('createProductType', 'Product Type', error);
      return '';
    }
    
    logCMSOperation('createProductType', 'Product Type', `Successfully created product type with ID: ${productType.id}`);
    return productType.id;
  } catch (error) {
    handleCMSError('createProductType', 'Product Type', error);
    return '';
  }
}
