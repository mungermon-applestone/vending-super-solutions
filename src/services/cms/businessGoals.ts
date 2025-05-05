
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
  
  // Special case for expand-footprint - direct fallback
  if (slug === 'expand-footprint' || slug.includes('expand') && slug.includes('footprint')) {
    console.log("[businessGoals.ts] Special handling for expand-footprint slug");
    
    try {
      // Try direct lookup first
      const expandGoals = await fetchFromCMS<CMSBusinessGoal>('business-goals', { 
        slug: 'expand-footprint' 
      });
      
      if (expandGoals && expandGoals.length > 0) {
        console.log(`[businessGoals.ts] Found expand-footprint via direct lookup`);
        return expandGoals[0];
      }
      
      // If that fails, try with all business goals
      const allGoals = await getBusinessGoals();
      
      // Look for exact match
      const exactMatch = allGoals.find(g => g.slug === 'expand-footprint');
      if (exactMatch) {
        console.log(`[businessGoals.ts] Found expand-footprint via exact match`);
        return exactMatch;
      }
      
      // Look for partial match
      const partialMatch = allGoals.find(g => 
        g.slug.includes('expand') || 
        g.slug.includes('footprint') || 
        g.title.toLowerCase().includes('expand') || 
        g.title.toLowerCase().includes('footprint')
      );
      
      if (partialMatch) {
        console.log(`[businessGoals.ts] Found expand-footprint via partial match: ${partialMatch.slug}`);
        return partialMatch;
      }
      
      // Create a fallback if nothing is found - This ensures we always return something
      console.log(`[businessGoals.ts] Creating fallback for expand-footprint`);
      return {
        id: 'expand-footprint-fallback',
        slug: 'expand-footprint',
        title: 'Expand Your Footprint',
        description: 'Grow your retail presence with automated smart vending solutions.',
        visible: true,
        icon: 'map',
        benefits: [
          'Expand to new locations without traditional store overhead',
          'Reach customers in high-traffic areas with minimal space requirements',
          'Test new markets with lower investment risk',
          'Scale your retail footprint faster than traditional stores',
          'Operate 24/7 without additional staffing costs'
        ],
        features: [
          {
            id: 'expandf-1',
            title: 'Lower Entry Costs',
            description: 'Automated retail machines cost a fraction of traditional store openings',
            icon: 'trending-up',
            display_order: 1
          },
          {
            id: 'expandf-2',
            title: 'Flexible Deployment',
            description: 'Place machines in locations impossible for traditional retail',
            icon: 'map',
            display_order: 2
          },
          {
            id: 'expandf-3',
            title: 'Rapid Market Testing',
            description: 'Quickly test product offerings in new demographic areas',
            icon: 'pie-chart',
            display_order: 3
          }
        ]
      };
    } catch (error) {
      console.error(`[businessGoals.ts] Error in special handling for expand-footprint:`, error);
    }
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
    
    console.log(`[businessGoals.ts] Business goal with slug "${slug}" not found after all attempts`);
    return null;
  } catch (error) {
    console.error(`[businessGoals.ts] Error fetching business goal by slug "${slug}":`, error);
    return null;
  }
}
