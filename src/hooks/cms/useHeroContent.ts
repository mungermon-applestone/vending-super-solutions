
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { isContentfulConfigured } from '@/config/cms';
import { toast } from 'sonner';

interface HeroContent {
  title: string;
  subtitle: string;
  pageKey: string;
  image: {
    url: string;
    alt: string;
  };
  imageAlt: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
}

export function useHeroContent(entryId: string) {
  return useQuery({
    queryKey: ['contentful', 'hero', entryId],
    queryFn: async () => {
      // First check if Contentful is configured
      if (!isContentfulConfigured()) {
        console.error(`[useHeroContent] Contentful is not configured properly for entryId: ${entryId}`);
        throw new Error('Contentful is not configured properly. Check your environment variables.');
      }
      
      try {
        console.log(`[useHeroContent] Fetching hero content for entry ID: ${entryId}`);
        const client = await getContentfulClient();
        const entry = await client.getEntry(entryId);
        
        console.log(`[useHeroContent] Successfully fetched entry: ${entry.sys.id}`);
        
        return {
          title: entry.fields.title as string,
          subtitle: entry.fields.subtitle as string,
          pageKey: entry.fields.pageKey as string,
          image: {
            url: (entry.fields.image as any)?.fields?.file?.url,
            alt: entry.fields.imageAlt as string
          },
          primaryButtonText: entry.fields.primaryButtonText as string,
          primaryButtonUrl: entry.fields.primaryButtonUrl as string,
          secondaryButtonText: entry.fields.secondaryButtonText as string,
          secondaryButtonUrl: entry.fields.secondaryButtonUrl as string,
          backgroundClass: entry.fields.backgroundClass as string
        } as HeroContent;
      } catch (error) {
        console.error(`[useHeroContent] Error fetching hero content for entry ID: ${entryId}`, error);
        
        // Show toast only in non-preview environments to reduce noise during development
        if (!window.location.hostname.includes('lovable')) {
          toast.error('Failed to load hero content from Contentful');
        }
        
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000
  });
}
