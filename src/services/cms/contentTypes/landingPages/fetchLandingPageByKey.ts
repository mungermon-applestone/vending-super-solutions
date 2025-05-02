
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
      const entries = await client.getEntries({
        content_type: 'landingPage',
        'fields.pageKey': key,
        limit: 1,
        include: 2
      });
      
      if (entries.items.length > 0) {
        const entry = entries.items[0];
        console.log(`[fetchLandingPageByKey] Found landing page in Contentful with key ${key}:`, entry);
        
        // Process video data from Contentful
        const videoFile = entry.fields.video?.fields?.file;
        const videoThumbnail = entry.fields.videoThumbnail?.fields?.file?.url;
        
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
            image_url: entry.fields.image?.fields?.file?.url,
            image_alt: entry.fields.imageAlt,
            is_video: !!entry.fields.isVideo,
            video_url: entry.fields.videoUrl || '',
            video_thumbnail: videoThumbnail ? `https:${videoThumbnail}` : '',
            video_file: videoFile ? {
              url: `https:${videoFile.url}`,
              contentType: videoFile.contentType,
              fileName: videoFile.fileName
            } : undefined,
            cta_primary_text: entry.fields.ctaPrimaryText,
            cta_primary_url: entry.fields.ctaPrimaryUrl,
            cta_secondary_text: entry.fields.ctaSecondaryText,
            cta_secondary_url: entry.fields.ctaSecondaryUrl,
            background_class: entry.fields.backgroundClass,
            created_at: entry.sys.createdAt,
            updated_at: entry.sys.updatedAt
          }
        } as LandingPage;
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
