
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';

/**
 * Hook to fetch machines from Contentful
 */
export function useContentfulMachines() {
  return useQuery({
    queryKey: ['contentful', 'machines'],
    queryFn: async () => {
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'machine',
          order: ['fields.name'],
          include: 2,
        });
        
        if (!response.items) {
          console.warn('[useContentfulMachines] No machines found');
          return [];
        }
        
        return response.items;
      } catch (error) {
        console.error('[useContentfulMachines] Error fetching machines:', error);
        throw error;
      }
    },
  });
}

/**
 * Hook to fetch a single machine by slug from Contentful
 */
export function useContentfulMachine(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'machine', slug],
    queryFn: async () => {
      try {
        if (!slug) {
          throw new Error('Machine slug is required');
        }
        
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'machine',
          'fields.slug': slug,
          include: 3,
        });
        
        if (!response.items || response.items.length === 0) {
          throw new Error(`Machine with slug '${slug}' not found`);
        }
        
        return response.items[0];
      } catch (error) {
        console.error(`[useContentfulMachine] Error fetching machine with slug '${slug}':`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}
