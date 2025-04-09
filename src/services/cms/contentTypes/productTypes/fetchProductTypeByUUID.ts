
import { supabase } from '@/integrations/supabase/client';
import { transformProductTypeData } from '../../utils/transformers';

/**
 * Direct fetch a single product type by UUID - the most reliable identifier
 */
export async function fetchProductTypeByUUID<T = any>(uuid: string): Promise<T | null> {
  try {
    console.log(`[fetchProductTypeByUUID] Directly fetching product type with UUID: "${uuid}"`);
    
    if (!uuid || uuid.trim() === '') {
      console.warn("[fetchProductTypeByUUID] Empty UUID provided");
      return null;
    }
    
    const { data, error } = await supabase
      .from('product_types')
      .select(`
        id,
        slug,
        title,
        description,
        visible,
        product_type_images (
          id,
          url,
          alt,
          width,
          height
        ),
        product_type_benefits (
          id,
          benefit,
          display_order
        ),
        product_type_features (
          id,
          title,
          description,
          icon,
          display_order,
          product_type_feature_images (
            id,
            url,
            alt,
            width,
            height
          )
        )
      `)
      .eq('visible', true)
      .eq('id', uuid)
      .maybeSingle();
    
    if (error) {
      console.error(`[fetchProductTypeByUUID] Error fetching product type: ${error.message}`);
      throw error;
    }
    
    if (!data) {
      console.warn(`[fetchProductTypeByUUID] No product type found with UUID: "${uuid}"`);
      return null;
    }
    
    console.log(`[fetchProductTypeByUUID] Successfully found product type: "${data.title}"`);
    
    // Transform the single product type
    const transformed = transformProductTypeData([data]);
    return transformed.length > 0 ? transformed[0] as T : null;
  } catch (error) {
    console.error(`[fetchProductTypeByUUID] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
