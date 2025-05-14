
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';

export function useHeroContent() {
  return useQuery({
    queryKey: ['contentful', 'hero'],
    queryFn: async () => {
      try {
        // Fetch the hero content from Contentful
        const entries = await fetchContentfulEntries('hero');
        
        if (!entries || entries.length === 0) {
          console.log('No hero content found');
          return null;
        }
        
        // Transform the first hero content entry
        const heroEntry = entries[0];
        
        return {
          headline: heroEntry.fields.headline || 'Welcome to Our Platform',
          subheading: heroEntry.fields.subheading || 'Discover the future of vending',
          ctaText: heroEntry.fields.ctaText || 'Learn More',
          ctaLink: heroEntry.fields.ctaLink || '/products',
          secondaryCTAText: heroEntry.fields.secondaryCTAText,
          secondaryCTALink: heroEntry.fields.secondaryCTALink,
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
