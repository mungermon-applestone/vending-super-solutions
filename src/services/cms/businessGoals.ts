
import { CMSBusinessGoal } from '@/types/cms';
import { businessGoalOperations } from './contentTypes/businessGoals';
import { fetchFromCMS } from './fetchFromCMS';
import { normalizeSlug, resolveSlug } from './utils/slugMatching';

/**
 * Get all business goals
 */
export async function getBusinessGoals(): Promise<CMSBusinessGoal[]> {
  return await businessGoalOperations.fetchAll();
}

/**
 * Get a business goal by slug
 */
export async function getBusinessGoalBySlug(slug: string): Promise<CMSBusinessGoal | null> {
  console.log(`[businessGoals.ts] Attempting to fetch business goal with slug: "${slug}"`);
  
  if (!slug || slug.trim() === '') {
    console.warn("[businessGoals.ts] Empty slug passed to getBusinessGoalBySlug");
    return null;
  }
  
  try {
    // First, normalize and resolve the slug to its canonical form if needed
    const resolvedSlug = resolveSlug(slug);
    console.log(`[businessGoals.ts] Using resolved slug for lookup: "${resolvedSlug}"`);
    
    // Use the direct method to get a business goal by slug
    const businessGoal = await businessGoalOperations.fetchBySlug(resolvedSlug);
    
    if (businessGoal) {
      console.log(`[businessGoals.ts] Successfully retrieved business goal: ${businessGoal.title}`);
      return businessGoal;
    }
    
    // If the resolved slug didn't work, try with the original slug as fallback
    if (resolvedSlug !== normalizeSlug(slug)) {
      console.log(`[businessGoals.ts] Trying with original normalized slug: "${normalizeSlug(slug)}"`);
      const businessGoalOriginal = await businessGoalOperations.fetchBySlug(normalizeSlug(slug));
      
      if (businessGoalOriginal) {
        return businessGoalOriginal;
      }
    }
    
    // Fallback to using fetchFromCMS with the resolved slug first
    console.log(`[businessGoals.ts] Direct lookup failed, trying fallback method with resolved slug: "${resolvedSlug}"`);
    let goals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { slug: resolvedSlug });
    
    if (goals.length === 0 && resolvedSlug !== normalizeSlug(slug)) {
      // Try with original slug if resolved didn't work
      goals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { slug: normalizeSlug(slug) });
    }
    
    return goals.length > 0 ? goals[0] : null;
  } catch (error) {
    console.error(`[businessGoals.ts] Error fetching business goal by slug "${slug}":`, error);
    return null;
  }
}
