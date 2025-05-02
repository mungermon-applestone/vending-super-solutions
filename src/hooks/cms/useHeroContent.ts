
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { isContentfulConfigured } from '@/config/cms';
import { toast } from 'sonner';

interface HeroContent {
  title: string;
  subtitle: string;
  pageKey?: string;
  image: {
    url: string;
    alt: string;
  };
  video?: {
    url: string;
    thumbnail?: string;
    contentType?: string;
    fileName?: string;
  };
  isVideo?: boolean;
  imageAlt: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
}

export function useHeroContent(idOrPageKey: string) {
  console.log(`[useHeroContent] Initializing for ${idOrPageKey}`);
  
  return useQuery({
    queryKey: ['contentful', 'hero', idOrPageKey],
    queryFn: async () => {
      // Enhanced logging for this specific query
      console.log(`[useHeroContent] Starting to fetch hero content for: ${idOrPageKey}`);
      
      // First check if Contentful is configured
      if (!isContentfulConfigured()) {
        console.error(`[useHeroContent] Contentful is not configured properly for: ${idOrPageKey}`);
        
        // For the home page hero, show a specific toast message
        if (idOrPageKey === "home") {
          toast.error('Failed to load home page hero from Contentful - check configuration', {
            id: 'home-hero-error',
            duration: 5000
          });
        }
        
        // Throw a specific error for missing configuration that's easy to identify
        throw new Error('CONTENTFUL_CONFIG_MISSING');
      }
      
      try {
        console.log(`[useHeroContent] Fetching hero content for: ${idOrPageKey}`);
        const client = await getContentfulClient(true); // Force refresh client to ensure latest config
        
        if (!client) {
          console.error(`[useHeroContent] Failed to get Contentful client`);
          throw new Error('Failed to initialize Contentful client');
        }
        
        // Determine if we're looking up by ID or by pageKey
        const isUUID = idOrPageKey.includes('-') || /^[0-9a-zA-Z]{16,}$/.test(idOrPageKey);
        
        console.log(`[useHeroContent] Looking up ${isUUID ? 'by ID' : 'by pageKey'}: ${idOrPageKey}`);
        
        try {
          let entry;
          
          if (isUUID) {
            // Direct ID lookup for legacy components
            console.log(`[useHeroContent] Fetching entry directly by ID: ${idOrPageKey}`);
            entry = await client.getEntry(idOrPageKey, { include: 2 });
          } else {
            // Page key lookup for the newer pattern
            console.log(`[useHeroContent] Querying entries with page key: ${idOrPageKey}`);
            
            const entries = await client.getEntries({
              content_type: 'heroContent',
              'fields.pageKey': idOrPageKey,
              limit: 1,
              include: 2
            });
            
            console.log(`[useHeroContent] Query results for page key ${idOrPageKey}:`, {
              total: entries.total,
              hasItems: entries.items.length > 0
            });
            
            if (entries.items.length === 0) {
              console.warn(`[useHeroContent] No hero content found for page key: ${idOrPageKey}`);
              throw new Error(`HERO_CONTENT_NOT_FOUND:${idOrPageKey}`);
            }
            
            entry = entries.items[0];
          }
          
          console.log(`[useHeroContent] Successfully fetched entry:`, {
            contentType: entry.sys.contentType?.sys?.id || 'unknown',
            fields: Object.keys(entry.fields || {}),
            title: entry.fields.title,
            subtitle: entry.fields.subtitle,
            hasImage: !!entry.fields.image,
            hasVideo: !!entry.fields.videoUrl || !!entry.fields.video,
            isVideo: !!entry.fields.isVideo,
            id: entry.sys.id
          });
          
          const image = entry.fields.image;
          const imageUrl = image && (image as any).fields && (image as any).fields.file 
            ? `https:${(image as any).fields.file.url}`
            : null;
            
          console.log(`[useHeroContent] Extracted image URL: ${imageUrl}`);
          
          // Process video data if available
          const isVideo = !!entry.fields.isVideo;
          const videoUrl = entry.fields.videoUrl || null;
          const videoThumbnail = entry.fields.videoThumbnail 
            ? `https:${(entry.fields.videoThumbnail as any).fields.file.url}`
            : null;
          
          // Check for directly uploaded video asset in Contentful
          let videoAsset = null;
          if (entry.fields.video && entry.fields.video.fields && entry.fields.video.fields.file) {
            videoAsset = {
              url: `https:${entry.fields.video.fields.file.url}`,
              contentType: entry.fields.video.fields.file.contentType,
              fileName: entry.fields.video.fields.file.fileName
            };
            console.log(`[useHeroContent] Found uploaded video asset:`, videoAsset);
          }
          
          const result = {
            title: entry.fields.title as string,
            subtitle: entry.fields.subtitle as string,
            pageKey: entry.fields.pageKey as string,
            isVideo: isVideo,
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
          
          // Add video properties if this is a video hero
          if (isVideo) {
            result.video = {
              url: videoAsset ? videoAsset.url : videoUrl,
              thumbnail: videoThumbnail,
              contentType: videoAsset ? videoAsset.contentType : undefined,
              fileName: videoAsset ? videoAsset.fileName : undefined
            };
          }
          
          console.log(`[useHeroContent] Returning processed hero content:`, result);
          return result;
        } catch (entryError) {
          console.error(`[useHeroContent] Error fetching entry for ${idOrPageKey}:`, entryError);
          
          // Check if the error is a 404 (entry not found)
          const errorMessage = entryError instanceof Error ? entryError.message : 'Unknown error';
          if (errorMessage.includes('not found') || errorMessage.includes('404')) {
            console.error(`[useHeroContent] Entry not found for: ${idOrPageKey}`);
            throw new Error(`HERO_CONTENT_NOT_FOUND:${idOrPageKey}`);
          }
          
          // Re-throw the original error
          throw entryError;
        }
      } catch (error) {
        // Enhanced error logging with structured data for easier debugging
        console.error(`[useHeroContent] Error fetching hero content for: ${idOrPageKey}`, {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : 'No stack trace',
          timestamp: new Date().toISOString()
        });
        
        // Special handling for home page hero errors
        if (idOrPageKey === "home") {
          console.error('[useHeroContent] HOME PAGE HERO FAILED TO LOAD:', error);
          toast.error('Failed to load home page hero');
        }
        
        // Re-throw specific error types to allow consumers to handle them differently
        if (error instanceof Error) {
          if (error.message.includes('not found') || error.message.includes('404')) {
            console.error(`[useHeroContent] Entry not found for: ${idOrPageKey}`);
            throw new Error(`HERO_CONTENT_NOT_FOUND:${idOrPageKey}`);
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
    staleTime: idOrPageKey === 'home' ? 5 * 60 * 1000 : 0, // 5 minutes for home hero
    refetchOnWindowFocus: idOrPageKey === 'home' // Enable refetch on focus for home hero
  });
}
