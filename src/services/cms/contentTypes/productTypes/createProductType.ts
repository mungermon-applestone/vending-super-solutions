
import { supabase } from '@/integrations/supabase/client';
import { CMSProductType } from '@/types/cms';

/**
 * Create a new product type
 * @param data Product type data
 * @returns The created product type
 */
export async function createProductType(data: any): Promise<CMSProductType> {
  try {
    console.log('[CMS:Product Type] createProductType: Creating new product type:', data.title);
    
    const { data: productType, error } = await supabase
      .from('product_types')
      .insert(data)
      .select('*')
      .single();
      
    if (error) {
      console.error('[CMS:Product Type] Error in createProductType:', error);
      throw error;
    }
    
    console.log('[CMS:Product Type] createProductType: Successfully created product type with ID:', productType.id);
    return productType as CMSProductType;
  } catch (error) {
    console.error('[CMS:Product Type] Error in createProductType:', error);
    throw error;
  }
}

export default createProductType;
