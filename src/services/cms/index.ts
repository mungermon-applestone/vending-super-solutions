
import { CMSMachine, CMSProductType, CMSTestimonial, CMSBusinessGoal } from '@/types/cms';
import { fetchFromCMS } from './fetchFromCMS';

/**
 * Get all machines, optionally filtered
 * @param filters Optional filters to apply
 * @returns Promise of machines that match the filters
 */
export async function getMachines(filters: Record<string, any> = {}): Promise<CMSMachine[]> {
  try {
    return await fetchFromCMS<CMSMachine>('machines', filters);
  } catch (error) {
    console.error('[CMS Service] Error in getMachines:', error);
    return [];
  }
}

/**
 * Get a specific machine by its type and slug
 * @param type The machine type (vending, locker, etc.)
 * @param id The machine slug identifier
 * @returns The matched machine or null
 */
export async function getMachineBySlug(type: string, id: string): Promise<CMSMachine | null> {
  try {
    const machines = await fetchFromCMS<CMSMachine>('machines', { 
      slug: id,
      type: type
    });
    
    return machines.length > 0 ? machines[0] : null;
  } catch (error) {
    console.error(`[CMS Service] Error in getMachineBySlug for type=${type}, id=${id}:`, error);
    return null;
  }
}

/**
 * Get all product types
 * @returns Promise of all visible product types
 */
export async function getProductTypes(): Promise<CMSProductType[]> {
  try {
    return await fetchFromCMS<CMSProductType>('product-types');
  } catch (error) {
    console.error('[CMS Service] Error in getProductTypes:', error);
    return [];
  }
}

/**
 * Get a specific product type by its slug
 * @param slug The product type slug identifier
 * @returns The matched product type or null
 */
export async function getProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  if (!slug || slug.trim() === '') {
    console.warn('[CMS Service] getProductTypeBySlug called with empty slug');
    return null;
  }

  try {
    console.log(`[CMS Service] Attempting to fetch product type with slug: ${slug}`);
    const productTypes = await fetchFromCMS<CMSProductType>('product-types', { slug });
    
    if (productTypes.length === 0) {
      console.log(`[CMS Service] No product type found for slug: ${slug}`);
      return null;
    }
    
    console.log(`[CMS Service] Successfully retrieved product type for slug: ${slug}`);
    return productTypes[0];
  } catch (error) {
    console.error(`[CMS Service] Error in getProductTypeBySlug for slug=${slug}:`, error);
    return null;
  }
}

/**
 * Get all testimonials
 * @returns Promise of all testimonials
 */
export async function getTestimonials(): Promise<CMSTestimonial[]> {
  try {
    return await fetchFromCMS<CMSTestimonial>('testimonials');
  } catch (error) {
    console.error('[CMS Service] Error in getTestimonials:', error);
    return [];
  }
}

/**
 * Get all business goals
 * @returns Promise of all business goals
 */
export async function getBusinessGoals(): Promise<CMSBusinessGoal[]> {
  try {
    return await fetchFromCMS<CMSBusinessGoal>('business-goals');
  } catch (error) {
    console.error('[CMS Service] Error in getBusinessGoals:', error);
    return [];
  }
}

/**
 * Get a specific business goal by its slug
 * @param slug The business goal slug identifier
 * @returns The matched business goal or null
 */
export async function getBusinessGoalBySlug(slug: string): Promise<CMSBusinessGoal | null> {
  try {
    const goals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { slug });
    return goals.length > 0 ? goals[0] : null;
  } catch (error) {
    console.error(`[CMS Service] Error in getBusinessGoalBySlug for slug=${slug}:`, error);
    return null;
  }
}

// Re-export fetchFromCMS for direct use if needed
export { fetchFromCMS };
