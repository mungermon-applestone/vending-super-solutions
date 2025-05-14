
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { isContentfulEntry, isContentfulAsset } from '@/services/cms/utils/contentfulHelpers';
import { safeString, safeAssetToImage } from '@/services/cms/utils/safeTypeUtilities';

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
          imageData = safeAssetToImage(fields.image);
        }
        
        let backgroundImageUrl = undefined;
        if (fields.backgroundImage && isContentfulAsset(fields.backgroundImage)) {
          backgroundImageUrl = `https:${fields.backgroundImage.fields?.file?.url || ''}`;
        }
        
        // Return a normalized structure that works with both old and new component naming
        return {
          // New property naming
          title: safeString(fields.headline || 'Welcome to Our Platform'),
          subtitle: safeString(fields.subheading || 'Discover the future of vending'),
          primaryButtonText: safeString(fields.ctaText || 'Learn More'),
          primaryButtonUrl: safeString(fields.ctaLink || '/products'),
          secondaryButtonText: fields.secondaryCTAText ? safeString(fields.secondaryCTAText) : undefined,
          secondaryButtonUrl: fields.secondaryCTALink ? safeString(fields.secondaryCTALink) : undefined,
          backgroundClass: fields.backgroundClass ? safeString(fields.backgroundClass) : '',
          
          // Legacy property naming
          headline: safeString(fields.headline || 'Welcome to Our Platform'),
          subheading: safeString(fields.subheading || 'Discover the future of vending'),
          ctaText: safeString(fields.ctaText || 'Learn More'),
          ctaLink: safeString(fields.ctaLink || '/products'),
          secondaryCTAText: fields.secondaryCTAText ? safeString(fields.secondaryCTAText) : undefined,
          secondaryCTALink: fields.secondaryCTALink ? safeString(fields.secondaryCTALink) : undefined,
          
          // Image handling
          image: imageData,
          backgroundImage: backgroundImageUrl,
          backgroundImageAlt: fields.backgroundImage && isContentfulAsset(fields.backgroundImage) 
            ? safeString(fields.backgroundImage.fields?.title) || 'Hero Background'
            : 'Hero Background'
        };
      } catch (error) {
        console.error('Error fetching hero content:', error);
        return null;
      }
    }
  });
}
