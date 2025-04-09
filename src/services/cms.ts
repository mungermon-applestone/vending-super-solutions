
import { 
  CMSMachine, 
  CMSProductType, 
  CMSTestimonial, 
  CMSBusinessGoal,
  CMSTechnology
} from '@/types/cms';
import { fetchFromCMS } from '@/services/cms/fetchFromCMS';
import { fetchProductTypeBySlug, fetchProductTypeByUUID } from '@/services/cms/contentTypes/productTypes';
import { fetchBusinessGoalBySlug } from '@/services/cms/contentTypes/businessGoals';
import { 
  normalizeSlug, 
  mapUrlSlugToDatabaseSlug, 
  getSlugVariations 
} from '@/services/cms/utils/slugMatching';
import { fetchMachineById, createMachine, updateMachine, deleteMachine } from '@/services/cms/contentTypes/machines';

// Import everything from technologies through one import
import {
  fetchTechnologies,
  fetchTechnologyBySlug
} from './cms/contentTypes/technologies';

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

export async function getMachineById(id: string): Promise<CMSMachine | null> {
  return await fetchMachineById<CMSMachine>(id);
}

export async function createNewMachine(machineData: any): Promise<string> {
  return await createMachine(machineData);
}

export async function updateExistingMachine(id: string, machineData: any): Promise<boolean> {
  return await updateMachine(id, machineData);
}

export async function removeExistingMachine(id: string): Promise<boolean> {
  return await deleteMachine(id);
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
    // Direct lookup with improved slug handling
    console.log(`[cms.ts] Using enhanced slug lookup for: "${slug}"`);
    const productType = await fetchProductTypeBySlug<CMSProductType>(slug);
    
    if (productType) {
      console.log(`[cms.ts] Successfully retrieved product type: ${productType.title}`);
      return productType;
    }
    
    console.log(`[cms.ts] Could not find product type with slug "${slug}" after trying all variations`);
    
    // As a last resort, try a fuzzy search
    console.log(`[cms.ts] All direct lookups failed, trying fallback method with fuzzy search`);
    const productTypes = await fetchFromCMS<CMSProductType>('product-types', { 
      slug: slug,
      exactMatch: false // Allow fuzzy matching as last resort
    });
    
    if (productTypes.length > 0) {
      console.log(`[cms.ts] Fallback found product type via fuzzy search: ${productTypes[0].title}`);
      return productTypes[0];
    }
    
    // DEBUG: Let's try to get all product types to see what's available
    console.log('[cms.ts] DEBUG: Getting all product types to check available options');
    const allTypes = await getProductTypes();
    console.log('[cms.ts] DEBUG: Available product types:', 
      allTypes.map(pt => ({ title: pt.title, slug: pt.slug, id: pt.id }))
    );
    
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
  console.log(`[cms.ts] Attempting to fetch business goal with slug: "${slug}"`);
  
  if (!slug || slug.trim() === '') {
    console.warn("[cms.ts] Empty slug passed to getBusinessGoalBySlug");
    return null;
  }
  
  try {
    // Use the direct method to get a business goal by slug
    const businessGoal = await fetchBusinessGoalBySlug<CMSBusinessGoal>(slug);
    
    if (businessGoal) {
      console.log(`[cms.ts] Successfully retrieved business goal: ${businessGoal.title}`);
      return businessGoal;
    }
    
    // Fallback to using fetchFromCMS if direct method fails
    console.log(`[cms.ts] Direct lookup failed, trying fallback method`);
    const goals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { slug });
    return goals.length > 0 ? goals[0] : null;
  } catch (error) {
    console.error(`[cms.ts] Error fetching business goal by slug "${slug}":`, error);
    return null;
  }
}

// Export technology functions
export const getTechnologies = fetchTechnologies;
export const getTechnologyBySlug = fetchTechnologyBySlug;
