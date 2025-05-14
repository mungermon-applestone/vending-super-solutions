
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';

export function useTestimonialSection() {
  return useQuery({
    queryKey: ['contentful', 'testimonials'],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('testimonial');
        
        if (!entries || entries.length === 0) {
          return [];
        }
        
        return entries.map((entry: any) => ({
          id: entry.sys.id,
          name: entry.fields.name || '',
          title: entry.fields.title || '',
          company: entry.fields.company || '',
          testimonial: entry.fields.quote || '',
          rating: entry.fields.rating || 5,
          image_url: entry.fields.image?.fields?.file?.url 
            ? `https:${entry.fields.image.fields.file.url}`
            : undefined
        }));
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
