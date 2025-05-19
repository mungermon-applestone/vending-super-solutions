
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

export function useTestimonialSection(pageKey: string) {
  return useQuery({
    queryKey: ['testimonialSection', pageKey],
    queryFn: async () => {
      console.log(`[useTestimonialSection] Fetching testimonials for page key: ${pageKey}`);
      
      try {
        // Ensure pageKey is valid and normalized
        const normalizedPageKey = pageKey?.trim() || '';
        console.log(`[useTestimonialSection] Using normalized pageKey: "${normalizedPageKey}"`);
        
        if (!normalizedPageKey) {
          console.warn('[useTestimonialSection] Empty page key provided, cannot fetch testimonials');
          return null;
        }
        
        // Try both with and without leading slash
        const pageKeyVariants = [
          normalizedPageKey,
          normalizedPageKey.startsWith('/') ? normalizedPageKey.substring(1) : `/${normalizedPageKey}`,
        ];
        
        console.log(`[useTestimonialSection] Will try these page key variants:`, pageKeyVariants);
        
        let entries = null;
        
        // Try each variant of the page key
        for (const keyVariant of pageKeyVariants) {
          try {
            console.log(`[useTestimonialSection] Trying to fetch with key: "${keyVariant}"`);
            const result = await fetchContentfulEntries<ContentfulTestimonialSection>('testimonialSection', {
              'fields.pageKey': keyVariant,
              include: 2
            });
            
            if (result && result.length > 0) {
              console.log(`[useTestimonialSection] Found testimonials using key: "${keyVariant}"`);
              entries = result;
              break;
            }
          } catch (variantError) {
            console.warn(`[useTestimonialSection] Error trying key variant "${keyVariant}":`, variantError);
          }
        }
        
        if (!entries || entries.length === 0) {
          console.warn(`[useTestimonialSection] No testimonial section found for any key variant of ${pageKey}`);
          return null;
        }
        
        console.log(`[useTestimonialSection] Retrieved ${entries.length} testimonial sections for page key: ${pageKey}`, entries);
        
        // Check if the testimonial section has testimonials
        const testimonials = entries[0].fields?.testimonials;
        console.log(`[useTestimonialSection] Testimonials in section: ${testimonials?.length || 0}`, testimonials);
        
        // Log detailed info about each testimonial
        if (testimonials && testimonials.length > 0) {
          testimonials.forEach((testimonial, index) => {
            console.log(`[useTestimonialSection] Testimonial #${index + 1}:`, {
              id: testimonial.sys?.id,
              hasFields: !!testimonial.fields,
              fieldKeys: testimonial.fields ? Object.keys(testimonial.fields) : [],
              name: testimonial.fields?.name || 'No name',
              hasQuote: !!testimonial.fields?.quote
            });
          });
        }
        
        return entries[0] || null;
      } catch (error) {
        console.error(`[useTestimonialSection] Error fetching testimonials for ${pageKey}:`, error);
        throw error;
      }
    }
  });
}
