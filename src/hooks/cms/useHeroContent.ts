
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
        
        // For the home page hero, show a specific toast message
        if (entryId === '2a1R6EfAcjJkb6WaRF2lGS') {
          toast.error('Failed to load home page hero from Contentful - check configuration', {
            id: 'home-hero-error',
            duration: 5000
          });
        }
        
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
          
          // Handle home page hero (ID: 2a1R6EfAcjJkb6WaRF2lGS) with special logging
          if (entryId === '2a1R6EfAcjJkb6WaRF2lGS') {
            console.log('[useHeroContent] Processing HOME PAGE hero content', entry.fields);
          }
          
          const image = entry.fields.image;
          const imageUrl = image && (image as any).fields && (image as any).fields.file 
            ? `https:${(image as any).fields.file.url}`
            : null;
            
          console.log(`[useHeroContent] Extracted image URL: ${imageUrl}`);
          
          const result = {
            title: entry.fields.title as string,
            subtitle: entry.fields.subtitle as string,
            pageKey: entry.fields.pageKey as string,
            image: {
              url: imageUrl,
              alt: entry.fields.imageAlt as string || entry.fields.title as string
            },
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
        
        // Special handling for home page hero errors
        if (entryId === '2a1R6EfAcjJkb6WaRF2lGS') {
          console.error('[useHeroContent] HOME PAGE HERO FAILED TO LOAD:', error);
          toast.error('Failed to load home page hero');
        }
        
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
    retry: 3, 
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    staleTime: entryId === '2a1R6EfAcjJkb6WaRF2lGS' ? 5 * 60 * 1000 : 0, // 5 minutes for home hero
    refetchOnWindowFocus: entryId === '2a1R6EfAcjJkb6WaRF2lGS' // Enable refetch on focus for home hero
  });
}
