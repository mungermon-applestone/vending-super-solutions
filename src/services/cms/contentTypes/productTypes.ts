
import { supabase } from '@/integrations/supabase/client';
import { transformProductTypeData } from '../utils/transformers';
import { normalizeSlug, mapUrlSlugToDatabaseSlug, logSlugSearch, logSlugResult } from '../utils/slugMatching';

/**
 * Fetch product types from the CMS with improved slug matching
 */
export async function fetchProductTypes<T>(params: Record<string, any> = {}): Promise<T[]> {  
  try {
    console.log('[fetchProductTypes] Fetching product types with params:', params);
    
    const hasSlug = params.slug && params.slug.trim() !== '';
    const hasUUID = params.uuid && params.uuid.trim() !== '';
    
    console.log(`[fetchProductTypes] Looking for specific slug: ${hasSlug ? params.slug : 'No'}`);
    console.log(`[fetchProductTypes] Looking for specific UUID: ${hasUUID ? params.uuid : 'No'}`);
    
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
    
    if (hasUUID) {
      // UUID is most specific, so use it first
      console.log(`[fetchProductTypes] Searching by UUID: ${params.uuid}`);
      const { data, error } = await query.eq('id', params.uuid);
      
      if (error) {
        console.error('[fetchProductTypes] Supabase error fetching by UUID:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.warn(`[fetchProductTypes] No product found with UUID: ${params.uuid}`);
        return [] as T[];
      }
      
      console.log(`[fetchProductTypes] Found product by UUID: ${data[0].title}`);
      return transformProductTypeData<T>(data);
    } else if (hasSlug) {
      // If we have a slug, map it to its database counterpart if necessary
      const mappedSlug = mapUrlSlugToDatabaseSlug(params.slug);
      return await searchBySlug<T>(query, mappedSlug, params.exactMatch);
    } else {
      // Normal case: return all visible product types
      const { data, error } = await query.order('title');
      
      if (error) {
        console.error('[fetchProductTypes] Supabase error fetching product types:', error);
        throw new Error(`Failed to fetch product types: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.warn('[fetchProductTypes] No product types found');
        return [] as T[];
      }

      console.log(`[fetchProductTypes] Found ${data.length} product types:`, data.map(item => item.title));
      return transformProductTypeData<T>(data);
    }
  } catch (error) {
    console.error('[fetchProductTypes] Error processing product types:', error);
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
  console.log(`[searchBySlug] Trying exact match for slug '${normalizedSlug}'`);
  const { data: exactMatch, error: exactError } = await query
    .eq('slug', normalizedSlug);
  
  if (exactError) {
    console.error('[searchBySlug] Error with exact slug match:', exactError);
    throw exactError;
  }
  
  logSlugResult(normalizedSlug, exactMatch, "Exact");
  
  if (exactMatch && exactMatch.length > 0) {
    console.log(`[searchBySlug] Found exact match for slug '${normalizedSlug}'`, exactMatch);
    return transformProductTypeData<T>(exactMatch);
  }
  
  if (exactMatchOnly) {
    console.log(`[searchBySlug] No exact match for '${normalizedSlug}' and exactMatch required`);
    return [] as T[];
  }
  
  // 2. Try case-insensitive match
  console.log(`[searchBySlug] No exact match for '${normalizedSlug}', trying case-insensitive match`);
  
  const { data: caseInsensitiveMatch, error: caseError } = await query
    .ilike('slug', normalizedSlug);
    
  if (caseError) {
    console.error('[searchBySlug] Error with case-insensitive slug match:', caseError);
    throw caseError;
  }
  
  logSlugResult(normalizedSlug, caseInsensitiveMatch, "Case-insensitive");
  
  if (caseInsensitiveMatch && caseInsensitiveMatch.length > 0) {
    console.log(`[searchBySlug] Found case-insensitive match for: ${normalizedSlug}`);
    return transformProductTypeData<T>(caseInsensitiveMatch);
  }
  
  // 3. Try fuzzy match as last resort
  console.log(`[searchBySlug] No case-insensitive match, trying fuzzy match for: ${normalizedSlug}`);
  
  const { data: fuzzyMatch, error: fuzzyError } = await query
    .ilike('slug', `%${normalizedSlug}%`);
    
  if (fuzzyError) {
    console.error('[searchBySlug] Error with fuzzy slug match:', fuzzyError);
    throw fuzzyError;
  }
  
  logSlugResult(normalizedSlug, fuzzyMatch, "Fuzzy");
  
  if (fuzzyMatch && fuzzyMatch.length > 0) {
    console.log(`[searchBySlug] Found fuzzy match for: ${normalizedSlug}`);
    return transformProductTypeData<T>(fuzzyMatch);
  }
  
  console.log(`[searchBySlug] No matches found for slug: ${normalizedSlug}`);
  return [] as T[];
}

/**
 * Direct fetch a single product type by slug - optimized for reliability
 */
export async function fetchProductTypeBySlug<T>(slug: string): Promise<T | null> {
  try {
    console.log(`[fetchProductTypeBySlug] Directly fetching product type with slug: "${slug}"`);
    
    if (!slug || slug.trim() === '') {
      console.warn("[fetchProductTypeBySlug] Empty slug provided");
      return null;
    }
    
    // Map URL slug to database slug if needed
    const mappedSlug = mapUrlSlugToDatabaseSlug(slug);
    console.log(`[fetchProductTypeBySlug] Using mapped slug: "${mappedSlug}" for database query`);
    
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
      .eq('slug', mappedSlug)
      .maybeSingle();
    
    if (error) {
      console.error(`[fetchProductTypeBySlug] Error fetching product type: ${error.message}`);
      throw error;
    }
    
    if (!data) {
      console.warn(`[fetchProductTypeBySlug] No product type found with slug: "${mappedSlug}"`);
      return null;
    }
    
    console.log(`[fetchProductTypeBySlug] Successfully found product type: "${data.title}"`);
    console.log('[fetchProductTypeBySlug] Retrieved data:', data);
    
    // Transform the single product type
    const transformed = transformProductTypeData<T>([data]);
    return transformed.length > 0 ? transformed[0] : null;
  } catch (error) {
    console.error(`[fetchProductTypeBySlug] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

/**
 * Direct fetch a single product type by UUID - the most reliable identifier
 */
export async function fetchProductTypeByUUID<T>(uuid: string): Promise<T | null> {
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
    const transformed = transformProductTypeData<T>([data]);
    return transformed.length > 0 ? transformed[0] : null;
  } catch (error) {
    console.error(`[fetchProductTypeByUUID] Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
