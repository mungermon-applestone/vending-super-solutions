
import { CMSBusinessGoal } from '@/types/cms';
import { businessGoalOperations } from './contentTypes/businessGoals';
import { fetchFromCMS } from './fetchFromCMS';

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
    // Use the direct method to get a business goal by slug
    const businessGoal = await businessGoalOperations.fetchBySlug(slug);
    
    if (businessGoal) {
      console.log(`[businessGoals.ts] Successfully retrieved business goal: ${businessGoal.title}`);
      return businessGoal;
    }
    
    // Fallback to using fetchFromCMS if direct method fails
    console.log(`[businessGoals.ts] Direct lookup failed, trying fallback method`);
    const goals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { slug });
    return goals.length > 0 ? goals[0] : null;
  } catch (error) {
    console.error(`[businessGoals.ts] Error fetching business goal by slug "${slug}":`, error);
    return null;
  }
}
