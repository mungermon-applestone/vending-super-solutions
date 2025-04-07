
import { 
  CMSMachine, 
  CMSProductType, 
  CMSTestimonial, 
  CMSBusinessGoal 
} from '@/types/cms';
import { fetchFromCMS } from '@/services/cms/fetchFromCMS';
import { fetchProductTypeBySlug, fetchProductTypeByUUID } from '@/services/cms/contentTypes/productTypes';
import { normalizeSlug, mapUrlSlugToDatabaseSlug } from '@/services/cms/utils/slugMatching';

export async function getMachines(filters: Record<string, any> = {}): Promise<CMSMachine[]> {
  return await fetchFromCMS<CMSMachine>('machines', filters);
}

export async function getMachineBySlug(type: string, id: string): Promise<CMSMachine | null> {
  const machines = await fetchFromCMS<CMSMachine>('machines', { 
    slug: id,
    type: type
  });
  
  return machines.length > 0 ? machines[0] : null;
}

export async function getProductTypes(): Promise<CMSProductType[]> {
  console.log("[cms.ts] Fetching all product types");
  return await fetchFromCMS<CMSProductType>('product-types');
}

export async function getProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  console.log(`[cms.ts] Attempting to fetch product type with slug: "${slug}"`);
  
  if (!slug || slug.trim() === '') {
    console.warn("[cms.ts] Empty slug passed to getProductTypeBySlug");
    return null;
  }
  
  try {
    // Map the URL slug to database slug
    const normalizedSlug = normalizeSlug(slug);
    const mappedSlug = mapUrlSlugToDatabaseSlug(normalizedSlug);
    console.log(`[cms.ts] Fetching product with mapped slug: "${mappedSlug}" (original: "${slug}")`);
    
    // First try with the mapped slug
    let productType = await fetchProductTypeBySlug<CMSProductType>(mappedSlug);
    
    if (productType) {
      console.log(`[cms.ts] Successfully retrieved product type: ${productType.title}`);
      return productType;
    } 
    
    // If that fails, try with the original slug
    console.log(`[cms.ts] No product found with mapped slug "${mappedSlug}", trying with original slug "${normalizedSlug}"`);
    productType = await fetchProductTypeBySlug<CMSProductType>(normalizedSlug);
    
    if (productType) {
      console.log(`[cms.ts] Successfully retrieved product type with original slug: ${productType.title}`);
      return productType;
    }
    
    // Try without the -vending suffix if it has one
    if (mappedSlug.endsWith('-vending')) {
      const withoutSuffix = mappedSlug.replace('-vending', '');
      console.log(`[cms.ts] Trying without -vending suffix: "${withoutSuffix}"`);
      productType = await fetchProductTypeBySlug<CMSProductType>(withoutSuffix);
      
      if (productType) {
        console.log(`[cms.ts] Found product with slug without -vending suffix: ${productType.title}`);
        return productType;
      }
    }
    
    // As a last resort, try a fuzzy search
    console.log(`[cms.ts] All direct lookups failed, trying fallback method with fuzzy search`);
    const productTypes = await fetchFromCMS<CMSProductType>('product-types', { 
      slug: mappedSlug,
      exactMatch: false // Allow fuzzy matching as last resort
    });
    
    if (productTypes.length > 0) {
      console.log(`[cms.ts] Fallback found product type via fuzzy search: ${productTypes[0].title}`);
      return productTypes[0];
    }
    
    console.log(`[cms.ts] Could not find product type with any slug variation of "${slug}"`);
    return null;
  } catch (error) {
    console.error(`[cms.ts] Error fetching product type by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get a product type by its UUID (most reliable method)
 */
export async function getProductTypeByUUID(uuid: string): Promise<CMSProductType | null> {
  console.log(`[cms.ts] Attempting to fetch product type with UUID: "${uuid}"`);
  
  if (!uuid || uuid.trim() === '') {
    console.warn("[cms.ts] Empty UUID passed to getProductTypeByUUID");
    return null;
  }
  
  try {
    // Use our direct method specifically for UUID lookups
    const productType = await fetchProductTypeByUUID<CMSProductType>(uuid);
    
    if (productType) {
      console.log(`[cms.ts] Successfully retrieved product type by UUID: ${productType.title}`);
      return productType;
    }
    
    console.log(`[cms.ts] Could not find product type with UUID "${uuid}"`);
    return null;
  } catch (error) {
    console.error(`[cms.ts] Error fetching product type by UUID "${uuid}":`, error);
    return null;
  }
}

export async function getTestimonials(): Promise<CMSTestimonial[]> {
  return await fetchFromCMS<CMSTestimonial>('testimonials');
}

export async function getBusinessGoals(): Promise<CMSBusinessGoal[]> {
  return await fetchFromCMS<CMSBusinessGoal>('business-goals');
}

export async function getBusinessGoalBySlug(slug: string): Promise<CMSBusinessGoal | null> {
  const goals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { slug });
  return goals.length > 0 ? goals[0] : null;
}
