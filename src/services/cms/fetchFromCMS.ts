import { IS_DEVELOPMENT } from '@/config/cms';
import { supabase } from '@/integrations/supabase/client';

// Use mock data in development mode if needed
const useMockData = IS_DEVELOPMENT && false; // Set to true to use mock data instead of Supabase

/**
 * Generic function for fetching data from the CMS (either mock or Supabase)
 * @param contentType The type of content to fetch
 * @param params Query parameters to filter results
 * @returns Promise resolving to the requested data
 */
export async function fetchFromCMS<T>(contentType: string, params: Record<string, any> = {}): Promise<T[]> {
  console.log(`[fetchFromCMS] Fetching ${contentType} with params:`, params);
  
  try {
    // Delegate to the appropriate handler based on content type
    switch (contentType) {
      case 'machines':
        return fetchMachines<T>(params);
      case 'product-types':
        return fetchProductTypes<T>(params);
      case 'testimonials':
        return fetchTestimonials<T>();
      case 'business-goals':
        return fetchBusinessGoals<T>();
      default:
        console.warn(`[fetchFromCMS] Unknown content type: ${contentType}`);
        return [] as T[];
    }
  } catch (error) {
    console.error(`[fetchFromCMS] Error fetching ${contentType}:`, error);
    throw error;
  }
}

/**
 * Fetch machines from the CMS
 */
async function fetchMachines<T>(params: Record<string, any> = {}): Promise<T[]> {
  if (useMockData) {
    return [] as T[];
  }
  
  try {
    let query = supabase
      .from('machines')
      .select(`
        id,
        slug,
        title,
        type,
        temperature,
        description,
        machine_images (
          id,
          url,
          alt,
          width,
          height,
          display_order
        ),
        machine_specs (
          id,
          key,
          value
        ),
        machine_features (
          id,
          feature,
          display_order
        ),
        deployment_examples (
          id,
          title,
          description,
          image_url,
          image_alt,
          display_order
        )
      `)
      .eq('visible', true);
    
    if (params.type) {
      query = query.eq('type', params.type);
    }
    
    if (params.temperature) {
      query = query.eq('temperature', params.temperature);
    }
    
    if (params.slug) {
      query = query.eq('slug', params.slug);
    }
    
    const { data, error } = await query.order('title');
    
    if (error) {
      throw error;
    }

    return data.map(machine => {
      const sortedImages = machine.machine_images ? [...machine.machine_images].sort((a, b) => a.display_order - b.display_order) : [];
      const sortedFeatures = machine.machine_features ? [...machine.machine_features].sort((a, b) => a.display_order - b.display_order) : [];
      const sortedExamples = machine.deployment_examples ? [...machine.deployment_examples].sort((a, b) => a.display_order - b.display_order) : [];
      
      return {
        id: machine.id,
        slug: machine.slug,
        title: machine.title,
        type: machine.type as "vending" | "locker",
        temperature: machine.temperature,
        description: machine.description,
        images: sortedImages.map(img => ({
          url: img.url,
          alt: img.alt,
          width: img.width,
          height: img.height
        })),
        specs: machine.machine_specs?.reduce((acc: Record<string, string>, spec) => {
          acc[spec.key] = spec.value;
          return acc;
        }, {} as Record<string, string>) || {},
        features: sortedFeatures.map(f => f.feature),
        deploymentExamples: sortedExamples.map(ex => ({
          title: ex.title,
          description: ex.description,
          image: {
            url: ex.image_url,
            alt: ex.image_alt
          }
        }))
      } as unknown as T;
    });
  } catch (error) {
    console.error('[fetchFromCMS] Error fetching machines:', error);
    throw error;
  }
}

/**
 * Fetch product types from the CMS with improved slug matching
 */
async function fetchProductTypes<T>(params: Record<string, any> = {}): Promise<T[]> {
  if (useMockData) {
    return [] as T[];
  }
  
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
      const normalizedSlug = params.slug.toLowerCase().trim();
      console.log(`[fetchFromCMS] Searching for product with normalized slug: "${normalizedSlug}"`);
      
      const { data: exactMatch, error: exactError } = await query.eq('slug', normalizedSlug);
      
      if (exactError) {
        console.error('[fetchFromCMS] Error with exact slug match:', exactError);
        throw exactError;
      }
      
      if (exactMatch && exactMatch.length > 0) {
        console.log(`[fetchFromCMS] Found exact match for slug '${normalizedSlug}':`, exactMatch[0].title);
        return transformProductTypeData<T>(exactMatch);
      }
      
      if (!params.exactMatch) {
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
      }
      
      console.log(`[fetchFromCMS] No matches found for slug: ${normalizedSlug}`);
      return [] as T[];
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
 * Transform raw product type data from Supabase into our CMS format
 */
function transformProductTypeData<T>(data: any[]): T[] {
  if (!data || data.length === 0) {
    return [] as T[];
  }
  
  return data.map(productType => {
    const sortedBenefits = productType.product_type_benefits ? 
      [...productType.product_type_benefits].sort((a, b) => a.display_order - b.display_order) : 
      [];

    const image = productType.product_type_images && productType.product_type_images.length > 0 
      ? productType.product_type_images[0] 
      : null;
    
    const features = productType.product_type_features ? 
      [...productType.product_type_features]
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((feature: any) => {
          const screenshot = feature.product_type_feature_images && 
            feature.product_type_feature_images.length > 0 ? 
            feature.product_type_feature_images[0] : 
            null;
          
          return {
            title: feature.title,
            description: feature.description,
            icon: feature.icon || undefined,
            screenshot: screenshot ? {
              url: screenshot.url,
              alt: screenshot.alt,
              width: screenshot.width,
              height: screenshot.height
            } : undefined
          };
        }) : 
      [];
    
    return {
      id: productType.id,
      slug: productType.slug,
      title: productType.title,
      description: productType.description,
      image: image ? {
        url: image.url,
        alt: image.alt,
        width: image.width,
        height: image.height
      } : { url: "https://via.placeholder.com/800x600", alt: "Placeholder image" },
      benefits: sortedBenefits.map((b: any) => b.benefit),
      features: features,
      examples: []
    } as unknown as T;
  });
}

/**
 * Fetch testimonials from the CMS
 */
async function fetchTestimonials<T>(): Promise<T[]> {
  return [] as T[];
}

/**
 * Fetch business goals from the CMS
 */
async function fetchBusinessGoals<T>(): Promise<T[]> {
  return [] as T[];
}
