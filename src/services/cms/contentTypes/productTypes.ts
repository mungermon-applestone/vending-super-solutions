
import { supabase } from '@/integrations/supabase/client';
import { transformProductTypeData } from '../utils/transformers';
import { normalizeSlug, logSlugSearch } from '../utils/slugMatching';

/**
 * Fetch product types from the CMS with improved slug matching
 */
export async function fetchProductTypes<T>(params: Record<string, any> = {}): Promise<T[]> {  
  try {
    console.log('[fetchFromCMS] Fetching product types with params:', params);
    
    const hasSlug = params.slug && params.slug.trim() !== '';
    console.log(`[fetchFromCMS] Looking for specific slug: ${hasSlug ? params.slug : 'No'}`);
    
    let query = supabase
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
      .eq('visible', true);
    
    if (hasSlug) {
      return await searchBySlug<T>(query, params.slug, params.exactMatch);
    } else {
      const { data, error } = await query.order('title');
      
      if (error) {
        console.error('[fetchFromCMS] Supabase error fetching product types:', error);
        throw new Error(`Failed to fetch product types: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.warn('[fetchFromCMS] No product types found');
        return [] as T[];
      }

      console.log(`[fetchFromCMS] Found ${data.length} product types`);
      return transformProductTypeData<T>(data);
    }
  } catch (error) {
    console.error('[fetchFromCMS] Error processing product types:', error);
    throw error;
  }
}

/**
 * Search for product types by slug using progressively less strict matching
 */
async function searchBySlug<T>(
  query: any, 
  slugParam: string, 
  exactMatchOnly: boolean = false
): Promise<T[]> {
  const normalizedSlug = normalizeSlug(slugParam);
  logSlugSearch(normalizedSlug, 'Searching for product');
  
  // 1. Try exact match first
  const { data: exactMatch, error: exactError } = await query.eq('slug', normalizedSlug);
  
  if (exactError) {
    console.error('[fetchFromCMS] Error with exact slug match:', exactError);
    throw exactError;
  }
  
  if (exactMatch && exactMatch.length > 0) {
    console.log(`[fetchFromCMS] Found exact match for slug '${normalizedSlug}':`, exactMatch[0].title);
    return transformProductTypeData<T>(exactMatch);
  }
  
  // If exactMatch is required and we didn't find one, return empty array
  if (exactMatchOnly) {
    console.log(`[fetchFromCMS] No exact match for '${normalizedSlug}' and exactMatch required`);
    return [] as T[];
  }
  
  // 2. Try case-insensitive match
  console.log(`[fetchFromCMS] No exact match for '${normalizedSlug}', trying case-insensitive match`);
  
  const { data: caseInsensitiveMatch, error: caseError } = await query
    .ilike('slug', normalizedSlug);
    
  if (caseError) {
    console.error('[fetchFromCMS] Error with case-insensitive slug match:', caseError);
    throw caseError;
  }
  
  if (caseInsensitiveMatch && caseInsensitiveMatch.length > 0) {
    console.log(`[fetchFromCMS] Found case-insensitive match: ${caseInsensitiveMatch[0].slug}`, caseInsensitiveMatch[0].title);
    return transformProductTypeData<T>(caseInsensitiveMatch);
  }
  
  // 3. Try fuzzy match as last resort
  console.log(`[fetchFromCMS] No case-insensitive match, trying fuzzy match for: ${normalizedSlug}`);
  
  const { data: fuzzyMatch, error: fuzzyError } = await query
    .ilike('slug', `%${normalizedSlug.replace(/-/g, '%')}%`);
    
  if (fuzzyError) {
    console.error('[fetchFromCMS] Error with fuzzy slug match:', fuzzyError);
    throw fuzzyError;
  }
  
  if (fuzzyMatch && fuzzyMatch.length > 0) {
    console.log(`[fetchFromCMS] Found fuzzy match: ${fuzzyMatch[0].slug}`, fuzzyMatch[0].title);
    return transformProductTypeData<T>(fuzzyMatch);
  }
  
  console.log(`[fetchFromCMS] No matches found for slug: ${normalizedSlug}`);
  return [] as T[];
}
