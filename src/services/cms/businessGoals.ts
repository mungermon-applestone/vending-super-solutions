
import { CMSBusinessGoal } from '@/types/cms';
import { businessGoalOperations } from './contentTypes/businessGoals';
import { fetchFromCMS } from './fetchFromCMS';
import { resolveSlug } from './utils/slugMatching';

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
    // First attempt: Use the direct method to get a business goal by slug
    let businessGoal = await businessGoalOperations.fetchBySlug(slug);
    
    if (businessGoal) {
      console.log(`[businessGoals.ts] Successfully retrieved business goal: ${businessGoal.title}`);
      return businessGoal;
    }
    
    // Second attempt: Try with fallback to fetchFromCMS
    console.log(`[businessGoals.ts] Direct lookup failed, trying fallback method`);
    const goals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { slug });
    
    if (goals.length > 0) {
      console.log(`[businessGoals.ts] Found via fallback with exact slug: ${goals[0].title}`);
      return goals[0];
    }
    
    // Third attempt: Try with all business goals and manual matching
    console.log(`[businessGoals.ts] Fallback failed, trying with all goals and manual matching`);
    const allGoals = await getBusinessGoals();
    
    // Try to find a match using various methods
    const matchedGoal = allGoals.find(g => 
      g.slug === slug || 
      g.slug === resolveSlug(slug) || 
      slug.includes(g.slug) || 
      g.slug.includes(slug)
    );
    
    if (matchedGoal) {
      console.log(`[businessGoals.ts] Found via manual matching: ${matchedGoal.title}`);
      return matchedGoal;
    }
    
    // Special handling for specific slugs (hardcoded fallback for critical slugs)
    if (slug === 'expand-footprint' || slug.includes('expand') || slug.includes('footprint')) {
      // Check if we have anything like this in our database
      const expandGoal = allGoals.find(g => 
        g.title.toLowerCase().includes('expand') || 
        g.title.toLowerCase().includes('footprint') ||
        g.description.toLowerCase().includes('expand footprint')
      );
      
      if (expandGoal) {
        console.log(`[businessGoals.ts] Found via title/description matching: ${expandGoal.title}`);
        return expandGoal;
      }
    }
    
    console.log(`[businessGoals.ts] Business goal with slug "${slug}" not found after all attempts`);
    return null;
  } catch (error) {
    console.error(`[businessGoals.ts] Error fetching business goal by slug "${slug}":`, error);
    return null;
  }
}
