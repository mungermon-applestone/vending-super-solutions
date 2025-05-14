
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { normalizeEntryFields, isContentfulEntry, isContentfulAsset } from '@/services/cms/utils/contentfulHelpers';

export function useHeroContent(id?: string) {
  return useQuery({
    queryKey: ['contentful', 'hero', id],
    queryFn: async () => {
      try {
        // Fetch the hero content from Contentful
        const query = id ? { 'fields.identifier': id } : {};
        const entries = await fetchContentfulEntries('hero', query);
        
        if (!entries || !Array.isArray(entries) || entries.length === 0) {
          console.log('No hero content found');
          return null;
        }
        
        // Get the first hero content entry
        const heroEntry = entries[0];
        
        if (!isContentfulEntry(heroEntry)) {
          console.error('Hero entry is not a valid Contentful entry');
          return null;
        }

        // Extract fields using our helper function
        const fields = heroEntry.fields;
        
        // Get image data safely
        let imageData = undefined;
        if (fields.image && isContentfulAsset(fields.image)) {
          imageData = {
            url: `https:${fields.image.fields.file?.url}` || '',
            alt: fields.image.fields.title || 'Hero image'
          };
        }
        
        let backgroundImageUrl = undefined;
        if (fields.backgroundImage && isContentfulAsset(fields.backgroundImage)) {
          backgroundImageUrl = `https:${fields.backgroundImage.fields.file?.url}`;
        }
        
        // Return a normalized structure that works with both old and new component naming
        return {
          // New property naming
          title: String(fields.headline || 'Welcome to Our Platform'),
          subtitle: String(fields.subheading || 'Discover the future of vending'),
          primaryButtonText: String(fields.ctaText || 'Learn More'),
          primaryButtonUrl: String(fields.ctaLink || '/products'),
          secondaryButtonText: fields.secondaryCTAText ? String(fields.secondaryCTAText) : undefined,
          secondaryButtonUrl: fields.secondaryCTALink ? String(fields.secondaryCTALink) : undefined,
          backgroundClass: fields.backgroundClass ? String(fields.backgroundClass) : '',
          
          // Legacy property naming
          headline: String(fields.headline || 'Welcome to Our Platform'),
          subheading: String(fields.subheading || 'Discover the future of vending'),
          ctaText: String(fields.ctaText || 'Learn More'),
          ctaLink: String(fields.ctaLink || '/products'),
          secondaryCTAText: fields.secondaryCTAText ? String(fields.secondaryCTAText) : undefined,
          secondaryCTALink: fields.secondaryCTALink ? String(fields.secondaryCTALink) : undefined,
          
          // Image handling
          image: imageData,
          backgroundImage: backgroundImageUrl,
          backgroundImageAlt: fields.backgroundImage?.fields?.title || 'Hero Background'
        };
      } catch (error) {
        console.error('Error fetching hero content:', error);
        return null;
      }
    }
  });
}
