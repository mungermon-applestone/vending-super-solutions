
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
      `${slug.replace('vending', '').replace(/-$/, '')}-vending`,
      // Add additional variations with "-" and "_" replacements
      slug.replace(/-/g, '_'),
      slug.replace(/_/g, '-'),
      // Add slug with and without trailing 's'
      slug.endsWith('s') ? slug.slice(0, -1) : `${slug}s`,
      // Add hyphenated variations
      slug.replace(/\s+/g, '-'),
      // Handle specific product categories with common variations
      slug.includes('food') ? slug.replace('food', 'foods') : slug,
      slug.includes('foods') ? slug.replace('foods', 'food') : slug,
      slug.includes('toy') ? slug.replace('toy', 'toys') : slug,
      slug.includes('toys') ? slug.replace('toys', 'toy') : slug,
      slug.includes('cosmetic') ? slug.replace('cosmetic', 'cosmetics') : slug,
      slug.includes('cosmetics') ? slug.replace('cosmetics', 'cosmetic') : slug,
      // Try with different word orders for compound slugs
      ...reorderCompoundSlug(slug)
    ];
    
    // Remove duplicates and empty strings
    const uniqueVariations = [...new Set(slugVariations)].filter(Boolean);
    
    console.log(`[fetchProductTypeBySlug] Trying these slug variations:`, uniqueVariations);
    
    for (const variation of uniqueVariations) {
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
    
    console.warn(`[fetchProductTypeBySlug] No product type found with any slug variations tried: ${uniqueVariations.join(', ')}`);
    return null;
  } catch (error) {
    console.error(`[fetchProductTypeBySlug] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

/**
 * Helper function to generate variations of compound slugs with different word orders
 */
function reorderCompoundSlug(slug: string): string[] {
  const variations: string[] = [];
  if (!slug) return variations;
  
  // Only attempt reordering for slugs with hyphens
  if (slug.includes('-')) {
    const parts = slug.split('-');
    if (parts.length >= 2) {
      // For two-part slugs, simply swap them
      if (parts.length === 2) {
        variations.push(`${parts[1]}-${parts[0]}`);
      }
      
      // For longer slugs, try some common combinations
      if (parts.length > 2) {
        // Some common permutations
        const lastPart = parts.pop();
        if (lastPart) {
          variations.push([lastPart, ...parts].join('-'));
          parts.push(lastPart); // Restore array
        }
        
        const firstPart = parts.shift();
        if (firstPart) {
          variations.push([...parts, firstPart].join('-'));
        }
      }
    }
  }
  
  return variations;
}
