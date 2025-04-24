
import { supabase } from '@/integrations/supabase/client';
import { transformProductTypeData } from '../../utils/transformers';
import { getSlugVariations } from '../../utils/slugMatching';

export async function fetchProductTypeBySlug<T = any>(slug: string): Promise<T | null> {
  try {
    console.log(`[fetchProductTypeBySlug] Directly fetching product type with slug: "${slug}"`);
    
    if (!slug || slug.trim() === '') {
      console.warn("[fetchProductTypeBySlug] Empty slug provided");
      return null;
    }
    
    // Create more comprehensive slug variations
    const slugVariations = [
      ...getSlugVariations(slug),
      slug.replace('-vending', ''),
      `${slug.replace('-vending', '')}-vending`,
      slug.replace('vending', '').replace(/-$/, ''),
      `${slug.replace('vending', '').replace(/-$/, '')}-vending`
    ];
    
    console.log(`[fetchProductTypeBySlug] Trying these slug variations:`, slugVariations);
    
    for (const variation of slugVariations) {
      console.log(`[fetchProductTypeBySlug] Trying variation: "${variation}"`);
      
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
        .eq('slug', variation)
        .maybeSingle();
      
      if (error) {
        console.error(`[fetchProductTypeBySlug] Error fetching product type with slug "${variation}": ${error.message}`);
        continue;
      }
      
      if (data) {
        console.log(`[fetchProductTypeBySlug] Successfully found product type: "${data.title}" with slug variation "${variation}"`);
        
        const transformed = transformProductTypeData([data]);
        return transformed.length > 0 ? transformed[0] as T : null;
      }
    }
    
    console.warn(`[fetchProductTypeBySlug] No product type found with any slug variations tried: ${slugVariations.join(', ')}`);
    return null;
  } catch (error) {
    console.error(`[fetchProductTypeBySlug] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
