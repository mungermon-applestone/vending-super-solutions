
import { supabase } from '@/integrations/supabase/client';
import { handleCMSError, logCMSOperation } from '../types';
import { CMSProductType } from '@/types/cms';

/**
 * Create a new product type
 * @param data Product type data
 * @returns The created product type
 */
export async function createProductType(data: any): Promise<CMSProductType> {
  try {
    logCMSOperation('createProductType', 'Product Type', `Creating new product type: ${data.title}`);
    
    const { data: productType, error } = await supabase
      .from('product_types')
      .insert(data)
      .select('*')
      .single();
      
    if (error) {
      handleCMSError('createProductType', 'Product Type', error);
      throw error;
    }
    
    logCMSOperation('createProductType', 'Product Type', `Successfully created product type with ID: ${productType.id}`);
    return productType as CMSProductType;
  } catch (error) {
    handleCMSError('createProductType', 'Product Type', error);
    throw error;
  }
}
