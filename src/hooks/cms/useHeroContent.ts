
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';

interface HeroContent {
  title: string;
  subtitle: string;
  image: {
    url: string;
    alt: string;
  };
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
}

/**
 * Hook to fetch hero content from Contentful
 */
export function useHeroContent(pageKey: string) {
  return useQuery({
    queryKey: ['contentful', 'hero-content', pageKey],
    queryFn: async (): Promise<HeroContent | null> => {
      try {
        const client = await getContentfulClient();
        
        let entryId = pageKey;
        // If pageKey doesn't look like an ID, try to find by page key
        if (!pageKey.match(/^[a-zA-Z0-9]{10,}$/)) {
          const response = await client.getEntries({
            content_type: 'heroContent',
            'fields.pageKey': pageKey,
            include: 1
          });
          
          if (!response.items || response.items.length === 0) {
            return null;
          }
          
          entryId = response.items[0].sys.id;
        }
        
        // Get the hero content by ID
        const entry = await client.getEntry(entryId, { include: 2 });
        
        if (!entry || !entry.fields) {
          return null;
        }
        
        // Extract the image URL
        let imageUrl = '';
        let imageAlt = 'Hero image';
        
        if (entry.fields.image) {
          const image = entry.fields.image;
          if (image.fields && image.fields.file && image.fields.file.url) {
            imageUrl = `https:${image.fields.file.url}`;
          }
          if (image.fields && image.fields.title) {
            imageAlt = image.fields.title;
          }
        }
        
        return {
          title: entry.fields.title || '',
          subtitle: entry.fields.subtitle || '',
          image: {
            url: imageUrl,
            alt: imageAlt
          },
          primaryButtonText: entry.fields.primaryButtonText || 'Learn More',
          primaryButtonUrl: entry.fields.primaryButtonUrl || '/',
          secondaryButtonText: entry.fields.secondaryButtonText || undefined,
          secondaryButtonUrl: entry.fields.secondaryButtonUrl || undefined,
          backgroundClass: entry.fields.backgroundClass || undefined
        };
      } catch (error) {
        console.error(`Error fetching hero content for page key "${pageKey}":`, error);
        return null;
      }
    },
  });
}

export default useHeroContent;
