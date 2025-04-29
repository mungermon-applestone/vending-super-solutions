
import { CMSBusinessGoal } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { useMockData } from '../../mockDataHandler';
import { IS_DEVELOPMENT } from '@/config/cms';

/**
 * Fetches a single business goal by its slug.
 * @param slug The slug of the business goal to fetch.
 * @returns A promise that resolves to the business goal or null if not found.
 */
export async function fetchBusinessGoalBySlug<T extends CMSBusinessGoal>(slug: string): Promise<T | null> {
  console.log(`[fetchBusinessGoalBySlug] Fetching business goal with slug: ${slug}`);

  try {
    if (!slug) {
      console.warn("[fetchBusinessGoalBySlug] Slug is empty or undefined.");
      return null;
    }

    // Try to fetch from Contentful
    try {
      const client = await getContentfulClient();
      
      // Query Contentful for the business goal with matching slug
      const entries = await client.getEntries({
        content_type: 'businessGoal',
        'fields.slug': slug,
        include: 2,
        limit: 1
      });
      
      if (entries.items.length === 0) {
        console.log(`[fetchBusinessGoalBySlug] No business goal found in Contentful with slug: ${slug}`);
      } else {
        const entry = entries.items[0];
        console.log(`[fetchBusinessGoalBySlug] Found business goal in Contentful: ${entry.fields.title}`);
        
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
        
        return businessGoal as T;
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
        const goal = goals.find(g => g.slug === slug);
        
        if (goal) {
          console.log(`[fetchBusinessGoalBySlug] Found business goal in mock data: ${goal.title}`);
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
