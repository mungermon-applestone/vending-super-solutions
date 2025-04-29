
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

export function useHeroContent(pageKey: string) {
  console.log(`[useHeroContent] Initializing for page key: ${pageKey}`);
  
  return useQuery({
    queryKey: ['contentful', 'hero', pageKey],
    queryFn: async () => {
      // Enhanced logging for this specific query
      console.log(`[useHeroContent] Starting to fetch hero content for page key: ${pageKey}`);
      
      // First check if Contentful is configured
      if (!isContentfulConfigured()) {
        console.error(`[useHeroContent] Contentful is not configured properly for page key: ${pageKey}`);
        
        // For the home page hero, show a specific toast message
        if (pageKey === "home") {
          toast.error('Failed to load home page hero from Contentful - check configuration', {
            id: 'home-hero-error',
            duration: 5000
          });
        }
        
        // Throw a specific error for missing configuration that's easy to identify
        throw new Error('CONTENTFUL_CONFIG_MISSING');
      }
      
      try {
        console.log(`[useHeroContent] Fetching hero content for page key: ${pageKey}`);
        const client = await getContentfulClient(true); // Force refresh client to ensure latest config
        
        if (!client) {
          console.error(`[useHeroContent] Failed to get Contentful client`);
          throw new Error('Failed to initialize Contentful client');
        }
        
        console.log(`[useHeroContent] Client created, fetching entries with page key: ${pageKey}`);
        
        // Instead of getting a specific entry by ID, query for entries with matching page key
        try {
          console.log(`[useHeroContent] About to query entries with page key: ${pageKey}`);
          
          const entries = await client.getEntries({
            content_type: 'heroContent',
            'fields.pageKey': pageKey,
            limit: 1,
            include: 2
          });
          
          console.log(`[useHeroContent] Query results for page key ${pageKey}:`, {
            total: entries.total,
            hasItems: entries.items.length > 0
          });
          
          if (entries.items.length === 0) {
            console.warn(`[useHeroContent] No hero content found for page key: ${pageKey}`);
            throw new Error(`HERO_CONTENT_NOT_FOUND:${pageKey}`);
          }
          
          const entry = entries.items[0];
          
          console.log(`[useHeroContent] Successfully fetched entry for page key ${pageKey}:`, {
            contentType: entry.sys.contentType?.sys?.id || 'unknown',
            fields: Object.keys(entry.fields || {}),
            title: entry.fields.title,
            subtitle: entry.fields.subtitle,
            hasImage: !!entry.fields.image,
            id: entry.sys.id
          });
          
          // Handle home page hero with special logging
          if (pageKey === "home") {
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
          console.error(`[useHeroContent] Error fetching entries for page key ${pageKey}:`, entryError);
          
          // Check if the error is a 404 (entry not found)
          const errorMessage = entryError instanceof Error ? entryError.message : 'Unknown error';
          if (errorMessage.includes('not found') || errorMessage.includes('404')) {
            console.error(`[useHeroContent] Entry not found for page key: ${pageKey}`);
            throw new Error(`CONTENTFUL_ENTRY_NOT_FOUND:${pageKey}`);
          }
          
          // Re-throw the original error
          throw entryError;
        }
      } catch (error) {
        // Enhanced error logging with structured data for easier debugging
        console.error(`[useHeroContent] Error fetching hero content for page key: ${pageKey}`, {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : 'No stack trace',
          timestamp: new Date().toISOString()
        });
        
        // Special handling for home page hero errors
        if (pageKey === "home") {
          console.error('[useHeroContent] HOME PAGE HERO FAILED TO LOAD:', error);
          toast.error('Failed to load home page hero');
        }
        
        // Re-throw specific error types to allow consumers to handle them differently
        if (error instanceof Error) {
          if (error.message.includes('not found') || error.message.includes('404')) {
            console.error(`[useHeroContent] Entry not found for page key: ${pageKey}`);
            throw new Error(`CONTENTFUL_ENTRY_NOT_FOUND:${pageKey}`);
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
    staleTime: pageKey === 'home' ? 5 * 60 * 1000 : 0, // 5 minutes for home hero
    refetchOnWindowFocus: pageKey === 'home' // Enable refetch on focus for home hero
  });
}
