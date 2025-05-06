
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { useMockData } from '../../mockDataHandler';
import { IS_DEVELOPMENT } from '@/config/cms';
import { 
  normalizeSlug, 
  getCanonicalSlug,
  getSlugVariations, 
  slugsMatch, 
  resolveSlug,
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
    logSlugSearch("business goal", slug);
    
    // Resolve the slug using our centralized method
    const resolvedSlug = resolveSlug(slug);
    
    console.log(`[fetchBusinessGoalBySlug] Slug details:`, {
      original: slug,
      resolved: resolvedSlug
    });
    
    // Try to fetch from Contentful
    try {
      const client = await getContentfulClient();
      
      // Step 1: Try with resolved slug
      console.log(`[fetchBusinessGoalBySlug] Trying with resolved slug: "${resolvedSlug}"`);
      let entries = await client.getEntries({
        content_type: 'businessGoal',
        'fields.slug': resolvedSlug,
        include: 2,
        limit: 1
      });
      
      // Step 2: If not found, try with original slug as fallback
      if (entries.items.length === 0 && slug !== resolvedSlug) {
        console.log(`[fetchBusinessGoalBySlug] Not found with resolved slug, trying original slug: "${slug}"`);
        entries = await client.getEntries({
          content_type: 'businessGoal',
          'fields.slug': slug,
          include: 2,
          limit: 1
        });
      }
      
      // Step 3: If still not found, try advanced matching
      if (entries.items.length === 0) {
        console.log(`[fetchBusinessGoalBySlug] No direct match found, trying variations`);
        
        // Get all business goals to compare slugs
        const allGoalsQuery = await client.getEntries({
          content_type: 'businessGoal',
          include: 2,
          limit: 100
        });
        
        if (allGoalsQuery.items.length > 0) {
          // Extract all available slugs
          const allSlugs = allGoalsQuery.items.map(item => item.fields.slug as string);
          console.log(`[fetchBusinessGoalBySlug] Available slugs:`, allSlugs);
          
          // Find best match using our centralized method
          const bestMatch = resolveSlug(slug, allSlugs);
          
          if (bestMatch && bestMatch !== resolvedSlug) {
            console.log(`[fetchBusinessGoalBySlug] Found best match: "${bestMatch}"`);
            
            // Get the matching business goal
            const matchedGoal = allGoalsQuery.items.find(item => 
              (item.fields.slug as string) === bestMatch
            );
            
            if (matchedGoal) {
              entries = {
                items: [matchedGoal],
                total: 1,
                limit: 1,
                skip: 0,
                sys: { type: 'Array' }
              };
            }
          }
        }
      }
      
      // If no entries found through any method, return null
      if (entries.items.length === 0) {
        logSlugResult("business goal", slug, resolvedSlug, false);
        return null;
      }
      
      // Process the found entry
      const entry = entries.items[0];
      logSlugResult("business goal", slug, entry.fields.slug as string, true);
      
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
    } catch (contentfulError) {
      console.error("[fetchBusinessGoalBySlug] Error fetching business goal from Contentful:", contentfulError);
    }
    
    // If we're in development and mock data is enabled, try mock data as fallback
    if (IS_DEVELOPMENT && useMockData) {
      console.log("[fetchBusinessGoalBySlug] Attempting to use mock data");
      try {
        const { fetchBusinessGoals } = await import('./fetchBusinessGoals');
        const goals = await fetchBusinessGoals();
        
        // Try to find a match using our slug matching function
        for (const goal of goals) {
          if (slugsMatch(normalizeSlug(slug), goal.slug)) {
            console.log(`[fetchBusinessGoalBySlug] Found business goal in mock data: ${goal.title}`);
            return goal as T;
          }
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
