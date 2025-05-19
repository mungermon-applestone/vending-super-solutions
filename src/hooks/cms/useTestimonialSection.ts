
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

export function useTestimonialSection(pageKey: string) {
  return useQuery({
    queryKey: ['testimonialSection', pageKey],
    queryFn: async () => {
      console.log(`[useTestimonialSection] Fetching testimonials for page key: ${pageKey}`);
      
      try {
        const entries = await fetchContentfulEntries<ContentfulTestimonialSection>('testimonialSection', {
          'fields.pageKey': pageKey,
          include: 2
        });
        
        console.log(`[useTestimonialSection] Retrieved ${entries.length} testimonial sections for page key: ${pageKey}`, entries);
        
        // If no testimonial section found, log a warning
        if (entries.length === 0) {
          console.warn(`[useTestimonialSection] No testimonial section found for page key: ${pageKey}`);
          return null;
        }
        
        // Check if the testimonial section has testimonials
        const testimonials = entries[0].fields?.testimonials;
        console.log(`[useTestimonialSection] Testimonials in section: ${testimonials?.length || 0}`, testimonials);
        
        return entries[0] || null;
      } catch (error) {
        console.error(`[useTestimonialSection] Error fetching testimonials for ${pageKey}:`, error);
        throw error;
      }
    }
  });
}
