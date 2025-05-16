
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';

interface BusinessGoal {
  id: string;
  slug: string;
  title: string;
  description: string;
  visible: boolean;
  icon?: string;
  benefits?: string[];
  features?: any[];
  imageUrl?: string;
}

/**
 * Hook to fetch all business goals
 */
export function useContentfulBusinessGoals() {
  return useQuery({
    queryKey: ['contentful', 'business-goals'],
    queryFn: async (): Promise<BusinessGoal[]> => {
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'businessGoal',
          order: 'fields.title',
          include: 1
        });
        
        if (!response.items) {
          return [];
        }
        
        return response.items
          .filter(item => item && item.fields)
          .map(item => {
            // Get image URL if available
            let imageUrl;
            if (item.fields.image && item.fields.image.fields && item.fields.image.fields.file) {
              imageUrl = `https:${item.fields.image.fields.file.url}`;
            }
            
            // Transform entry to BusinessGoal interface
            return {
              id: item.sys.id,
              slug: item.fields.slug || '',
              title: item.fields.title || '',
              description: item.fields.description || '',
              visible: item.fields.visible === true,
              icon: item.fields.icon || undefined,
              benefits: Array.isArray(item.fields.benefits) ? item.fields.benefits : [],
              features: Array.isArray(item.fields.features) ? item.fields.features : [],
              imageUrl
            };
          })
          // Only return visible goals
          .filter(goal => goal.visible);
      } catch (error) {
        console.error('Error fetching business goals:', error);
        return [];
      }
    },
  });
}

/**
 * Hook to fetch a business goal by slug
 */
export function useContentfulBusinessGoalBySlug(slug?: string) {
  return useQuery({
    queryKey: ['contentful', 'business-goal', slug],
    enabled: !!slug,
    queryFn: async (): Promise<BusinessGoal | null> => {
      if (!slug) return null;
      
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'businessGoal',
          'fields.slug': slug,
          include: 1,
          limit: 1
        });
        
        if (!response.items || response.items.length === 0) {
          return null;
        }
        
        const item = response.items[0];
        
        // Get image URL if available
        let imageUrl;
        if (item.fields.image && item.fields.image.fields && item.fields.image.fields.file) {
          imageUrl = `https:${item.fields.image.fields.file.url}`;
        }
        
        // Transform entry to BusinessGoal interface
        return {
          id: item.sys.id,
          slug: item.fields.slug || '',
          title: item.fields.title || '',
          description: item.fields.description || '',
          visible: item.fields.visible === true,
          icon: item.fields.icon || undefined,
          benefits: Array.isArray(item.fields.benefits) ? item.fields.benefits : [],
          features: Array.isArray(item.fields.features) ? item.fields.features : [],
          imageUrl
        };
      } catch (error) {
        console.error(`Error fetching business goal with slug "${slug}":`, error);
        return null;
      }
    },
  });
}
