
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
import { CMSTestimonial } from '@/types/cms';

/**
 * Transform a Contentful testimonial entry to our application's Testimonial type
 */
function transformContentfulTestimonial(entry: any): CMSTestimonial {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    name: fields.author?.toString() || 'Anonymous',
    title: fields.position?.toString() || '',
    company: fields.company?.toString() || '',
    testimonial: fields.quote?.toString() || '',
    image_url: fields.image?.fields?.file?.url 
      ? `https:${fields.image.fields.file.url}` 
      : undefined,
    rating: typeof fields.rating === 'number' ? fields.rating : 5,
  };
}

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
