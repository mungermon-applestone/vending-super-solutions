
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { IS_DEVELOPMENT } from '@/config/cms';

/**
 * Generic function to fetch content from the CMS
 * @param contentType The content type to fetch
 * @param options Query options
 * @returns The fetched data
 */
export async function fetchFromCMS<T>(
  contentType: string,
  options?: {
    slug?: string;
    id?: string;
    limit?: number;
    includeMocks?: boolean;
  }
): Promise<T | T[] | null> {
  try {
    // Allow overriding with mock data in development
    if (IS_DEVELOPMENT && options?.includeMocks && window._devMockData?.[contentType]) {
      console.log(`[fetchFromCMS] Using mock data for ${contentType}`);
      return window._devMockData[contentType] as T;
    }
    
    // Try to fetch by ID first
    if (options?.id) {
      try {
        const entry = await fetchContentfulEntry(options.id);
        return entry as T;
      } catch (idError) {
        console.warn(`[fetchFromCMS] Failed to fetch ${contentType} by ID:`, idError);
        // Fall back to slug search
      }
    }
    
    // Try to fetch by slug if provided
    if (options?.slug) {
      const query = {
        'fields.slug': options.slug,
        limit: 1
      };
      
      const entries = await fetchContentfulEntries(contentType, query);
      
      if (entries && entries.length > 0) {
        return entries[0] as T;
      }
      
      console.log(`[fetchFromCMS] No ${contentType} found with slug: ${options.slug}`);
      return null;
    }
    
    // Fetch all entries if no specific ID or slug
    const query = options?.limit ? { limit: options.limit } : undefined;
    const entries = await fetchContentfulEntries(contentType, query);
    
    if (entries && entries.length > 0) {
      return entries as T[];
    }
    
    return [];
  } catch (error) {
    console.error(`[fetchFromCMS] Error fetching ${contentType}:`, error);
    return null;
  }
}
