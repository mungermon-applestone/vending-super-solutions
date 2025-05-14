
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';

export function useHeroContent(id?: string) {
  return useQuery({
    queryKey: ['contentful', 'hero', id],
    queryFn: async () => {
      try {
        // Fetch the hero content from Contentful
        const query = id ? { 'fields.identifier': id } : {};
        const entries = await fetchContentfulEntries('hero', query);
        
        if (!entries || entries.length === 0) {
          console.log('No hero content found');
          return null;
        }
        
        // Transform the first hero content entry
        const heroEntry = entries[0];
        
        // Return a normalized structure that works with both old and new component naming
        return {
          // New property naming
          title: heroEntry.fields.headline || 'Welcome to Our Platform',
          subtitle: heroEntry.fields.subheading || 'Discover the future of vending',
          primaryButtonText: heroEntry.fields.ctaText || 'Learn More',
          primaryButtonUrl: heroEntry.fields.ctaLink || '/products',
          secondaryButtonText: heroEntry.fields.secondaryCTAText,
          secondaryButtonUrl: heroEntry.fields.secondaryCTALink,
          backgroundClass: heroEntry.fields.backgroundClass || '',
          
          // Legacy property naming
          headline: heroEntry.fields.headline || 'Welcome to Our Platform',
          subheading: heroEntry.fields.subheading || 'Discover the future of vending',
          ctaText: heroEntry.fields.ctaText || 'Learn More',
          ctaLink: heroEntry.fields.ctaLink || '/products',
          secondaryCTAText: heroEntry.fields.secondaryCTAText,
          secondaryCTALink: heroEntry.fields.secondaryCTALink,
          
          // Image handling
          image: heroEntry.fields.image?.fields ? {
            url: `https:${heroEntry.fields.image.fields.file?.url}` || '',
            alt: heroEntry.fields.image.fields.title || 'Hero image'
          } : undefined,
          
          backgroundImage: heroEntry.fields.backgroundImage?.fields?.file?.url
            ? `https:${heroEntry.fields.backgroundImage.fields.file.url}`
            : undefined,
          backgroundImageAlt: heroEntry.fields.backgroundImage?.fields?.title || 'Hero Background'
        };
      } catch (error) {
        console.error('Error fetching hero content:', error);
        return null;
      }
    }
  });
}
