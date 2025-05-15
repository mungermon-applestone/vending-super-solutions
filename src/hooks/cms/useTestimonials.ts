
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMSTestimonial } from '@/types/cms';
import { transformContentfulTestimonial, ContentfulTestimonial } from '@/types/contentful/testimonial';

/**
 * Hook to fetch testimonials from Contentful
 */
export function useTestimonials() {
  return useQuery({
    queryKey: ['contentful', 'testimonials'],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('testimonial', {
          'fields.visible': true,
          order: '-sys.createdAt'
        });
        
        // Transform to our standard format
        return entries.map((entry: ContentfulTestimonial) => 
          transformContentfulTestimonial(entry)
        );
      } catch (error) {
        console.error('[useTestimonials] Error fetching testimonials:', error);
        return [] as CMSTestimonial[];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
