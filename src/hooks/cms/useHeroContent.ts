
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
  console.log(`[useHeroContent] Initializing for entry ID: ${entryId}`);
  
  return useQuery({
    queryKey: ['contentful', 'hero', entryId],
    queryFn: async () => {
      // Enhanced logging for this specific entry
      console.log(`[useHeroContent] Starting to fetch hero content for entry ID: ${entryId}`);
      
      // First check if Contentful is configured
      if (!isContentfulConfigured()) {
        console.error(`[useHeroContent] Contentful is not configured properly for entryId: ${entryId}`);
        
        // Throw a specific error for missing configuration that's easy to identify
        throw new Error('CONTENTFUL_CONFIG_MISSING');
      }
      
      try {
        console.log(`[useHeroContent] Fetching hero content for entry ID: ${entryId}`);
        const client = await getContentfulClient(true); // Force refresh client to ensure latest config
        
        if (!client) {
          console.error(`[useHeroContent] Failed to get Contentful client`);
          throw new Error('Failed to initialize Contentful client');
        }
        
        console.log(`[useHeroContent] Client created, fetching entry: ${entryId}`);
        
        try {
          console.log(`[useHeroContent] About to call client.getEntry for: ${entryId}`);
          const entry = await client.getEntry(entryId);
          
          console.log(`[useHeroContent] Successfully fetched entry: ${entry.sys.id}`, {
            contentType: entry.sys.contentType?.sys?.id || 'unknown',
            fields: Object.keys(entry.fields || {}),
            title: entry.fields.title,
            subtitle: entry.fields.subtitle,
            hasImage: !!entry.fields.image,
            rawEntry: entry
          });
          
          const imageUrl = entry.fields.image ? (entry.fields.image as any)?.fields?.file?.url : null;
          console.log(`[useHeroContent] Extracted image URL: ${imageUrl}`);
          
          const result = {
            title: entry.fields.title as string,
            subtitle: entry.fields.subtitle as string,
            pageKey: entry.fields.pageKey as string,
            image: entry.fields.image ? {
              url: imageUrl,
              alt: entry.fields.imageAlt as string
            } : null,
            primaryButtonText: entry.fields.primaryButtonText as string,
            primaryButtonUrl: entry.fields.primaryButtonUrl as string,
            secondaryButtonText: entry.fields.secondaryButtonText as string,
            secondaryButtonUrl: entry.fields.secondaryButtonUrl as string,
            backgroundClass: entry.fields.backgroundClass as string
          } as HeroContent;
          
          console.log(`[useHeroContent] Returning processed hero content:`, result);
          return result;
        } catch (entryError) {
          console.error(`[useHeroContent] Error fetching entry ${entryId}:`, entryError);
          
          // Check if the error is a 404 (entry not found)
          const errorMessage = entryError instanceof Error ? entryError.message : 'Unknown error';
          if (errorMessage.includes('not found') || errorMessage.includes('404')) {
            console.error(`[useHeroContent] Entry not found: ${entryId}`);
            throw new Error(`CONTENTFUL_ENTRY_NOT_FOUND:${entryId}`);
          }
          
          // Re-throw the original error
          throw entryError;
        }
      } catch (error) {
        // Enhanced error logging with structured data for easier debugging
        console.error(`[useHeroContent] Error fetching hero content for entry ID: ${entryId}`, {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : 'No stack trace',
          timestamp: new Date().toISOString()
        });
        
        // Re-throw specific error types to allow consumers to handle them differently
        if (error instanceof Error) {
          if (error.message.includes('not found') || error.message.includes('404')) {
            console.error(`[useHeroContent] Entry not found: ${entryId}`);
            throw new Error(`CONTENTFUL_ENTRY_NOT_FOUND:${entryId}`);
          }
          
          if (error.message.includes('access token') || error.message.includes('401')) {
            console.error(`[useHeroContent] Authentication error`);
            throw new Error('CONTENTFUL_AUTH_ERROR');
          }
        }
        
        // Show toast only in non-preview environments to reduce noise during development
        if (!window.location.hostname.includes('lovable')) {
          toast.error('Failed to load hero content from Contentful');
        }
        
        throw error;
      }
    },
    retry: 3, // Increase retries for the machines page hero
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    // For specific machines page hero ID, improve caching and refetch behavior
    staleTime: entryId === '3bH4WrT0pLKDeG35mUekGq' ? 5 * 60 * 1000 : 0, // 5 minutes for machines hero, default for others
    refetchOnWindowFocus: entryId === '3bH4WrT0pLKDeG35mUekGq' // Enable refetch on window focus for machines hero
  });
}
