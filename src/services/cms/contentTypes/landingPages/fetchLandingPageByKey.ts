import { LandingPage } from '@/types/landingPage';
import { IS_DEVELOPMENT } from '@/config/cms';
import { useMockData } from '../../mockDataHandler';
import { fetchLandingPages } from './fetchLandingPages';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

export async function fetchLandingPageByKey(key: string): Promise<LandingPage | null> {
  try {
    console.log(`[fetchLandingPageByKey] Fetching landing page with key: ${key}`);
    
    // Skip Supabase attempts entirely since they're causing errors
    console.log(`[fetchLandingPageByKey] Skipping Supabase, going directly to fallback/mock data`);
    
    // Try to fetch from Contentful if available
    try {
      const client = await getContentfulClient();
      
      // Try to fetch using the correct content type - try heroContent first
      try {
        console.log(`[fetchLandingPageByKey] Trying to fetch as heroContent type with key ${key}`);
        const entries = await client.getEntries({
          content_type: 'heroContent',
          'fields.pageKey': key,
          limit: 1,
          include: 2
        });
        
        if (entries.items.length > 0) {
          const entry = entries.items[0];
          console.log(`[fetchLandingPageByKey] Found heroContent in Contentful with key ${key}:`, entry);
          
          // Enhanced video detection
          const isVideo = !!entry.fields.isVideo;
          const hasVideo = !!entry.fields.video;
          const hasVideoUrl = !!entry.fields.videoUrl;
          
          // Log video details for debugging
          if (isVideo) {
            console.log(`[fetchLandingPageByKey] Video content detected in heroContent:`, {
              isVideo,
              hasVideoAsset: hasVideo,
              videoUrl: entry.fields.videoUrl || 'not set',
              videoThumbnail: entry.fields.videoThumbnail ? 'present' : 'not set' 
            });
            
            // Check if file data is available when we have a video asset
            if (hasVideo && entry.fields.video?.fields?.file) {
              console.log(`[fetchLandingPageByKey] Video file details:`, {
                url: entry.fields.video.fields.file.url,
                contentType: entry.fields.video.fields.file.contentType,
                fileName: entry.fields.video.fields.file.fileName
              });
            }
          }
          
          // Map heroContent to landingPage format
          return {
            id: entry.sys.id,
            page_key: entry.fields.pageKey || key,
            page_name: entry.fields.title || key,
            hero_content_id: entry.sys.id,
            hero_content: {
              id: entry.sys.id,
              title: entry.fields.title,
              subtitle: entry.fields.subtitle,
              image_url: entry.fields.image?.fields?.file?.url ? `https:${entry.fields.image.fields.file.url}` : '',
              image_alt: entry.fields.imageAlt || '',
              is_video: isVideo,
              // Enhanced video handling - process video URL from either direct asset or external URL
              video_url: hasVideo && entry.fields.video?.fields?.file?.url 
                ? `https:${entry.fields.video.fields.file.url}`
                : (hasVideoUrl ? entry.fields.videoUrl : ''),
              video_thumbnail: entry.fields.videoThumbnail?.fields?.file?.url 
                ? `https:${entry.fields.videoThumbnail.fields.file.url}` 
                : '',
              video_file: hasVideo && entry.fields.video?.fields?.file ? {
                url: `https:${entry.fields.video.fields.file.url}`,
                contentType: entry.fields.video.fields.file.contentType,
                fileName: entry.fields.video.fields.file.fileName
              } : undefined,
              cta_primary_text: entry.fields.primaryButtonText || '',
              cta_primary_url: entry.fields.primaryButtonUrl || '',
              cta_secondary_text: entry.fields.secondaryButtonText || '',
              cta_secondary_url: entry.fields.secondaryButtonUrl || '',
              background_class: entry.fields.backgroundClass || '',
              created_at: entry.sys.createdAt,
              updated_at: entry.sys.updatedAt
            }
          } as LandingPage;
        }
      } catch (heroContentError) {
        console.log(`[fetchLandingPageByKey] No heroContent found or error:`, heroContentError);
      }
      
      // If getting from heroContent failed, try the original landingPage content type
      try {
        console.log(`[fetchLandingPageByKey] Trying to fetch as landingPage type with key ${key}`);
        const entries = await client.getEntries({
          content_type: 'landingPage',
          'fields.pageKey': key,
          limit: 1,
          include: 2
        });
        
        if (entries.items.length > 0) {
          const entry = entries.items[0];
          console.log(`[fetchLandingPageByKey] Found landing page in Contentful with key ${key}:`, entry);
          
          // Process video data from Contentful with detailed logging
          const videoFile = entry.fields.video?.fields?.file;
          const videoThumbnail = entry.fields.videoThumbnail?.fields?.file?.url;
          
          console.log(`[fetchLandingPageByKey] Video data for ${key}:`, {
            isVideo: !!entry.fields.isVideo,
            hasVideoFile: !!videoFile,
            videoUrl: entry.fields.videoUrl || 'none',
            videoThumbnail: videoThumbnail ? `https:${videoThumbnail}` : 'none',
            videoFileDetails: videoFile ? {
              url: `https:${videoFile.url}`,
              contentType: videoFile.contentType,
              fileName: videoFile.fileName
            } : 'none'
          });
          
          // Create hero_content with all necessary video fields
          return {
            id: entry.sys.id,
            page_key: entry.fields.pageKey,
            page_name: entry.fields.pageName,
            hero_content_id: entry.fields.heroContentId || entry.sys.id,
            hero_content: {
              id: entry.sys.id,
              title: entry.fields.title,
              subtitle: entry.fields.subtitle,
              image_url: entry.fields.image?.fields?.file?.url ? `https:${entry.fields.image.fields.file.url}` : '',
              image_alt: entry.fields.imageAlt || '',
              is_video: !!entry.fields.isVideo,
              video_url: entry.fields.videoUrl || '',
              video_thumbnail: videoThumbnail ? `https:${videoThumbnail}` : '',
              video_file: videoFile ? {
                url: `https:${videoFile.url}`,
                contentType: videoFile.contentType,
                fileName: videoFile.fileName
              } : undefined,
              cta_primary_text: entry.fields.ctaPrimaryText || '',
              cta_primary_url: entry.fields.ctaPrimaryUrl || '',
              cta_secondary_text: entry.fields.ctaSecondaryText || '',
              cta_secondary_url: entry.fields.ctaSecondaryUrl || '',
              background_class: entry.fields.backgroundClass || '',
              created_at: entry.sys.createdAt,
              updated_at: entry.sys.updatedAt
            }
          } as LandingPage;
        }
      } catch (landingPageError) {
        console.log(`[fetchLandingPageByKey] No landingPage found or error:`, landingPageError);
      }
    } catch (contentfulError) {
      console.log(`[fetchLandingPageByKey] Error fetching from Contentful:`, contentfulError);
    }
    
    // Fallback to mock data if no records found in Contentful or in development mode
    if (IS_DEVELOPMENT && useMockData) {
      const pages = await fetchLandingPages();
      const page = pages.find(page => page.page_key === key);
      console.log(`[fetchLandingPageByKey] Mock data result for key ${key}:`, page ? "Found" : "Not found");
      return page || null;
    }
    
    return null;
  } catch (error) {
    console.error(`[fetchLandingPageByKey] Error fetching landing page with key ${key}:`, error);
    return null;
  }
}
