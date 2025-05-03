
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { useMockData } from '../../mockDataHandler';
import { IS_DEVELOPMENT } from '@/config/cms';
import { 
  normalizeSlug, 
  getSlugVariations, 
  slugsMatch, 
  findBestSlugMatch,
  logSlugSearch, 
  logSlugResult 
} from '@/services/cms/utils/slugMatching';

/**
 * Fetches a single business goal by its slug.
 * @param slug The slug of the business goal to fetch.
 * @returns A promise that resolves to the business goal or null if not found.
 */
export async function fetchBusinessGoalBySlug<T extends CMSBusinessGoal>(slug: string): Promise<T | null> {
  try {
    if (!slug) {
      console.warn("[fetchBusinessGoalBySlug] Slug is empty or undefined.");
      return null;
    }

    // Log search parameters for debugging
    logSlugSearch('businessGoal', slug);
    
    // Normalize the slug to handle inconsistencies
    const normalizedSlug = normalizeSlug(slug);
    console.log(`[fetchBusinessGoalBySlug] Fetching business goal with normalized slug: ${normalizedSlug}`);

    // Try to fetch from Contentful
    try {
      const client = await getContentfulClient();
      
      // First try: attempt to get all business goals for advanced matching
      const allGoalsQuery = await client.getEntries({
        content_type: 'businessGoal',
        include: 2,
        limit: 100
      });
      
      if (allGoalsQuery.items.length > 0) {
        // Extract all available slugs
        const allSlugs = allGoalsQuery.items.map(item => item.fields.slug as string);
        console.log(`[fetchBusinessGoalBySlug] Found ${allSlugs.length} business goals for matching`);
        
        // Try to find best match using our advanced matching
        const bestMatch = findBestSlugMatch(normalizedSlug, allSlugs);
        
        if (bestMatch) {
          console.log(`[fetchBusinessGoalBySlug] Found best match: "${bestMatch}" for search slug: "${normalizedSlug}"`);
          
          // Get the matching business goal from our results
          const matchedGoal = allGoalsQuery.items.find(item => 
            (item.fields.slug as string) === bestMatch
          );
          
          if (matchedGoal) {
            const entry = matchedGoal;
            
            const businessGoal: CMSBusinessGoal = {
              id: entry.sys.id,
              slug: entry.fields.slug as string,
              title: entry.fields.title as string,
              description: entry.fields.description as string,
              image: entry.fields.image ? {
                id: (entry.fields.image as any).sys.id,
                url: `https:${(entry.fields.image as any).fields.file.url}`,
                alt: (entry.fields.image as any).fields.title || entry.fields.title
              } : undefined,
              visible: entry.fields.visible as boolean ?? true,
              icon: entry.fields.icon as string,
              benefits: (entry.fields.benefits as string[]) || [],
              features: (entry.fields.features || []).map((feature: any) => ({
                id: feature.sys?.id,
                title: feature.fields?.title,
                description: feature.fields?.description,
                icon: feature.fields?.icon,
                display_order: feature.fields?.displayOrder || 0
              })),
              // Add video if available
              video: entry.fields.video ? {
                id: (entry.fields.video as any).sys.id,
                url: `https:${(entry.fields.video as any).fields.file.url}`,
                title: (entry.fields.video as any).fields.title || 'Business Goal Video'
              } : undefined,
              // Add recommended machines if available
              recommendedMachines: (entry.fields.recommendedMachines || []).map((machine: any) => ({
                id: machine.sys.id,
                slug: machine.fields.slug,
                title: machine.fields.title,
                description: machine.fields.description,
                image: machine.fields.images?.[0] ? {
                  url: `https:${machine.fields.images[0].fields.file.url}`,
                  alt: machine.fields.images[0].fields.title || machine.fields.title
                } : undefined
              }))
            };
            
            logSlugResult('businessGoal', normalizedSlug, bestMatch, true);
            console.log(`[fetchBusinessGoalBySlug] Successfully found business goal via best match: ${entry.fields.title}`);
            return businessGoal as T;
          }
        }
      }
      
      // If advanced matching fails, try traditional approach with slug variations
      const slugVariations = getSlugVariations(normalizedSlug);
      console.log(`[fetchBusinessGoalBySlug] Trying ${slugVariations.length} slug variations:`, slugVariations);
      
      // Try each variation
      for (const slugVariation of slugVariations) {
        console.log(`[fetchBusinessGoalBySlug] Trying slug variation: ${slugVariation}`);
        
        try {
          const entries = await client.getEntries({
            content_type: 'businessGoal',
            'fields.slug': slugVariation,
            include: 2,
            limit: 1
          });
          
          if (entries.items.length > 0) {
            const entry = entries.items[0];
            console.log(`[fetchBusinessGoalBySlug] Found business goal with slug "${slugVariation}": ${entry.fields.title}`);
            
            logSlugResult('businessGoal', normalizedSlug, slugVariation, true);
            
            // Map the Contentful data to our CMSBusinessGoal interface
            const businessGoal: CMSBusinessGoal = {
              id: entry.sys.id,
              slug: entry.fields.slug as string,
              title: entry.fields.title as string,
              description: entry.fields.description as string,
              image: entry.fields.image ? {
                id: (entry.fields.image as any).sys.id,
                url: `https:${(entry.fields.image as any).fields.file.url}`,
                alt: (entry.fields.image as any).fields.title || entry.fields.title
              } : undefined,
              visible: entry.fields.visible as boolean ?? true,
              icon: entry.fields.icon as string,
              benefits: (entry.fields.benefits as string[]) || [],
              features: (entry.fields.features || []).map((feature: any) => ({
                id: feature.sys?.id,
                title: feature.fields?.title,
                description: feature.fields?.description,
                icon: feature.fields?.icon,
                display_order: feature.fields?.displayOrder || 0
              })),
              video: entry.fields.video ? {
                id: (entry.fields.video as any).sys.id,
                url: `https:${(entry.fields.video as any).fields.file.url}`,
                title: (entry.fields.video as any).fields.title || 'Business Goal Video'
              } : undefined,
              recommendedMachines: (entry.fields.recommendedMachines || []).map((machine: any) => ({
                id: machine.sys.id,
                slug: machine.fields.slug,
                title: machine.fields.title,
                description: machine.fields.description,
                image: machine.fields.images?.[0] ? {
                  url: `https:${machine.fields.images[0].fields.file.url}`,
                  alt: machine.fields.images[0].fields.title || machine.fields.title
                } : undefined
              }))
            };
            
            return businessGoal as T;
          } else {
            logSlugResult('businessGoal', normalizedSlug, slugVariation, false);
          }
        } catch (error) {
          console.error(`[fetchBusinessGoalBySlug] Error trying slug variation "${slugVariation}":`, error);
        }
      }
    } catch (contentfulError) {
      console.error("[fetchBusinessGoalBySlug] Error fetching business goal from Contentful:", contentfulError);
    }
    
    // If we're in development and mock data is enabled, try mock data
    if (IS_DEVELOPMENT && useMockData) {
      console.log("[fetchBusinessGoalBySlug] Attempting to use mock data");
      try {
        const { fetchBusinessGoals } = await import('./fetchBusinessGoals');
        const goals = await fetchBusinessGoals();
        
        // Try to find a match using our slug matching function
        for (const goal of goals) {
          if (slugsMatch(normalizedSlug, goal.slug)) {
            console.log(`[fetchBusinessGoalBySlug] Found business goal in mock data via slug matching: ${goal.title}`);
            return goal as T;
          }
        }
        
        // If no match found with slug matching, try exact match
        const goal = goals.find(g => g.slug === normalizedSlug);
        
        if (goal) {
          console.log(`[fetchBusinessGoalBySlug] Found business goal in mock data with exact match: ${goal.title}`);
          return goal as T;
        }
      } catch (mockError) {
        console.error("[fetchBusinessGoalBySlug] Error using mock data:", mockError);
      }
    }
    
    console.log(`[fetchBusinessGoalBySlug] Business goal with slug "${slug}" not found`);
    return null;
  } catch (error) {
    console.error("[fetchBusinessGoalBySlug] Unexpected error:", error);
    return null;
  }
}
