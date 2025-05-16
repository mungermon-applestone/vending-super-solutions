
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

/**
 * Hook to fetch a testimonial section by page key
 */
export function useTestimonialSection(pageKey: string) {
  return useQuery({
    queryKey: ['contentful', 'testimonial-section', pageKey],
    queryFn: async (): Promise<ContentfulTestimonialSection | null> => {
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'testimonialSection',
          'fields.pageKey': pageKey,
          include: 2 // Include 2 levels of references
        });
        
        if (!response.items || response.items.length === 0) {
          return null;
        }
        
        return response.items[0] as ContentfulTestimonialSection;
      } catch (error) {
        console.error(`Error fetching testimonial section for page key "${pageKey}":`, error);
        return null;
      }
    },
  });
}
