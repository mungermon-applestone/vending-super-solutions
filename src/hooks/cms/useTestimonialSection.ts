
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulTestimonialSection } from '@/types/contentful/testimonial';

export function useTestimonialSection(pageKey: string) {
  return useQuery({
    queryKey: ['testimonialSection', pageKey],
    queryFn: async () => {
      const entries = await fetchContentfulEntries<ContentfulTestimonialSection>('testimonialSection', {
        'fields.pageKey': pageKey,
        include: 2
      });
      return entries[0] || null;
    }
  });
}
