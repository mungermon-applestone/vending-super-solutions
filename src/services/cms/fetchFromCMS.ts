
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
  console.log(`[CMS Service] Fetching ${contentType} with params:`, params);
  
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
        console.warn(`[CMS Service] Unknown content type: ${contentType}`);
        return [] as T[];
    }
  } catch (error) {
    console.error(`[CMS Service] Error fetching ${contentType}:`, error);
    throw error;
  }
}

/**
 * Fetch machines from the CMS
 */
async function fetchMachines<T>(params: Record<string, any> = {}): Promise<T[]> {
  if (useMockData) {
    // Implementation for mock data would go here
    return [] as T[];
  }
  
  // Real implementation using Supabase
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
    
    // Apply filters if present
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

    // Transform the Supabase response to match our CMS types
    return data.map(machine => {
      // Sort related data by display_order
      const sortedImages = machine.machine_images ? [...machine.machine_images].sort((a, b) => a.display_order - b.display_order) : [];
      const sortedFeatures = machine.machine_features ? [...machine.machine_features].sort((a, b) => a.display_order - b.display_order) : [];
      const sortedExamples = machine.deployment_examples ? [...machine.deployment_examples].sort((a, b) => a.display_order - b.display_order) : [];
      
      // Transform to our CMSMachine type
      return {
        id: machine.id,
        slug: machine.slug,
        title: machine.title,
        type: machine.type as "vending" | "locker", // Cast to the specific union type
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
    console.error('[CMS Service] Error fetching machines:', error);
    throw error;
  }
}

/**
 * Fetch product types from the CMS with better error handling
 */
async function fetchProductTypes<T>(params: Record<string, any> = {}): Promise<T[]> {
  if (useMockData) {
    // Implementation for mock data would go here
    return [] as T[];
  }
  
  // Real implementation using Supabase
  try {
    console.log('[CMS Service] Fetching product types with params:', params);
    
    // Check if we're looking for a specific slug
    const hasSlug = params.slug && params.slug.trim() !== '';
    console.log(`[CMS Service] Looking for specific slug: ${hasSlug ? params.slug : 'No'}`);
    
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
    
    // Apply filters if present
    if (hasSlug) {
      console.log(`[CMS Service] Filtering product types by slug: ${params.slug}`);
      
      // Try with two different slug formats to catch inconsistencies in the data
      // First try with the exact slug
      let { data: exactMatch, error: exactError } = await query.eq('slug', params.slug).order('title');
      
      if (exactError) {
        console.error('[CMS Service] Error with exact slug match:', exactError);
        throw exactError;
      }
      
      // If no exact match is found, try checking for the related slug
      // For example, if "grocery" doesn't match, try "grocery-vending"
      if (!exactMatch || exactMatch.length === 0) {
        console.log(`[CMS Service] No exact match for '${params.slug}', trying related slugs`);
        
        let { data: relatedMatch, error: relatedError } = await query
          .ilike('slug', `%${params.slug}%`)
          .order('title');
          
        if (relatedError) {
          console.error('[CMS Service] Error with related slug match:', relatedError);
          throw relatedError;
        }
        
        if (relatedMatch && relatedMatch.length > 0) {
          console.log(`[CMS Service] Found related match: ${relatedMatch[0].slug}`);
          return transformProductTypeData<T>(relatedMatch);
        } else {
          console.log(`[CMS Service] No matches found for slug pattern: %${params.slug}%`);
          return [] as T[];
        }
      }
      
      return transformProductTypeData<T>(exactMatch);
    } else {
      // Get all product types
      const { data, error } = await query.order('title');
      
      if (error) {
        console.error('[CMS Service] Supabase error fetching product types:', error);
        throw new Error(`Failed to fetch product types: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.warn('[CMS Service] No product types found');
        return [] as T[];
      }

      console.log(`[CMS Service] Found ${data.length} product types`);
      return transformProductTypeData<T>(data);
    }
  } catch (error) {
    console.error('[CMS Service] Error processing product types:', error);
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
    // Sort benefits by display_order
    const sortedBenefits = productType.product_type_benefits ? 
      [...productType.product_type_benefits].sort((a, b) => a.display_order - b.display_order) : 
      [];

    // Get the main image (assuming there's only one for now)
    const image = productType.product_type_images && productType.product_type_images.length > 0 
      ? productType.product_type_images[0] 
      : null;
    
    // Sort and transform features
    const features = productType.product_type_features ? 
      [...productType.product_type_features]
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((feature: any) => {
          // Get the screenshot for this feature if available
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
    
    // Transform to our CMSProductType
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
      examples: []  // We'll implement examples in a future update
    } as unknown as T;
  });
}

/**
 * Fetch testimonials from the CMS
 */
async function fetchTestimonials<T>(): Promise<T[]> {
  // Testimonials implementation
  return [] as T[];
}

/**
 * Fetch business goals from the CMS
 */
async function fetchBusinessGoals<T>(): Promise<T[]> {
  // Business goals implementation
  return [] as T[];
}
