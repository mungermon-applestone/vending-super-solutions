
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';
import { transformContentfulTestimonial, transformTestimonials } from './transformers/testimonialTransformer';

/**
 * Hook to fetch testimonials from Contentful
 */
export function useContentfulTestimonials() {
  return useQuery({
    queryKey: ['contentful', 'testimonials'],
    queryFn: async () => {
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'testimonial',
          order: ['fields.author'],
        });
        
        if (!response.items || !Array.isArray(response.items)) {
          console.warn('[useContentfulTestimonials] No testimonials found or invalid response format');
          return [];
        }
        
        const transformedTestimonials = response.items.map(entry => transformContentfulTestimonial(entry));
        return transformTestimonials(transformedTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials from Contentful:', error);
        return [];
      }
    },
  });
}
