
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
import { CMSTestimonial } from '@/types/cms';
import { transformContentfulTestimonial } from './transformers/testimonialTransformer';

/**
 * Hook to fetch testimonials from Contentful
 */
export function useContentfulTestimonials() {
  return useQuery({
    queryKey: ['contentful', 'testimonials'],
    queryFn: async (): Promise<CMSTestimonial[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'testimonial',
          order: ['fields.author'],
        });
        
        return response.items.map(entry => transformContentfulTestimonial(entry));
      } catch (error) {
        console.error('Error fetching testimonials from Contentful:', error);
        return [];
      }
    },
  });
}
