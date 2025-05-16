
import { useQuery } from '@tanstack/react-query';
import { 
  getContentfulClient
} from '@/services/contentful/client';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

/**
 * Hook to fetch testimonials section content from Contentful
 */
export function useTestimonialSection(pageKey: string = 'homepage') {
  return useQuery({
    queryKey: ['contentful', 'testimonial-section', pageKey],
    queryFn: async (): Promise<ContentfulTestimonialSection | null> => {
      try {
        const client = await getContentfulClient();
        
        // Query for testimonialSection with the specified pageKey
        const response = await client.getEntries({
          content_type: 'testimonialSection',
          'fields.pageKey': pageKey,
          include: 2, // Include linked entries (testimonials)
        });
        
        if (!response.items || response.items.length === 0) {
          console.warn(`[useTestimonialSection] No testimonial section found for pageKey: ${pageKey}`);
          return null;
        }
        
        const section = response.items[0];
        
        // Cast to ContentfulTestimonialSection
        return {
          ...section,
          fields: {
            title: section.fields.title,
            subtitle: section.fields.subtitle,
            testimonials: section.fields.testimonials || [],
            pageKey: section.fields.pageKey
          },
          metadata: section.metadata || { tags: [] }
        } as ContentfulTestimonialSection;
      } catch (error) {
        console.error('[useTestimonialSection] Error fetching testimonial section:', error);
        return null;
      }
    },
  });
}
