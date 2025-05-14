
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulTestimonialSection, convertTestimonialsToSection } from '@/types/contentful/testimonial';

export function useTestimonialSection() {
  return useQuery({
    queryKey: ['contentful', 'testimonials'],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('testimonial');
        
        if (!entries || entries.length === 0) {
          return null;
        }
        
        // Convert the testimonials to the expected format
        const testimonials = entries.map((entry: any) => ({
          id: entry.sys.id,
          name: entry.fields.author || '',
          title: entry.fields.position || '',
          company: entry.fields.company || '',
          testimonial: entry.fields.quote || '',
          rating: entry.fields.rating || 5,
          image_url: entry.fields.image?.fields?.file?.url 
            ? `https:${entry.fields.image.fields.file.url}`
            : undefined
        }));
        
        // Create a section with these testimonials
        return convertTestimonialsToSection(testimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
