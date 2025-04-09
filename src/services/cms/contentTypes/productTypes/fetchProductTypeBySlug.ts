
import { supabase } from '@/integrations/supabase/client';
import { transformProductTypeData } from '../../utils/transformers';
import { logSlugSearch } from '../../utils/slugMatching';

/**
 * Direct fetch a single product type by slug - optimized for reliability
 */
export async function fetchProductTypeBySlug<T = any>(slug: string): Promise<T | null> {
  try {
    console.log(`[fetchProductTypeBySlug] Directly fetching product type with slug: "${slug}"`);
    
    if (!slug || slug.trim() === '') {
      console.warn("[fetchProductTypeBySlug] Empty slug provided");
      return null;
    }
    
    // Try all slug variations (original, mapped, with/without -vending suffix)
    const slugVariations = getSlugVariations(slug);
    
    // DEBUG: For debugging purposes, let's get all products to see what's available
    try {
      const { data: allProducts, error: debugError } = await supabase
        .from('product_types')
        .select('id, title, slug, visible')
        .eq('visible', true);
        
      if (debugError) {
        console.error('[fetchProductTypeBySlug] DEBUG: Error getting all products:', debugError);
      } else {
        console.log('[fetchProductTypeBySlug] DEBUG: All available products in database:', 
          allProducts.map(p => ({ id: p.id, title: p.title, slug: p.slug, visible: p.visible }))
        );
      }
    } catch (err) {
      console.error('[fetchProductTypeBySlug] DEBUG: Exception getting all products:', err);
    }
    
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
        // Try next variation instead of throwing
        continue;
      }
      
      if (data) {
        console.log(`[fetchProductTypeBySlug] Successfully found product type: "${data.title}" with slug variation "${variation}"`);
        
        // Transform the single product type
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

// Helper function for slug variations
function getSlugVariations(slug: string): string[] {
  if (!slug) return [];
  
  const variations = [slug];
  
  // Add or remove -vending suffix
  if (slug.endsWith('-vending')) {
    variations.push(slug.replace('-vending', ''));
  } else {
    variations.push(`${slug}-vending`);
  }
  
  return variations;
}
